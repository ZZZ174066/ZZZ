package com.tsj.mapper;

import com.tsj.entity.Container;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ContainerMapper {

    int insert(Container container);

    int update(Container container);

    int deleteById(@Param("id") Long id);

    Container selectById(@Param("id") Long id);

    List<Container> selectAll();
}
