package com.monitor.video.controller;

import com.monitor.video.service.GroupService;
import com.monitor.video.vo.Facility;
import com.monitor.video.vo.Group;
import com.monitor.video.vo.RestResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/group")
public class GroupController extends AbstractController {

    private GroupService service;

    @Autowired
    protected void setService(GroupService service) {
        super.setService(service);
        this.service = service;
    }

    @GetMapping("/userGroups/{userId}")
    public RestResult<List<Group>> getUserGroups(@PathVariable String userId) {
        return service.getUserGroups(userId);
    }

    @PostMapping("/user/{userId}/{groupId}")
    public RestResult addUserGroup(@PathVariable String userId, @PathVariable String groupId) {
        return service.addUserGroup(userId, groupId);
    }

    @DeleteMapping("/user/{userId}/{groupId}")
    public RestResult removeUserGroup(@PathVariable String userId, @PathVariable String groupId) {
        return service.removeUserGroups(userId, groupId);
    }

    @GetMapping("/groupFacilities/{groupId}")
    public RestResult<List<Facility>> getGroupFacilities(@PathVariable String groupId) {
        return service.getGroupFacilities(groupId);
    }

    @PostMapping("/facility/{groupId}/{facilityId}")
    public RestResult addGroupFacility(@PathVariable String groupId, @PathVariable String facilityId) {
        return service.addGroupFacility(groupId, facilityId);
    }

    @DeleteMapping("/groupFacility/{userId}/{groupId}")
    public RestResult removeGroupFacility(@PathVariable String groupId, @PathVariable String facilityId) {
        return service.removeGroupFacility(groupId, facilityId);
    }

}
