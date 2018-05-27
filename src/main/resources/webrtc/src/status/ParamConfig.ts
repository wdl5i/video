/**
 * 请求参数配置类
 */
export class ParamConfig {
    static login(id: string, usernam: string) {
        return {
            "id": id,
            "jsonrpc": "2.0",
            "method": "xmcloud/service/login",
            "params": {
                "username": usernam
            }
        }
    }

    static auth(id: string, username: string, pass: string) {
        return {
            "id": id,
            "jsonrpc": "2.0",
            "method": "xmcloud/service/login",
            "params": {
                "username": username,
                "password": pass
            }
        }
    }

    static queryStatus(id: string, token: string, uuids: any) {
        return {
            "id": id,
            "jsonrpc": "2.0",
            "token": token,
            "method": "xmcloud/service/status/query",
            "params": uuids
        }
    }
}