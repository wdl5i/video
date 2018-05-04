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
                    console.log('登录成功',vm);
                    router.push({path:'/home'}); //登录成功跳转至主页
                    //设置用户信息的本地存储
                    localStorage.setItem("userToken",JSON.stringify(data.content.token));
                    //设置用户菜单权限的本地存储
                    localStorage.setItem("menuAuth",(data.content.licensed).join(","));
                    //设置用户ID的本地存储
                    localStorage.setItem("userId",(data.content.userId).toString());
                }else{
                    console.log('用户不存在');
                }
            },function(err){
                console.log(err);
            },false,false)
        },
        
    },
}
var Home = {
    template: '#home',
    data:function(){
        let isUserManageShow = false, isFacilityManageShow = false, isGroupManageShow = false;
        let userId = 0;
        return {
            activeIndex: '1',
            isUserManageShow,
            isFacilityManageShow,
            isGroupManageShow,
            userId
        }
    },
    methods:{
        handleSelect(key, keyPath) {
            console.log('keyPath',key, keyPath);
        },
    },
    mounted:function(){
        let _this = this;
        Vue.nextTick(function(){
            let userToken = JSON.parse(localStorage.getItem("userToken")); //取出登录用户信息
            if(userToken == null){
                console.log('not login');
                router.push({path:'/login'}); //无缓存登录信息，跳转回登录页
            }else{
                console.log('mounted',userToken,vm);
                vm.token = userToken;
                let menuAuth = (localStorage.getItem("menuAuth")).split(",");
                if(menuAuth.indexOf('用户管理') !== -1){
                    _this.isUserManageShow = true;
                }
                if(menuAuth.indexOf('设备管理') !== -1){
                    _this.isFacilityManageShow = true;
                }
                if(menuAuth.indexOf('设备组管理') !== -1){
                    _this.isGroupManageShow = true;
                }

                let userId = parseInt(localStorage.getItem("userId"));
                if(userId == null){
                    console.log('userid 不存在');
                }else{
                    _this.userId = userId;
                }
            };
            
        })
    }
}
// 用户管理
var userManage = {
    template: '#userManage',
    data:function(){
        let userList = [], currentUserId = null;
        let groupList;
        let isUserManageAddShow = false, isUserManageDelShow = false ,isUserManageUpdateShow = false;
        let userInfo = {
            userName:'name',
            password:'123456',
            sex:'女',
            phone:'13488888888'
        };
        return {
            userList,
            currentUserId,
            userInfo,
            dialogFormVisible: false,
            formLabelWidth: '120px',
            groupList,
            loading:true,
            isUserAdd:true,
            isUserManageAddShow,
            isUserManageDelShow,
            isUserManageUpdateShow
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
                                userGroupList:[],
                                checkGroupList:[]
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
        getAllGrpList:function(userId){
            let _this = this;
            let getGroupUrl = '/group/page/1/10000';
            let params = {

            };
            vm.getData(getGroupUrl,'POST',JSON.stringify(params), function(data){
                console.log(data);
                if(data.content){
                    //_this.groupList = data.content.list;
                    $.each(_this.userList,function(i){
                        if(_this.userList[i].id == userId){
                            _this.userList[i].userGroupList = data.content.list;
                            console.log('userGroupList',_this.userList[i].userGroupList);
                        }
                    })
                    
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
                            _this.userList[i].checkGroupList = [];
                            $.each(data.content,function(k){
                                _this.userList[i].checkGroupList.push(data.content[k].id);
                            })
                            console.log('checkGroupList', _this.userList[i].checkGroupList);
                        }
                    })
                }
            },function(err){
                console.log(err);
            },true,true)
        },
        showThisGrpId:function(userId,groupId,ischecked){
            if($(".el-checkbox input[type='checkbox'][name='groupCheckbox'][value='"+groupId+"']").is(':checked') == true){
                console.log('选中');
                let addUserGroupUrl = '/group/userGroup/'+userId+'/'+groupId;
                let params = {};
                vm.getData(addUserGroupUrl,'POST',JSON.stringify(params), function(data){
                    console.log(data);
                },function(err){
                    console.log(err);
                },true,true)
            }else{
                console.log('未选中');
                let deleteUserGroupUrl = '/group/userGroup/'+userId+'/'+groupId;
                let params = {};
                vm.getData(deleteUserGroupUrl,'DELETE',JSON.stringify(params), function(data){
                    console.log(data);
                },function(err){
                    console.log(err);
                },true,true)
            }
            //console.log('绑定的checkGroupList',this.checkGroupList);
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
                    _this.$message({
                        type: 'success',
                        message: '用户添加成功!'
                      });
                    _this.getUserList(1,20);
                }else{
                    console.log('用户添加失败');
                    _this.$message.error("用户添加失败");
                }
            },function(err){
                console.log(err);
            },true,true)
        },
        userUpdate:function(userId,user){
            console.log(userId,user);
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
                    _this.$message({
                        type: 'success',
                        message: '用户修改成功!'
                      });
                    _this.getUserList(1,20);
                }else{
                    console.log('用户修改失败');
                    _this.$message.error("用户修改失败");
                }
            },function(err){
                console.log(err);
            },true,true)
        },
        userDelete:function(userId){
            this.$confirm('即将删除该用户及其所有数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                let _this = this;
                let deleteUrl = '/user/'+userId;
                let params = {
                    
                }
                vm.getData(deleteUrl,'DELETE',params,function(data){
                    console.log(data);
                    if(data.message == 'OK'){
                        console.log('用户删除成功');
                        _this.$message({
                            type: 'success',
                            message: '用户删除成功!'
                          });
                        _this.getUserList(1,20);
                    }else{
                        console.log('用户删除失败');
                        _this.$message.error("用户删除失败");
                    }
                },function(err){
                    console.log(err);
                },true,true)
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消删除'
                });          
            });
            
        }
    },
    mounted:function(){
        let _this = this;
        Vue.nextTick(function(){
            let userToken = JSON.parse(localStorage.getItem("userToken")); //取出登录用户信息
            if(userToken == null){
                console.log('not login');
                router.push({path:'/login'}); //无缓存登录信息，跳转回登录页
            }else{
                console.log('mounted',userToken,vm);
                vm.token = userToken;
                let menuAuth = (localStorage.getItem("menuAuth")).split(",");
                if(menuAuth.indexOf('添加用户') !== -1){
                    _this.isUserManageAddShow = true;
                }
                if(menuAuth.indexOf('删除用户') !== -1){
                    _this.isUserManageDelShow = true;
                }
                if(menuAuth.indexOf('修改用户') !== -1){
                    _this.isUserManageUpdateShow = true;
                }
            };
            
        })
        
    }
}
// 设备管理
var facilityManage = {
    template: '#facilityManage',
    data:function(){
        let facilityList = [], currentFacilityId = null;
        let isFacilityManageAddShow =false, isFacilityManageDelShow = false, isFacilityManageUpdateShow = false;
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
            facilityInfo,
            isFacilityManageAddShow,
            isFacilityManageDelShow,
            isFacilityManageUpdateShow
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
    },
    mounted:function(){
        let _this = this;
        Vue.nextTick(function(){
            let userToken = JSON.parse(localStorage.getItem("userToken")); //取出登录用户信息
            if(userToken == null){
                console.log('not login');
                router.push({path:'/login'}); //无缓存登录信息，跳转回登录页
            }else{
                console.log('mounted',userToken,vm);
                vm.token = userToken;
                let menuAuth = (localStorage.getItem("menuAuth")).split(",");
                if(menuAuth.indexOf('添加设备') !== -1){
                    _this.isFacilityManageAddShow = true;
                }
                if(menuAuth.indexOf('删除设备') !== -1){
                    _this.isFacilityManageDelShow = true;
                }
                if(menuAuth.indexOf('修改设备') !== -1){
                    _this.isFacilityManageUpdateShow = true;
                }
            };
            
        })
        
    }
}
// 设备组管理
var groupManage = {
    template: '#groupManage',
    data:function(){
        let groupList = [], currentGroupId = null;
        let facilityList;
        let isGroupManageAddShow =false, isGroupManageDelShow = false, isGroupManageUpdateShow = false;
        let groupInfo = {
            name:''
        };
        return {
            groupList,
            currentGroupId,
            groupInfo,
            facilityList,
            dialogFormVisible: false,
            formLabelWidth: '120px',
            loading:true,
            isGroupAdd:true,
            isGroupManageAddShow,
            isGroupManageDelShow,
            isGroupManageUpdateShow
        }
    },
    methods:{
        //设备增删改查
        getGroupList:function(pageNum, pageSize){
            // console.log("this",this);
            let _this = this;
            let getGroupUrl = '/group/page/'+pageNum+'/'+pageSize;
            let params = {
                // 'name':'wang'
            };
            vm.getData(getGroupUrl,'POST',JSON.stringify(params), function(data){
                console.log(data);
                if(data.content){
                    let contentList = data.content.list;
                    if(contentList.length !== 0){
                        _this.groupList = [];
                        $.each(contentList,function(i){
                            _this.groupList.push({
                                id:contentList[i].id,
                                name:contentList[i].name,
                                orderNum:contentList[i].orderNum,
                                status:contentList[i].status,
                                groupFacilityList:[],
                                checkFacilityList:[]
                            })
                        })
                        console.log("group data",_this.groupList);
                    }
                }else{
                    console.log("no group data");
                }
            },function(err){
                console.log(err);
            },true,true)
        },
        getAllFacilityList:function(groupId){
            let _this = this;
            let getFacilityUrl = '/facility/page/1/10000';
            let params = {

            };
            vm.getData(getFacilityUrl,'POST',JSON.stringify(params), function(data){
                console.log(data);
                if(data.content){
                    $.each(_this.groupList,function(i){
                        if(_this.groupList[i].id == groupId){
                            _this.groupList[i].groupFacilityList = data.content.list;
                            console.log('groupFacilityList',_this.groupList[i].groupFacilityList);
                        }
                    })
                }else{
                    console.log("no group data");
                }
            },function(err){
                console.log(err);
            },true,true)
        },
        getGroupFacilities:function(groupId,groupFacilityList){
            let _this = this;
            let groupFacilityUrl = '/group/groupFacilities/'+groupId;
            vm.getData(groupFacilityUrl,'GET','', function(data){
                console.log(data);
                if(data.message == 'OK' && data.content.length !== 0){
                    $.each(_this.groupList,function(i){
                        if(_this.groupList[i].id == groupId){
                            _this.groupList[i].checkFacilityList = [];
                            $.each(data.content,function(k){
                                _this.groupList[i].checkFacilityList.push(data.content[k].id);
                            })
                            console.log('checkFacilityList', _this.groupList[i].checkFacilityList);
                        }
                    })
                }
            },function(err){
                console.log(err);
            },true,true)
        },
        showThisfacilityId:function(groupId,facilityId,ischecked){
            if($(".el-checkbox input[type='checkbox'][name='facilityCheckbox'][value='"+facilityId+"']").is(':checked') == true){
                console.log('选中');
                let addGroupFacilityUrl = '/group/groupFacilities/'+groupId+'/'+facilityId;
                let params = {};
                vm.getData(addGroupFacilityUrl,'POST',JSON.stringify(params), function(data){
                    console.log(data);
                },function(err){
                    console.log(err);
                },true,true)
            }else{
                console.log('未选中');
                let deleteGroupFacilityUrl = '/group/groupFacilities/'+groupId+'/'+facilityId;
                let params = {};
                vm.getData(deleteGroupFacilityUrl,'DELETE',JSON.stringify(params), function(data){
                    console.log(data);
                },function(err){
                    console.log(err);
                },true,true)
            }
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
                    _this.$message({
                        type: 'success',
                        message: '设备组添加成功!'
                      });
                    _this.getGroupList(1,20);
                }else{
                    console.log('设备组添加失败');
                    _this.$message.error("设备组添加失败");
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
                    _this.$message({
                        type: 'success',
                        message: '设备组修改成功!'
                      });
                    _this.getGroupList(1,20);
                }else{
                    console.log('设备组修改失败');
                    _this.$message.error("设备组修改失败");
                }
            },function(err){
                console.log(err);
            },true,true)
        },
        groupDelete:function(groupId){
            this.$confirm('即将删除该设备组及其所有数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                let _this = this;
                let deleteUrl = '/group/'+groupId;
                let params = {
                    
                }
                vm.getData(deleteUrl,'DELETE',params,function(data){
                    console.log(data);
                    if(data.message == 'OK'){
                        console.log('设备组删除成功');
                        _this.$message({
                            type: 'success',
                            message: '设备组删除成功!'
                        });
                        _this.getGroupList(1,20);
                    }else{
                        console.log('设备组删除失败');
                        _this.$message.error("设备组删除失败");
                    }
                },function(err){
                    console.log(err);
                },true,true)
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消删除'
                });          
              });
        }
    },
    mounted:function(){
        let _this = this;
        Vue.nextTick(function(){
            let userToken = JSON.parse(localStorage.getItem("userToken")); //取出登录用户信息
            if(userToken == null){
                console.log('not login');
                router.push({path:'/login'}); //无缓存登录信息，跳转回登录页
            }else{
                console.log('mounted',userToken,vm);
                vm.token = userToken;
                let menuAuth = (localStorage.getItem("menuAuth")).split(",");
                if(menuAuth.indexOf('添加组') !== -1){
                    _this.isGroupManageAddShow = true;
                }
                if(menuAuth.indexOf('删除组') !== -1){
                    _this.isGroupManageDelShow = true;
                }
                if(menuAuth.indexOf('修改组') !== -1){
                    _this.isGroupManageUpdateShow = true;
                }
            };
            
        })
        
    }
}
var auth = {
    template:'#auth',
    data:function(){
        let TreeData = [];
        let checkData = [];
        let authUserList = [];
        let currentAuthUserId;
        let lastCheckedData = [];
        let currentUserId = 0;
        return {
            TreeData,
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            checkData,
            showTree:false,
            authUserList,
            currentAuthUserId,
            lastCheckedData,
            currentUserId
        }
    },
    methods:{
        //获取可授权的用户列表
        getAuthUserList:function(pageNum,pageSize){
            let _this = this;
            let getUserUrl = '/user/page/'+pageNum+'/'+pageSize;
            let params = {
                
            };
            vm.getData(getUserUrl,'POST',JSON.stringify(params), function(data){
                console.log(data);
                if(data.content){
                    let contentList = data.content.list;
                    if(contentList.length !== 0){
                        _this.authUserList = [];
                        $.each(contentList,function(i){
                            if(contentList[i].id == _this.currentUserId){
                                console.log('过滤自己Id',contentList[i].id);
                            }else{
                                _this.authUserList.push({
                                    id:contentList[i].id,
                                    name:contentList[i].name
                                })
                            }
                        })
                        console.log("user data",_this.authUserList);
                    }
                    
                }else{
                    console.log("no user data");
                }
            },function(err){
                console.log(err);
            },true,true)
        },
        //获取所有树型菜单数据
        getMenuTree:function(){
            let _this = this;
            let getTreeUrl = '/auth/page/1/10000';
            let params = {
               
            };
            vm.getData(getTreeUrl,'POST',JSON.stringify(params), function(data){
                console.log(data);
                if(data.message == 'OK' && data.content !== null){
                    _this.TreeData = [];
                    let treeList = data.content.list;
                    $.each(treeList,function(i){
                        let parentId = treeList[i].id;
                        if(!(treeList[i].hasOwnProperty('parentId'))){
                            _this.TreeData.push({
                                id: treeList[i].id,
                                label: treeList[i].name,
                                children: []
                            })
                        }
                        $.each(treeList,function(k){
                            if(treeList[k].parentId == parentId){
                                setTimeout(function(){
                                    $.each(_this.TreeData,function(j){
                                        if(_this.TreeData[j].id == parentId){
                                            _this.TreeData[j].children.push({
                                                id: treeList[k].id,
                                                label: treeList[k].name,
                                                parentId:treeList[k].parentId
                                            })
                                        }
                                    })
                                },1)
                            }
                        })
                    })
                    console.log('_this.TreeData',_this.TreeData);
                }else{
                    console.log('获取菜单失败');
                    _this.$message.error("获取菜单树失败");
                }
            },function(err){
                console.log(err);
            },true,true)
        },
        getUserTree:function(userId){
            let _this = this;
            _this.currentAuthUserId = userId;
            let getUserTreeUrl = '/auth/list/'+userId;
            let params = {};
            vm.getData(getUserTreeUrl,'GET',params, function(data){
                console.log(data);
                if(data.message == 'OK' && data.content !== null){
                    _this.checkData = [];
                    $.each(data.content,function(i){
                        _this.checkData.push(data.content[i].id);
                    })
                    console.log('绑定选中id数组',_this.checkData);
                    _this.$refs.tree.setCheckedKeys(_this.checkData,false);
                    console.log('整个树种选中keys',_this.$refs.tree.getCheckedKeys());
                    _this.lastCheckedData = _this.$refs.tree.getCheckedKeys();
                }else{
                    console.log('获取用户菜单失败');
                    _this.$message.error("获取用户菜单树失败");
                }
            },function(err){
                console.log(err);
            },true,true)
        },
        checkChange:function(data, checkedObj){
            //console.log(data, checkedObj);
            let _this = this;
            let checked = true;
            console.log('当前节点ID',data.id,'lastchecked',_this.lastCheckedData);
            let menuId = data.id;
            //判断‘上次选中数据中是否含有当前节点ID’
            if((_this.lastCheckedData).indexOf(menuId) == -1){
                checked = true;
            }else{
                checked = false;
            };
            //将checkedKey存入‘上次选中数据’
            _this.lastCheckedData = checkedObj.checkedKeys;
            let authUrl = '/auth/'+ parseInt(_this.currentAuthUserId) + '/' + parseInt(menuId);
            let params = {};
            //使用严格父子不关联方式 判断当前节点类型
            if(data.hasOwnProperty('children')){
                //当前为父节点
                if(checked == true){
                    //选中，发送POST请求
                    vm.getData(authUrl,'POST',JSON.stringify(params), function(data){
                        console.log(data);
                        if(data.message == 'OK'){
                            console.log('父节点授权成功');
                        }else{
                            console.log('父节点授权失败');
                            _this.$message.error("授权失败");
                        }
                    },function(err){
                        console.log(err);
                    },true,true)
                }else{
                    //未选中，发送DELETE请求
                    vm.getData(authUrl,'DELETE',params, function(data){
                        console.log(data);
                        if(data.message == 'OK'){
                            console.log('父节点取消授权成功');
                        }else{
                            console.log('父节点取消授权失败');
                            _this.$message.error("授权失败");
                        }
                    },function(err){
                        console.log(err);
                    },true,true);

                    //console.log(_this.$refs.tree.getNode(menuId));
                    let currentNode = _this.$refs.tree.getNode(menuId).childNodes;
                    //_this.$refs.tree.setCheckedKeys(menuId)
                    $.each(currentNode,function(i){
                        if(currentNode[i].checked){
                            console.log('有选中的子节点',currentNode[i].data.id);
                            _this.$refs.tree.setChecked(currentNode[i].data.id,false);
                            let childrenAuthUrl = '/auth/' + parseInt(_this.currentAuthUserId) + '/' + parseInt(currentNode[i].data.id);
                            vm.getData(childrenAuthUrl,'DELETE',params, function(data){
                                console.log(data);
                                if(data.message == 'OK'){
                                    console.log('子节点取消授权成功');
                                }else{
                                    console.log('子节点取消授权失败');
                                    _this.$message.error("授权失败");
                                }
                            },function(err){
                                console.log(err);
                            },true,true);
                        }
                    })
                }
            }else{
                //当前为子节点
                if(checked == true){
                    //选中，并且找到父节点设置选中
                    let parentId = this.$refs.tree.getNode(menuId).parent.data.id;
                    console.log("parentId",parentId);
                    //发送子节点授权请求
                    vm.getData(authUrl,'POST',JSON.stringify(params), function(data){
                        console.log(data);
                        if(data.message == 'OK'){
                            console.log('子节点授权成功');
                        }else{
                            console.log('子节点授权成功');
                            _this.$message.error("授权失败");
                        }
                    },function(err){
                        console.log(err);
                    },true,true)
                    //发送父节点授权请求
                    this.$refs.tree.setChecked(parentId,true);
                    let parentAuthUrl = '/auth/' + parseInt(_this.currentAuthUserId) + '/' + parseInt(parentId);
                    vm.getData(parentAuthUrl,'POST',JSON.stringify(params), function(data){
                        console.log(data);
                        if(data.message == 'OK'){
                            console.log('父节点授权成功');
                        }else{
                            console.log('父节点授权成功');
                            _this.$message.error("授权失败");
                        }
                    },function(err){
                        console.log(err);
                    },true,true)
                }else{
                    //未选中
                    vm.getData(authUrl,'DELETE',params, function(data){
                        console.log(data);
                        if(data.message == 'OK'){
                            console.log('取消授权成功');
                        }else{
                            console.log('取消授权成功');
                            _this.$message.error("授权失败");
                        }
                    },function(err){
                        console.log(err);
                    },true,true)
                }
            }
        }
    },
    mounted:function(){
        let _this = this;
        Vue.nextTick(function(){
            let userToken = JSON.parse(localStorage.getItem("userToken")); //取出登录用户信息
            if(userToken == null){
                console.log('not login');
                router.push({path:'/login'}); //无缓存登录信息，跳转回登录页
            }else{
                console.log('mounted',userToken,vm);
                vm.token = userToken;
                let userId = (localStorage.getItem("userId"));
                if(userId == null){
                    console.log('userId 不存在');
                }else{
                    _this.currentUserId = userId;
                }
            };
            
        })
        
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
            },{
                path:'auth',
                component:auth
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
        token:'',
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