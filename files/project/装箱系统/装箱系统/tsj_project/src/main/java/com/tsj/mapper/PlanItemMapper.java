package com.tsj.mapper;

import com.tsj.entity.PlanItem;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PlanItemMapper {

    int insert(PlanItem planItem);

    int update(PlanItem planItem);

    int deleteById(@Param("id") Long id);

    PlanItem selectById(@Param("id") Long id);

    List<PlanItem> selectByPlanId(@Param("planId") Long planId);


    int countByItemId(@Param("itemId") Long itemId);
}
