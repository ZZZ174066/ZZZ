package com.tsj.mapper;

import com.tsj.entity.Item;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ItemMapper {

    int insert(Item item);

    int update(Item item);

    int deleteById(@Param("id") Long id);

    Item selectById(@Param("id") Long id);

    List<Item> selectAll();
}
