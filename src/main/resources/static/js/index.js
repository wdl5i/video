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
            let psd = $("input[name='pwd']").val();
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
            })
        }
    },
}
var Home = {
    template: '#home',
    data:function(){
        let userInfo = JSON.parse(localStorage.getItem("userInfo")); //取出登录用户信息
        if(userInfo == {} || userInfo == null){
            console.log('not login');

        }else{
            console.log('user',userInfo);
            return userInfo;
        }
    }
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
        getData: function (url, method, param, doneHandler, failHandler) {
            if (url) {
                $.ajax({
                    url: url,
                    type: method || "GET",
                    data: param || "",
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
}).$mount("#app")