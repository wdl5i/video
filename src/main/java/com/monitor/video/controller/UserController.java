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

    @GetMapping("/login")
    public String greetingForm(Model model) {
        model.addAttribute("user", new User());
        return "login";
    }

    @PostMapping("/login")
    public String handleLogin(@ModelAttribute User user, Model model) {
        RestResult<User> restResult;
        user = userService.login(user.getUserName(), user.getPassword());
        if(user == null) {
            restResult = RestResult.buildErrorResult(RestResult.Status.NOT_EXIST_ERROR);
        } else {
            restResult = RestResult.buildSuccessResult(user);
        }
        model.addAttribute("data", restResult);
        return "login_result";
    }

}
