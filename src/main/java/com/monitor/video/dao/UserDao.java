package com.monitor.video.dao;

import com.monitor.video.vo.User;
import org.apache.ibatis.annotations.Param;

/**
 * Created by fangzhipeng on 2017/4/20.
 */
public interface UserDao {
   User login(@Param("userName") String userName, @Param("pwd") String password);
}
