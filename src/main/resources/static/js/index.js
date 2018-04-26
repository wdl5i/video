/*  Created by huangx on 2018/4/18. */

/* 创建路由组件 */
var Login = {
    template: '#login',
    methods:{
        login:function(url){
            let user = $("input[name='userName']").val();
            let psd = $("input[name='password']").val();
            let params = {
                userName:user,
                password:psd
            }
            vm.getData(url,'POST',params,function(data){
                console.log(data);
                if(data.message == 'OK'){
                    console.log('登录成功');
                    router.push({path:'/home'}); //登录成功跳转至主页
                    //设置用户信息的本地存储
                    localStorage.setItem("userToken",JSON.stringify(data.content));
                }else{
                    console.log('用户不存在');
                }
            },function(err){
                console.log(err);
            },false,false)
        }
    },
}
var Home = {
    template: '#home',
    data:function(){
        return {
            activeIndex: '1'
        }
    },
    methods:{
        handleSelect(key, keyPath) {
            console.log('keyPath',key, keyPath);
        },
    },
    mounted:function(){
        Vue.nextTick(function(){
            let userToken = JSON.parse(localStorage.getItem("userToken")); //取出登录用户信息
            if(userToken == null){
                console.log('not login');
                router.push({path:'/login'}); //无缓存登录信息，跳转回登录页
            }else{
                console.log('mounted',userToken,vm);
                vm.token = userToken;
            };
        })
        
    }
}
// 用户管理
var userManage = {
    template: '#userManage',
    data:function(){
        let userList = [], currentUserId = null;
        let userInfo = {
            userName:'name',
            password:'123456',
            sex:'女',
            phone:'13488888888'
        };
        return {
            userList,
            currentUserId,
            userInfo
        }
    },
    methods:{
        //用户增删改查
        getUserList:function(pageNum, pageSize){
            // console.log("this",this);
            let _this = this;
            let getUserUrl = '/user/page/'+pageNum+'/'+pageSize;
            let params = {
                // pageNum:parseInt(pageNum),
                // pageSize:parseInt(pageSize),
                // 'name':'wang'
            };
            vm.getData(getUserUrl,'POST',JSON.stringify(params), function(data){
                console.log(data);
                if(data.content){
                    let contentList = data.content.list;
                    if(contentList.length !== 0){
                        _this.userList = [];
                        $.each(contentList,function(i){
                            _this.userList.push({
                                id:contentList[i].id,
                                name:contentList[i].name,
                                password:contentList[i].password,
                                sex:contentList[i].sex,
                                phone:contentList[i].phone,
                                userGroupList:[]
                            })
                        })
                        // _this.userList = data.content.list;
                        console.log("user data",_this.userList);
                    }
                    
                }else{
                    console.log("no user data");
                }
            },function(err){
                console.log(err);
            },true,true)
        },
        getUserGroup:function(userId,userGroupList){
            let _this = this;
            let userGroupUrl = '/group/userGroups/'+userId;
            vm.getData(userGroupUrl,'GET','', function(data){
                console.log(data);
                if(data.message == 'OK' && data.content.length !== 0){
                    $.each(_this.userList,function(i){
                        if(_this.userList[i].id == userId){
                            _this.userList[i].userGroupList = data.content;
                        }
                    })
                }
                console.log('userGroupList',userGroupList);
            },function(err){
                console.log(err);
            },true,true)
        },
        userAdd:function(){
            let _this = this;
            let addUrl = '/user'
            let params = {
                "name":this.userInfo.userName,
                "password":this.userInfo.password,
                "sex":this.userInfo.sex,
                "phone":this.userInfo.phone
            }
            vm.getData(addUrl,'POST',JSON.stringify(params),function(data){
                console.log(data);
                if(data.message == 'OK'){
                    console.log('用户添加成功');
                    _this.getUserList(1,20);
                }else{
                    console.log('用户添加失败');
                }
            },function(err){
                console.log(err);
            },true,true)
        },
        userUpdate:function(userId,user){
            console.log(userId,user);
            $("#comfirmUpdate").css({'display':'block'});
            this.currentUserId = userId;
            //默认填入修改用户信息
            this.userInfo.userName = user.name;
            this.userInfo.password = user.password;
            this.userInfo.sex = user.sex;
            this.userInfo.phone = user.phone;
        },
        comfirmUpdate:function(){
            let _this = this;
            console.log("id",this.currentUserId);
            let updateUrl = '/user'
            let params = {
                "id":this.currentUserId,
                "name":this.userInfo.userName,
                "password":this.userInfo.password,
                "sex":this.userInfo.sex,
                "phone":this.userInfo.phone
            }
            vm.getData(updateUrl,'PUT',JSON.stringify(params),function(data){
                console.log(data);
                if(data.message == 'OK'){
                    console.log('用户修改成功');
                    _this.getUserList(1,20);
                }else{
                    console.log('用户修改失败');
                }
            },function(err){
                console.log(err);
            },true,true)
        },
        userDelete:function(userId){
            let _this = this;
            let deleteUrl = '/user/'+userId;
            let params = {
                
            }
            vm.getData(deleteUrl,'DELETE',params,function(data){
                console.log(data);
                if(data.message == 'OK'){
                    console.log('用户删除成功');
                    _this.getUserList(1,20);
                }else{
                    console.log('用户删除失败');
                }
            },function(err){
                console.log(err);
            },true,true)
        }
    }
}

var facilityManage = {
    template: '#facilityManage',
    data:function(){
        let facilityList = [], currentFacilityId = null;
        let facilityInfo = {
            name:'',
            ipAddr:'',
            port:'',
            type:1,
            serial:''
        }
        return {
            facilityList,
            currentFacilityId,
            facilityInfo
        }
    },
    methods:{
        //设备增删改查
        getFacilityList:function(pageNum, pageSize){
            //console.log('string',this.serial)
            // console.log("this",this);
            let _this = this;
            let getFacilityUrl = '/facility/page/'+pageNum+'/'+pageSize;
            let params = {
                // pageNum:parseInt(pageNum),
                // pageSize:parseInt(pageSize),
                // 'name':'wang'
            };
            vm.getData(getFacilityUrl,'POST',JSON.stringify(params), function(data){
                console.log(data);
                if(data.content){
                    _this.facilityList = data.content.list;
                }else{
                    console.log("no user data");
                }
            },function(err){
                console.log(err);
            },true,true)
        },
        facilityAdd:function(){
            let _this = this;
            let addUrl = '/facility'
            let params = {
                "name":this.facilityInfo.name,
                "ipAddr":this.facilityInfo.ipAddr,
                "port":this.facilityInfo.port,
                "type":this.facilityInfo.type,
                "serial":this.facilityInfo.serial
            }
            vm.getData(addUrl,'POST',JSON.stringify(params),function(data){
                console.log(data);
                if(data.message == 'OK'){
                    console.log('设备添加成功');
                    _this.getFacilityList(1,20);
                }else{
                    console.log('设备添加失败');
                }
            },function(err){
                console.log(err);
            },true,true)
        },
        facilityUpdate:function(facilityId,facility){
            $("#facilityComfirmUpdate").css({'display':'block'});
            this.currentFacilityId = facilityId;
            //默认填入修改设备信息
            this.facilityInfo.name = facility.name;
            this.facilityInfo.ipAddr = facility.ipAddr;
            this.facilityInfo.port = facility.port;
            this.facilityInfo.serial = facility.serial;
        },
        facilityComfirmUpdate:function(){
            let _this = this;
            console.log("id",this.currentFacilityId);
            let updateUrl = '/facility'
            let params = {
                "id":this.currentFacilityId,
                "name":this.facilityInfo.name,
                "ipAddr":this.facilityInfo.ipAddr,
                "port":this.facilityInfo.port,
                "type":this.facilityInfo.type,
                "serial":this.facilityInfo.serial
            }
            vm.getData(updateUrl,'PUT',JSON.stringify(params),function(data){
                console.log(data);
                if(data.message == 'OK'){
                    console.log('设备修改成功');
                    _this.getFacilityList(1,20);
                }else{
                    console.log('设备修改失败');
                }
            },function(err){
                console.log(err);
            },true,true)
        },
        facilityDelete:function(facilityId){
            let _this = this;
            let deleteUrl = '/facility/'+facilityId;
            let params = {
                
            }
            vm.getData(deleteUrl,'DELETE',params,function(data){
                console.log(data);
                if(data.message == 'OK'){
                    console.log('设备删除成功');
                    _this.getFacilityList(1,20);
                }else{
                    console.log('设备删除失败');
                }
            },function(err){
                console.log(err);
            },true,true)
        }
    }
}

var groupManage = {
    template: '#groupManage',
    data:function(){
        let groupList = [], currentGroupId = null;
        let groupInfo = {
            name:''
        };
        return {
            groupList,
            currentGroupId,
            groupInfo
        }
    },
    methods:{
        //设备增删改查
        getGroupList:function(pageNum, pageSize){
            // console.log("this",this);
            let _this = this;
            let getGroupUrl = '/group/page/'+pageNum+'/'+pageSize;
            let params = {
                // pageNum:parseInt(pageNum),
                // pageSize:parseInt(pageSize),
                // 'name':'wang'
            };
            vm.getData(getGroupUrl,'POST',JSON.stringify(params), function(data){
                console.log(data);
                if(data.content){
                    _this.groupList = data.content.list;
                }else{
                    console.log("no user data");
                }
            },function(err){
                console.log(err);
            },true,true)
        },
        groupAdd:function(){
            let _this = this;
            let addUrl = '/group'
            let params = {
                "name":this.groupInfo.name
            }
            vm.getData(addUrl,'POST',JSON.stringify(params),function(data){
                console.log(data);
                if(data.message == 'OK'){
                    console.log('设备组添加成功');
                    _this.getGroupList(1,20);
                }else{
                    console.log('设备组添加失败');
                }
            },function(err){
                console.log(err);
            },true,true)
        },
        groupUpdate:function(groupId,group){
            $("#groupComfirmUpdate").css({'display':'block'});
            this.currentGroupId = groupId;
            //默认填入修改用户信息
            this.groupInfo.name = group.name;
        },
        groupComfirmUpdate:function(){
            console.log("id",this.currentGroupId);
            let _this = this;
            let updateUrl = '/group'
            let params = {
                "id":this.currentGroupId,
                "name":this.groupInfo.name
            }
            vm.getData(updateUrl,'PUT',JSON.stringify(params),function(data){
                console.log(data);
                if(data.message == 'OK'){
                    console.log('设备组修改成功');
                    _this.getGroupList(1,20);
                }else{
                    console.log('设备组修改失败');
                }
            },function(err){
                console.log(err);
            },true,true)
        },
        groupDelete:function(groupId){
            let _this = this;
            let deleteUrl = '/group/'+groupId;
            let params = {
                
            }
            vm.getData(deleteUrl,'DELETE',params,function(data){
                console.log(data);
                if(data.message == 'OK'){
                    console.log('设备组删除成功');
                    _this.getGroupList(1,20);
                }else{
                    console.log('设备组删除失败');
                }
            },function(err){
                console.log(err);
            },true,true)
        }
    }
}


/* 定义路由 */
var routes = [
    {
        path:"/login",
        component:Login
    },
    {
        path:"/home",
        component:Home,
        children:[
            {
                path:'userManage',
                component:userManage
            },{
                path:'facilityManage',
                component:facilityManage
            },{
                path:'groupManage',
                component:groupManage
            }
        ]
    },
    //重定向为登录页
    {
        path:"/",
        redirect:'/login'
    }
]

/* 创建路由器 */
var router = new VueRouter({
    routes
})

/* 创建vue根实例 */
var vm = new Vue({
    data:{
        token:''
    },
    router,
    methods:{
        //获取数据的统一函数
        getData: function (url, method, param, doneHandler, failHandler, hasToken, isJson) {
            if (url) {
                let headerObj = {};
                if(hasToken){
                    headerObj = {"auth":vm.token}
                }else{
                    headerObj = {} 
                }
                if(isJson){
                    $.ajax({
                        url: url,
                        type: method || "GET",
                        data: param || "",
                        contentType:"application/json",
                        headers:headerObj
                    }).done(function (data) {
                        if (doneHandler) {
                            doneHandler(data);
                        }
                    }).fail(function (err) {
                        if (failHandler) {
                            failHandler(err);
                        }
                    })
                }else{
                    $.ajax({
                        url: url,
                        type: method || "GET",
                        data: param || "",
                        headers:headerObj
                    }).done(function (data) {
                        if (doneHandler) {
                            doneHandler(data);
                        }
                    }).fail(function (err) {
                        if (failHandler) {
                            failHandler(err);
                        }
                    })
                }
            }
        }
    },
}).$mount("#app")