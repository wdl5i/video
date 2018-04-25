package com.monitor.video.service;

import com.monitor.video.dao.FacilityDao;
import com.monitor.video.dao.UserDao;
import com.monitor.video.util.JWTUtil;
import com.monitor.video.vo.Facility;
import com.monitor.video.vo.RestResult;
import com.monitor.video.vo.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class FacilityService extends AbstractService<Facility> {

    private static Logger logger = LoggerFactory.getLogger(FacilityService.class);

    private FacilityDao dao;

    @Autowired
    protected void setDao(FacilityDao dao) {
        this.dao = dao;
        super.setDao(dao);
    }

}
