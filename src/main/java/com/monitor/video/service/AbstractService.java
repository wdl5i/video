package com.monitor.video.service;

import com.monitor.video.vo.Page;
import com.monitor.video.vo.RestResult;
import com.monitor.video.vo.User;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.session.RowBounds;
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

    public RestResult<Page<T>> page(@Param("pageNum") int pageNum, @Param("pageSize") int pageSize, @Param("entity") T entity) {
        RestResult<Page<T>> restResult = null;
        try {
            List<T> users = dao.selectByRowBounds(entity, new RowBounds(Page.calcuOffset(pageNum, pageSize), pageSize));
            int count = dao.selectCount(entity);
            Page<T> page = new Page<T>(pageNum, pageSize, count, users);
            restResult = RestResult.buildSuccessResult(page);
        } catch (Exception e) {
            restResult = RestResult.buildErrorResult(RestResult.Status.INTERNAL_SERVER_ERROR);
            logger.error(e.getMessage(), e);
        }
        return restResult;

    }
}
