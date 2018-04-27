package com.monitor.video.controller;

import com.monitor.video.service.ResourceService;
import com.monitor.video.service.UserService;
import com.monitor.video.vo.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth")
public class ResourceController extends AbstractController<Resource> {

    private static Logger logger = LoggerFactory.getLogger(ResourceController.class);

    private ResourceService service;

    @Autowired
    protected void setService(ResourceService service) {
        super.setService(service);
        this.service = service;
    }

    @PostMapping("/{userId}/{id}")
    public RestResult<Resource> auth(@PathVariable("userId") String userId, @PathVariable("resourceId") String resourceId,  @RequestParam("val") boolean val) {
        return null;
    }

    @GetMapping("/list/{userId}")
    public RestResult<List<Resource>> list(@PathVariable("userId") String userId) {
        return service.list(userId);
    }
}
