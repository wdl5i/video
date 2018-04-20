package com.monitor.video.controller;

import com.monitor.video.service.AbstractService;
import com.monitor.video.vo.Page;
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

    @PostMapping
    public RestResult add(@RequestParam("pojo") T pojo) {
        return service.add(pojo);
    }

    @PutMapping
    public RestResult update(@RequestParam("pojo") T pojo) {
        return service.update(pojo);
    }

    @DeleteMapping("/{id}")
    public RestResult delete(@PathVariable("id") int id) {
        return service.delete(id);
    }

    @GetMapping("/{id}")
    public RestResult<T> findById(@PathVariable("id") int id) {
        return service.findById(id);
    }

    @GetMapping("/page")
    public RestResult<Page<T>> page(@RequestParam(defaultValue = "-1", name = "pageNum") int pageNum, @RequestParam(defaultValue = "-1", name = "pageSize") int pageSize, @RequestParam(required = false, name = "pojo") T pojo) {
        return service.page(pageNum, pageSize, pojo);
    }
}
