package com.tsj.Controller;

import com.tsj.algorithm.PackingAlgorithm1;
import com.tsj.algorithm.PackingAlgorithm2;
import com.tsj.algorithm.PackingAlgorithm3;
import com.tsj.dto.OrderImportRequest;
import com.tsj.dto.PlanCreateRequest;
import com.tsj.entity.*;
import com.tsj.mapper.*;
import com.tsj.dto.PackingLlmConstraints;
import com.tsj.Service.LlmChatService;
import com.tsj.Service.OrderImportLlmService;
import com.tsj.Service.PlanRequirementLlmService;
import com.tsj.Service.PlanExportService;
import com.tsj.util.PackingLlmConstraintsParser;
import com.tsj.algorithm.PackingStepListener;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/plans")
public class PlanController {
    private static final String IMPORTED_MARKER_REQUIREMENT = "[[SYS_IMPORTED_PLAN_LOCKED]]";
    private static final String IMPORTED_ITEM_PREFIX = "__IMPORTED_ITEM__";
    private static final String IMPORTED_CONTAINER_PREFIX = "__IMPORTED_CONTAINER__";
    private static final int MAX_XLSX_ROWS_FOR_LLM = 300;
    private static final int MAX_XLSX_COLS_FOR_LLM = 8;
    private static final int MAX_CELL_CHARS_FOR_LLM = 80;

    private final PlanMapper planMapper;
    private final PlanItemMapper planItemMapper;
    private final PlanContainerMapper planContainerMapper;
    private final PlanRequirementMapper planRequirementMapper;
    private final PlanItemDetailMapper planItemDetailMapper;
    private final PlanContainerDetailMapper planContainerDetailMapper;
    private final ContainerMapper containerMapper;
    private final ItemMapper itemMapper;
    private final LlmChatService llmChatService;
    private final OrderImportLlmService orderImportLlmService;
    private final PlanRequirementLlmService planRequirementLlmService;
    private final PlanExportService planExportService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public PlanController(
            PlanMapper planMapper,
            PlanItemMapper planItemMapper,
            PlanContainerMapper planContainerMapper,
            PlanRequirementMapper planRequirementMapper,
            PlanItemDetailMapper planItemDetailMapper,
            PlanContainerDetailMapper planContainerDetailMapper,
            ContainerMapper containerMapper,
            ItemMapper itemMapper,
            LlmChatService llmChatService,
            OrderImportLlmService orderImportLlmService,
            PlanRequirementLlmService planRequirementLlmService,
            PlanExportService planExportService
    ) {
        this.planMapper = planMapper;
        this.planItemMapper = planItemMapper;
        this.planContainerMapper = planContainerMapper;
        this.planRequirementMapper = planRequirementMapper;
        this.planItemDetailMapper = planItemDetailMapper;
        this.planContainerDetailMapper = planContainerDetailMapper;
        this.containerMapper = containerMapper;
        this.itemMapper = itemMapper;
        this.llmChatService = llmChatService;
        this.orderImportLlmService = orderImportLlmService;
        this.planRequirementLlmService = planRequirementLlmService;
        this.planExportService = planExportService;
    }

    @GetMapping
    public List<Plan> list(@RequestParam(value = "keyword", required = false) String keyword) {
        List<Plan> all = planMapper.selectAll();
        if (keyword == null || keyword.isBlank()) {
            return all;
        }
        String lower = keyword.toLowerCase();
        return all.stream()
                .filter(p -> p.getPlanName() != null && p.getPlanName().toLowerCase().contains(lower))
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public Plan getById(@PathVariable Long id) {
        return planMapper.selectById(id);
    }

    @GetMapping("/{id}/items")
    public List<Map<String, Object>> getPlanItems(@PathVariable Long id) {

        List<PlanItemDetail> details = planItemDetailMapper.selectByPlanId(id);
        if (details == null) return List.of();

        Map<Long, Item> itemMap = new HashMap<>();
        for (Item it : itemMapper.selectAll()) {
            if (it != null && it.getItemId() != null) itemMap.put(it.getItemId(), it);
        }


        Map<Long, String> containerInstanceNameMap = buildContainerInstanceNameMap(id);

        List<Map<String, Object>> result = new ArrayList<>();
        for (PlanItemDetail d : details) {
            if (d == null) continue;
            Item it = itemMap.get(d.getItemId());
            Map<String, Object> map = new HashMap<>();
            map.put("id", d.getId());
            map.put("itemId", d.getItemId());
            map.put("loaded", d.getLoaded());
            map.put("containerInstanceId", d.getContainerInstanceId());
            map.put("containerName", d.getContainerInstanceId() == null ? null : containerInstanceNameMap.get(d.getContainerInstanceId()));
            map.put("layerIndex", d.getLayerIndex());
            map.put("posX", d.getPosX());
            map.put("posY", d.getPosY());
            map.put("posZ", d.getPosZ());
            map.put("swapLengthWidth", d.getSwapLengthWidth());
            map.put("supportRate", d.getSupportRate());

            if (it != null) {
                map.put("itemName", stripImportedPrefix(it.getItemName(), IMPORTED_ITEM_PREFIX));
                map.put("lengthMm", it.getLengthMm());
                map.put("widthMm", it.getWidthMm());
                map.put("heightMm", it.getHeightMm());
            }
            result.add(map);
        }
        return result;
    }


    @GetMapping("/{id}/plan-items")
    public List<Map<String, Object>> getPlanItemPicks(@PathVariable Long id) {
        List<PlanItem> planItems = planItemMapper.selectByPlanId(id);
        if (planItems == null) return List.of();

        Map<Long, Item> itemMap = new HashMap<>();
        for (Item it : itemMapper.selectAll()) {
            if (it != null && it.getItemId() != null) itemMap.put(it.getItemId(), it);
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (PlanItem pi : planItems) {
            if (pi == null) continue;
            Item it = itemMap.get(pi.getItemId());
            Map<String, Object> map = new HashMap<>();
            map.put("id", pi.getId());
            map.put("itemId", pi.getItemId());
            map.put("itemQty", pi.getItemQty());
            if (it != null) {
                map.put("itemName", stripImportedPrefix(it.getItemName(), IMPORTED_ITEM_PREFIX));
                map.put("lengthMm", it.getLengthMm());
                map.put("widthMm", it.getWidthMm());
                map.put("heightMm", it.getHeightMm());
            }
            result.add(map);
        }
        return result;
    }


    @GetMapping("/{id}/plan-containers")
    public List<Map<String, Object>> getPlanContainerPicks(@PathVariable Long id) {
        List<PlanContainer> planContainers = planContainerMapper.selectByPlanId(id);
        if (planContainers == null) return List.of();

        Map<Long, Container> containerMap = new HashMap<>();
        for (Container c : containerMapper.selectAll()) {
            if (c != null && c.getContainerId() != null) containerMap.put(c.getContainerId(), c);
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (PlanContainer pc : planContainers) {
            if (pc == null) continue;
            Container c = containerMap.get(pc.getContainerId());
            Map<String, Object> map = new HashMap<>();
            map.put("id", pc.getId());
            map.put("containerId", pc.getContainerId());
            map.put("containerQty", pc.getContainerQty());
            if (c != null) {
                map.put("containerName", stripImportedPrefix(c.getContainerName(), IMPORTED_CONTAINER_PREFIX));
                map.put("lengthMm", c.getLengthMm());
                map.put("widthMm", c.getWidthMm());
                map.put("heightMm", c.getHeightMm());
            }
            result.add(map);
        }
        return result;
    }

    @GetMapping("/{id}/containers")
    public List<Map<String, Object>> getPlanContainers(@PathVariable Long id) {

        List<PlanContainerDetail> details = planContainerDetailMapper.selectByPlanId(id);
        if (details == null) return List.of();

        Map<Long, Container> containerMap = new HashMap<>();
        for (Container c : containerMapper.selectAll()) {
            if (c != null && c.getContainerId() != null) containerMap.put(c.getContainerId(), c);
        }


        Map<Long, Integer> seq = new HashMap<>();
        List<Map<String, Object>> result = new ArrayList<>();
        for (PlanContainerDetail d : details) {
            if (d == null) continue;
            Container tpl = containerMap.get(d.getContainerId());
            int idx = seq.merge(d.getContainerId(), 1, Integer::sum);
            String baseName = tpl == null || tpl.getContainerName() == null ? "容器" : tpl.getContainerName();
            baseName = stripImportedPrefix(baseName, IMPORTED_CONTAINER_PREFIX);
            String name = baseName + "-" + idx;

            Map<String, Object> map = new HashMap<>();
            map.put("id", d.getId());
            map.put("containerId", d.getContainerId());
            map.put("name", name);
            map.put("containerName", baseName);
            map.put("filled", d.getFilled());
            map.put("filledItemQty", d.getFilledItemQty());
            map.put("fillRate", d.getFillRate());
            map.put("avgSupportRate", d.getAvgSupportRate());
            if (tpl != null) {
                map.put("lengthMm", tpl.getLengthMm());
                map.put("widthMm", tpl.getWidthMm());
                map.put("heightMm", tpl.getHeightMm());
            }
            result.add(map);
        }
        return result;
    }

    @GetMapping("/{id}/requirements")
    public List<PlanRequirement> getPlanRequirements(@PathVariable Long id) {
        List<PlanRequirement> all = planRequirementMapper.selectByPlanId(id);
        if (all == null) return List.of();
        return all.stream()
                .filter(r -> r != null && !IMPORTED_MARKER_REQUIREMENT.equals(r.getContent()))
                .collect(Collectors.toList());
    }


    @PostMapping("/{id}/requirements")
    public PlanRequirement addRequirement(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Plan plan = planMapper.selectById(id);
        if (plan == null) {
            throw new RuntimeException("方案不存在");
        }
        Object contentObj = body == null ? null : body.get("content");
        String content = contentObj == null ? "" : String.valueOf(contentObj).trim();
        if (content.isEmpty()) {
            throw new RuntimeException("需求内容不能为空");
        }
        PlanRequirement r = new PlanRequirement();
        r.setPlanId(id);
        r.setFinished(0);
        r.setContent(content);
        planRequirementMapper.insert(r);
        plan.setNeedUpdate(1);
        planMapper.update(plan);
        return planRequirementMapper.selectById(r.getId());
    }

    @DeleteMapping("/{planId}/requirements/{reqId}")
    public Map<String, Object> deleteRequirement(@PathVariable Long planId, @PathVariable Long reqId) {
        PlanRequirement existing = planRequirementMapper.selectById(reqId);
        if (existing == null || !Objects.equals(existing.getPlanId(), planId)) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("message", "需求不存在");
            return err;
        }
        planRequirementMapper.deleteById(reqId);
        Plan plan = planMapper.selectById(planId);
        if (plan != null) {
            plan.setNeedUpdate(1);
            planMapper.update(plan);
        }
        Map<String, Object> ok = new HashMap<>();
        ok.put("success", true);
        return ok;
    }


    @PostMapping("/{id}/llm/optimize-requirements")
    public Map<String, Object> llmOptimizeRequirements(@PathVariable Long id, @RequestBody(required = false) Map<String, Object> body) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (!llmChatService.isConfigured()) {
                response.put("success", false);
                response.put("message",
                        "LLM 未就绪：请配置 API Key——任选其一：① 在 application.properties 中设置 llm.api.key=你的密钥 "
                                + "② 在系统或 IDE 运行配置里设置环境变量 LLM_API_KEY。修改后需重启后端。"
                                + "暂不用 LLM 可将 llm.api.enabled=false。");
                return response;
            }
            Long focusId = null;
            if (body != null && body.get("focusRequirementId") != null) {
                Object v = body.get("focusRequirementId");
                if (v instanceof Number) {
                    focusId = ((Number) v).longValue();
                } else {
                    String s = String.valueOf(v).trim();
                    if (!s.isEmpty()) focusId = Long.parseLong(s);
                }
            }
            Map<String, Object> result = planRequirementLlmService.optimizePlanWithRequirements(id, focusId);
            if (Boolean.FALSE.equals(result.get("success"))) {
                return result;
            }
            Plan plan = planMapper.selectById(id);
            if (plan != null) {
                plan.setNeedUpdate(1);
                planMapper.update(plan);
            }
            return result;
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage() == null ? "LLM 调用失败" : e.getMessage());
            return response;
        }
    }

    @PostMapping
    public Plan create(@RequestBody PlanCreateRequest req) {
        return createPlanInternal(req);
    }


    @PostMapping("/import-order")
    public Map<String, Object> importOrder(@RequestBody OrderImportRequest req) {
        Map<String, Object> res = new LinkedHashMap<>();
        try {
            if (req == null || req.getOrderText() == null || req.getOrderText().isBlank()) {
                res.put("success", false);
                res.put("message", "订单文本不能为空");
                return res;
            }
            if (!llmChatService.isConfigured()) {
                res.put("success", false);
                res.put("message",
                        "LLM 未就绪：请配置 API Key——任选其一：① 在 application.properties 中设置 llm.api.key=你的密钥 "
                                + "② 在系统或 IDE 运行配置里设置环境变量 LLM_API_KEY。修改后需重启后端。"
                                + "暂不用 LLM 可将 llm.api.enabled=false。");
                return res;
            }

            OrderImportLlmService.ParsedOrder parsed = orderImportLlmService.parseOrderText(req.getOrderText());
            boolean hasParsedItems = (parsed.getItems() != null && !parsed.getItems().isEmpty())
                    || (parsed.getRawItems() != null && !parsed.getRawItems().isEmpty());
            boolean hasParsedContainers = (parsed.getContainers() != null && !parsed.getContainers().isEmpty())
                    || (parsed.getRawContainers() != null && !parsed.getRawContainers().isEmpty());
            if (!hasParsedItems) {
                res.put("success", false);
                res.put("message", "订单解析失败：未识别到可用物品，请检查订单文本或物品模板。");
                res.put("parsed", parsed);
                return res;
            }
            if (!hasParsedContainers) {
                res.put("success", false);
                res.put("message", "订单解析失败：未识别到可用容器，请检查订单文本或容器模板。");
                res.put("parsed", parsed);
                return res;
            }

            PlanCreateRequest createReq = toCreateRequest(req, parsed);
            if (req.getReplacePlanId() != null) {
                return importOrderReplaceExisting(req.getReplacePlanId(), createReq, parsed);
            }
            Plan plan = createPlanInternal(createReq);
            if (plan == null || plan.getPlanId() == null) {
                res.put("success", false);
                res.put("message", "创建方案失败");
                return res;
            }

            PlanRequirement marker = new PlanRequirement();
            marker.setPlanId(plan.getPlanId());
            marker.setFinished(1);
            marker.setContent(IMPORTED_MARKER_REQUIREMENT);
            planRequirementMapper.insert(marker);


            if (parsed.getRequirements() != null) {
                for (String r : parsed.getRequirements()) {
                    if (r == null || r.isBlank()) continue;
                    PlanRequirement pr = new PlanRequirement();
                    pr.setPlanId(plan.getPlanId());
                    pr.setFinished(0);
                    pr.setContent(r.trim());
                    planRequirementMapper.insert(pr);
                }
            }

            res.put("success", true);
            res.put("message", "订单导入成功，方案已创建");
            res.put("plan", planMapper.selectById(plan.getPlanId()));
            res.put("parsed", parsed);
            return res;
        } catch (Exception e) {
            res.put("success", false);
            res.put("message", e.getMessage() == null ? "订单导入失败" : e.getMessage());
            return res;
        }
    }


    @PostMapping(value = "/import-order-file", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Map<String, Object> importOrderFile(
            @RequestPart("file") MultipartFile[] files,
            @RequestPart(value = "planName", required = false) String planName,
            @RequestPart(value = "replacePlanId", required = false) String replacePlanIdStr
    ) throws IOException {
        String text = extractOrderTextFromFiles(files);
        OrderImportRequest req = new OrderImportRequest();
        req.setOrderText(text);
        req.setPlanName(planName);
        if (replacePlanIdStr != null && !replacePlanIdStr.isBlank()) {
            try {
                req.setReplacePlanId(Long.parseLong(replacePlanIdStr.trim()));
            } catch (NumberFormatException ignored) {
                req.setReplacePlanId(null);
            }
        }
        return importOrder(req);
    }

    private String extractOrderTextFromFiles(MultipartFile[] files) throws IOException {
        if (files == null || files.length == 0) return "";
        StringBuilder sb = new StringBuilder();
        int kept = 0;
        for (MultipartFile file : files) {
            if (file == null || file.isEmpty()) continue;
            String part = extractOrderTextFromFile(file).trim();
            if (part.isEmpty()) continue;
            if (kept > 0) sb.append("\n\n");
            String fileName = file.getOriginalFilename() == null ? "未命名文件" : file.getOriginalFilename();
            sb.append("【文件：").append(fileName).append("】\n");
            sb.append(part);
            kept++;
        }
        return sb.toString().trim();
    }

    private String extractOrderTextFromFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) return "";
        String name = file.getOriginalFilename() == null ? "" : file.getOriginalFilename().toLowerCase(Locale.ROOT);
        if (name.endsWith(".xlsx")) {
            return parseXlsxToText(file.getBytes());
        }
        if (name.endsWith(".xls")) {
            throw new RuntimeException("暂不支持 .xls，请另存为 .xlsx 后再导入");
        }
        return new String(file.getBytes(), StandardCharsets.UTF_8);
    }


    private String parseXlsxToText(byte[] bytes) throws IOException {
        Map<String, byte[]> entries = readZipEntries(bytes);
        if (entries.isEmpty()) return "";

        List<String> sharedStrings = parseSharedStrings(entries.get("xl/sharedStrings.xml"));
        String sheetPath = locateFirstSheetPath(entries);
        if (sheetPath == null) {
            throw new RuntimeException("未找到可解析的工作表，请检查 Excel 文件内容");
        }
        byte[] sheetXml = entries.get(sheetPath);
        if (sheetXml == null || sheetXml.length == 0) return "";

        return parseSheetRowsToText(sheetXml, sharedStrings);
    }

    private Map<String, byte[]> readZipEntries(byte[] bytes) throws IOException {
        Map<String, byte[]> map = new HashMap<>();
        try (ZipInputStream zis = new ZipInputStream(new ByteArrayInputStream(bytes))) {
            ZipEntry entry;
            while ((entry = zis.getNextEntry()) != null) {
                if (entry.isDirectory()) continue;
                map.put(entry.getName(), zis.readAllBytes());
            }
        }
        return map;
    }

    private String locateFirstSheetPath(Map<String, byte[]> entries) {
        List<String> sheetCandidates = entries.keySet().stream()
                .filter(k -> k.startsWith("xl/worksheets/sheet") && k.endsWith(".xml"))
                .sorted()
                .toList();
        return sheetCandidates.isEmpty() ? null : sheetCandidates.get(0);
    }

    private List<String> parseSharedStrings(byte[] xmlBytes) {
        if (xmlBytes == null || xmlBytes.length == 0) return List.of();
        String xml = new String(xmlBytes, StandardCharsets.UTF_8);
        List<String> out = new ArrayList<>();
        Pattern siPattern = Pattern.compile("<si>(.*?)</si>", Pattern.DOTALL);
        Matcher siMatcher = siPattern.matcher(xml);
        while (siMatcher.find()) {
            String si = siMatcher.group(1);
            Matcher tMatcher = Pattern.compile("<t[^>]*>(.*?)</t>", Pattern.DOTALL).matcher(si);
            StringBuilder sb = new StringBuilder();
            while (tMatcher.find()) {
                sb.append(xmlUnescape(tMatcher.group(1)));
            }
            out.add(sb.toString().trim());
        }
        return out;
    }

    private String parseSheetRowsToText(byte[] sheetXmlBytes, List<String> sharedStrings) {
        String xml = new String(sheetXmlBytes, StandardCharsets.UTF_8);
        Pattern rowPattern = Pattern.compile("<row[^>]*>(.*?)</row>", Pattern.DOTALL);
        Pattern cellPattern = Pattern.compile("<c([^>]*)>(.*?)</c>", Pattern.DOTALL);
        Pattern vPattern = Pattern.compile("<v>(.*?)</v>", Pattern.DOTALL);
        Pattern tPattern = Pattern.compile("<t[^>]*>(.*?)</t>", Pattern.DOTALL);

        StringBuilder result = new StringBuilder();
        int keptRows = 0;
        Matcher rowMatcher = rowPattern.matcher(xml);
        while (rowMatcher.find()) {
            String row = rowMatcher.group(1);
            List<String> values = new ArrayList<>();
            Matcher cellMatcher = cellPattern.matcher(row);
            while (cellMatcher.find()) {
                String attrs = cellMatcher.group(1);
                String body = cellMatcher.group(2);
                String cellValue = "";

                Matcher vm = vPattern.matcher(body);
                if (vm.find()) {
                    String raw = xmlUnescape(vm.group(1)).trim();
                    boolean isShared = attrs != null && attrs.contains(" t=\"s\"");
                    if (isShared) {
                        try {
                            int idx = Integer.parseInt(raw);
                            if (idx >= 0 && idx < sharedStrings.size()) {
                                cellValue = sharedStrings.get(idx);
                            }
                        } catch (NumberFormatException ignored) {
                            cellValue = raw;
                        }
                    } else {
                        cellValue = raw;
                    }
                } else {
                    Matcher tm = tPattern.matcher(body);
                    if (tm.find()) {
                        cellValue = xmlUnescape(tm.group(1)).trim();
                    }
                }
                if (cellValue != null && cellValue.length() > MAX_CELL_CHARS_FOR_LLM) {
                    cellValue = cellValue.substring(0, MAX_CELL_CHARS_FOR_LLM);
                }
                values.add(cellValue);
            }

            List<String> limitedCols = values.size() > MAX_XLSX_COLS_FOR_LLM
                    ? values.subList(0, MAX_XLSX_COLS_FOR_LLM)
                    : values;
            String line = limitedCols.stream()
                    .map(v -> v == null ? "" : v.trim())
                    .filter(v -> !v.isEmpty())
                    .collect(Collectors.joining(" | "));
            if (!line.isEmpty()) {
                result.append(line).append('\n');
                keptRows++;
                if (keptRows >= MAX_XLSX_ROWS_FOR_LLM) {
                    break;
                }
            }
        }
        return result.toString().trim();
    }

    private String xmlUnescape(String in) {
        if (in == null) return "";
        return in
                .replace("&lt;", "<")
                .replace("&gt;", ">")
                .replace("&amp;", "&")
                .replace("&quot;", "\"")
                .replace("&#39;", "'");
    }

    private PlanCreateRequest toCreateRequest(OrderImportRequest req, OrderImportLlmService.ParsedOrder parsed) {
        PlanCreateRequest out = new PlanCreateRequest();
        String name = req.getPlanName();
        if (name == null || name.isBlank()) {
            name = parsed.getPlanName();
        }
        if (name == null || name.isBlank()) {
            name = "订单导入方案-" + System.currentTimeMillis();
        }
        out.setPlanName(name);

        List<PlanCreateRequest.ItemRef> itemRefs = new ArrayList<>();
        int itemTotal = 0;
        if (parsed.getItems() != null) {
            for (OrderImportLlmService.IdQtyRef ref : parsed.getItems()) {
                if (ref == null || ref.id() == null || ref.quantity() == null || ref.quantity() <= 0) continue;
                PlanCreateRequest.ItemRef i = new PlanCreateRequest.ItemRef();
                i.setItemId(ref.id());
                i.setQuantity(ref.quantity());
                itemRefs.add(i);
                itemTotal += ref.quantity();
            }
        }

        if ((itemRefs.isEmpty()) && parsed.getRawItems() != null) {
            for (OrderImportLlmService.NamedDimQty row : parsed.getRawItems()) {
                if (row == null || row.quantity() == null || row.quantity() <= 0) continue;
                Item item = new Item();
                item.setItemName(IMPORTED_ITEM_PREFIX + row.name());
                item.setLengthMm(row.lengthMm());
                item.setWidthMm(row.widthMm());
                item.setHeightMm(row.heightMm());
                item.setQuantity(row.quantity());
                itemMapper.insert(item);
                if (item.getItemId() == null) continue;
                PlanCreateRequest.ItemRef i = new PlanCreateRequest.ItemRef();
                i.setItemId(item.getItemId());
                i.setQuantity(row.quantity());
                itemRefs.add(i);
                itemTotal += row.quantity();
            }
        }
        out.setItems(itemRefs);
        out.setPlannedTotalItemQty(itemTotal);

        List<PlanCreateRequest.ContainerRef> containerRefs = new ArrayList<>();
        int containerTotal = 0;
        if (parsed.getContainers() != null) {
            for (OrderImportLlmService.IdQtyRef ref : parsed.getContainers()) {
                if (ref == null || ref.id() == null || ref.quantity() == null || ref.quantity() <= 0) continue;
                PlanCreateRequest.ContainerRef c = new PlanCreateRequest.ContainerRef();
                c.setContainerId(ref.id());
                c.setQuantity(ref.quantity());
                containerRefs.add(c);
                containerTotal += ref.quantity();
            }
        }

        if ((containerRefs.isEmpty()) && parsed.getRawContainers() != null) {
            for (OrderImportLlmService.NamedDimQty row : parsed.getRawContainers()) {
                if (row == null || row.quantity() == null || row.quantity() <= 0) continue;
                Container ctpl = new Container();
                ctpl.setContainerName(IMPORTED_CONTAINER_PREFIX + row.name());
                ctpl.setLengthMm(row.lengthMm());
                ctpl.setWidthMm(row.widthMm());
                ctpl.setHeightMm(row.heightMm());
                ctpl.setQuantity(row.quantity());
                containerMapper.insert(ctpl);
                if (ctpl.getContainerId() == null) continue;
                PlanCreateRequest.ContainerRef c = new PlanCreateRequest.ContainerRef();
                c.setContainerId(ctpl.getContainerId());
                c.setQuantity(row.quantity());
                containerRefs.add(c);
                containerTotal += row.quantity();
            }
        }
        out.setContainers(containerRefs);
        out.setPlannedTotalContainerQty(containerTotal);
        out.setNeedUpdate(1);
        return out;
    }

    private Plan createPlanInternal(PlanCreateRequest req) {
        Plan plan = new Plan();
        plan.setPlanName(req.getPlanName());
        plan.setPlannedTotalItemQty(req.getPlannedTotalItemQty());
        plan.setPlannedTotalContainerQty(req.getPlannedTotalContainerQty());
        plan.setActualTotalItemQty(0);
        plan.setActualTotalContainerQty(0);
        plan.setAvgItemSupportRate(BigDecimal.ZERO);
        plan.setAvgFilledContainerFillRate(BigDecimal.ZERO);
        plan.setPlanStatus(0);
        plan.setNeedUpdate(req.getNeedUpdate() == null ? 0 : req.getNeedUpdate());
        planMapper.insert(plan);

        Long planId = plan.getPlanId();


        if (req.getItems() != null) {
            for (PlanCreateRequest.ItemRef itemRef : req.getItems()) {
                if (itemRef == null || itemRef.getItemId() == null) continue;
                int qty = itemRef.getQuantity() == null ? 0 : itemRef.getQuantity();
                if (qty <= 0) continue;

                PlanItem pi = new PlanItem();
                pi.setPlanId(planId);
                pi.setItemId(itemRef.getItemId());
                pi.setItemQty(qty);
                planItemMapper.insert(pi);


                for (int i = 0; i < qty; i++) {
                    PlanItemDetail detail = new PlanItemDetail();
                    detail.setPlanId(planId);
                    detail.setItemId(itemRef.getItemId());
                    detail.setLoaded(0);
                    detail.setSwapLengthWidth(0);
                    detail.setSupportRate(BigDecimal.ZERO);
                    planItemDetailMapper.insert(detail);
                }
            }
        }


        if (req.getContainers() != null) {
            for (PlanCreateRequest.ContainerRef cRef : req.getContainers()) {
                if (cRef == null || cRef.getContainerId() == null) continue;
                int qty = cRef.getQuantity() == null ? 0 : cRef.getQuantity();
                if (qty <= 0) continue;

                PlanContainer pc = new PlanContainer();
                pc.setPlanId(planId);
                pc.setContainerId(cRef.getContainerId());
                pc.setContainerQty(qty);
                planContainerMapper.insert(pc);


                for (int i = 0; i < qty; i++) {
                    PlanContainerDetail detail = new PlanContainerDetail();
                    detail.setPlanId(planId);
                    detail.setContainerId(cRef.getContainerId());
                    detail.setFilled(0);
                    detail.setFilledItemQty(0);
                    detail.setFillRate(BigDecimal.ZERO);
                    detail.setAvgSupportRate(BigDecimal.ZERO);
                    planContainerDetailMapper.insert(detail);
                }
            }
        }

        return planMapper.selectById(planId);
    }


    private void replacePlanSelectionsAndDetails(Long id, PlanCreateRequest req) {
        List<PlanItemDetail> oldItemDetails = planItemDetailMapper.selectByPlanId(id);
        if (oldItemDetails != null) {
            for (PlanItemDetail detail : oldItemDetails) {
                planItemDetailMapper.deleteById(detail.getId());
            }
        }

        List<PlanContainerDetail> oldContainerDetails = planContainerDetailMapper.selectByPlanId(id);
        if (oldContainerDetails != null) {
            for (PlanContainerDetail detail : oldContainerDetails) {
                planContainerDetailMapper.deleteById(detail.getId());
            }
        }

        List<PlanItem> oldItems = planItemMapper.selectByPlanId(id);
        if (oldItems != null) {
            for (PlanItem pi : oldItems) {
                planItemMapper.deleteById(pi.getId());
            }
        }

        List<PlanContainer> oldContainers = planContainerMapper.selectByPlanId(id);
        if (oldContainers != null) {
            for (PlanContainer pc : oldContainers) {
                planContainerMapper.deleteById(pc.getId());
            }
        }

        if (req.getItems() != null) {
            for (PlanCreateRequest.ItemRef itemRef : req.getItems()) {
                if (itemRef == null || itemRef.getItemId() == null) continue;
                int qty = itemRef.getQuantity() == null ? 0 : itemRef.getQuantity();
                if (qty <= 0) continue;

                PlanItem pi = new PlanItem();
                pi.setPlanId(id);
                pi.setItemId(itemRef.getItemId());
                pi.setItemQty(qty);
                planItemMapper.insert(pi);

                for (int i = 0; i < qty; i++) {
                    PlanItemDetail detail = new PlanItemDetail();
                    detail.setPlanId(id);
                    detail.setItemId(itemRef.getItemId());
                    detail.setLoaded(0);
                    detail.setSwapLengthWidth(0);
                    detail.setSupportRate(BigDecimal.ZERO);
                    planItemDetailMapper.insert(detail);
                }
            }
        }

        if (req.getContainers() != null) {
            for (PlanCreateRequest.ContainerRef cRef : req.getContainers()) {
                if (cRef == null || cRef.getContainerId() == null) continue;
                int qty = cRef.getQuantity() == null ? 0 : cRef.getQuantity();
                if (qty <= 0) continue;

                PlanContainer pc = new PlanContainer();
                pc.setPlanId(id);
                pc.setContainerId(cRef.getContainerId());
                pc.setContainerQty(qty);
                planContainerMapper.insert(pc);

                for (int i = 0; i < qty; i++) {
                    PlanContainerDetail detail = new PlanContainerDetail();
                    detail.setPlanId(id);
                    detail.setContainerId(cRef.getContainerId());
                    detail.setFilled(0);
                    detail.setFilledItemQty(0);
                    detail.setFillRate(BigDecimal.ZERO);
                    detail.setAvgSupportRate(BigDecimal.ZERO);
                    planContainerDetailMapper.insert(detail);
                }
            }
        }
    }

    private Map<Long, Integer> aggregatePlanItemQty(Long planId) {
        Map<Long, Integer> m = new HashMap<>();
        List<PlanItem> list = planItemMapper.selectByPlanId(planId);
        if (list == null) return m;
        for (PlanItem pi : list) {
            if (pi == null || pi.getItemId() == null) continue;
            int q = pi.getItemQty() == null ? 0 : pi.getItemQty();
            m.merge(pi.getItemId(), q, Integer::sum);
        }
        return m;
    }

    private Map<Long, Integer> aggregatePlanContainerQty(Long planId) {
        Map<Long, Integer> m = new HashMap<>();
        List<PlanContainer> list = planContainerMapper.selectByPlanId(planId);
        if (list == null) return m;
        for (PlanContainer pc : list) {
            if (pc == null || pc.getContainerId() == null) continue;
            int q = pc.getContainerQty() == null ? 0 : pc.getContainerQty();
            m.merge(pc.getContainerId(), q, Integer::sum);
        }
        return m;
    }

    private Map<Long, Integer> aggregateReqItemQty(PlanCreateRequest req) {
        Map<Long, Integer> m = new HashMap<>();
        if (req.getItems() == null) return m;
        for (PlanCreateRequest.ItemRef ir : req.getItems()) {
            if (ir == null || ir.getItemId() == null || ir.getQuantity() == null || ir.getQuantity() <= 0) continue;
            m.merge(ir.getItemId(), ir.getQuantity(), Integer::sum);
        }
        return m;
    }

    private Map<Long, Integer> aggregateReqContainerQty(PlanCreateRequest req) {
        Map<Long, Integer> m = new HashMap<>();
        if (req.getContainers() == null) return m;
        for (PlanCreateRequest.ContainerRef cr : req.getContainers()) {
            if (cr == null || cr.getContainerId() == null || cr.getQuantity() == null || cr.getQuantity() <= 0) continue;
            m.merge(cr.getContainerId(), cr.getQuantity(), Integer::sum);
        }
        return m;
    }

    private boolean planSelectionsEqual(Long planId, PlanCreateRequest req) {
        return aggregatePlanItemQty(planId).equals(aggregateReqItemQty(req))
                && aggregatePlanContainerQty(planId).equals(aggregateReqContainerQty(req));
    }

    private Map<String, Object> importOrderReplaceExisting(Long planId, PlanCreateRequest createReq, OrderImportLlmService.ParsedOrder parsed) {
        Map<String, Object> res = new LinkedHashMap<>();
        Plan existing = planMapper.selectById(planId);
        if (existing == null) {
            res.put("success", false);
            res.put("message", "方案不存在");
            return res;
        }
        existing.setPlanName(createReq.getPlanName());
        existing.setPlannedTotalItemQty(createReq.getPlannedTotalItemQty());
        existing.setPlannedTotalContainerQty(createReq.getPlannedTotalContainerQty());
        existing.setActualTotalItemQty(0);
        existing.setActualTotalContainerQty(0);
        existing.setAvgItemSupportRate(BigDecimal.ZERO);
        existing.setAvgFilledContainerFillRate(BigDecimal.ZERO);
        existing.setPlanStatus(0);
        existing.setNeedUpdate(createReq.getNeedUpdate() == null ? 1 : createReq.getNeedUpdate());
        planMapper.update(existing);
        replacePlanSelectionsAndDetails(planId, createReq);
        res.put("success", true);
        res.put("message", "订单已覆盖当前方案");
        res.put("plan", planMapper.selectById(planId));
        res.put("parsed", parsed);
        return res;
    }

    @PutMapping("/{id}")
    public Plan update(@PathVariable Long id, @RequestBody PlanCreateRequest req) {
        Plan plan = planMapper.selectById(id);
        if (plan == null) {
            throw new RuntimeException("方案不存在");
        }

        if (planSelectionsEqual(id, req)) {
            plan.setPlanName(req.getPlanName());
            planMapper.update(plan);
            return planMapper.selectById(id);
        }

        plan.setPlanName(req.getPlanName());
        plan.setPlannedTotalItemQty(req.getPlannedTotalItemQty());
        plan.setPlannedTotalContainerQty(req.getPlannedTotalContainerQty());
        plan.setNeedUpdate(1);
        planMapper.update(plan);
        replacePlanSelectionsAndDetails(id, req);
        return planMapper.selectById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        boolean imported = isImportedPlan(id);
        Set<Long> itemIds = new HashSet<>();
        Set<Long> containerIds = new HashSet<>();
        if (imported) {
            List<PlanItem> pis = planItemMapper.selectByPlanId(id);
            if (pis != null) {
                for (PlanItem pi : pis) if (pi != null && pi.getItemId() != null) itemIds.add(pi.getItemId());
            }
            List<PlanContainer> pcs = planContainerMapper.selectByPlanId(id);
            if (pcs != null) {
                for (PlanContainer pc : pcs) if (pc != null && pc.getContainerId() != null) containerIds.add(pc.getContainerId());
            }
        }

        planMapper.deleteById(id);

        if (imported) {
            for (Long itemId : itemIds) {
                Item it = itemMapper.selectById(itemId);
                if (it != null && it.getItemName() != null && it.getItemName().startsWith(IMPORTED_ITEM_PREFIX)) {
                    itemMapper.deleteById(itemId);
                }
            }
            for (Long containerId : containerIds) {
                Container c = containerMapper.selectById(containerId);
                if (c != null && c.getContainerName() != null && c.getContainerName().startsWith(IMPORTED_CONTAINER_PREFIX)) {
                    containerMapper.deleteById(containerId);
                }
            }
        }
    }

    @PostMapping("/{id}/generate-packing-v3")
    public Map<String, Object> generatePackingV3(
            @PathVariable Long id,
            @RequestParam(value = "algorithm", required = false, defaultValue = "auto") String algorithm,
            @RequestBody(required = false) Map<String, Object> body
    ) {
        Map<String, Object> response = new HashMap<>();
        try {
            Plan plan = planMapper.selectById(id);
            if (plan == null) {
                response.put("success", false);
                response.put("message", "方案不存在");
                return response;
            }


            planItemDetailMapper.deleteByPlanId(id);
            planContainerDetailMapper.deleteByPlanId(id);


            List<PlanItem> planItems = planItemMapper.selectByPlanId(id);
            List<PlanContainer> planContainers = planContainerMapper.selectByPlanId(id);

            if (planItems == null || planItems.isEmpty() || planContainers == null || planContainers.isEmpty()) {
                response.put("success", false);
                response.put("message", "方案中没有物品或容器");
                return response;
            }

            List<Item> items = new ArrayList<>();
            for (PlanItem pi : planItems) {
                Item item = itemMapper.selectById(pi.getItemId());
                if (item != null) {
                    item.setQuantity(pi.getItemQty());
                    items.add(item);
                }
            }


            Map<Long, Double> itemVolumeById = new HashMap<>();
            for (Item item : items) {
                if (item == null || item.getItemId() == null) continue;
                itemVolumeById.put(item.getItemId(), volumeMmCubed(item.getLengthMm(), item.getWidthMm(), item.getHeightMm()));
            }


            Map<Long, Deque<Long>> detailIdQueueByItem = new HashMap<>();
            for (PlanItem pi : planItems) {
                if (pi == null || pi.getItemId() == null) continue;
                int qty = pi.getItemQty() == null ? 0 : pi.getItemQty();
                if (qty <= 0) continue;
                for (int i = 0; i < qty; i++) {
                    PlanItemDetail detail = new PlanItemDetail();
                    detail.setPlanId(id);
                    detail.setItemId(pi.getItemId());
                    detail.setLoaded(0);
                    detail.setContainerInstanceId(null);
                    detail.setLayerIndex(null);
                    detail.setPosX(null);
                    detail.setPosY(null);
                    detail.setPosZ(null);
                    detail.setSwapLengthWidth(0);
                    detail.setSupportRate(BigDecimal.ZERO);
                    planItemDetailMapper.insert(detail);
                    if (detail.getId() != null) {
                        detailIdQueueByItem
                                .computeIfAbsent(pi.getItemId(), k -> new ArrayDeque<>())
                                .addLast(detail.getId());
                    }
                }
            }


            List<Container> containerInstancesForAlgo = new ArrayList<>();

            Map<Long, Container> instanceTplMap = new HashMap<>();
            for (PlanContainer pc : planContainers) {
                Container tpl = containerMapper.selectById(pc.getContainerId());
                if (tpl == null) continue;
                int qty = pc.getContainerQty() == null ? 0 : pc.getContainerQty();
                for (int i = 0; i < qty; i++) {
                    PlanContainerDetail detail = new PlanContainerDetail();
                    detail.setPlanId(id);
                    detail.setContainerId(pc.getContainerId());
                    detail.setFilled(0);
                    detail.setFilledItemQty(0);
                    detail.setFillRate(BigDecimal.ZERO);
                    detail.setAvgSupportRate(BigDecimal.ZERO);
                    planContainerDetailMapper.insert(detail);

                    Long instanceId = detail.getId();
                    if (instanceId == null) continue;
                    Container inst = new Container();
                    inst.setContainerId(instanceId);
                    inst.setContainerName(tpl.getContainerName());
                    inst.setLengthMm(tpl.getLengthMm());
                    inst.setWidthMm(tpl.getWidthMm());
                    inst.setHeightMm(tpl.getHeightMm());
                    inst.setQuantity(1);
                    containerInstancesForAlgo.add(inst);
                    instanceTplMap.put(instanceId, tpl);
                }
            }

            PackingLlmConstraints llmConstraints = PackingLlmConstraintsParser.fromRequestBody(body);

            String algo = resolvePackingAlgorithm(items, algorithm);


            List<PlanItemDetail> packingResult = switch (algo) {
                case "fill_priority", "fill", "algo2", "2" -> PackingAlgorithm2.optimize(items, containerInstancesForAlgo, 0.70, llmConstraints);
                case "improved", "improved3", "algo3", "3", "v3" -> PackingAlgorithm3.optimize(items, containerInstancesForAlgo, 0.70, llmConstraints, null);
                default -> PackingAlgorithm1.optimize(items, containerInstancesForAlgo, 0.70, llmConstraints);
            };
            if (packingResult == null || packingResult.isEmpty()) {
                response.put("success", false);
                response.put("message", "装箱失败");
                return response;
            }

            final int plannedItems = plan.getPlannedTotalItemQty() == null ? 0 : plan.getPlannedTotalItemQty();

            Set<Long> usedContainers = new HashSet<>();
            int packedUpdatedCount = 0;


            for (PlanItemDetail packed : packingResult) {
                if (packed == null || packed.getItemId() == null) continue;
                Deque<Long> q = detailIdQueueByItem.get(packed.getItemId());
                Long detailId = (q == null) ? null : q.pollFirst();
                if (detailId == null) continue;

                PlanItemDetail upd = new PlanItemDetail();
                upd.setId(detailId);
                upd.setPlanId(id);
                upd.setItemId(packed.getItemId());
                upd.setLoaded(1);
                upd.setContainerInstanceId(packed.getContainerInstanceId());
                upd.setLayerIndex(packed.getLayerIndex());
                upd.setPosX(packed.getPosX());
                upd.setPosY(packed.getPosY());
                upd.setPosZ(packed.getPosZ());
                upd.setSwapLengthWidth(packed.getSwapLengthWidth());
                upd.setSupportRate(packed.getSupportRate() == null ? BigDecimal.ZERO : packed.getSupportRate());
                planItemDetailMapper.update(upd);

                packedUpdatedCount++;
                if (upd.getContainerInstanceId() != null) usedContainers.add(upd.getContainerInstanceId());
            }


            List<PlanItemDetail> persistedLoaded = planItemDetailMapper.selectByPlanId(id);
            Map<Long, List<PlanItemDetail>> byContainer = new HashMap<>();
            for (PlanItemDetail d : persistedLoaded) {
                if (d == null || d.getLoaded() == null || d.getLoaded() != 1) continue;
                if (d.getContainerInstanceId() == null) continue;
                byContainer.computeIfAbsent(d.getContainerInstanceId(), k -> new ArrayList<>()).add(d);
            }

            List<PlanContainerDetail> containerDetails = planContainerDetailMapper.selectByPlanId(id);
            if (containerDetails != null) {


                final boolean notAllItemsPacked = packedUpdatedCount < plannedItems;
                final Long lastUsedContainerInstanceId = usedContainers.isEmpty()
                        ? null
                        : usedContainers.stream().max(Long::compareTo).orElse(null);

                for (PlanContainerDetail cd : containerDetails) {
                    if (cd == null || cd.getId() == null) continue;
                    List<PlanItemDetail> packedIn = byContainer.getOrDefault(cd.getId(), List.of());
                    cd.setFilledItemQty(packedIn.size());

                    Container tpl = instanceTplMap.get(cd.getId());
                    if (tpl == null) {

                        tpl = containerMapper.selectById(cd.getContainerId());
                    }

                    BigDecimal sum = BigDecimal.ZERO;
                    double packedVol = 0.0;
                    if (!packedIn.isEmpty()) {
                        for (PlanItemDetail d : packedIn) {
                            if (d.getSupportRate() != null) sum = sum.add(d.getSupportRate());
                            packedVol += resolveItemVolumeMm3(d.getItemId(), itemVolumeById);
                        }
                        cd.setAvgSupportRate(sum.divide(BigDecimal.valueOf(packedIn.size()), 2, java.math.RoundingMode.HALF_UP));
                    } else {
                        cd.setAvgSupportRate(BigDecimal.ZERO);
                    }

                    double containerVol = tpl == null ? 0.0 : volumeMmCubed(tpl.getLengthMm(), tpl.getWidthMm(), tpl.getHeightMm());
                    double fillRate = containerVol > 0 ? (packedVol / containerVol) * 100.0 : 0.0;
                    cd.setFillRate(BigDecimal.valueOf(fillRate).setScale(2, java.math.RoundingMode.HALF_UP));


                    boolean isUsed = usedContainers.contains(cd.getId());
                    int filled;
                    if (!isUsed) {
                        filled = 0;
                    } else if (notAllItemsPacked) {
                        filled = 1;
                    } else {
                        boolean isLastUsed = lastUsedContainerInstanceId != null && Objects.equals(cd.getId(), lastUsedContainerInstanceId);
                        if (isLastUsed) {
                            filled = fillRate >= 99.995 ? 1 : 0;
                        } else {
                            filled = 1;
                        }
                    }
                    cd.setFilled(filled);
                    planContainerDetailMapper.update(cd);
                }
            }

            plan.setNeedUpdate(0);
            plan.setActualTotalItemQty(packedUpdatedCount);
            plan.setActualTotalContainerQty(usedContainers.size());


            Set<Long> filledContainerIds = new HashSet<>();
            if (containerDetails != null) {
                for (PlanContainerDetail cd : containerDetails) {
                    if (cd != null && cd.getId() != null && cd.getFilled() != null && cd.getFilled() == 1) {
                        filledContainerIds.add(cd.getId());
                    }
                }
            }
            BigDecimal sumSupportInFilled = BigDecimal.ZERO;
            int supportCountInFilled = 0;
            for (PlanItemDetail d : persistedLoaded) {
                if (d == null || d.getLoaded() == null || d.getLoaded() != 1) continue;
                if (d.getContainerInstanceId() == null) continue;
                if (!filledContainerIds.contains(d.getContainerInstanceId())) continue;
                if (d.getSupportRate() != null) {
                    sumSupportInFilled = sumSupportInFilled.add(d.getSupportRate());
                    supportCountInFilled++;
                }
            }
            plan.setAvgItemSupportRate(
                    supportCountInFilled <= 0 ? BigDecimal.ZERO :
                            sumSupportInFilled.divide(BigDecimal.valueOf(supportCountInFilled), 2, java.math.RoundingMode.HALF_UP)
            );

            BigDecimal sumFill = BigDecimal.ZERO;
            int filledContainersForAvg = 0;
            if (containerDetails != null) {
                for (PlanContainerDetail cd : containerDetails) {
                    if (cd == null) continue;
                    if (cd.getFilled() == null || cd.getFilled() != 1) continue;
                    if (cd.getFillRate() != null) {
                        filledContainersForAvg++;
                        sumFill = sumFill.add(cd.getFillRate());
                    }
                }
            }
            plan.setAvgFilledContainerFillRate(
                    filledContainersForAvg == 0 ? BigDecimal.ZERO :
                            sumFill.divide(BigDecimal.valueOf(filledContainersForAvg), 2, java.math.RoundingMode.HALF_UP)
            );


            int plannedContainers = plan.getPlannedTotalContainerQty() == null ? 0 : plan.getPlannedTotalContainerQty();
            if (packedUpdatedCount < plannedItems) {
                plan.setPlanStatus(1);
            } else {
                boolean hasUnusedContainer = usedContainers.size() < plannedContainers;
                boolean hasUnfilledUsed = false;
                if (containerDetails != null) {
                    for (PlanContainerDetail cd : containerDetails) {
                        if (cd == null || cd.getId() == null) continue;
                        if (!usedContainers.contains(cd.getId())) continue;
                        if (cd.getFilled() == null || cd.getFilled() == 0) {
                            hasUnfilledUsed = true;
                            break;
                        }
                    }
                }
                plan.setPlanStatus((hasUnusedContainer || hasUnfilledUsed) ? 2 : 0);
            }
            planMapper.update(plan);

            response.put("success", true);
            response.put("message", "装箱成功");
            response.put("packedCount", packedUpdatedCount);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "装箱出错: " + e.getMessage());
        }
        return response;
    }


    @PostMapping(value = "/{id}/generate-packing-v3-stream", produces = "text/event-stream")
    public void generatePackingV3Stream(
            @PathVariable Long id,
            @RequestParam(value = "algorithm", required = false, defaultValue = "auto") String algorithm,
            @RequestBody(required = false) Map<String, Object> body,
            HttpServletResponse resp
    ) throws Exception {
        resp.setCharacterEncoding(StandardCharsets.UTF_8.name());
        resp.setContentType("text/event-stream;charset=UTF-8");
        resp.setHeader("Cache-Control", "no-cache");
        resp.setHeader("Connection", "keep-alive");

        var writer = resp.getWriter();

        PackingStepListener listener = (event) -> {
            try {
                String json = objectMapper.writeValueAsString(event);
                writer.write("data: " + json + "\n\n");
                writer.flush();
            } catch (Exception ignored) {
            }
        };

        listener.onEvent(new LinkedHashMap<>(Map.of(
                "type", "phase",
                "name", "prepare"
        )));


        Plan plan = planMapper.selectById(id);
        if (plan == null) {
            listener.onEvent(new LinkedHashMap<>(Map.of("type", "error", "message", "方案不存在")));
            writer.write("data: {\"type\":\"done\",\"success\":false}\n\n");
            writer.flush();
            return;
        }


        planItemDetailMapper.deleteByPlanId(id);
        planContainerDetailMapper.deleteByPlanId(id);

        List<PlanItem> planItems = planItemMapper.selectByPlanId(id);
        List<PlanContainer> planContainers = planContainerMapper.selectByPlanId(id);
        if (planItems == null || planItems.isEmpty() || planContainers == null || planContainers.isEmpty()) {
            listener.onEvent(new LinkedHashMap<>(Map.of("type", "error", "message", "方案中没有物品或容器")));
            writer.write("data: {\"type\":\"done\",\"success\":false}\n\n");
            writer.flush();
            return;
        }

        List<Item> items = new ArrayList<>();
        for (PlanItem pi : planItems) {
            Item item = itemMapper.selectById(pi.getItemId());
            if (item != null) {
                item.setQuantity(pi.getItemQty());
                items.add(item);
            }
        }


        Map<Long, Double> itemVolumeById = new HashMap<>();
        for (Item item : items) {
            if (item == null || item.getItemId() == null) continue;
            itemVolumeById.put(item.getItemId(), volumeMmCubed(item.getLengthMm(), item.getWidthMm(), item.getHeightMm()));
        }

        Map<Long, Deque<Long>> detailIdQueueByItem = new HashMap<>();
        for (PlanItem pi : planItems) {
            if (pi == null || pi.getItemId() == null) continue;
            int qty = pi.getItemQty() == null ? 0 : pi.getItemQty();
            if (qty <= 0) continue;
            for (int i = 0; i < qty; i++) {
                PlanItemDetail detail = new PlanItemDetail();
                detail.setPlanId(id);
                detail.setItemId(pi.getItemId());
                detail.setLoaded(0);
                detail.setContainerInstanceId(null);
                detail.setLayerIndex(null);
                detail.setPosX(null);
                detail.setPosY(null);
                detail.setPosZ(null);
                detail.setSwapLengthWidth(0);
                detail.setSupportRate(BigDecimal.ZERO);
                planItemDetailMapper.insert(detail);
                if (detail.getId() != null) {
                    detailIdQueueByItem.computeIfAbsent(pi.getItemId(), k -> new ArrayDeque<>()).addLast(detail.getId());
                }
            }
        }

        List<Container> containerInstancesForAlgo = new ArrayList<>();
        Map<Long, Container> instanceTplMap = new HashMap<>();
        for (PlanContainer pc : planContainers) {
            Container tpl = containerMapper.selectById(pc.getContainerId());
            if (tpl == null) continue;
            int qty = pc.getContainerQty() == null ? 0 : pc.getContainerQty();
            for (int i = 0; i < qty; i++) {
                PlanContainerDetail detail = new PlanContainerDetail();
                detail.setPlanId(id);
                detail.setContainerId(pc.getContainerId());
                detail.setFilled(0);
                detail.setFilledItemQty(0);
                detail.setFillRate(BigDecimal.ZERO);
                detail.setAvgSupportRate(BigDecimal.ZERO);
                planContainerDetailMapper.insert(detail);
                Long instanceId = detail.getId();
                if (instanceId == null) continue;
                Container inst = new Container();
                inst.setContainerId(instanceId);
                inst.setContainerName(tpl.getContainerName());
                inst.setLengthMm(tpl.getLengthMm());
                inst.setWidthMm(tpl.getWidthMm());
                inst.setHeightMm(tpl.getHeightMm());
                inst.setQuantity(1);
                containerInstancesForAlgo.add(inst);
                instanceTplMap.put(instanceId, tpl);
            }
        }

        PackingLlmConstraints llmConstraints = PackingLlmConstraintsParser.fromRequestBody(body);

        String algo = resolvePackingAlgorithm(items, algorithm);
        listener.onEvent(new LinkedHashMap<>(Map.of("type", "phase", "name", "packing_start", "algorithm", algo)));

        List<PlanItemDetail> packingResult = switch (algo) {
            case "improved", "improved3", "algo3", "3", "v3" ->
                    PackingAlgorithm3.optimize(items, containerInstancesForAlgo, 0.70, llmConstraints, listener);
            case "fill_priority", "fill", "algo2", "2" ->
                    PackingAlgorithm2.optimize(items, containerInstancesForAlgo, 0.70, llmConstraints, listener);
            default ->
                    PackingAlgorithm1.optimize(items, containerInstancesForAlgo, 0.70, llmConstraints);
        };

        if (packingResult == null || packingResult.isEmpty()) {
            listener.onEvent(new LinkedHashMap<>(Map.of("type", "error", "message", "装箱失败")));
            writer.write("data: {\"type\":\"done\",\"success\":false}\n\n");
            writer.flush();
            return;
        }


        final int plannedItems = plan.getPlannedTotalItemQty() == null ? 0 : plan.getPlannedTotalItemQty();
        Set<Long> usedContainers = new HashSet<>();
        int packedUpdatedCount = 0;

        for (PlanItemDetail packed : packingResult) {
            if (packed == null || packed.getItemId() == null) continue;
            Deque<Long> q = detailIdQueueByItem.get(packed.getItemId());
            Long detailId = (q == null) ? null : q.pollFirst();
            if (detailId == null) continue;

            PlanItemDetail upd = new PlanItemDetail();
            upd.setId(detailId);
            upd.setPlanId(id);
            upd.setItemId(packed.getItemId());
            upd.setLoaded(1);
            upd.setContainerInstanceId(packed.getContainerInstanceId());
            upd.setLayerIndex(packed.getLayerIndex());
            upd.setPosX(packed.getPosX());
            upd.setPosY(packed.getPosY());
            upd.setPosZ(packed.getPosZ());
            upd.setSwapLengthWidth(packed.getSwapLengthWidth());
            upd.setSupportRate(packed.getSupportRate() == null ? BigDecimal.ZERO : packed.getSupportRate());
            planItemDetailMapper.update(upd);

            packedUpdatedCount++;
            if (upd.getContainerInstanceId() != null) usedContainers.add(upd.getContainerInstanceId());
        }


        List<PlanItemDetail> persistedLoaded = planItemDetailMapper.selectByPlanId(id);
        Map<Long, List<PlanItemDetail>> byContainer = new HashMap<>();
        for (PlanItemDetail d : persistedLoaded) {
            if (d == null || d.getLoaded() == null || d.getLoaded() != 1) continue;
            if (d.getContainerInstanceId() == null) continue;
            byContainer.computeIfAbsent(d.getContainerInstanceId(), k -> new ArrayList<>()).add(d);
        }

        List<PlanContainerDetail> containerDetails = planContainerDetailMapper.selectByPlanId(id);
        if (containerDetails != null) {
            final boolean notAllItemsPacked = packedUpdatedCount < plannedItems;
            final Long lastUsedContainerInstanceId = usedContainers.isEmpty()
                    ? null
                    : usedContainers.stream().max(Long::compareTo).orElse(null);

            for (PlanContainerDetail cd : containerDetails) {
                if (cd == null || cd.getId() == null) continue;
                List<PlanItemDetail> packedIn = byContainer.getOrDefault(cd.getId(), List.of());
                cd.setFilledItemQty(packedIn.size());

                Container tpl = instanceTplMap.get(cd.getId());
                if (tpl == null) tpl = containerMapper.selectById(cd.getContainerId());

                BigDecimal sum = BigDecimal.ZERO;
                double packedVol = 0.0;
                if (!packedIn.isEmpty()) {
                    for (PlanItemDetail d : packedIn) {
                        if (d.getSupportRate() != null) sum = sum.add(d.getSupportRate());
                        packedVol += resolveItemVolumeMm3(d.getItemId(), itemVolumeById);
                    }
                    cd.setAvgSupportRate(sum.divide(BigDecimal.valueOf(packedIn.size()), 2, java.math.RoundingMode.HALF_UP));
                } else {
                    cd.setAvgSupportRate(BigDecimal.ZERO);
                }

                double containerVol = tpl == null ? 0.0 : volumeMmCubed(tpl.getLengthMm(), tpl.getWidthMm(), tpl.getHeightMm());
                double fillRate = containerVol > 0 ? (packedVol / containerVol) * 100.0 : 0.0;
                cd.setFillRate(BigDecimal.valueOf(fillRate).setScale(2, java.math.RoundingMode.HALF_UP));

                boolean isUsed = usedContainers.contains(cd.getId());
                int filled;
                if (!isUsed) {
                    filled = 0;
                } else if (notAllItemsPacked) {
                    filled = 1;
                } else {
                    boolean isLastUsed = lastUsedContainerInstanceId != null && Objects.equals(cd.getId(), lastUsedContainerInstanceId);
                    if (isLastUsed) {
                        filled = fillRate >= 99.995 ? 1 : 0;
                    } else {
                        filled = 1;
                    }
                }
                cd.setFilled(filled);
                planContainerDetailMapper.update(cd);
            }
        }

        plan.setNeedUpdate(0);
        plan.setActualTotalItemQty(packedUpdatedCount);
        plan.setActualTotalContainerQty(usedContainers.size());

        Set<Long> filledContainerIdsStream = new HashSet<>();
        if (containerDetails != null) {
            for (PlanContainerDetail cd : containerDetails) {
                if (cd != null && cd.getId() != null && cd.getFilled() != null && cd.getFilled() == 1) {
                    filledContainerIdsStream.add(cd.getId());
                }
            }
        }
        BigDecimal sumSupportInFilledStream = BigDecimal.ZERO;
        int supportCountInFilledStream = 0;
        for (PlanItemDetail d : persistedLoaded) {
            if (d == null || d.getLoaded() == null || d.getLoaded() != 1) continue;
            if (d.getContainerInstanceId() == null) continue;
            if (!filledContainerIdsStream.contains(d.getContainerInstanceId())) continue;
            if (d.getSupportRate() != null) {
                sumSupportInFilledStream = sumSupportInFilledStream.add(d.getSupportRate());
                supportCountInFilledStream++;
            }
        }
        plan.setAvgItemSupportRate(
                supportCountInFilledStream <= 0 ? BigDecimal.ZERO :
                        sumSupportInFilledStream.divide(BigDecimal.valueOf(supportCountInFilledStream), 2, java.math.RoundingMode.HALF_UP)
        );

        BigDecimal sumFillStream = BigDecimal.ZERO;
        int filledContainersForAvgStream = 0;
        if (containerDetails != null) {
            for (PlanContainerDetail cd : containerDetails) {
                if (cd == null) continue;
                if (cd.getFilled() == null || cd.getFilled() != 1) continue;
                if (cd.getFillRate() != null) {
                    filledContainersForAvgStream++;
                    sumFillStream = sumFillStream.add(cd.getFillRate());
                }
            }
        }
        plan.setAvgFilledContainerFillRate(
                filledContainersForAvgStream == 0 ? BigDecimal.ZERO :
                        sumFillStream.divide(BigDecimal.valueOf(filledContainersForAvgStream), 2, java.math.RoundingMode.HALF_UP)
        );

        int plannedContainers = plan.getPlannedTotalContainerQty() == null ? 0 : plan.getPlannedTotalContainerQty();
        if (packedUpdatedCount < plannedItems) {
            plan.setPlanStatus(1);
        } else {
            boolean hasUnusedContainer = usedContainers.size() < plannedContainers;
            boolean hasUnfilledUsed = false;
            if (containerDetails != null) {
                for (PlanContainerDetail cd : containerDetails) {
                    if (cd == null || cd.getId() == null) continue;
                    if (!usedContainers.contains(cd.getId())) continue;
                    if (cd.getFilled() == null || cd.getFilled() == 0) {
                        hasUnfilledUsed = true;
                        break;
                    }
                }
            }
            plan.setPlanStatus((hasUnusedContainer || hasUnfilledUsed) ? 2 : 0);
        }
        planMapper.update(plan);

        listener.onEvent(new LinkedHashMap<>(Map.of(
                "type", "done",
                "success", true,
                "packedCount", packedUpdatedCount
        )));
        writer.flush();
    }

    private Map<Long, String> buildContainerInstanceNameMap(Long planId) {
        List<PlanContainerDetail> details = planContainerDetailMapper.selectByPlanId(planId);
        if (details == null) return Map.of();

        Map<Long, Container> containerMap = new HashMap<>();
        for (Container c : containerMapper.selectAll()) {
            if (c != null && c.getContainerId() != null) containerMap.put(c.getContainerId(), c);
        }

        Map<Long, Integer> seq = new HashMap<>();
        Map<Long, String> result = new HashMap<>();
        for (PlanContainerDetail d : details) {
            if (d == null || d.getId() == null) continue;
            Container tpl = containerMap.get(d.getContainerId());
            int idx = seq.merge(d.getContainerId(), 1, Integer::sum);
            String baseName = tpl == null || tpl.getContainerName() == null ? "容器" : tpl.getContainerName();
            baseName = stripImportedPrefix(baseName, IMPORTED_CONTAINER_PREFIX);
            result.put(d.getId(), baseName + "-" + idx);
        }
        return result;
    }

    private boolean isImportedPlan(Long planId) {
        List<PlanRequirement> reqs = planRequirementMapper.selectByPlanId(planId);
        if (reqs == null) return false;
        for (PlanRequirement r : reqs) {
            if (r != null && IMPORTED_MARKER_REQUIREMENT.equals(r.getContent())) return true;
        }
        return false;
    }

    private static String stripImportedPrefix(String name, String prefix) {
        if (name == null) return null;
        return name.startsWith(prefix) ? name.substring(prefix.length()) : name;
    }


    private static String resolvePackingAlgorithm(List<Item> items, String algorithm) {
        if (algorithm == null) return resolvePackingAlgorithmAuto(items);
        String a = algorithm.trim().toLowerCase(Locale.ROOT);
        if (a.isEmpty() || "auto".equals(a)) return resolvePackingAlgorithmAuto(items);
        return a;
    }


    private static String resolvePackingAlgorithmAuto(List<Item> items) {
        if (items == null || items.isEmpty()) return "improved";
        Set<Double> heights = new HashSet<>();
        for (Item it : items) {
            if (it == null || it.getItemId() == null) continue;
            int q = it.getQuantity() == null ? 0 : it.getQuantity();
            if (q <= 0) continue;
            if (it.getHeightMm() == null) return "improved";
            heights.add(it.getHeightMm().doubleValue());
            if (heights.size() > 1) return "improved";
        }
        return heights.isEmpty() ? "improved" : "fill_priority";
    }


    private static double volumeMmCubed(Integer lengthMm, Integer widthMm, Integer heightMm) {
        long l = lengthMm == null ? 0L : lengthMm.longValue();
        long w = widthMm == null ? 0L : widthMm.longValue();
        long h = heightMm == null ? 0L : heightMm.longValue();
        return (double) l * (double) w * (double) h;
    }


    private double resolveItemVolumeMm3(Long itemId, Map<Long, Double> itemVolumeById) {
        if (itemId == null) return 0.0;
        Double v = itemVolumeById.get(itemId);
        if (v != null && v > 0) return v;
        Item it = itemMapper.selectById(itemId);
        if (it == null) return 0.0;
        double vol = volumeMmCubed(it.getLengthMm(), it.getWidthMm(), it.getHeightMm());
        if (vol > 0) {
            itemVolumeById.put(itemId, vol);
        }
        return vol;
    }


    @GetMapping("/{planId}/export-zip")
    public ResponseEntity<byte[]> exportPlanZip(
            @PathVariable Long planId,
            @RequestParam(value = "includeThreeViewsPng", required = false, defaultValue = "true") boolean includeThreeViewsPng,
            @RequestParam(value = "includePlanInfoXlsx", required = false, defaultValue = "true") boolean includePlanInfoXlsx,
            @RequestParam(value = "includePackingDetailXlsx", required = false, defaultValue = "true") boolean includePackingDetailXlsx,
            @RequestParam(value = "includeUnloadedXlsx", required = false, defaultValue = "true") boolean includeUnloadedXlsx
    ) throws Exception {
        byte[] zip = planExportService.exportPlanZip(
                planId, includeThreeViewsPng, includePlanInfoXlsx, includePackingDetailXlsx, includeUnloadedXlsx);
        if (zip == null) {
            return ResponseEntity.notFound().build();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/zip"));
        headers.setContentDisposition(
                ContentDisposition.attachment().filename("plan_" + planId + "_export.zip").build()
        );

        return ResponseEntity.ok()
                .headers(headers)
                .body(zip);
    }
}
