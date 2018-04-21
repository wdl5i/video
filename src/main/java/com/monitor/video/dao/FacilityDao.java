package com.monitor.video.dao;

import com.monitor.video.vo.Facility;
import org.springframework.stereotype.Repository;
import tk.mybatis.mapper.common.Mapper;

/**
 * Created by donglin.wang on 2017/4/20.
 */
@Repository
public interface FacilityDao extends Mapper<Facility> {

}
