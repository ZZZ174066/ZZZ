package com.tsj.mapper;

import com.tsj.entity.Plan;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PlanMapper {

    int insert(Plan plan);

    int update(Plan plan);

    int deleteById(@Param("id") Long id);

    Plan selectById(@Param("id") Long id);

    List<Plan> selectAll();


    int updatePlanMeta(@Param("planId") Long planId, @Param("planName") String planName, @Param("needUpdate") Integer needUpdate);
}
