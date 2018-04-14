package com.monitor.video.service;

import com.monitor.video.dao.UserDao;
import com.monitor.video.vo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserDao userDao;

    public User login(String userName, String password) {
        User user = userDao.login(userName, password);
        return user;
    }

}
