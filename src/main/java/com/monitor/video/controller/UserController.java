package com.monitor.video.controller;

import com.monitor.video.service.UserService;
import com.monitor.video.vo.RestResult;
import com.monitor.video.vo.User;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;

/**
 * Created by donglin.wang on 2018/4/14.
 */
@Controller
@RequestMapping("/user")
@MapperScan("com.monitor.video")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    @ResponseBody
    public RestResult<User> handleLogin(@RequestParam("userName") String userName, @RequestParam("pwd") String password) {
        RestResult<User> restResult;
        User user = userService.login(userName, password);
        if(user == null) {
            restResult = RestResult.buildErrorResult(RestResult.Status.NOT_EXIST_ERROR);
        } else {
            restResult = RestResult.buildSuccessResult(user);
        }
        return restResult;
    }

}
