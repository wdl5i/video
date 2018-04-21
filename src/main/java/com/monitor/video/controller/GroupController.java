package com.monitor.video.controller;

import com.monitor.video.service.GroupService;
import com.monitor.video.vo.Group;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/group")
public class GroupController extends AbstractController<Group> {

    private GroupService groupService;

    @Autowired
    protected void setService(GroupService groupService) {
        super.setService(groupService);
        this.groupService = groupService;
    }

}
