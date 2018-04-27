package com.monitor.video.service;

import com.monitor.video.dao.ResourceDao;
import com.monitor.video.dao.UserDao;
import com.monitor.video.vo.Resource;
import com.monitor.video.vo.RestResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResourceService extends AbstractService<Resource> {

    private ResourceDao dao;

    @Autowired
    protected void setDao(ResourceDao dao) {
        this.dao = dao;
        super.setDao(dao);
    }

    public RestResult<List<Resource>> list(int userId) {
        RestResult<List<Resource>> restResult;
        try {
            List<Resource> resources =  dao.list(userId);
            restResult = RestResult.buildSuccessResult(resources);
        } catch (Exception e) {
            restResult = RestResult.buildErrorResult(RestResult.Status.INTERNAL_SERVER_ERROR);
        }
        return restResult;
    }

    public RestResult auth(int userId, int resourceId, boolean value) {
        RestResult<List<Resource>> restResult;
        try {
            if(value) {
                dao.addAuth(userId, resourceId);
            } else {
                dao.deleteAuth(userId, resourceId);
            }
            restResult = RestResult.buildSuccessResult();
        } catch (Exception e) {
            restResult = RestResult.buildErrorResult(RestResult.Status.INTERNAL_SERVER_ERROR);
        }
        return restResult;
    }
}
