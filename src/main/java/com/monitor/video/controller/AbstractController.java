package com.monitor.video.controller;

import com.monitor.video.service.AbstractService;
import com.monitor.video.vo.RestResult;
import com.monitor.video.vo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/")
public  class AbstractController<T> {

    protected AbstractService service;

    protected void setService(AbstractService service) {
        this.service = service;
    }

    public RestResult addOrUpdate(@RequestParam("pojo") T pojo) {
        return service.addOrUpdate(pojo);
    }

    @DeleteMapping("/{id}")
    public RestResult delete(@PathVariable("id") int id) {
        return service.delete(id);
    }

    @GetMapping("/{id}")
    public RestResult<User> findById(@PathVariable("id") int id) {
        return service.findById(id);
    }

    @GetMapping("/page")
    public RestResult<List<User>> page(@RequestParam("pageNum") int pageNum, @RequestParam("pageSize") int pageSize, @RequestParam("pojo") T pojo) {
        return service.page(pageNum, pageSize, pojo);
    }
}
