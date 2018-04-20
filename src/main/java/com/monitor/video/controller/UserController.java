package com.monitor.video.controller;

import com.monitor.video.service.UserService;
import com.monitor.video.vo.RestResult;
import com.monitor.video.vo.User;
import org.mybatis.spring.annotation.MapperScan;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * Created by donglin.wang on 2018/4/14.
 */
@RestController
@RequestMapping("/user")
public class UserController extends AbstractController {

    private static Logger logger = LoggerFactory.getLogger(UserController.class);

    private UserService userService;

    @Autowired
    protected void setService(UserService userService) {
        super.setService(userService);
        this.userService = userService;
    }

    @PostMapping("/login")
    public RestResult<String> handleLogin(@RequestParam String userName, @RequestParam  String password) {
        return userService.login(userName, password);
    }

}
