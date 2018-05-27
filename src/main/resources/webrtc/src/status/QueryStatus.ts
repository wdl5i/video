import {Common} from "../utils/Common";
import {ParamConfig} from "./ParamConfig";

declare var md5;

/**
 * 查询设备状态协议
 */
export class QueryStatus {
    private username = 'caiqianmeng';
    private password = 'xmcloudsuperuser';
    private token = '';
    private token_expire = 0;
    private token_expire_time = 25000;
    private clientID;


    constructor() {
        this.clientID = Common.clientID();
    }

    /**
     * 查询设备状态
     * 1.接口鉴权 login->auth->token
     * @param uuids
     * @param success 成功回调
     */
    status(uuids, success, error) {
        var _this = this;
        Common.log('token-->', _this.token)
        Common.log('token_expire-->', _this.token_expire)
        if (_this.token == null || _this.token == '' || new Date().getTime() - _this.token_expire > _this.token_expire_time) {
            _this.getToken(function (data) {
                _this.statusExecute(uuids, success, error)
            });
        } else {
            _this.statusExecute(uuids, success, error)
        }
    }

    /**
     * 状态请求
     * @param uuids
     */
    private statusExecute(uuids, success, error) {
        var param = ParamConfig.queryStatus(this.clientID, this.token, uuids)
        this.ajax(param, success, error)
    }

    /**
     * 获取token
     * @param success 成功回调
     */
    private getToken(success) {
        var _this = this;
        _this.login(function (data) {
            var nonce = data.result.nonce;
            var pass = md5.base64(nonce + _this.password);
            _this.auth(_this.username, pass, function (data) {
                _this.token = data.result.token;
                _this.token_expire = new Date().getTime();
                success(data);
            })
        })
    }

    /**
     * 登录获取 nonce
     * @param success 成功回调
     */
    public login(success) {
        var param = ParamConfig.login(this.clientID, this.username)
        this.ajax(param, success)
    }

    /**
     * 请求鉴权获取 token
     * @param username 用户名
     * @param pass 密码
     * @param success 成功回调
     */
    auth(username, pass, success) {
        var param = ParamConfig.auth(this.clientID, username, pass)
        this.ajax(param, success)
    }

    /**
     * 异步请求
     * @param param
     * @param success
     */
    ajax(param, success,error=null) {
        // var url = 'http://10.2.5.51:9355/xmcloud/service';
        var url = 'http://xmcloud.xmsecu.com:9355/xmcloud/service'
        Common.ajax(param, url, success,error);
    }
}

