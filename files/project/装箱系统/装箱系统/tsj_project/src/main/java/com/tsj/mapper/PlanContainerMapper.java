package com.tsj.mapper;

import com.tsj.entity.PlanContainer;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PlanContainerMapper {

    int insert(PlanContainer planContainer);

    int update(PlanContainer planContainer);

    int deleteById(@Param("id") Long id);

    PlanContainer selectById(@Param("id") Long id);

    List<PlanContainer> selectByPlanId(@Param("planId") Long planId);


    int countByContainerId(@Param("containerId") Long containerId);
}
