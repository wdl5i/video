package com.monitor.video.controller;


import com.monitor.video.service.FacilityService;
import com.monitor.video.service.UserService;
import com.monitor.video.vo.Facility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/facility")
public class FacilityController extends AbstractController {
    private FacilityService service;

    @Autowired
    protected void setService(FacilityService service) {
        super.setService(service);
        this.service = service;
    }
}
