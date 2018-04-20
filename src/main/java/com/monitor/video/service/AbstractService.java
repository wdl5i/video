package com.monitor.video.service;

import com.monitor.video.vo.RestResult;
import org.apache.ibatis.annotations.Param;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import tk.mybatis.mapper.common.Mapper;

import java.util.List;

public abstract class AbstractService<T> {

    private Logger logger = LoggerFactory.getLogger(getClass());

    private Mapper<T> dao;

    protected void setDao(Mapper<T> dao) {
        this.dao = dao;
    }

    public RestResult addOrUpdate(T entity){
        RestResult restResult = null;
        try {
            //dao.addOrUpdate(entity);
            restResult = RestResult.buildSuccessResult();
        } catch (Exception e) {
            restResult = RestResult.buildErrorResult(RestResult.Status.INTERNAL_SERVER_ERROR);
            logger.error(e.getMessage(), e);
        }
        return restResult;
    }

    public RestResult delete(int id) {
        RestResult restResult = null;
        try {
            //dao.delete(id);
            restResult = RestResult.buildSuccessResult();
        } catch (Exception e) {
            restResult = RestResult.buildErrorResult(RestResult.Status.INTERNAL_SERVER_ERROR);
            logger.error(e.getMessage(), e);
        }
        return restResult;
    }

    public RestResult<T> findById(int id) {
        RestResult restResult = null;
        try {
            T entity = dao.selectByPrimaryKey(id);
            restResult = RestResult.buildSuccessResult(entity);
        } catch (Exception e) {
            restResult = RestResult.buildErrorResult(RestResult.Status.INTERNAL_SERVER_ERROR);
            logger.error(e.getMessage(), e);
        }
        return restResult;
    }

    public RestResult<List<T>> page(@Param("pageNum") int pageNum, @Param("pageSize") int pageSize, @Param("entity") T entity) {
        RestResult restResult = null;
        try {
            //List<T> users = dao.page(pageNum, pageSize, entity);
            restResult = RestResult.buildSuccessResult(null);
        } catch (Exception e) {
            restResult = RestResult.buildErrorResult(RestResult.Status.INTERNAL_SERVER_ERROR);
            logger.error(e.getMessage(), e);
        }
        return restResult;

    }
}
