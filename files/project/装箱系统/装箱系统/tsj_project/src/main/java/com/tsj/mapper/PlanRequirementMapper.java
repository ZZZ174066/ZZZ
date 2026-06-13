package com.tsj.mapper;

import com.tsj.entity.PlanRequirement;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PlanRequirementMapper {

    int insert(PlanRequirement requirement);

    int update(PlanRequirement requirement);

    int deleteById(@Param("id") Long id);

    PlanRequirement selectById(@Param("id") Long id);

    List<PlanRequirement> selectByPlanId(@Param("planId") Long planId);
}
