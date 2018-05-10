package com.monitor.video.service;

import com.monitor.video.dao.GroupDao;
import com.monitor.video.vo.Facility;
import com.monitor.video.vo.Group;
import com.monitor.video.vo.RestResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class GroupService extends AbstractService<Group> {

    private static Logger logger = LoggerFactory.getLogger(GroupService.class);

    private GroupDao dao;

    @Autowired
    protected void setDao(GroupDao dao) {
        this.dao = dao;
        super.setDao(dao);
    }

    public RestResult<List<Group>> getUserGroups(String userId) {
        RestResult<List<Group>> restResult;
        try {
            List<Group> groupList = dao.getUserGroups(userId);
            restResult = RestResult.buildSuccessResult(groupList);
        } catch (Exception e) {
            restResult = RestResult.buildErrorResult(RestResult.Status.INTERNAL_SERVER_ERROR);
            logger.error(e.getMessage(), e);
        }
        return restResult;
    }

    @Transactional
    public RestResult addUserGroup(String userId, String groupId) {
        RestResult restResult;
        try {
            dao.deleteUserGroup(userId, groupId);
            dao.addUserGroup(userId, groupId);
            restResult = RestResult.buildSuccessResult();
        } catch (Exception e) {
            restResult = RestResult.buildErrorResult(RestResult.Status.INTERNAL_SERVER_ERROR);
            logger.error(e.getMessage(), e);
        }
        return restResult;
    }

    public RestResult removeUserGroups(String userId, String groupId) {
        RestResult restResult;
        try {
            dao.deleteUserGroup(userId, groupId);
            restResult = RestResult.buildSuccessResult();
        } catch (Exception e) {
            restResult = RestResult.buildErrorResult(RestResult.Status.INTERNAL_SERVER_ERROR);
            logger.error(e.getMessage(), e);
        }
        return restResult;
    }

    public RestResult<List<Facility>> getGroupFacilities(String groupId) {
        RestResult<List<Facility>> restResult;
        try {
            List<Facility> facilityList = dao.getGroupFacilities(groupId);
            restResult = RestResult.buildSuccessResult(facilityList);
        } catch (Exception e) {
            restResult = RestResult.buildErrorResult(RestResult.Status.INTERNAL_SERVER_ERROR);
            logger.error(e.getMessage(), e);
        }
        return restResult;
    }

    @Transactional
    public RestResult addGroupFacility(String groupId, String facilityId) {
        RestResult restResult;
        try {
            dao.deleteGroupFacility(groupId, facilityId);
            dao.addGroupFacility(groupId, facilityId);
            restResult = RestResult.buildSuccessResult();
        } catch (Exception e) {
            restResult = RestResult.buildErrorResult(RestResult.Status.INTERNAL_SERVER_ERROR);
            logger.error(e.getMessage(), e);
        }
        return restResult;
    }

    public RestResult removeGroupFacility(String groupId, String facilityId) {
        RestResult restResult;
        try {
            dao.deleteGroupFacility(groupId, facilityId);
            restResult = RestResult.buildSuccessResult();
        } catch (Exception e) {
            restResult = RestResult.buildErrorResult(RestResult.Status.INTERNAL_SERVER_ERROR);
            logger.error(e.getMessage(), e);
        }
        return restResult;
    }


}
