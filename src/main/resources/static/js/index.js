/*  Created by huangx on 2018/4/18. */

/* 创建路由组件 */
var Login = {
    template: '#login',
    data:function(){
        return {
            userInfo:{
                name:'',
                id:''
            },
            username:'admin'
        }
    },
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
                    localStorage.setItem("userInfo",JSON.stringify(data.content));
                }else{
                    console.log('用户不存在');
                }
            },function(err){
                console.log(err);
            },'','')
        }
    },
}
var Home = {
    template: '#home',
    data:function(){
        let userInfo = {};
        let userList = [];
        userInfo.token = JSON.parse(localStorage.getItem("userInfo")); //取出登录用户信息
        if(userInfo.token == null){
            console.log('not login');
            router.push({path:'/login'}); //无缓存登录信息，跳转回登录页
        }else{
            console.log('user',userInfo);
        };
        return {
            userInfo:userInfo,
            userList:userList
        }
    },
    methods:{
        //用户增删改查
        getUserList:function(pageNum, pageSize){
            // console.log("this",this);
            let _this = this;
            let getUserUrl = '/user/page?'+pageNum+'&'+pageSize;
            let params = {
                // pageNum:parseInt(pageNum),
                // pageSize:parseInt(pageSize),
                'name':'wang'
            };
            vm.getData(getUserUrl,'GET',params, function(data){
                console.log(data);
                if(data.content){
                    _this.userList = data.content.list;
                    // console.log("user data",this.userList);
                }else{
                    console.log("no user data");
                }
            },function(err){
                console.log(err);
            },{'auth':this.userInfo.token})
        },
        userAdd:function(){
            let addUrl = '/user'
            let params = {
                "name":$("input[name='addName']").val(),
                "password":$("input[name='addPsd']").val(),
                "sex":$("input[name='sex']").val(),
                "phone":$("input[name='phone']").val()
            }
            vm.getData(addUrl,'POST',params,function(data){
                console.log(data);
            },function(err){
                console.log(err);
            },{'auth':this.userInfo.token})
        },
        userUpdate:function(){
            let updateUrl = '/user'
            let params = {
                "name":$("input[name='addName']").val(),
                "password":$("input[name='addPsd']").val(),
                "sex":$("input[name='sex']").val(),
                "phone":$("input[name='phone']").val()
            }
            vm.getData(updateUrl,'PUT',params,function(data){
                console.log(data);
            },function(err){
                console.log(err);
            },{'auth':this.userInfo.token})
        },
        userDelete:function(){
            let deleteUrl = '/user'
            let params = {
                "name":$("input[name='addName']").val(),
                "password":$("input[name='addPsd']").val(),
                "sex":$("input[name='sex']").val(),
                "phone":$("input[name='phone']").val()
            }
            vm.getData(deleteUrl,'DELETE',params,function(data){
                console.log(data);
            },function(err){
                console.log(err);
            },{'auth':this.userInfo.token})
        }
    },
}
var userManage = {
    template: '#userManage'
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
        chidren:[
            {
                path:'userManage',
                component:userManage
            }
        ]
    },
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
    router,
    data:{
        
    },
    methods:{
        //获取数据的统一函数
        getData: function (url, method, param, doneHandler, failHandler, headerObj, isJson) {
            if (url) {
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