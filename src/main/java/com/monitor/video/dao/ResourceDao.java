package com.monitor.video.dao;

import com.monitor.video.vo.Resource;
import com.monitor.video.vo.User;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;
import tk.mybatis.mapper.common.Mapper;

import java.util.List;

/**
 * Created by donglin.wang on 2017/4/20.
 */
@Repository
public interface ResourceDao extends Mapper<Resource> {

   List<Resource> list(@Param("userId") String userId);

   Integer findIdByUrl(@Param("url")String url, @Param("method")String method);

   boolean ifAuthExist(@Param("userId")int userId, @Param("resourceId")int resourceId);

}
