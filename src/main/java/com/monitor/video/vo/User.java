package com.monitor.video.vo;

import javax.persistence.Table;

@Table(name = "user")
public class User extends BaseEntity{


    private String password;
    private String sex;
    private int phone;

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public int getPhone() {
        return phone;
    }

    public void setPhone(int phone) {
        this.phone = phone;
    }



    //
//    @Override
//    public int getId() {
//        return id;
//    }
//
//    @Override
//    public void setId(int id) {
//        this.id = id;
//    }
//
//    @Override
//    public String getName() {
//        return name;
//    }
//
//    @Override
//    public void setName(String name) {
//        this.name = name;
//    }
//
//    @Override
//    public int getStatus() {
//        return status;
//    }
//
//    @Override
//    public void setStatus(int status) {
//        this.status = status;
//    }
}
