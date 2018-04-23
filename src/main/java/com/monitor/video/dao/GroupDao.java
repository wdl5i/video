package com.monitor.video.dao;

import com.monitor.video.vo.Facility;
import com.monitor.video.vo.Group;
import com.monitor.video.vo.User;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;
import tk.mybatis.mapper.common.Mapper;

import java.util.List;

/**
 * Created by donglin.wang on 2017/4/20.
 */
@Repository
public interface GroupDao extends Mapper<Group> {

    List<Group> getUserGroups(@Param("userId") String userId);

    void addUserGroup(@Param("userId") String userId, @Param("groupId") String groupId);

    void deleteUserGroup(@Param("userId") String userId, @Param("groupId") String groupId);

    List<Facility> getGroupFacilities(@Param("groupId") String groupId);

    void addGroupFacility(@Param("groupId") String groupId, @Param("facilityId") String facilityId);

    void deleteGroupFacility(@Param("groupId") String groupId, @Param("facilityId") String facilityId);
}
