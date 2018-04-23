package com.monitor.video.vo;

import javax.persistence.Table;

@Table(name = "grp")
public class Group extends BaseEntity {
    private String remark;
    private float orderNum;

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public float getOrderNum() {
        return orderNum;
    }

    public void setOrderNum(float orderNum) {
        this.orderNum = orderNum;
    }
}
