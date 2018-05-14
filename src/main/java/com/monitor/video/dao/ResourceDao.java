package com.monitor.video.dao;

import com.monitor.video.vo.Resource;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;
import tk.mybatis.mapper.common.Mapper;

import java.util.List;

/**
 * Created by donglin.wang on 2017/4/20.
 */
@Repository
public interface ResourceDao extends Mapper<Resource> {

   List<Resource> list(@Param("userId") int userId);

   List<String> listName(@Param("userId") int userId);

   List<String> listAllName(@Param("userId") int userId);

   void addAuth(@Param("userId") int userId, @Param("resourceId") int resourceId);

   void deleteAuth(@Param("userId") int userId, @Param("resourceId") int resourceId);

   Integer findIdByUrl(@Param("url")String url, @Param("method")String method);

   Integer userResourceCount(@Param("userId")int userId, @Param("resourceId")int resourceId);

}
