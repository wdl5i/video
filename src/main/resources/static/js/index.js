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
                    _this.userList = data.content.list;
                    // console.log("user data",this.userList);
                }else{
                    console.log("no user data");
                }
            },function(err){
                console.log(err);
            },true,true)
        },
        userAdd:function(){
            let addUrl = '/user'
            let params = {
                "name":this.userInfo.userName,
                "password":this.userInfo.password,
                "sex":this.userInfo.sex,
                "phone":this.userInfo.phone
            }
            vm.getData(addUrl,'POST',JSON.stringify(params),function(data){
                console.log(data);
            },function(err){
                console.log(err);
            },true,true)
        },
        userUpdate:function(userId,user){
            $("#comfirmUpdate").css({'display':'block'});
            this.currentUserId = userId;
            //默认填入修改用户信息
            this.userInfo.userName = user.name;
            this.userInfo.password = user.password;
            this.userInfo.sex = user.sex;
            this.userInfo.phone = user.phone;
        },
        comfirmUpdate:function(){
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
            },function(err){
                console.log(err);
            },true,true)
        },
        userDelete:function(userId){
            let deleteUrl = '/user/'+userId;
            let params = {
                
            }
            vm.getData(deleteUrl,'DELETE',params,function(data){
                console.log(data);
            },function(err){
                console.log(err);
            },true,true)
        }
    }
}

var facilityManage = {
    template: '#facilityManage',
    methods:{
    
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