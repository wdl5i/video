package com.monitor.video.dao;

import com.monitor.video.vo.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by fangzhipeng on 2017/4/20.
 */
@Mapper
public interface UserDao extends BaseDao{

   User login(@Param("userName") String userName, @Param("pwd") String password);

}
