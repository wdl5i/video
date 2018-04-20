package com.monitor.video.dao;

import com.monitor.video.vo.User;
import org.apache.ibatis.annotations.Param;
import tk.mybatis.mapper.common.Mapper;

import java.util.List;

/**
 * Created by fangzhipeng on 2017/4/20.
 */
public interface UserDao extends Mapper<User> {

   User login(@Param("name") String name, @Param("pwd") String password);

}
