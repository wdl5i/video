package com.monitor.video.dao;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;
import tk.mybatis.mapper.common.Mapper;

import java.util.List;

@Repository
public interface TableDao{

    int tableNum(@Param("tableName") String tableName);

    void deleteTableByName(@Param("tableName") String tableName);

    void deleteColumn(@Param("columnName") String columnName, @Param("tableName") String tableName);

    int columnExisted(@Param("columnName") String columnName, @Param("tableName") String tableName);

    void addVarCharColumn(@Param("columnName") String columnName, @Param("tableName") String tableName);

    void addBigVarCharColumn(@Param("columnName") String columnName, @Param("tableName") String tableName);

    void addIntColumn(@Param("columnName") String columnName, @Param("tableName") String tableName);
}
