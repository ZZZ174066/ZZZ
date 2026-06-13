package com.tsj.mapper;

import com.tsj.entity.PlanContainerDetail;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PlanContainerDetailMapper {

    int insert(PlanContainerDetail detail);

    int update(PlanContainerDetail detail);

    int deleteById(@Param("id") Long id);

    int deleteByPlanId(@Param("planId") Long planId);

    PlanContainerDetail selectById(@Param("id") Long id);

    List<PlanContainerDetail> selectByPlanId(@Param("planId") Long planId);
}
