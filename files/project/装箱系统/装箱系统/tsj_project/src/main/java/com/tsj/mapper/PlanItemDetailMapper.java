package com.tsj.mapper;

import com.tsj.entity.PlanItemDetail;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PlanItemDetailMapper {

    int insert(PlanItemDetail detail);

    int update(PlanItemDetail detail);

    int deleteById(@Param("id") Long id);

    int deleteByPlanId(@Param("planId") Long planId);

    PlanItemDetail selectById(@Param("id") Long id);

    List<PlanItemDetail> selectByPlanId(@Param("planId") Long planId);
}
