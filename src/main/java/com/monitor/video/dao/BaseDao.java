package com.monitor.video.dao;

import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface BaseDao<T> {

    void addOrUpdate(@Param("entity") T entity);

    void delete(@Param("id") int id);

    T findById(@Param("id") int id);

    List<T> page(@Param("pageNum") int pageNum, @Param("pageSize") int pageSize, @Param("entity") T entity);
}
