package com.monitor.video.controller;

import com.monitor.video.vo.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth")
public class ResourceController extends AbstractController<Resource> {

    @RequestMapping("/{userId}/{id}")
    @Authority(AuthorityType.ADMIN)
    public RestResult<Resource> auth(@PathVariable("userId") String userId, @PathVariable("id") String id,  @RequestParam("val") boolean val) {
        return null;
    }

    @Authority(AuthorityType.ADMIN)
    @RequestMapping("/list/{userId}")
    public RestResult<List<Resource>> list(@PathVariable("userId") String userId) {
        return null;
    }
}
