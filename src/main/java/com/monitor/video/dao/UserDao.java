package com.monitor.video.dao;

import com.monitor.video.vo.User;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;
import tk.mybatis.mapper.common.Mapper;

/**
 * Created by donglin.wang on 2017/4/20.
 */
@Repository
public interface UserDao extends Mapper<User> {

   User login(@Param("name") String name, @Param("pwd") String password);

}
