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
            console.log('denglu');
            let params = {
                userName:'wang',
                pwd:'donglin'
            }
            vm.getData(url,'POST',params,function(data){
                console.log(data);
            },function(err){
                console.log(err);
            })
        }
    },
}
var Home = {
    template: '#home'
}

/* 定义路由 */
var routes = [
    {path:"/login",component:Login},
    {path:"/home",component:Home}
]

/* 创建路由器 */
var router = new VueRouter({
    routes
})

/* 创建vue根实例 */
var vm = new Vue({
    router,
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