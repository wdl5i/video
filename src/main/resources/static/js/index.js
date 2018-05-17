/*  Created by huangx on 2018/4/18. */

/* 创建路由组件 */
var Login = {
    template: '#login',
    data(){
        return {
            userLogin:{
                userName:'',
                password:''
            },
            rules: {
                userName: [
                  { required: true, message: '请输入用户名称', trigger: 'blur' },
                ],
                password: [
                  { required: true, message: '请输入用户密码', trigger: 'blur' },
                ]
            }
        }
    },
    methods:{
        login:function(formName){
            
            let _this = this;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let loginUrl = '/user/login';
                    let params = {
                        userName:this.userLogin.userName,
                        password:this.userLogin.password
                    }
                    vm.getData(loginUrl,'POST',params,function(data){
                        console.log(data);
                        if(data.message == 'OK'){
                            console.log('登录成功',vm);
                            router.push({path:'/home/facilityManage'}); //登录成功跳转至主页
                            //设置用户信息的本地存储
                            localStorage.setItem("userToken",JSON.stringify(data.content.token));
                            //设置用户菜单权限的本地存储
                            localStorage.setItem("menuAuth",(data.content.licensed).join(","));
                            //设置用户ID的本地存储
                            localStorage.setItem("userId",(data.content.userId).toString());
                            //设置用户ID的本地存储
                            localStorage.setItem("loginUserName",(data.content.userName).toString());
                        }else{
                            console.log('用户不存在');
                            _this.$message.error('用户不存在或者密码错误');
                        }
                    },function(err){
                        console.log(err);
                    },false,false) 
                } else {
                  return false;
                }
            }); 
        },
        
    },
}
var Home = {
    template: '#home',
    data:function(){
        return {
            activeIndex: '',
            tabs:[],
            defaultIndex1:'groupManage',
            defaultIndex2:'userManage',
            defaultOpeneds:['groupManage'],
            userId:0,
            userName:'admin',
            showSidebar:'',
            systemManageList:[
                {
                    name:'用户管理',
                    index:'userManage',
                    icon: 'el-icon-tickets',
                    isShow:false,
                    path:'/home/userManage'
                },
                {
                    name:'用户授权',
                    index:'auth',
                    icon: 'el-icon-edit-outline',
                    isShow:false,
                    path:'/home/auth'
                }
            ],
            facilityManageList:[
                {
                    name:'设备列表',
                    index:'facilityManage',
                    icon: 'el-icon-document',
                    isShow:false,
                    path:'/home/facilityManage'
                },{
                    name:'设备组列表',
                    index:'groupManage',
                    icon: 'el-icon-menu',
                    isShow:false,
                    path:'/home/groupManage',
                    subs:[]
                }
            ]
        }
    },
    computed:{
        username(){
            let username = localStorage.getItem('loginUserName');
            return username ? username : this.userName;
        },
        onRoutes(){
            console.log('path',this.$route.path);
            return (this.$route.path.split('/'))[2];
        }
    },
    methods:{
        // 用户名下拉菜单选择事件
        handleCommand(command) {
            if(command == 'loginout'){
                localStorage.removeItem('userToken')
                router.push({path:'/login'});
            }
        },
        handleSelect(key, keyPath) {
            console.log('keyPath',key, keyPath);
            this.activeIndex = key;  
        },
        openhandle(key, keyPath){
            router.push({path:`/home/${key}`});
        },
        closehandle(key, keyPath){
            router.push({path:`/home/${key}`});
        },
        goSystem(){
            this.showSidebar = 'system';
            this.defaultIndex2 = 'userManage';
            router.push({path:'/home/userManage'});
        },
        goFacility(){
            this.showSidebar = 'facility';
            this.defaultIndex1 = 'groupManage';
            router.push({path:'/home/facilityManage'});
        },
        //获取设备组列表
        getGroupList:function(){
            // console.log("this",this);
            let _this = this;
            let getGroupUrl = '/group/page/1/10000';
            let params = {};
            vm.getData(getGroupUrl,'POST',JSON.stringify(params), function(data){
                console.log('home group Data',data);
                if(data.content){
                    let contentList = data.content.list;
                    if(contentList.length !== 0){
                        _this.facilityManageList[1].subs = [];
                        $.each(contentList,function(i){
                            _this.facilityManageList[1].subs.push({
                                name:contentList[i].name,
                                id:contentList[i].id,
                                index:'facility/'+contentList[i].id,
                                path:'/home/groupManage',
                            })
                        })
                    }
                }else{
                    console.log("no group data");
                }
            },function(err){
                console.log(err);
            },true,true)
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
                vm.token = userToken;
                let menuAuth = (localStorage.getItem("menuAuth")).split(",");
                _this.getGroupList();
                if(menuAuth.indexOf('用户管理') !== -1){
                    _this.systemManageList[0].isShow = true;
                }
                if(menuAuth.indexOf('权限管理') !== -1){
                    _this.systemManageList[1].isShow = true;
                }
                if(menuAuth.indexOf('设备管理') !== -1){
                    _this.facilityManageList[0].isShow = true;
                }
                if(menuAuth.indexOf('设备组管理') !== -1){
                    _this.facilityManageList[1].isShow = true;
                }

                let userId = parseInt(localStorage.getItem("userId"));
                if(userId == null){
                    console.log('userid 不存在');
                }else{
                    _this.userId = userId;
                }
            };
            let path = _this.$route.path;
            let routeMsg = [
                {
                    path:'/home/userManage',
                    parentIndex:'2',
                    Sidebar:'system'
                },
                {
                    path:'/home/auth',
                    parentIndex:'2',
                    Sidebar:'system',
                },
                {
                    path:'/home/facilityManage',
                    parentIndex:'1',
                    Sidebar:'facility',
                },
                {
                    path:'/home/groupManage',
                    parentIndex:'1',
                    Sidebar:'facility',
                },
                {
                    path:'/home/facility',
                    parentIndex:'1',
                    Sidebar:'facility',
                },
            ]
            //console.log('path',path);
            $.each(routeMsg,function(i){
                let str = new RegExp(routeMsg[i].path);
                if(str.test(path)){
                    console.log('匹配为',path);
                    _this.activeIndex = routeMsg[i].parentIndex;
                    _this.showSidebar = routeMsg[i].Sidebar;
                }
            })
        })
    }
}

// 用户管理
var userManage = {
    template: '#userManage',
    data:function(){
        //手机号码验证规则
        let checkPhone = (rule, value, callback) => {
            let phoneReg=/^[1][3,4,5,7,8][0-9]{9}$/;
            if (!value) {
              return callback(new Error('手机号码不能为空'));
            } else {
              return callback();
            }
            setTimeout(() => {
              if (!phoneReg.test(value)) {
                callback(new Error('请输入正确的手机号码'));
              } else {
                return callback()
              }
            }, 1000);
        };
        return {
            userList:[],
            currentUserId:null,
            userInfo:{
                userName:'',
                password:'',
                sex:'女',
                phone:''
            },
            dialogFormVisible: false,
            dialogGrpFormVisible:false,
            formLabelWidth: '120px',
            GroupList:[],
            checkGroupList:[],
            loading:true,
            isUserAdd:true,
            isUserManageAddShow:false,
            isUserManageDelShow:false,
            isUserManageUpdateShow:false,
            isUserGroupOption:false,
            currentPage:1,
            currentSize:10,
            total:0,
            rules: {
                userName: [
                  { required: true, message: '请输入用户名称', trigger: 'blur' },
                ],
                password: [
                  { required: true, message: '请输入用户密码', trigger: 'blur' },
                  { min: 6, message: '密码长度至少6位', trigger: 'blur' }
                ],
                phone: [
                  { validator: checkPhone, trigger: 'blur' }
                ]
            },
            activeName:'userManage',
            tabs:[
                {
                    title:'用户列表',
                    id:'userManage'
                }
            ]
        }
    },
    methods:{
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.currentSize = val;
            this.getUserList(this.currentPage,val);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.currentPage = val;
            this.getUserList(val,this.currentSize);
        },
        handleClick(tab, event) {
            console.log(tab, event);
            router.push({path:`/home/${tab.name}`});
        },
        //用户增删改查
        getUserList:function(pageNum, pageSize){
            let _this = this;
            let getUserUrl = '/user/page/'+pageNum+'/'+pageSize;
            let params = {};
            vm.getData(getUserUrl,'POST',JSON.stringify(params), function(data){
                console.log(data);
                if(data.content){
                    _this.total = data.content.count;
                    _this.currentPage = data.content.pageNo;
                    let contentList = data.content.list;
                    if(contentList.length !== 0){
                        _this.userList = [];
                        $.each(contentList,function(i){
                            _this.userList.push({
                                id:contentList[i].id,
                                name:contentList[i].name,
                                password:contentList[i].password,
                                sex:contentList[i].sex,
                                phone:contentList[i].phone
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
        getAllGrpList:function(){
            let _this = this;
            let getGroupUrl = '/group/page/1/10000';
            let params = {

            };
            vm.getData(getGroupUrl,'POST',JSON.stringify(params), function(data){
                console.log(data);
                if(data.content){
                    _this.GroupList = data.content.list;   
                }else{
                    console.log("no user data");
                }
            },function(err){
                console.log(err);
            },true,true)
        },
        getUserGroup:function(userId){
            let _this = this;
            _this.currentUserId = userId;
            let userGroupUrl = '/group/userGroups/'+userId;
            vm.getData(userGroupUrl,'GET','', function(data){
                console.log(data);
                _this.checkGroupList = [];
                if(data.message == 'OK' && data.content.length !== 0){
                    $.each(data.content,function(k){
                        _this.checkGroupList.push(data.content[k].id);
                    })
                }
            },function(err){
                console.log(err);
            },true,true)
        },
        showThisGrpId:function(groupId,ischecked){
            let _this= this;
            if($(".el-checkbox input[type='checkbox'][name='groupCheckbox'][value='"+groupId+"']").is(':checked') == true){
                console.log('选中');
                let addUserGroupUrl = '/group/userGroups/'+_this.currentUserId+'/'+groupId;
                let params = {};
                vm.getData(addUserGroupUrl,'POST',JSON.stringify(params), function(data){
                    console.log(data);
                },function(err){
                    console.log(err);
                },true,true)
            }else{
                console.log('未选中');
                let deleteUserGroupUrl = '/group/userGroups/'+_this.currentUserId+'/'+groupId;
                let params = {};
                vm.getData(deleteUserGroupUrl,'DELETE',JSON.stringify(params), function(data){
                    console.log(data);
                },function(err){
                    console.log(err);
                },true,true)
            }
            //console.log('绑定的checkGroupList',this.checkGroupList);
        },
        userAdd:function(formName){
            let _this = this;
            _this.$refs[formName].validate((valid) => {
                if (valid) {
                    _this.dialogFormVisible = false;
                    let addUrl = '/user';
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
                            _this.getUserList(_this.currentPage,_this.currentSize);
                        }else{
                            console.log('用户添加失败');
                            _this.$message.error("用户添加失败");
                        }
                    },function(err){
                        console.log(err);
                    },true,true)
                } else {
                  return false;
                }
            }); 
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
        comfirmUpdate:function(formName){
            let _this = this;
            _this.$refs[formName].validate((valid) => {
                if (valid) {
                    _this.dialogFormVisible = false;
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
                            _this.getUserList(_this.currentPage,_this.currentSize);
                        }else{
                            console.log('用户修改失败');
                            _this.$message.error("用户修改失败");
                        }
                    },function(err){
                        console.log(err);
                    },true,true)
                } else {
                  return false;
                }
            }); 
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
                        _this.getUserList(_this.currentPage,_this.currentSize);
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
                if(menuAuth.indexOf('用户管理') !== -1){
                    _this.getUserList(_this.currentPage,_this.currentSize);
                    _this.getAllGrpList();
                }else{
                    $(".mainContainer").html('<h2>无权限</h2>').css({"color":"#666"});
                }
                if(menuAuth.indexOf('添加用户') !== -1){
                    _this.isUserManageAddShow = true;
                }
                if(menuAuth.indexOf('删除用户') !== -1){
                    _this.isUserManageDelShow = true;
                }
                if(menuAuth.indexOf('修改用户') !== -1){
                    _this.isUserManageUpdateShow = true;
                }
                if(menuAuth.indexOf('绑定用户设备组') !== -1){
                    _this.isUserGroupOption = true;
                }
            };
            
        })
    }
}
// 设备管理
var facilityManage = {
    template: '#facilityManage',
    data:function(){
        //设备相关验证规则
        let checkSerial = (rule, value, callback) => {
            //let serialReg=/^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/;
            if (!value) {
              return callback(new Error('请输入Serial'));
            } else {
                return callback();
            }
            // setTimeout(() => {
            //   if (!serialReg.test(value)) {
            //     callback(new Error('请输入正确的Serial'));
            //   } else {
            //     return callback();
            //   }
            // }, 100);
        };
        return {
            facilityList:[],
            currentFacilityId:null,
            facilityInfo:{
                name:'',
                userName:'',
                password:'',
                type:1,
                serial:'',
                type:1,
                orderNum:1
            },
            dialogFormVisible: false,
            dialogMonitorVisible:false,
            formLabelWidth: '120px',
            loading:true,
            isFacilityAdd:true,
            isFacilityManageAddShow:false,
            isFacilityManageDelShow:false,
            isFacilityManageUpdateShow:false,
            currentPage:1,
            currentSize:10,
            total:0,
            isFull:true,
            cssObj:{},
            options:[
                {
                    label:'类型1',
                    value:1
                },
                {
                    label:'类型2',
                    value:2
                },
                {
                    label:'类型3',
                    value:3
                }
            ],
            rules: {
                name: [
                  { required: true, message: '请输入设备名称', trigger: 'blur' },
                ],
                userName: [
                  { required: true, message: '请输入设备用户名称', trigger: 'blur' }
                ],
                password: [
                  { required: true, message: '请输入设备用户密码', trigger: 'blur' }
                ],
                serial: [
                  { required: true, validator: checkSerial, trigger: 'blur' }
                ],
                type: [
                    { required: true, message: '请选择设备类型', trigger: 'blur' }
                ]
            },
            activeName:'facilityManage',
            tabs:[
                {
                    title:'设备列表',
                    id:'facilityManage'
                }
            ]
        }
    },
    methods:{
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.currentSize = val;
            this.getFacilityList(this.currentPage,val);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.currentPage = val;
            this.getFacilityList(val,this.currentSize);
        },
        handleClick(tab, event) {
            //console.log(tab, event);
            router.push({path:`/home/${tab.name}`});
        },
        optionChange(val){
            console.log(`选中了: ${val}`);
        },
        goMonitor(){
            this.dialogMonitorVisible = true;
        },
        goFull(){
            this.isFull = false;
            let windowWidth = $(window).width();
            let windowHeight = $(window).height();
            console.log('window',windowWidth,windowHeight);
            this.cssObj.width = $(".videoBox").css('width');
            this.cssObj.height = $(".videoBox").css('height');
            this.cssObj.position = $(".videoBox").css('position');
            this.cssObj.top = $(".videoBox").css('top');
            this.cssObj.left = $(".videoBox").css('left');
            this.cssObj.zindex = $(".videoBox").css('z-index');
            this.cssObj.margintop = $(".videoBox").css('margin-top');
            
            $(".videoBox").css({
                "width":windowWidth,
                "height":windowHeight,
                "position":'fixed',
                "top":"0",
                "left":"0",
                "z-index":1000,
                "margin-top":'0'
            });
            $("video").css({
                "height":windowHeight-26,
            })

        },
        backFull(){
            this.isFull = true;
            $(".videoBox").css({
                "width":this.cssObj.width,
                "height":this.cssObj.height,
                "position":this.cssObj.position,
                "top":this.cssObj.top,
                "left":this.cssObj.left,
                "z-index":this.cssObj.zindex,
                "margin-top":this.cssObj.margintop
            });
            $("video").css({
                "height":600,
            })
        },
        //设备增删改查
        getFacilityList:function(pageNum, pageSize){
            let _this = this;
            let getFacilityUrl = '/facility/page/'+pageNum+'/'+pageSize;
            let params = {};
            vm.getData(getFacilityUrl,'POST',JSON.stringify(params), function(data){
                console.log(data);
                if(data.content){
                    _this.total = data.content.count;
                    _this.currentPage = data.content.pageNo;
                    _this.facilityList = data.content.list;
                }else{
                    console.log("no user data");
                }
            },function(err){
                console.log(err);
            },true,true)
        },
        facilityAdd:function(formName){
            let _this = this;
            _this.$refs[formName].validate((valid) => {
                if (valid) {
                    _this.dialogFormVisible = false;
                    let addUrl = '/facility'
                    let params = {
                        "name":this.facilityInfo.name,
                        "userName":this.facilityInfo.userName,
                        "password":this.facilityInfo.password,
                        "type":this.facilityInfo.type,
                        "serial":this.facilityInfo.serial,
                        "type":this.facilityInfo.type,
                        "orderNum":this.facilityInfo.orderNum,
                    }
                    vm.getData(addUrl,'POST',JSON.stringify(params),function(data){
                        console.log(data);
                        if(data.message == 'OK'){
                            console.log('设备添加成功');
                            _this.$message({
                                type: 'success',
                                message: '设备添加成功!'
                            });
                            _this.getFacilityList(_this.currentPage,_this.currentSize);
                        }else{
                            console.log('设备添加失败');
                            _this.$message.error("设备添加失败");
                        }
                    },function(err){
                        console.log(err);
                    },true,true)
                } else {
                  console.log('验证未通过');
                  return false;
                }
            }); 
        },
        facilityUpdate:function(facilityId,facility){
            console.log('facility',facility);
            this.currentFacilityId = facilityId;
            //默认填入修改设备信息
            this.facilityInfo.name = facility.name;
            this.facilityInfo.userName = facility.userName;
            this.facilityInfo.password = facility.password;
            this.facilityInfo.serial = facility.serial;
            this.facilityInfo.type = facility.type;
            this.facilityInfo.orderNum = facility.orderNum;
        },
        facilityComfirmUpdate:function(formName){
            let _this = this;
            _this.$refs[formName].validate((valid) => {
                if (valid) {
                    _this.dialogFormVisible = false;
                    let updateUrl = '/facility'
                    let params = {
                        "id":this.currentFacilityId,
                        "name":this.facilityInfo.name,
                        "userName":this.facilityInfo.userName,
                        "password":this.facilityInfo.password,
                        "type":this.facilityInfo.type,
                        "serial":this.facilityInfo.serial,
                        "type":this.facilityInfo.type,
                        "orderNum":this.facilityInfo.orderNum,
                    }
                    vm.getData(updateUrl,'PUT',JSON.stringify(params),function(data){
                        console.log(data);
                        if(data.message == 'OK'){
                            console.log('设备修改成功');
                            _this.$message({
                                type: 'success',
                                message: '设备修改成功!'
                            });
                            _this.getFacilityList(_this.currentPage,_this.currentSize);
                        }else{
                            console.log('设备修改失败');
                            _this.$message.error("设备修改失败");
                        }
                    },function(err){
                        console.log(err);
                    },true,true)
                } else {
                  console.log('验证未通过');
                  return false;
                }
            }); 
        },
        facilityDelete:function(facilityId){
            this.$confirm('即将删除该设备及其所有数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                let _this = this;
                let deleteUrl = '/facility/'+facilityId;
                let params = {
                    
                }
                vm.getData(deleteUrl,'DELETE',params,function(data){
                    console.log(data);
                    if(data.message == 'OK'){
                        console.log('设备删除成功');
                        _this.$message({
                            type: 'success',
                            message: '设备删除成功!'
                        });
                        _this.getFacilityList(_this.currentPage,_this.currentSize);
                    }else{
                        console.log('设备删除失败');
                        _this.$message.error("设备删除失败");
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
                if(menuAuth.indexOf('设备管理') !== -1){
                    _this.getFacilityList(_this.currentPage,_this.currentSize);
                }else{
                    $(".mainContainer").html('<h2>无权限</h2>').css({"color":"#666"});
                }
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
        return {
            groupList:[],
            currentGroupId:null,
            groupInfo:{
                name:'',
                orderNum:1
            },
            FacilityList:[],
            dialogFormVisible: false,
            dialogFacilityFormVisible:false,
            formLabelWidth: '120px',
            loading:true,
            isGroupAdd:true,
            isGroupManageAddShow:false,
            isGroupManageDelShow:false,
            isGroupManageUpdateShow:false,
            isGroupFacilityOption:false,
            checkFacilityList:[],
            currentPage:1,
            total:0,
            currentSize:10,
            rules: {
                name: [
                  { required: true, message: '请输入设备组名称', trigger: 'blur' },
                ]
            },
            activeName:'groupManage',
            tabs:[
                {
                    title:'设备组列表',
                    id:'groupManage'
                }
            ]
        }
    },
    methods:{
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.currentSize = val;
            this.getGroupList(this.currentPage,val);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.currentPage = val;
            this.getGroupList(val,this.currentSize);
        },
        handleClick(tab, event) {
            //console.log(tab, event);
            router.push({path:`/home/${tab.name}`});
        },
        //设备组增删改查
        getGroupList:function(pageNum, pageSize){
            // console.log("this",this);
            let _this = this;
            let getGroupUrl = '/group/page/'+pageNum+'/'+pageSize;
            let params = {};
            vm.getData(getGroupUrl,'POST',JSON.stringify(params), function(data){
                console.log(data);
                if(data.content){
                    _this.total = data.content.count;
                    _this.currentPage = data.content.pageNo;
                    let contentList = data.content.list;
                    if(contentList.length !== 0){
                        _this.groupList = [];
                        $.each(contentList,function(i){
                            _this.groupList.push({
                                id:contentList[i].id,
                                name:contentList[i].name,
                                orderNum:contentList[i].orderNum,
                                status:contentList[i].status
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
        getAllFacilityList:function(){
            let _this = this;
            let getFacilityUrl = '/facility/page/1/10000';
            let params = {

            };
            vm.getData(getFacilityUrl,'POST',JSON.stringify(params), function(data){
                console.log(data);
                if(data.content){
                    _this.FacilityList = data.content.list;
                }else{
                    console.log("no group data");
                }
            },function(err){
                console.log(err);
            },true,true)
        },
        getGroupFacilities:function(groupId){
            let _this = this;
            _this.currentGroupId = groupId;
            let groupFacilityUrl = '/group/groupFacilities/'+groupId;
            vm.getData(groupFacilityUrl,'GET','', function(data){
                console.log(data);
                _this.checkFacilityList = [];
                if(data.message == 'OK' && data.content.length !== 0){
                    $.each(data.content,function(k){
                        _this.checkFacilityList.push(data.content[k].id);
                    })
                }
            },function(err){
                console.log(err);
            },true,true)
        },
        showThisfacilityId:function(facilityId,ischecked){
            let _this = this;
            if($(".el-checkbox input[type='checkbox'][name='facilityCheckbox'][value='"+facilityId+"']").is(':checked') == true){
                console.log('选中');
                let addGroupFacilityUrl = '/group/groupFacilities/'+ _this.currentGroupId+'/'+facilityId;
                let params = {};
                vm.getData(addGroupFacilityUrl,'POST',JSON.stringify(params), function(data){
                    console.log(data);
                },function(err){
                    console.log(err);
                },true,true)
            }else{
                console.log('未选中');
                let deleteGroupFacilityUrl = '/group/groupFacilities/'+ _this.currentGroupId+'/'+facilityId;
                let params = {};
                vm.getData(deleteGroupFacilityUrl,'DELETE',JSON.stringify(params), function(data){
                    console.log(data);
                },function(err){
                    console.log(err);
                },true,true)
            }
        },
        groupAdd:function(formName){
            let _this = this;
            _this.$refs[formName].validate((valid) => {
                if (valid) {
                    _this.dialogFormVisible = false;
                    let addUrl = '/group'
                    let params = {
                        "name":this.groupInfo.name,
                        "orderNum":this.groupInfo.orderNum
                    }
                    vm.getData(addUrl,'POST',JSON.stringify(params),function(data){
                        console.log(data);
                        if(data.message == 'OK'){
                            console.log('设备组添加成功');
                            _this.$message({
                                type: 'success',
                                message: '设备组添加成功!'
                            });
                            _this.getGroupList(_this.currentPage,_this.currentSize);
                        }else{
                            console.log('设备组添加失败');
                            _this.$message.error("设备组添加失败");
                        }
                    },function(err){
                        console.log(err);
                    },true,true)
                } else {
                  console.log('验证未通过');
                  return false;
                }
            });
        },
        groupUpdate:function(groupId,group){
            this.currentGroupId = groupId;
            //默认填入修改用户信息
            this.groupInfo.name = group.name;
            this.groupInfo.orderNum = group.orderNum;
        },
        groupComfirmUpdate:function(formName){
            let _this = this;
            _this.$refs[formName].validate((valid) => {
                if (valid) {
                    _this.dialogFormVisible = false;
                    let updateUrl = '/group'
                    let params = {
                        "id":this.currentGroupId,
                        "name":this.groupInfo.name,
                        "orderNum":this.groupInfo.orderNum
                    }
                    vm.getData(updateUrl,'PUT',JSON.stringify(params),function(data){
                        console.log(data);
                        if(data.message == 'OK'){
                            console.log('设备组修改成功');
                            _this.$message({
                                type: 'success',
                                message: '设备组修改成功!'
                            });
                            _this.getGroupList(_this.currentPage,_this.currentSize);
                        }else{
                            console.log('设备组修改失败');
                            _this.$message.error("设备组修改失败");
                        }
                    },function(err){
                        console.log(err);
                    },true,true)
                } else {
                  console.log('验证未通过');
                  return false;
                }
            }); 
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
                        _this.getGroupList(_this.currentPage,_this.currentSize);
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
                if(menuAuth.indexOf('绑定设备组与设备') !== -1){
                    _this.isGroupFacilityOption = true;
                }
            };
            _this.getGroupList(_this.currentPage,_this.currentSize);
            _this.getAllFacilityList();
        })
        
    }
}

var auth = {
    template:'#auth',
    data:function(){
        return {
            TreeData:[],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            checkData:[],
            dialogFormVisible: false,
            authUserList:[],
            currentAuthUserId:null,
            lastCheckedData:[],
            currentUserId:0,
            currentPage:1,
            currentSize:10,
            total:0,
            activeName:'auth',
            tabs:[
                {
                    title:'用户授权',
                    id:'auth'
                }
            ]
        }
    },
    methods:{
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.currentSize = val;
            this.getAuthUserList(this.currentPage,val);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.currentPage = val;
            this.getAuthUserList(val,this.currentSize);
        },
        handleClick(tab, event) {
            //console.log(tab, event);
            router.push({path:`/home/${tab.name}`});
        },
        //获取可授权的用户列表
        getAuthUserList:function(pageNum,pageSize){
            let _this = this;
            let getUserUrl = '/user/page/'+pageNum+'/'+pageSize;
            let params = {};
            vm.getData(getUserUrl,'POST',JSON.stringify(params), function(data){
                console.log(data);
                if(data.content){
                    _this.total = data.content.count;
                    _this.currentPage = data.content.pageNo;
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
            _this.getAuthUserList(_this.currentPage,_this.currentSize);
            _this.getMenuTree();
        })
        
    }
}
 var groupFacility = {
     template:'#groupFacility',
     data(){

        
         return {
            groupId:null,
            groupFacilityList:[],
            AllFacilityList:[],
         }
     },
     methods:{
        getThisFacilities:function(groupId){
            let _this = this;
            let groupFacilityUrl = '/group/groupFacilities/'+groupId;
            vm.getData(groupFacilityUrl,'GET','', function(data){
                console.log(data);
                if(data.message == 'OK' && data.content.length !== 0){
                    _this.groupFacilityList = data.content;
                }
            },function(err){
                console.log(err);
            },true,true)
        },
        getAllFacilityList:function(){
            let _this = this;
            let getFacilityUrl = '/facility/page/1/10000';
            let params = {};
            vm.getData(getFacilityUrl,'POST',JSON.stringify(params), function(data){
                console.log(data);
                if(data.content){
                    _this.AllFacilityList = data.content.list;
                }else{
                    console.log("no facility data");
                }
            },function(err){
                console.log(err);
            },true,true)
        },
        handleClose(tag) {
            console.log('tag',tag);
            let _this = this;
            let thisfacilityId = (tag.id).toString();

            let deleteGroupFacilityUrl = '/group/groupFacilities/'+ _this.groupId +'/'+thisfacilityId;
            let params = {};
            vm.getData(deleteGroupFacilityUrl,'DELETE',JSON.stringify(params), function(data){
                console.log(data);
                if(data.message == 'OK'){
                    _this.getThisFacilities(_this.groupId);
                }else{
                    _this.$message.error("删除失败");
                }
            },function(err){
                console.log(err);
            },true,true)
        },
        addThisTag:function(tagId){
            console.log('tagId',tagId);
            let _this = this;
            let hasThisId = false;
            let facilityids = [];
            $.each(_this.groupFacilityList,function(i){
                facilityids.push(_this.groupFacilityList[i].id);
            })
            if(facilityids.indexOf(tagId) !== -1){
                _this.$message({
                    message: '该设备已添加',
                    type: 'warning'
                });
            }else{
                let addGroupFacilityUrl = '/group/groupFacilities/'+ _this.groupId +'/'+tagId;
                let params = {};
                vm.getData(addGroupFacilityUrl,'POST',JSON.stringify(params), function(data){
                    console.log(data);
                    if(data.message == 'OK'){
                        _this.getThisFacilities(_this.groupId);
                    }else{
                        _this.$message.error("添加失败");
                    }
                },function(err){
                    console.log(err);
                },true,true)
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

                let params = _this.$route.params.id;
                _this.getAllFacilityList();
                _this.getThisFacilities(parseInt(params));
                _this.groupId = parseInt(params);
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
                component:groupManage,
            },{
                path:'facility/:id',
                component:groupFacility,
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
    }
}).$mount("#app")