package com.monitor.video.service;

import com.monitor.video.vo.Page;
import com.monitor.video.vo.RestResult;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.session.RowBounds;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;
import tk.mybatis.mapper.common.Mapper;
import java.util.List;
import java.util.Map;


public abstract class AbstractService<T> {

    private Logger logger = LoggerFactory.getLogger(getClass());

    private Mapper<T> dao;

    protected void setDao(Mapper<T> dao) {
        this.dao = dao;
    }

    public RestResult add(T entity) {
        RestResult restResult;
        try {
            dao.insertSelective(entity);
            restResult = RestResult.buildSuccessResult();
        } catch (Exception e) {
            restResult = RestResult.buildErrorResult(RestResult.Status.INTERNAL_SERVER_ERROR);
            logger.error(e.getMessage(), e);
        }
        return restResult;
    }

    public RestResult update(T entity){
        RestResult restResult;
        try {
            dao.updateByPrimaryKey(entity);
            restResult = RestResult.buildSuccessResult();
        } catch (Exception e) {
            restResult = RestResult.buildErrorResult(RestResult.Status.INTERNAL_SERVER_ERROR);
            logger.error(e.getMessage(), e);
        }
        return restResult;
    }

    public RestResult delete(int id) {
        RestResult restResult;
        try {
            dao.deleteByPrimaryKey(id);
            restResult = RestResult.buildSuccessResult();
        } catch (Exception e) {
            restResult = RestResult.buildErrorResult(RestResult.Status.INTERNAL_SERVER_ERROR);
            logger.error(e.getMessage(), e);
        }
        return restResult;
    }

    public RestResult<T> findById(int id) {
        RestResult restResult;
        try {
            T entity = dao.selectByPrimaryKey(id);
            restResult = RestResult.buildSuccessResult(entity);
        } catch (Exception e) {
            restResult = RestResult.buildErrorResult(RestResult.Status.INTERNAL_SERVER_ERROR);
            logger.error(e.getMessage(), e);
        }
        return restResult;
    }

    public RestResult<Page<T>> page(int pageNum, int pageSize, T entity) {
        RestResult<Page<T>> restResult;
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
