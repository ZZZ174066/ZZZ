package com.tsj.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tsj.entity.Container;
import com.tsj.entity.Item;
import com.tsj.mapper.ContainerMapper;
import com.tsj.mapper.ItemMapper;
import org.springframework.stereotype.Service;

import java.util.*;


@Service
public class OrderImportLlmService {

    private static final String SYSTEM_PROMPT = """
            你是装箱系统的“订单结构化解析器”。
            你会收到：
            1) 用户订单原文（可能来自 txt 或手动输入）
            2) 系统已有物品模板列表（含 itemId 与尺寸）
            3) 系统已有容器模板列表（含 containerId 与尺寸）

            请根据订单原文，输出一个 JSON 对象，不要输出 markdown 代码块，不要额外说明。
            JSON 结构必须严格为：
            {
              "planName": "字符串，可为空",
              "items": [{"name":"板件A","lengthMm":2440,"widthMm":1220,"heightMm":18,"quantity":10}],
              "containers": [{"name":"托盘箱A","lengthMm":2700,"widthMm":1300,"heightMm":900,"quantity":2}],
              "requirements": ["字符串数组，可为空"],
              "unresolvedItems": ["无法匹配的物品文本，可为空"],
              "unresolvedContainers": ["无法匹配的容器文本，可为空"]
            }

            规则：
            - 你需要直接抽取订单中的物品与容器尺寸数据，不要求匹配现有模板ID。
            - quantity 必须为正整数。
            - 若订单中没有明确容器，可给空数组。
            - 若订单里有“易碎/不可倒置/禁止底层”等文本，提炼到 requirements。
            - 若有任何无法可靠匹配项，放入 unresolvedItems/unresolvedContainers。
            """;

    private final LlmChatService llmChatService;
    private final ItemMapper itemMapper;
    private final ContainerMapper containerMapper;
    private final ObjectMapper objectMapper;

    public OrderImportLlmService(
            LlmChatService llmChatService,
            ItemMapper itemMapper,
            ContainerMapper containerMapper,
            ObjectMapper objectMapper
    ) {
        this.llmChatService = llmChatService;
        this.itemMapper = itemMapper;
        this.containerMapper = containerMapper;
        this.objectMapper = objectMapper;
    }

    public ParsedOrder parseOrderText(String orderText) throws Exception {
        if (orderText == null || orderText.isBlank()) {
            throw new IllegalArgumentException("订单文本不能为空");
        }

        String prompt = buildPrompt(orderText);
        String raw = llmChatService.chat(SYSTEM_PROMPT, prompt);
        String json = extractFirstJsonObject(raw);
        if (json == null) {
            throw new IllegalStateException("LLM 未返回可解析 JSON");
        }
        JsonNode root = objectMapper.readTree(json);

        ParsedOrder out = new ParsedOrder();
        out.setPlanName(text(root, "planName"));
        out.setItems(parseRefs(root.get("items"), "itemId"));
        out.setContainers(parseRefs(root.get("containers"), "containerId"));
        out.setRawItems(parseRawRows(root.get("items")));
        out.setRawContainers(parseRawRows(root.get("containers")));
        out.setRequirements(parseStringArray(root.get("requirements")));
        out.setUnresolvedItems(parseStringArray(root.get("unresolvedItems")));
        out.setUnresolvedContainers(parseStringArray(root.get("unresolvedContainers")));
        out.setRawAssistantText(raw);
        return out;
    }

    private String buildPrompt(String orderText) throws Exception {
        List<Map<String, Object>> itemRows = new ArrayList<>();
        for (Item it : itemMapper.selectAll()) {
            if (it == null || it.getItemId() == null) continue;
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("itemId", it.getItemId());
            row.put("itemName", it.getItemName());
            row.put("lengthMm", it.getLengthMm());
            row.put("widthMm", it.getWidthMm());
            row.put("heightMm", it.getHeightMm());
            itemRows.add(row);
        }

        List<Map<String, Object>> containerRows = new ArrayList<>();
        for (Container c : containerMapper.selectAll()) {
            if (c == null || c.getContainerId() == null) continue;
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("containerId", c.getContainerId());
            row.put("containerName", c.getContainerName());
            row.put("lengthMm", c.getLengthMm());
            row.put("widthMm", c.getWidthMm());
            row.put("heightMm", c.getHeightMm());
            containerRows.add(row);
        }

        StringBuilder sb = new StringBuilder();
        sb.append("【订单原文】\n");
        sb.append(orderText).append("\n\n");
        sb.append("【可选物品模板】\n");
        sb.append(objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(itemRows)).append("\n\n");
        sb.append("【可选容器模板】\n");
        sb.append(objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(containerRows)).append("\n");
        return sb.toString();
    }

    private static List<IdQtyRef> parseRefs(JsonNode arr, String idField) {
        if (arr == null || !arr.isArray()) return List.of();
        List<IdQtyRef> out = new ArrayList<>();
        for (JsonNode n : arr) {
            if (n == null || !n.isObject()) continue;
            long id = n.path(idField).asLong(0);
            int qty = n.path("quantity").asInt(0);
            if (id <= 0 || qty <= 0) continue;
            out.add(new IdQtyRef(id, qty));
        }
        return out;
    }

    private static List<String> parseStringArray(JsonNode arr) {
        if (arr == null || !arr.isArray()) return List.of();
        List<String> out = new ArrayList<>();
        for (JsonNode n : arr) {
            if (n != null && n.isTextual()) {
                String s = n.asText("").trim();
                if (!s.isEmpty()) out.add(s);
            }
        }
        return out;
    }

    private static List<NamedDimQty> parseRawRows(JsonNode arr) {
        if (arr == null || !arr.isArray()) return List.of();
        List<NamedDimQty> out = new ArrayList<>();
        for (JsonNode n : arr) {
            if (n == null || !n.isObject()) continue;

            String name = firstNonBlank(
                    text(n, "name"),
                    text(n, "itemName"),
                    text(n, "containerName")
            ).trim();
            int l = readPositiveMm(n, "lengthMm", "length_mm", "L", "l");
            int w = readPositiveMm(n, "widthMm", "width_mm", "W", "w");
            int h = readPositiveMm(n, "heightMm", "height_mm", "H", "h");
            int qty = readPositiveMm(n, "quantity", "qty", "count");
            if (name.isEmpty() || l <= 0 || w <= 0 || h <= 0 || qty <= 0) continue;
            out.add(new NamedDimQty(name, l, w, h, qty));
        }
        return out;
    }

    private static String firstNonBlank(String... parts) {
        if (parts == null) return "";
        for (String p : parts) {
            if (p != null && !p.isBlank()) return p;
        }
        return "";
    }


    private static int readPositiveMm(JsonNode parent, String... fieldNames) {
        for (String field : fieldNames) {
            JsonNode v = parent.get(field);
            if (v == null || v.isNull()) continue;
            if (v.isNumber()) {
                double d = v.asDouble();
                if (d > 0 && d <= 1e9) return (int) Math.round(d);
            }
            if (v.isTextual()) {
                String s = v.asText("").trim().replace("mm", "").replace("MM", "").trim();
                if (s.isEmpty()) continue;
                try {
                    double d = Double.parseDouble(s);
                    if (d > 0 && d <= 1e9) return (int) Math.round(d);
                } catch (NumberFormatException ignored) {

                }
            }
        }
        return 0;
    }

    private static String text(JsonNode node, String field) {
        JsonNode v = node == null ? null : node.get(field);
        return v == null || v.isNull() ? "" : v.asText("");
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

    public static class ParsedOrder {
        private String planName;
        private List<IdQtyRef> items = List.of();
        private List<IdQtyRef> containers = List.of();
        private List<NamedDimQty> rawItems = List.of();
        private List<NamedDimQty> rawContainers = List.of();
        private List<String> requirements = List.of();
        private List<String> unresolvedItems = List.of();
        private List<String> unresolvedContainers = List.of();
        private String rawAssistantText;

        public String getPlanName() {
            return planName;
        }

        public void setPlanName(String planName) {
            this.planName = planName;
        }

        public List<IdQtyRef> getItems() {
            return items;
        }

        public void setItems(List<IdQtyRef> items) {
            this.items = items == null ? List.of() : items;
        }

        public List<IdQtyRef> getContainers() {
            return containers;
        }

        public void setContainers(List<IdQtyRef> containers) {
            this.containers = containers == null ? List.of() : containers;
        }

        public List<String> getRequirements() {
            return requirements;
        }

        public void setRequirements(List<String> requirements) {
            this.requirements = requirements == null ? List.of() : requirements;
        }

        public List<NamedDimQty> getRawItems() {
            return rawItems;
        }

        public void setRawItems(List<NamedDimQty> rawItems) {
            this.rawItems = rawItems == null ? List.of() : rawItems;
        }

        public List<NamedDimQty> getRawContainers() {
            return rawContainers;
        }

        public void setRawContainers(List<NamedDimQty> rawContainers) {
            this.rawContainers = rawContainers == null ? List.of() : rawContainers;
        }

        public List<String> getUnresolvedItems() {
            return unresolvedItems;
        }

        public void setUnresolvedItems(List<String> unresolvedItems) {
            this.unresolvedItems = unresolvedItems == null ? List.of() : unresolvedItems;
        }

        public List<String> getUnresolvedContainers() {
            return unresolvedContainers;
        }

        public void setUnresolvedContainers(List<String> unresolvedContainers) {
            this.unresolvedContainers = unresolvedContainers == null ? List.of() : unresolvedContainers;
        }

        public String getRawAssistantText() {
            return rawAssistantText;
        }

        public void setRawAssistantText(String rawAssistantText) {
            this.rawAssistantText = rawAssistantText;
        }
    }

    public record IdQtyRef(Long id, Integer quantity) {
    }

    public record NamedDimQty(String name, Integer lengthMm, Integer widthMm, Integer heightMm, Integer quantity) {
    }
}
