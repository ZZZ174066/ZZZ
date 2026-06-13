package com.tsj.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tsj.entity.*;
import com.tsj.mapper.*;
import org.springframework.stereotype.Service;

import java.util.*;


@Service
public class PlanRequirementLlmService {

    private static final String SYSTEM_PROMPT = """
            你是板状物品三维分层装箱优化系统的智能助手。用户会提供：方案概况、计划使用的物品与容器、**当前装箱明细 JSON（plan_item_detail 每条单件）**、以及特殊需求文本。
            你必须结合 **currentPackingSnapshot** 中的真实数据（itemId、layerIndex、坐标、是否装载等）分析现状，不能只写泛泛建议。
            你的任务：
            1) 准确理解特殊需求，并说明当前装箱结果是否违反需求、违反点在哪里（引用 itemId、层数、容器实例等）。
            2) 给出修改方案：包括业务说明 + 若需重新装箱，给出 **packingConstraintsForRegeneration**（供后端算法消费的约束）。
            3) packingConstraintsForRegeneration 当前支持字段：forbiddenBottomLayerItemIds（整数数组）：禁止出现在**每个容器最底层第1层（整层）**的物品模板 itemId；底层须先用非禁忌品垫底，禁忌品从第2层起放（若方案中仅有禁忌品且无其它材质，底层才可能全部为禁忌品）。
            4) needRegeneratePacking：若需要重新运行装箱算法则为 true。
            你必须只输出一个 JSON 对象，不要 Markdown 代码块，不要其它解释文字。字段如下：
            {
              "requirementUnderstanding": "字符串",
              "currentPackingAssessment": "结合明细 JSON 的现状评估：是否违反需求、具体例子",
              "modifiedPlanSummary": "修改方案说明（面向业务）",
              "recommendedAlgorithm": "regular 或 fill_priority 或 unknown",
              "constraintNotes": ["字符串"],
              "planEditHints": ["字符串"],
              "needRegeneratePacking": true或false,
              "packingConstraintsForRegeneration": {
                "forbiddenBottomLayerItemIds": [1, 2]
              }
            }
            若无底层禁忌，forbiddenBottomLayerItemIds 用空数组 []。
            recommendedAlgorithm 只能是 regular、fill_priority、unknown 三者之一。
            """;

    private final PlanMapper planMapper;
    private final PlanItemMapper planItemMapper;
    private final PlanContainerMapper planContainerMapper;
    private final PlanRequirementMapper planRequirementMapper;
    private final PlanItemDetailMapper planItemDetailMapper;
    private final PlanContainerDetailMapper planContainerDetailMapper;
    private final ItemMapper itemMapper;
    private final ContainerMapper containerMapper;
    private final LlmChatService llmChatService;
    private final ObjectMapper objectMapper;

    public PlanRequirementLlmService(
            PlanMapper planMapper,
            PlanItemMapper planItemMapper,
            PlanContainerMapper planContainerMapper,
            PlanRequirementMapper planRequirementMapper,
            PlanItemDetailMapper planItemDetailMapper,
            PlanContainerDetailMapper planContainerDetailMapper,
            ItemMapper itemMapper,
            ContainerMapper containerMapper,
            LlmChatService llmChatService,
            ObjectMapper objectMapper
    ) {
        this.planMapper = planMapper;
        this.planItemMapper = planItemMapper;
        this.planContainerMapper = planContainerMapper;
        this.planRequirementMapper = planRequirementMapper;
        this.planItemDetailMapper = planItemDetailMapper;
        this.planContainerDetailMapper = planContainerDetailMapper;
        this.itemMapper = itemMapper;
        this.containerMapper = containerMapper;
        this.llmChatService = llmChatService;
        this.objectMapper = objectMapper;
    }

    public Map<String, Object> optimizePlanWithRequirements(Long planId, Long focusRequirementId) throws Exception {
        Plan plan = planMapper.selectById(planId);
        if (plan == null) {
            return error("方案不存在");
        }

        String userPrompt = buildUserContext(planId, plan, focusRequirementId);
        String assistantText = llmChatService.chat(SYSTEM_PROMPT, userPrompt);

        Map<String, Object> parsed = parseLlmJson(assistantText);
        parsed.put("success", true);
        parsed.put("rawAssistantText", assistantText);
        return parsed;
    }

    private Map<String, Object> error(String msg) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("success", false);
        m.put("message", msg);
        return m;
    }

    private String buildUserContext(Long planId, Plan plan, Long focusRequirementId) {
        StringBuilder sb = new StringBuilder();

        sb.append("【方案概况】\n");
        sb.append("planId=").append(planId).append("\n");
        sb.append("名称: ").append(plan.getPlanName()).append("\n");
        sb.append("状态 planStatus: ").append(plan.getPlanStatus()).append("\n");
        sb.append("计划物品总数: ").append(plan.getPlannedTotalItemQty()).append(" 实际装入: ").append(plan.getActualTotalItemQty()).append("\n");
        sb.append("计划容器总数: ").append(plan.getPlannedTotalContainerQty()).append(" 实际使用: ").append(plan.getActualTotalContainerQty()).append("\n");
        sb.append("平均支撑率(%): ").append(plan.getAvgItemSupportRate()).append(" 平均填充率(%): ").append(plan.getAvgFilledContainerFillRate()).append("\n");
        sb.append("needUpdate: ").append(plan.getNeedUpdate()).append("\n\n");

        Map<Long, Item> itemMap = new HashMap<>();
        for (Item it : itemMapper.selectAll()) {
            if (it != null && it.getItemId() != null) itemMap.put(it.getItemId(), it);
        }
        Map<Long, Container> containerMap = new HashMap<>();
        for (Container c : containerMapper.selectAll()) {
            if (c != null && c.getContainerId() != null) containerMap.put(c.getContainerId(), c);
        }

        sb.append("【计划物品 plan_item】\n");
        List<PlanItem> pis = planItemMapper.selectByPlanId(planId);
        if (pis != null) {
            for (PlanItem pi : pis) {
                if (pi == null) continue;
                Item it = itemMap.get(pi.getItemId());
                sb.append("- itemId=").append(pi.getItemId())
                        .append(" qty=").append(pi.getItemQty());
                if (it != null) {
                    sb.append(" name=").append(it.getItemName())
                            .append(" sizeMm=").append(it.getLengthMm()).append("x").append(it.getWidthMm()).append("x").append(it.getHeightMm());
                }
                sb.append("\n");
            }
        }
        sb.append("\n");

        sb.append("【计划容器 plan_container】\n");
        List<PlanContainer> pcs = planContainerMapper.selectByPlanId(planId);
        if (pcs != null) {
            for (PlanContainer pc : pcs) {
                if (pc == null) continue;
                Container c = containerMap.get(pc.getContainerId());
                sb.append("- containerId=").append(pc.getContainerId())
                        .append(" qty=").append(pc.getContainerQty());
                if (c != null) {
                    sb.append(" name=").append(c.getContainerName())
                            .append(" sizeMm=").append(c.getLengthMm()).append("x").append(c.getWidthMm()).append("x").append(c.getHeightMm());
                }
                sb.append("\n");
            }
        }
        sb.append("\n");

        sb.append("【装箱明细摘要 plan_item_detail】\n");
        List<PlanItemDetail> details = planItemDetailMapper.selectByPlanId(planId);
        int loaded = 0, unloaded = 0;
        if (details != null) {
            for (PlanItemDetail d : details) {
                if (d == null) continue;
                if (d.getLoaded() != null && d.getLoaded() == 1) loaded++;
                else unloaded++;
            }
        }
        sb.append("明细行数: ").append(details == null ? 0 : details.size())
                .append(" 已装载: ").append(loaded).append(" 未装载: ").append(unloaded).append("\n\n");

        sb.append("【当前装箱明细 JSON currentPackingSnapshot】\n");
        sb.append("以下为每条 plan_item_detail 的结构化数据，供你逐条分析（未装载的 loaded=0，坐标可能为空）：\n");
        try {
            sb.append(buildPackingSnapshotJson(planId, itemMap));
        } catch (JsonProcessingException e) {
            sb.append("(序列化装箱明细失败: ").append(e.getMessage()).append(")\n");
        }
        sb.append("\n");

        sb.append("【特殊需求 plan_requirement】\n");
        List<PlanRequirement> reqs = planRequirementMapper.selectByPlanId(planId);
        if (reqs == null || reqs.isEmpty()) {
            sb.append("(当前无记录)\n");
        } else {
            for (PlanRequirement r : reqs) {
                if (r == null) continue;
                if (focusRequirementId != null && !Objects.equals(r.getId(), focusRequirementId)) {
                    continue;
                }
                sb.append("- id=").append(r.getId())
                        .append(" finished=").append(r.getFinished())
                        .append("\n  content=").append(r.getContent()).append("\n");
            }
        }

        if (focusRequirementId != null) {
            sb.append("\n【说明】本次仅针对 requirementId=").append(focusRequirementId).append(" 与整体方案上下文进行分析。\n");
        }

        return sb.toString();
    }

    private String buildPackingSnapshotJson(Long planId, Map<Long, Item> itemMap) throws JsonProcessingException {
        List<PlanItemDetail> details = planItemDetailMapper.selectByPlanId(planId);
        Map<Long, String> instanceNames = buildContainerInstanceNameMap(planId);
        List<Map<String, Object>> rows = new ArrayList<>();
        if (details != null) {
            for (PlanItemDetail d : details) {
                if (d == null) continue;
                Map<String, Object> row = new LinkedHashMap<>();
                row.put("detailId", d.getId());
                row.put("itemId", d.getItemId());
                Item it = itemMap.get(d.getItemId());
                if (it != null) {
                    row.put("itemName", it.getItemName());
                    row.put("lengthMm", it.getLengthMm());
                    row.put("widthMm", it.getWidthMm());
                    row.put("heightMm", it.getHeightMm());
                }
                row.put("loaded", d.getLoaded());
                row.put("containerInstanceId", d.getContainerInstanceId());
                if (d.getContainerInstanceId() != null) {
                    row.put("containerInstanceName", instanceNames.get(d.getContainerInstanceId()));
                }
                row.put("layerIndex", d.getLayerIndex());
                row.put("posX", d.getPosX());
                row.put("posY", d.getPosY());
                row.put("posZ", d.getPosZ());
                row.put("swapLengthWidth", d.getSwapLengthWidth());
                row.put("supportRate", d.getSupportRate());
                rows.add(row);
            }
        }
        return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(rows);
    }

    private Map<Long, String> buildContainerInstanceNameMap(Long planId) {
        List<PlanContainerDetail> cds = planContainerDetailMapper.selectByPlanId(planId);
        if (cds == null) return Map.of();
        Map<Long, Container> containerMap = new HashMap<>();
        for (Container c : containerMapper.selectAll()) {
            if (c != null && c.getContainerId() != null) containerMap.put(c.getContainerId(), c);
        }
        Map<Long, Integer> seq = new HashMap<>();
        Map<Long, String> result = new HashMap<>();
        for (PlanContainerDetail d : cds) {
            if (d == null || d.getId() == null) continue;
            Container tpl = containerMap.get(d.getContainerId());
            int idx = seq.merge(d.getContainerId(), 1, Integer::sum);
            String baseName = tpl == null || tpl.getContainerName() == null ? "容器" : tpl.getContainerName();
            result.put(d.getId(), baseName + "-" + idx);
        }
        return result;
    }

    private Map<String, Object> parseLlmJson(String assistantText) {
        Map<String, Object> out = new LinkedHashMap<>();
        String json = extractFirstJsonObject(assistantText);
        if (json == null) {
            out.put("requirementUnderstanding", "");
            out.put("currentPackingAssessment", "");
            out.put("modifiedPlanSummary", assistantText);
            out.put("recommendedAlgorithm", "unknown");
            out.put("constraintNotes", List.of());
            out.put("planEditHints", List.of());
            out.put("needRegeneratePacking", false);
            out.put("packingConstraintsForRegeneration", Map.of());
            out.put("parseWarning", "模型未返回可解析 JSON，已把全文放入 modifiedPlanSummary");
            return out;
        }
        try {
            JsonNode node = objectMapper.readTree(json);
            out.put("requirementUnderstanding", text(node, "requirementUnderstanding"));
            out.put("currentPackingAssessment", text(node, "currentPackingAssessment"));
            out.put("modifiedPlanSummary", text(node, "modifiedPlanSummary"));
            out.put("recommendedAlgorithm", text(node, "recommendedAlgorithm"));
            out.put("constraintNotes", stringList(node, "constraintNotes"));
            out.put("planEditHints", stringList(node, "planEditHints"));
            out.put("needRegeneratePacking", node.path("needRegeneratePacking").asBoolean(false));
            JsonNode pc = node.get("packingConstraintsForRegeneration");
            if (pc != null && pc.isObject()) {
                out.put("packingConstraintsForRegeneration",
                        objectMapper.convertValue(pc, new TypeReference<Map<String, Object>>() { }));
            } else {
                out.put("packingConstraintsForRegeneration", Map.of());
            }
        } catch (Exception e) {
            out.put("requirementUnderstanding", "");
            out.put("currentPackingAssessment", "");
            out.put("modifiedPlanSummary", assistantText);
            out.put("recommendedAlgorithm", "unknown");
            out.put("constraintNotes", List.of());
            out.put("planEditHints", List.of());
            out.put("needRegeneratePacking", false);
            out.put("packingConstraintsForRegeneration", Map.of());
            out.put("parseWarning", "JSON 解析失败: " + e.getMessage());
        }
        return out;
    }

    private static String text(JsonNode node, String field) {
        JsonNode v = node.get(field);
        return v == null || v.isNull() ? "" : v.asText("");
    }

    private static List<String> stringList(JsonNode node, String field) {
        JsonNode arr = node.get(field);
        if (arr == null || !arr.isArray()) return List.of();
        List<String> list = new ArrayList<>();
        for (JsonNode n : arr) {
            if (n != null && n.isTextual()) list.add(n.asText());
        }
        return list;
    }


    private static String extractFirstJsonObject(String text) {
        if (text == null) return null;
        int i = text.indexOf('{');
        if (i < 0) return null;
        int depth = 0;
        boolean inString = false;
        boolean escape = false;
        for (int j = i; j < text.length(); j++) {
            char c = text.charAt(j);
            if (escape) {
                escape = false;
                continue;
            }
            if (c == '\\' && inString) {
                escape = true;
                continue;
            }
            if (c == '"') {
                inString = !inString;
                continue;
            }
            if (inString) continue;
            if (c == '{') depth++;
            else if (c == '}') {
                depth--;
                if (depth == 0) return text.substring(i, j + 1);
            }
        }
        return null;
    }
}
