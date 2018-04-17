package com.monitor.video.controller;

import com.monitor.video.service.UserService;
import com.monitor.video.vo.RestResult;
import com.monitor.video.vo.User;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

/**
 * Created by donglin.wang on 2018/4/14.
 */
@RestController
@RequestMapping("/user")
@MapperScan("com.monitor.video")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public RestResult<User> handleLogin(@RequestParam String userName, @RequestParam String pwd) {
        RestResult<User> restResult;
        User user = userService.login(userName, pwd);
        if(user == null) {
            restResult = RestResult.buildErrorResult(RestResult.Status.NOT_EXIST_ERROR);
        } else {
            restResult = RestResult.buildSuccessResult(user);
        }
        return restResult;
    }

}
