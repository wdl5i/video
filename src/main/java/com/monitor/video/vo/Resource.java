package com.monitor.video.vo;

public class Resource extends BaseEntity {

    public static final int TYPE_MENU = 0;
    public static final int TYPE_BUTTON = 1;

    private String url;
    private float orderNum;
    private int type;
    private String remark;
    private int parentId;

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public float getOrderNum() {
        return orderNum;
    }

    public void setOrderNum(float orderNum) {
        this.orderNum = orderNum;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public int getParentId() {
        return parentId;
    }

    public void setParentId(int parentId) {
        this.parentId = parentId;
    }
}
