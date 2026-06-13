package com.tsj.Service;

import com.tsj.entity.*;
import com.tsj.mapper.*;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.GraphicsEnvironment;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;


@Service
public class PlanExportService {

    private static final DateTimeFormatter DT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private static final String IMPORTED_ITEM_PREFIX = "__IMPORTED_ITEM__";
    private static final String IMPORTED_CONTAINER_PREFIX = "__IMPORTED_CONTAINER__";

    private static final String SYS_IMPORTED_PLAN_LOCKED_REQUIREMENT = "[[SYS_IMPORTED_PLAN_LOCKED]]";

    private final PlanMapper planMapper;
    private final PlanItemDetailMapper planItemDetailMapper;
    private final PlanContainerDetailMapper planContainerDetailMapper;
    private final PlanItemMapper planItemMapper;
    private final PlanContainerMapper planContainerMapper;
    private final PlanRequirementMapper planRequirementMapper;
    private final ItemMapper itemMapper;
    private final ContainerMapper containerMapper;

    public PlanExportService(
            PlanMapper planMapper,
            PlanItemDetailMapper planItemDetailMapper,
            PlanContainerDetailMapper planContainerDetailMapper,
            PlanItemMapper planItemMapper,
            PlanContainerMapper planContainerMapper,
            PlanRequirementMapper planRequirementMapper,
            ItemMapper itemMapper,
            ContainerMapper containerMapper
    ) {
        this.planMapper = planMapper;
        this.planItemDetailMapper = planItemDetailMapper;
        this.planContainerDetailMapper = planContainerDetailMapper;
        this.planItemMapper = planItemMapper;
        this.planContainerMapper = planContainerMapper;
        this.planRequirementMapper = planRequirementMapper;
        this.itemMapper = itemMapper;
        this.containerMapper = containerMapper;
    }


    public byte[] exportPlanZip(
            Long planId,
            boolean includeThreeViewsPng,
            boolean includePlanInfoXlsx,
            boolean includePackingDetailXlsx,
            boolean includeUnloadedXlsx
    ) throws IOException {
        if (!includeThreeViewsPng && !includePlanInfoXlsx && !includePackingDetailXlsx && !includeUnloadedXlsx) {
            includeThreeViewsPng = true;
        }
        Plan plan = planMapper.selectById(planId);
        if (plan == null) {
            return null;
        }

        Map<Long, Item> itemMap = new HashMap<>();
        for (Item it : itemMapper.selectAll()) {
            if (it != null && it.getItemId() != null) {
                itemMap.put(it.getItemId(), it);
            }
        }
        Map<Long, Container> containerTplMap = new HashMap<>();
        for (Container c : containerMapper.selectAll()) {
            if (c != null && c.getContainerId() != null) {
                containerTplMap.put(c.getContainerId(), c);
            }
        }

        List<PlanItem> planItems = planItemMapper.selectByPlanId(planId);
        if (planItems == null) {
            planItems = List.of();
        }
        List<PlanContainer> planContainers = planContainerMapper.selectByPlanId(planId);
        if (planContainers == null) {
            planContainers = List.of();
        }
        List<PlanRequirement> requirements = planRequirementMapper.selectByPlanId(planId);
        if (requirements == null) {
            requirements = List.of();
        }

        List<PlanItemDetail> allDetails = planItemDetailMapper.selectByPlanId(planId);
        if (allDetails == null) {
            allDetails = List.of();
        }

        List<PlanContainerDetail> instances = planContainerDetailMapper.selectByPlanId(planId);
        if (instances == null) {
            instances = List.of();
        }

        Map<Long, String> instanceNameMap = buildContainerInstanceNameMap(instances, containerTplMap);
        Map<Long, Color> sceneItemColors = buildSceneItemColorMap(allDetails);
        List<PlanItemDetail> unloaded = allDetails.stream()
                .filter(d -> d != null && (d.getLoaded() == null || d.getLoaded() != 1
                        || d.getContainerInstanceId() == null))
                .collect(Collectors.toList());

        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        try (ZipOutputStream zos = new ZipOutputStream(bos, StandardCharsets.UTF_8)) {
            if (includePlanInfoXlsx) {
                try (Workbook wb = buildPlanInfoWorkbook(
                        plan, planItems, planContainers, requirements,
                        itemMap, containerTplMap, allDetails, instances)) {
                    putWorkbook(zos, "方案信息表.xlsx", wb);
                }
            }
            if (includePackingDetailXlsx) {
                for (PlanContainerDetail pcd : instances) {
                    if (pcd == null || pcd.getId() == null) {
                        continue;
                    }
                    String displayName = instanceNameMap.getOrDefault(pcd.getId(), "容器-" + pcd.getId());
                    String safe = sanitizeFileName(displayName);
                    List<PlanItemDetail> inBox = allDetails.stream()
                            .filter(d -> d != null && Objects.equals(pcd.getId(), d.getContainerInstanceId()))
                            .collect(Collectors.toList());
                    Container tpl = containerTplMap.get(pcd.getContainerId());
                    try (Workbook wb = buildContainerPackingWorkbook(pcd, tpl, displayName, inBox, itemMap)) {
                        putWorkbook(zos, "装箱明细_" + safe + ".xlsx", wb);
                    }
                }
            }
            if (includeUnloadedXlsx) {
                try (Workbook wb = buildUnloadedWorkbook(unloaded, itemMap, instanceNameMap)) {
                    putWorkbook(zos, "未装载明细.xlsx", wb);
                }
            }
            if (includeThreeViewsPng) {
                for (PlanContainerDetail pcd : instances) {
                    if (pcd == null || pcd.getId() == null) {
                        continue;
                    }
                    String displayName = instanceNameMap.getOrDefault(pcd.getId(), "容器-" + pcd.getId());
                    String safe = sanitizeFileName(displayName);
                    List<PlanItemDetail> inBox = allDetails.stream()
                            .filter(d -> d != null && Objects.equals(pcd.getId(), d.getContainerInstanceId()))
                            .collect(Collectors.toList());
                    Container tpl = containerTplMap.get(pcd.getContainerId());
                    byte[] png = renderContainerSixViewsPng(pcd, tpl, displayName, inBox, itemMap, sceneItemColors);
                    putBinary(zos, "六视图_" + safe + ".png", png);
                }
            }
        }
        return bos.toByteArray();
    }

    private static void putWorkbook(ZipOutputStream zos, String name, Workbook wb) throws IOException {
        ByteArrayOutputStream tmp = new ByteArrayOutputStream();
        wb.write(tmp);
        putBinary(zos, name, tmp.toByteArray());
    }

    private static String stripImportedItemPrefix(String name) {
        if (name == null) {
            return "";
        }
        return name.startsWith(IMPORTED_ITEM_PREFIX) ? name.substring(IMPORTED_ITEM_PREFIX.length()) : name;
    }

    private static String stripImportedContainerPrefix(String name) {
        if (name == null) {
            return "";
        }
        return name.startsWith(IMPORTED_CONTAINER_PREFIX) ? name.substring(IMPORTED_CONTAINER_PREFIX.length()) : name;
    }

    private Workbook buildPlanInfoWorkbook(
            Plan plan,
            List<PlanItem> planItems,
            List<PlanContainer> planContainers,
            List<PlanRequirement> requirements,
            Map<Long, Item> itemMap,
            Map<Long, Container> containerTplMap,
            List<PlanItemDetail> allDetails,
            List<PlanContainerDetail> instances
    ) {
        if (allDetails == null) {
            allDetails = List.of();
        }
        if (instances == null) {
            instances = List.of();
        }

        Map<Long, Integer> plannedItemQty = new HashMap<>();
        for (PlanItem pi : planItems) {
            if (pi == null || pi.getItemId() == null) {
                continue;
            }
            int q = pi.getItemQty() == null ? 0 : pi.getItemQty();
            plannedItemQty.merge(pi.getItemId(), q, Integer::sum);
        }
        Map<Long, Integer> loadedItemPieces = new HashMap<>();
        Map<Long, Integer> unloadedItemPieces = new HashMap<>();
        for (PlanItemDetail d : allDetails) {
            if (d == null || d.getItemId() == null) {
                continue;
            }
            boolean packed = d.getLoaded() != null && d.getLoaded() == 1 && d.getContainerInstanceId() != null;
            if (packed) {
                loadedItemPieces.merge(d.getItemId(), 1, Integer::sum);
            } else {
                unloadedItemPieces.merge(d.getItemId(), 1, Integer::sum);
            }
        }
        NavigableSet<Long> allItemIds = new TreeSet<>();
        allItemIds.addAll(plannedItemQty.keySet());
        allItemIds.addAll(loadedItemPieces.keySet());
        allItemIds.addAll(unloadedItemPieces.keySet());
        for (PlanItemDetail d : allDetails) {
            if (d != null && d.getItemId() != null) {
                allItemIds.add(d.getItemId());
            }
        }

        Map<Long, Integer> plannedContainerInstances = new HashMap<>();
        for (PlanContainer pc : planContainers) {
            if (pc == null || pc.getContainerId() == null) {
                continue;
            }
            int q = pc.getContainerQty() == null ? 0 : pc.getContainerQty();
            plannedContainerInstances.merge(pc.getContainerId(), q, Integer::sum);
        }
        Set<Long> instanceIdsWithPackedItem = new HashSet<>();
        for (PlanItemDetail d : allDetails) {
            if (d != null && d.getLoaded() != null && d.getLoaded() == 1 && d.getContainerInstanceId() != null) {
                instanceIdsWithPackedItem.add(d.getContainerInstanceId());
            }
        }
        Map<Long, Integer> expandedInstancesByTpl = new HashMap<>();
        Map<Long, Integer> usedInstancesByTpl = new HashMap<>();
        for (PlanContainerDetail pcd : instances) {
            if (pcd == null || pcd.getContainerId() == null) {
                continue;
            }
            Long tid = pcd.getContainerId();
            expandedInstancesByTpl.merge(tid, 1, Integer::sum);
            if (pcd.getId() != null && instanceIdsWithPackedItem.contains(pcd.getId())) {
                usedInstancesByTpl.merge(tid, 1, Integer::sum);
            }
        }
        NavigableSet<Long> allTplIds = new TreeSet<>();
        allTplIds.addAll(plannedContainerInstances.keySet());
        allTplIds.addAll(expandedInstancesByTpl.keySet());

        List<PlanRequirement> userRequirements = new ArrayList<>();
        for (PlanRequirement req : requirements) {
            if (req == null) {
                continue;
            }
            if (SYS_IMPORTED_PLAN_LOCKED_REQUIREMENT.equals(req.getContent())) {
                continue;
            }
            userRequirements.add(req);
        }

        XSSFWorkbook wb = new XSSFWorkbook();
        CellStyle wrapTop = wb.createCellStyle();
        wrapTop.setWrapText(true);
        wrapTop.setVerticalAlignment(VerticalAlignment.TOP);

        String[] hc1 = {"物品ID", "物品名称", "长mm", "宽mm", "高mm", "计划件数", "已装入件数", "未装入件数"};
        String[] hc2 = {"容器模板ID", "容器名称", "长mm", "宽mm", "高mm",
                "计划实例数", "方案内实例数(已展开)", "已装载使用实例数"};


        Sheet s0 = wb.createSheet("方案概要");
        Row h0 = s0.createRow(0);
        String[] head0 = {"方案ID", "方案名称", "计划物品总数", "实际装入物品数", "计划容器总数", "实际使用容器数",
                "平均物品支撑率%", "平均容器填充率%", "方案状态", "需更新标记", "创建时间", "更新时间"};
        for (int i = 0; i < head0.length; i++) {
            h0.createCell(i).setCellValue(head0[i]);
        }
        Row d0 = s0.createRow(1);
        d0.createCell(0).setCellValue(plan.getPlanId() == null ? 0 : plan.getPlanId());
        d0.createCell(1).setCellValue(nzStr(plan.getPlanName()));
        setIntCell(d0.createCell(2), plan.getPlannedTotalItemQty());
        setIntCell(d0.createCell(3), plan.getActualTotalItemQty());
        setIntCell(d0.createCell(4), plan.getPlannedTotalContainerQty());
        setIntCell(d0.createCell(5), plan.getActualTotalContainerQty());
        d0.createCell(6).setCellValue(formatBd(plan.getAvgItemSupportRate()));
        d0.createCell(7).setCellValue(formatBd(plan.getAvgFilledContainerFillRate()));
        d0.createCell(8).setCellValue(planStatusText(plan.getPlanStatus()));
        setIntCell(d0.createCell(9), plan.getNeedUpdate());
        d0.createCell(10).setCellValue(plan.getCreatedAt() == null ? "" : DT.format(plan.getCreatedAt()));
        d0.createCell(11).setCellValue(plan.getUpdatedAt() == null ? "" : DT.format(plan.getUpdatedAt()));

        int r = 2;
        s0.createRow(r++);
        Row secItems = s0.createRow(r++);
        secItems.createCell(0).setCellValue("【物品】方案内物品尺寸与数量（向下滚动可见）");
        Row hItemsOnSummary = s0.createRow(r++);
        for (int i = 0; i < hc1.length; i++) {
            hItemsOnSummary.createCell(i).setCellValue(hc1[i]);
        }
        if (allItemIds.isEmpty()) {
            Row emptyIt = s0.createRow(r++);
            emptyIt.createCell(0).setCellValue("（当前无物品汇总行：方案中可能没有计划物品或明细尚未生成）");
        }
        for (Long itemId : allItemIds) {
            Item it = itemMap.get(itemId);
            Row rr = s0.createRow(r++);
            rr.createCell(0).setCellValue(itemId);
            rr.createCell(1).setCellValue(it == null ? "" : stripImportedItemPrefix(nzStr(it.getItemName())));
            setIntCell(rr.createCell(2), it == null ? null : it.getLengthMm());
            setIntCell(rr.createCell(3), it == null ? null : it.getWidthMm());
            setIntCell(rr.createCell(4), it == null ? null : it.getHeightMm());
            setIntCell(rr.createCell(5), plannedItemQty.getOrDefault(itemId, 0));
            setIntCell(rr.createCell(6), loadedItemPieces.getOrDefault(itemId, 0));
            setIntCell(rr.createCell(7), unloadedItemPieces.getOrDefault(itemId, 0));
        }

        s0.createRow(r++);
        Row secCt = s0.createRow(r++);
        secCt.createCell(0).setCellValue("【容器】方案内容器尺寸与实例数量");
        Row hCtOnSummary = s0.createRow(r++);
        for (int i = 0; i < hc2.length; i++) {
            hCtOnSummary.createCell(i).setCellValue(hc2[i]);
        }
        if (allTplIds.isEmpty()) {
            Row emptyCt = s0.createRow(r++);
            emptyCt.createCell(0).setCellValue("（当前无容器汇总行：方案中可能没有计划容器或实例尚未展开）");
        }
        for (Long tplId : allTplIds) {
            Container tpl = containerTplMap.get(tplId);
            Row rr = s0.createRow(r++);
            rr.createCell(0).setCellValue(tplId);
            rr.createCell(1).setCellValue(tpl == null ? "" : stripImportedContainerPrefix(nzStr(tpl.getContainerName())));
            setIntCell(rr.createCell(2), tpl == null ? null : tpl.getLengthMm());
            setIntCell(rr.createCell(3), tpl == null ? null : tpl.getWidthMm());
            setIntCell(rr.createCell(4), tpl == null ? null : tpl.getHeightMm());
            setIntCell(rr.createCell(5), plannedContainerInstances.getOrDefault(tplId, 0));
            setIntCell(rr.createCell(6), expandedInstancesByTpl.getOrDefault(tplId, 0));
            setIntCell(rr.createCell(7), usedInstancesByTpl.getOrDefault(tplId, 0));
        }

        s0.createRow(r++);
        Row secReq = s0.createRow(r++);
        secReq.createCell(0).setCellValue("【特殊需求】逐条列出（每条一行）");
        Row hReqSummary = s0.createRow(r++);
        hReqSummary.createCell(0).setCellValue("序号");
        hReqSummary.createCell(1).setCellValue("需求内容");
        hReqSummary.createCell(2).setCellValue("已完成");
        if (userRequirements.isEmpty()) {
            Row rr = s0.createRow(r++);
            rr.createCell(0).setCellValue("—");
            rr.createCell(1).setCellValue("（无用户特殊需求）");
            rr.createCell(2).setCellValue("");
        } else {
            int seq = 1;
            for (PlanRequirement req : userRequirements) {
                Row rr = s0.createRow(r++);
                rr.createCell(0).setCellValue(seq++);
                Cell c1 = rr.createCell(1);
                c1.setCellValue(nzStr(req.getContent()));
                c1.setCellStyle(wrapTop);
                rr.createCell(2).setCellValue(req.getFinished() != null && req.getFinished() == 1 ? "是" : "否");
                int lines = Math.max(1, (nzStr(req.getContent()).length() + 39) / 40);
                rr.setHeightInPoints(Math.min(409, 8f + lines * 14f));
            }
        }

        for (int c = 0; c < 12; c++) {
            s0.autoSizeColumn(c);
        }
        s0.setColumnWidth(1, Math.max(s0.getColumnWidth(1), 48 * 256));

        Sheet s1 = wb.createSheet("方案物品");
        Row h1 = s1.createRow(0);
        for (int i = 0; i < hc1.length; i++) {
            h1.createCell(i).setCellValue(hc1[i]);
        }
        int r1 = 1;
        if (allItemIds.isEmpty()) {
            s1.createRow(r1++).createCell(0).setCellValue("（无物品数据）");
        }
        for (Long itemId : allItemIds) {
            Item it = itemMap.get(itemId);
            Row rr = s1.createRow(r1++);
            rr.createCell(0).setCellValue(itemId);
            rr.createCell(1).setCellValue(it == null ? "" : stripImportedItemPrefix(nzStr(it.getItemName())));
            setIntCell(rr.createCell(2), it == null ? null : it.getLengthMm());
            setIntCell(rr.createCell(3), it == null ? null : it.getWidthMm());
            setIntCell(rr.createCell(4), it == null ? null : it.getHeightMm());
            setIntCell(rr.createCell(5), plannedItemQty.getOrDefault(itemId, 0));
            setIntCell(rr.createCell(6), loadedItemPieces.getOrDefault(itemId, 0));
            setIntCell(rr.createCell(7), unloadedItemPieces.getOrDefault(itemId, 0));
        }
        for (int c = 0; c < hc1.length; c++) {
            s1.autoSizeColumn(c);
        }

        Sheet s2 = wb.createSheet("方案容器");
        Row h2 = s2.createRow(0);
        for (int i = 0; i < hc2.length; i++) {
            h2.createCell(i).setCellValue(hc2[i]);
        }
        int r2 = 1;
        if (allTplIds.isEmpty()) {
            s2.createRow(r2++).createCell(0).setCellValue("（无容器数据）");
        }
        for (Long tplId : allTplIds) {
            Container tpl = containerTplMap.get(tplId);
            Row rr = s2.createRow(r2++);
            rr.createCell(0).setCellValue(tplId);
            rr.createCell(1).setCellValue(tpl == null ? "" : stripImportedContainerPrefix(nzStr(tpl.getContainerName())));
            setIntCell(rr.createCell(2), tpl == null ? null : tpl.getLengthMm());
            setIntCell(rr.createCell(3), tpl == null ? null : tpl.getWidthMm());
            setIntCell(rr.createCell(4), tpl == null ? null : tpl.getHeightMm());
            setIntCell(rr.createCell(5), plannedContainerInstances.getOrDefault(tplId, 0));
            setIntCell(rr.createCell(6), expandedInstancesByTpl.getOrDefault(tplId, 0));
            setIntCell(rr.createCell(7), usedInstancesByTpl.getOrDefault(tplId, 0));
        }
        for (int c = 0; c < hc2.length; c++) {
            s2.autoSizeColumn(c);
        }

        Sheet s3 = wb.createSheet("特殊需求");
        Row h3 = s3.createRow(0);
        h3.createCell(0).setCellValue("需求ID");
        h3.createCell(1).setCellValue("内容");
        h3.createCell(2).setCellValue("已完成");
        h3.createCell(3).setCellValue("创建时间");
        int r3 = 1;
        if (userRequirements.isEmpty()) {
            Row rr = s3.createRow(r3);
            rr.createCell(0).setCellValue("—");
            rr.createCell(1).setCellValue("（无用户特殊需求）");
            rr.createCell(2).setCellValue("");
            rr.createCell(3).setCellValue("");
        } else {
            for (PlanRequirement req : userRequirements) {
                Row rr = s3.createRow(r3++);
                rr.createCell(0).setCellValue(req.getId() == null ? 0 : req.getId());
                Cell c = rr.createCell(1);
                c.setCellValue(nzStr(req.getContent()));
                c.setCellStyle(wrapTop);
                rr.createCell(2).setCellValue(req.getFinished() != null && req.getFinished() == 1 ? "是" : "否");
                rr.createCell(3).setCellValue(req.getCreatedAt() == null ? "" : DT.format(req.getCreatedAt()));
                int lines = Math.max(1, (nzStr(req.getContent()).length() + 39) / 40);
                rr.setHeightInPoints(Math.min(409, 8f + lines * 14f));
            }
        }
        for (int c = 0; c < 4; c++) {
            s3.autoSizeColumn(c);
        }
        s3.setColumnWidth(1, Math.max(s3.getColumnWidth(1), 52 * 256));

        return wb;
    }

    private static void setIntCell(Cell cell, Integer v) {
        if (v == null) {
            cell.setBlank();
        } else {
            cell.setCellValue(v.doubleValue());
        }
    }

    private Workbook buildContainerPackingWorkbook(
            PlanContainerDetail pcd,
            Container tpl,
            String displayName,
            List<PlanItemDetail> inBox,
            Map<Long, Item> itemMap
    ) {
        XSSFWorkbook wb = new XSSFWorkbook();
        Sheet s = wb.createSheet("装箱明细");
        int r = 0;
        putKV(s, r++, "容器实例名称", displayName);
        putKV(s, r++, "容器模板ID", str(pcd.getContainerId()));
        putKV(s, r++, "容器模板名称", tpl == null ? "" : stripImportedContainerPrefix(nzStr(tpl.getContainerName())));
        putKV(s, r++, "外廓尺寸mm L×W×H",
                tpl == null ? "" : (str(tpl.getLengthMm()) + "×" + str(tpl.getWidthMm()) + "×" + str(tpl.getHeightMm())));
        putKV(s, r++, "是否已装载使用", pcd.getFilled() != null && pcd.getFilled() == 1 ? "是" : "否");
        putKV(s, r++, "装入件数", str(pcd.getFilledItemQty()));
        putKV(s, r++, "填充率%", formatBd(pcd.getFillRate()));
        putKV(s, r++, "平均支撑率%", formatBd(pcd.getAvgSupportRate()));
        r++;
        Row h = s.createRow(r++);
        String[] hc = {"明细ID", "物品ID", "物品名称", "是否装载", "层序号", "posX", "posY", "posZ",
                "旋转90度", "支撑率%", "长mm", "宽mm", "高mm"};
        for (int i = 0; i < hc.length; i++) {
            h.createCell(i).setCellValue(hc[i]);
        }
        for (PlanItemDetail d : inBox) {
            if (d == null) {
                continue;
            }
            Item it = itemMap.get(d.getItemId());
            Row rr = s.createRow(r++);
            rr.createCell(0).setCellValue(d.getId() == null ? 0 : d.getId());
            rr.createCell(1).setCellValue(d.getItemId() == null ? 0 : d.getItemId());
            rr.createCell(2).setCellValue(it == null ? "" : stripImportedItemPrefix(nzStr(it.getItemName())));
            rr.createCell(3).setCellValue(d.getLoaded() != null && d.getLoaded() == 1 ? "是" : "否");
            setIntCell(rr.createCell(4), d.getLayerIndex());
            rr.createCell(5).setCellValue(formatBd(d.getPosX()));
            rr.createCell(6).setCellValue(formatBd(d.getPosY()));
            rr.createCell(7).setCellValue(formatBd(d.getPosZ()));
            rr.createCell(8).setCellValue(d.getSwapLengthWidth() != null && d.getSwapLengthWidth() == 1 ? "是" : "否");
            rr.createCell(9).setCellValue(formatBd(d.getSupportRate()));
            setIntCell(rr.createCell(10), it == null ? null : it.getLengthMm());
            setIntCell(rr.createCell(11), it == null ? null : it.getWidthMm());
            setIntCell(rr.createCell(12), it == null ? null : it.getHeightMm());
        }
        return wb;
    }

    private static void putKV(Sheet s, int rowIdx, String k, String v) {
        Row rr = s.createRow(rowIdx);
        rr.createCell(0).setCellValue(k);
        rr.createCell(1).setCellValue(v == null ? "" : v);
    }

    private Workbook buildUnloadedWorkbook(
            List<PlanItemDetail> unloaded,
            Map<Long, Item> itemMap,
            Map<Long, String> instanceNameMap
    ) {
        XSSFWorkbook wb = new XSSFWorkbook();
        Sheet s = wb.createSheet("未装载");
        int r = 0;
        Row note = s.createRow(r++);
        note.createCell(0).setCellValue("说明");
        note.createCell(1).setCellValue("以下为未装入容器或标记为未装载的物品明细");
        Row h = s.createRow(r++);
        String[] hc = {"明细ID", "物品ID", "物品名称", "是否装载", "容器实例ID", "容器实例名称",
                "层序号", "posX", "posY", "posZ", "旋转90度", "支撑率%"};
        for (int i = 0; i < hc.length; i++) {
            h.createCell(i).setCellValue(hc[i]);
        }
        if (unloaded == null || unloaded.isEmpty()) {
            Row empty = s.createRow(r);
            empty.createCell(0).setCellValue("（当前无未装载物品）");
            return wb;
        }
        for (PlanItemDetail d : unloaded) {
            if (d == null) {
                continue;
            }
            Item it = itemMap.get(d.getItemId());
            Row rr = s.createRow(r++);
            rr.createCell(0).setCellValue(d.getId() == null ? 0 : d.getId());
            rr.createCell(1).setCellValue(d.getItemId() == null ? 0 : d.getItemId());
            rr.createCell(2).setCellValue(it == null ? "" : stripImportedItemPrefix(nzStr(it.getItemName())));
            rr.createCell(3).setCellValue(d.getLoaded() != null && d.getLoaded() == 1 ? "是" : "否");
            rr.createCell(4).setCellValue(d.getContainerInstanceId() == null ? "" : str(d.getContainerInstanceId()));
            String instName = d.getContainerInstanceId() == null ? "" : nzStr(instanceNameMap.get(d.getContainerInstanceId()));
            rr.createCell(5).setCellValue(instName);
            setIntCell(rr.createCell(6), d.getLayerIndex());
            rr.createCell(7).setCellValue(formatBd(d.getPosX()));
            rr.createCell(8).setCellValue(formatBd(d.getPosY()));
            rr.createCell(9).setCellValue(formatBd(d.getPosZ()));
            rr.createCell(10).setCellValue(d.getSwapLengthWidth() != null && d.getSwapLengthWidth() == 1 ? "是" : "否");
            rr.createCell(11).setCellValue(formatBd(d.getSupportRate()));
        }
        return wb;
    }

    private static Map<Long, String> buildContainerInstanceNameMap(
            List<PlanContainerDetail> details,
            Map<Long, Container> containerMap
    ) {
        Map<Long, Integer> seq = new HashMap<>();
        Map<Long, String> result = new LinkedHashMap<>();
        for (PlanContainerDetail d : details) {
            if (d == null || d.getId() == null) {
                continue;
            }
            Container tpl = containerMap.get(d.getContainerId());
            int n = seq.merge(d.getContainerId(), 1, Integer::sum);
            String base = tpl == null || tpl.getContainerName() == null ? "容器" : tpl.getContainerName();
            result.put(d.getId(), stripImportedContainerPrefix(base) + "-" + n);
        }
        return result;
    }

    private static void putBinary(ZipOutputStream zos, String name, byte[] data) throws IOException {
        zos.putNextEntry(new ZipEntry(name));
        zos.write(data);
        zos.closeEntry();
    }

    private static String planStatusText(Integer s) {
        if (s == null) {
            return "";
        }
        return switch (s) {
            case 0 -> "未开始";
            case 1 -> "容器不足";
            case 2 -> "物品不足";
            default -> "状态" + s;
        };
    }


    private static final String[] SCENE_COLORS_HEX = {
            "#FF6B6B", "#FF69B4", "#FFD93D", "#6BCB77", "#4D96FF", "#9D84B7"
    };


    private static Map<Long, Color> buildSceneItemColorMap(List<PlanItemDetail> allDetailsOrderedById) {
        Map<Long, Color> map = new LinkedHashMap<>();
        int colorIndex = 0;
        for (PlanItemDetail d : allDetailsOrderedById) {
            if (d == null || d.getItemId() == null) {
                continue;
            }
            if (map.containsKey(d.getItemId())) {
                continue;
            }
            String hex = SCENE_COLORS_HEX[colorIndex % SCENE_COLORS_HEX.length];
            colorIndex++;
            map.put(d.getItemId(), parseHexRgbOpaque(hex));
        }
        return map;
    }

    private static Color parseHexRgbOpaque(String hex) {
        String s = hex.startsWith("#") ? hex.substring(1) : hex;
        int v = Integer.parseInt(s, 16);
        return new Color((v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF);
    }

    private static Color sceneFillColor(Map<Long, Color> itemColors, long itemId) {
        Color c = itemColors.get(itemId);
        if (c != null) {
            return c;
        }
        return new Color(200, 200, 200);
    }

    private static List<Box3> buildLoadedBoxes(List<PlanItemDetail> inBox, Map<Long, Item> itemMap) {
        List<Box3> boxes = new ArrayList<>();
        if (inBox == null) {
            return boxes;
        }
        for (PlanItemDetail d : inBox) {
            if (d == null || d.getLoaded() == null || d.getLoaded() != 1) {
                continue;
            }
            Item it = itemMap.get(d.getItemId());
            if (it == null) {
                continue;
            }
            boolean swap = d.getSwapLengthWidth() != null && d.getSwapLengthWidth() == 1;
            double lm = nz(it.getLengthMm());
            double wm = nz(it.getWidthMm());
            double hm = nz(it.getHeightMm());
            double lx = swap ? wm : lm;
            double ly = swap ? lm : wm;
            double lz = hm;
            double x0 = nz(d.getPosX());
            double y0 = nz(d.getPosY());
            double z0 = nz(d.getPosZ());
            int layer = d.getLayerIndex() == null ? 0 : d.getLayerIndex();
            boxes.add(new Box3(d.getItemId(), x0, y0, z0, x0 + lx, y0 + ly, z0 + lz, layer));
        }
        return boxes;
    }

    private byte[] renderContainerSixViewsPng(
            PlanContainerDetail pcd,
            Container tpl,
            String displayName,
            List<PlanItemDetail> inBox,
            Map<Long, Item> itemMap,
            Map<Long, Color> sceneItemColors
    ) throws IOException {
        double L = tpl == null ? 1 : nz(tpl.getLengthMm());
        double Wb = tpl == null ? 1 : nz(tpl.getWidthMm());
        double H = tpl == null ? 1 : nz(tpl.getHeightMm());
        if (L <= 0) {
            L = 1;
        }
        if (Wb <= 0) {
            Wb = 1;
        }
        if (H <= 0) {
            H = 1;
        }

        List<Box3> boxes = buildLoadedBoxes(inBox, itemMap);

        int panelW = 520;
        int panelH = 520;
        int gap = 18;
        int titleH = 56;
        int cols = 3;
        int rows = 2;
        int imgW = panelW * cols + gap * (cols - 1) + 48;
        int imgH = titleH + panelH * rows + gap * (rows - 1) + 48;

        BufferedImage image = new BufferedImage(imgW, imgH, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = image.createGraphics();
        g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g.setColor(Color.WHITE);
        g.fillRect(0, 0, imgW, imgH);

        g.setColor(Color.BLACK);
        g.setFont(pickFont(16));
        String title = "六视图 — 容器: " + displayName;
        if (tpl != null && tpl.getContainerName() != null) {
            title += "  |  " + stripImportedContainerPrefix(nzStr(tpl.getContainerName()));
        }
        title += String.format("  |  外廓 L×W×H %.0f×%.0f×%.0f mm", L, Wb, H);
        title += "  |  " + (pcd.getFilled() != null && pcd.getFilled() == 1 ? "实例已装载" : "实例未装载");
        g.drawString(title, 24, 34);

        int x0 = 24;
        int y0 = titleH;

        drawPanel(g, "上视图 俯视图 (X-Y, +Z)", x0, y0, panelW, panelH, L, Wb, boxes, ViewMode.TOP, sceneItemColors);
        drawPanel(g, "下视图 仰视图 (X-Y, -Z)", x0 + panelW + gap, y0, panelW, panelH, L, Wb, boxes, ViewMode.BOTTOM_XY, sceneItemColors);
        drawPanel(g, "前视图 正视图 (X-Z, -Y)", x0 + (panelW + gap) * 2, y0, panelW, panelH, L, H, boxes, ViewMode.FRONT_XZ, sceneItemColors);

        int y1 = y0 + panelH + gap;
        drawPanel(g, "后视图 (X-Z, +Y)", x0, y1, panelW, panelH, L, H, boxes, ViewMode.BACK_XZ, sceneItemColors);
        drawPanel(g, "左视图 (Y-Z, +X)", x0 + panelW + gap, y1, panelW, panelH, Wb, H, boxes, ViewMode.LEFT_YZ, sceneItemColors);
        drawPanel(g, "右视图 (Y-Z, -X)", x0 + (panelW + gap) * 2, y1, panelW, panelH, Wb, H, boxes, ViewMode.RIGHT_YZ, sceneItemColors);

        g.dispose();
        return pngBytes(image);
    }


    private byte[] renderContainerLayerTopViewsPng(
            PlanContainerDetail pcd,
            Container tpl,
            String displayName,
            List<PlanItemDetail> inBox,
            Map<Long, Item> itemMap,
            Map<Long, Color> sceneItemColors
    ) throws IOException {
        double L = tpl == null ? 1 : nz(tpl.getLengthMm());
        double Wb = tpl == null ? 1 : nz(tpl.getWidthMm());
        if (L <= 0) {
            L = 1;
        }
        if (Wb <= 0) {
            Wb = 1;
        }

        List<Box3> boxes = buildLoadedBoxes(inBox, itemMap);
        Map<Integer, List<Box3>> byLayer = boxes.stream().collect(Collectors.groupingBy(Box3::layerIndex));
        List<Integer> layers = new ArrayList<>(byLayer.keySet());
        Collections.sort(layers);

        int panelW = 320;
        int panelH = 300;
        int gap = 16;
        int cols = 4;
        int labelH = 22;
        int headerH = 52;
        int topPad = 12;
        int n = layers.size();
        int rowCount = n == 0 ? 1 : (n + cols - 1) / cols;
        int imgW = Math.max(720, 40 + cols * (panelW + gap));
        int imgH = headerH + topPad + rowCount * (labelH + panelH + gap) + 28;

        BufferedImage image = new BufferedImage(imgW, imgH, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = image.createGraphics();
        g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g.setColor(Color.WHITE);
        g.fillRect(0, 0, imgW, imgH);

        g.setColor(Color.BLACK);
        g.setFont(pickFont(16));
        String title = "分层俯视图 (X-Y) — 容器: " + displayName;
        if (tpl != null && tpl.getContainerName() != null) {
            title += "  |  " + nzStr(tpl.getContainerName());
        }
        title += String.format("  |  底面 %.0f×%.0f mm", L, Wb);
        title += "  |  " + (pcd.getFilled() != null && pcd.getFilled() == 1 ? "实例已装载" : "实例未装载");
        g.drawString(title, 24, 34);

        if (n == 0) {
            g.setFont(pickFont(14));
            g.drawString("本容器无已装载物品", 24, headerH + 36);
            g.dispose();
            return pngBytes(image);
        }

        int startY = headerH + topPad;
        for (int i = 0; i < n; i++) {
            int layer = layers.get(i);
            int col = i % cols;
            int row = i / cols;
            int ox = 24 + col * (panelW + gap);
            int oy = startY + row * (labelH + panelH + gap);
            g.setColor(Color.BLACK);
            g.setFont(pickFont(14));
            g.drawString("第 " + layer + " 层", ox + 4, oy + 16);
            drawPanel(g, "", ox, oy + labelH, panelW, panelH, L, Wb, byLayer.get(layer), ViewMode.TOP, sceneItemColors);
        }

        g.dispose();
        return pngBytes(image);
    }


    private enum ViewMode { TOP, BOTTOM_XY, FRONT_XZ, BACK_XZ, LEFT_YZ, RIGHT_YZ }

    private void drawPanel(
            Graphics2D g0,
            String subtitle,
            int ox,
            int oy,
            int pw,
            int ph,
            double spanX,
            double spanY,
            List<Box3> boxes,
            ViewMode mode,
            Map<Long, Color> sceneItemColors
    ) {
        Graphics2D g = (Graphics2D) g0.create();
        g.translate(ox, oy);
        g.setColor(new Color(245, 245, 245));
        g.fillRect(0, 0, pw, ph);
        g.setColor(Color.DARK_GRAY);
        g.setFont(pickFont(13));
        g.drawString(subtitle, 8, 18);

        int pad = 40;
        double innerW = pw - 2L * pad;
        double innerH = ph - 2L * pad;
        double sx = innerW / spanX;
        double sy = innerH / spanY;

        g.setColor(Color.BLACK);
        g.setStroke(new BasicStroke(2f));
        int boxPx = pad;
        int boxPy = pad + 20;
        int boxW = (int) innerW;
        int boxH = (int) innerH;
        g.drawRect(boxPx, boxPy, boxW, boxH);

        List<Box3> sorted = new ArrayList<>(boxes);
        switch (mode) {
            case TOP -> sorted.sort(Comparator.comparingDouble(b -> b.z0));
            case BOTTOM_XY -> sorted.sort(Comparator.comparingDouble(b -> -b.z1));
            case FRONT_XZ -> sorted.sort(Comparator.comparingDouble(b -> b.y0));
            case BACK_XZ -> sorted.sort(Comparator.comparingDouble(b -> -b.y1));
            case LEFT_YZ -> sorted.sort(Comparator.comparingDouble(b -> b.x0));
            case RIGHT_YZ -> sorted.sort(Comparator.comparingDouble(b -> -b.x1));
        }

        for (Box3 b : sorted) {
            Color fill = sceneFillColor(sceneItemColors, b.itemId);
            g.setColor(fill);
            double x1 = 0;
            double y1 = 0;
            double x2 = 0;
            double y2 = 0;
            switch (mode) {
                case TOP -> {
                    x1 = b.x0;
                    y1 = b.y0;
                    x2 = b.x1;
                    y2 = b.y1;
                }
                case BOTTOM_XY -> {
                    x1 = b.x0;
                    x2 = b.x1;
                    double ya = spanY - b.y1;
                    double yb = spanY - b.y0;
                    y1 = Math.min(ya, yb);
                    y2 = Math.max(ya, yb);
                }
                case FRONT_XZ -> {
                    x1 = b.x0;
                    y1 = b.z0;
                    x2 = b.x1;
                    y2 = b.z1;
                }
                case BACK_XZ -> {
                    x1 = spanX - b.x1;
                    x2 = spanX - b.x0;
                    y1 = b.z0;
                    y2 = b.z1;
                }
                case LEFT_YZ -> {
                    x1 = b.y0;
                    y1 = b.z0;
                    x2 = b.y1;
                    y2 = b.z1;
                }
                case RIGHT_YZ -> {
                    x1 = spanX - b.y1;
                    x2 = spanX - b.y0;
                    y1 = b.z0;
                    y2 = b.z1;
                }
            }
            int px = boxPx + (int) Math.round(x1 * sx);
            int py = boxPy + boxH - (int) Math.round(y2 * sy);
            int pwRect = Math.max(1, (int) Math.round((x2 - x1) * sx));
            int phRect = Math.max(1, (int) Math.round((y2 - y1) * sy));
            g.fillRect(px, py, pwRect, phRect);
            g.setColor(new Color(40, 40, 40));
            g.setStroke(new BasicStroke(1f));
            g.drawRect(px, py, pwRect, phRect);
        }

        g.setColor(Color.GRAY);
        g.setFont(pickFont(11));
        g.drawString("0", boxPx - 4, boxPy + boxH + 14);
        g.drawString(String.format("%.0f mm", spanX), boxPx + boxW - 60, boxPy + boxH + 14);

        g.dispose();
    }

    private static Font pickFont(int size) {
        GraphicsEnvironment ge = GraphicsEnvironment.getLocalGraphicsEnvironment();
        String[] names = ge.getAvailableFontFamilyNames();
        Set<String> set = new HashSet<>(Arrays.asList(names));
        for (String p : List.of("Microsoft YaHei", "SimHei", "SimSun", "SansSerif")) {
            if (set.contains(p)) {
                return new Font(p, Font.PLAIN, size);
            }
        }
        return new Font(Font.SANS_SERIF, Font.PLAIN, size);
    }

    private static byte[] pngBytes(BufferedImage img) throws IOException {
        ByteArrayOutputStream bo = new ByteArrayOutputStream();
        ImageIO.write(img, "png", bo);
        return bo.toByteArray();
    }

    private static String sanitizeFileName(String name) {
        if (name == null || name.isBlank()) {
            return "unnamed";
        }
        return name.replaceAll("[\\\\/:*?\"<>|]", "_").trim();
    }

    private static String str(Object o) {
        return o == null ? "" : String.valueOf(o);
    }

    private static String nzStr(String s) {
        return s == null ? "" : s;
    }

    private static double nz(BigDecimal v) {
        return v == null ? 0.0 : v.doubleValue();
    }

    private static double nz(Number v) {
        return v == null ? 0.0 : v.doubleValue();
    }

    private static String formatBd(BigDecimal v) {
        if (v == null) {
            return "";
        }
        return v.stripTrailingZeros().toPlainString();
    }

    private record Box3(long itemId, double x0, double y0, double z0, double x1, double y1, double z1, int layerIndex) {}
}
