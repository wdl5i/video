package com.monitor.video.controller;

import com.monitor.video.service.ResourceService;
import com.monitor.video.service.UserService;
import com.monitor.video.vo.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

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

    @PostMapping("/{userId}/{resourceId}")
    public RestResult addAuth(@PathVariable("userId") int userId, @PathVariable("resourceId") int resourceId) {
        return service.auth(userId, resourceId, true);
    }

    @DeleteMapping("/{userId}/{resourceId}")
    public RestResult removeAuth(@PathVariable("userId") int userId, @PathVariable("resourceId") int resourceId) {
        return service.auth(userId, resourceId, false);
    }



    @Authority(AuthorityType.ADMIN)
    @GetMapping("/list/{userId}")
    public RestResult<List<Resource>> list(@PathVariable("userId") int userId) {
        return service.list(userId);
    }

    @Override
    @Authority(AuthorityType.ADMIN)
    @PostMapping("/page/{pageNum}/{pageSize}")
    public RestResult<Page<Resource>> page(@PathVariable(name = "pageNum") int pageNum,
                                           @PathVariable(name = "pageSize") int pageSize,
                                           @RequestBody Map pojo) {
        return super.page(pageNum, pageSize, pojo);
    }

    @Authority(AuthorityType.NO_VALIDATE)
    @GetMapping
    public RestResult<Boolean> hasPermission(@RequestParam("userId") int userId, @RequestParam("url") String url, @RequestParam("method") String method) {
        return service.hasPermission(userId, url, method);
    }
}
