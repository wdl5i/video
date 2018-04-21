package com.monitor.video.service;

import com.monitor.video.dao.UserDao;
import com.monitor.video.util.JWTUtil;
import com.monitor.video.vo.RestResult;
import com.monitor.video.vo.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class UserService extends AbstractService {

    private static Logger logger = LoggerFactory.getLogger(UserService.class);

    private static final long ONE_HOUR_MILLS = 60 * 60 * 1000;

    private UserDao userDao;

    @Autowired
    protected void setDao(UserDao dao) {
        this.userDao = dao;
        super.setDao(dao);
    }

    public RestResult<String> login(String userName, String password) {
        RestResult<String> restResult;
        User user = userDao.login(userName, password);
        if(user == null) {
            restResult = RestResult.buildErrorResult(RestResult.Status.NOT_FOUND);
        } else {
            Map<String, Object> claims = new HashMap<>();
            String claimsStr = "";
            claims.put("user", userName);
            try {
                claimsStr = JWTUtil.createJWT("jwt", claims, ONE_HOUR_MILLS);
            } catch (Exception e) {
                logger.error(e.getMessage(), e);
            }
            restResult = RestResult.buildSuccessResult(claimsStr);
        }
        return restResult;
    }



}
