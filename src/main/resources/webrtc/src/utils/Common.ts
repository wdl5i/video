declare var $;

/**
 * 公用类库
 */
export class Common {
    public static logstatus = true;

    /**
     * 生成唯一ID 标识
     * @returns {string}
     */
    static clientID() {
        var clientID = '';
        for (var _i = 0; _i < 4; _i++) {
            clientID += Math.ceil(Math.random() * 100000);
        }
        return clientID;
    }

    /**
     * 日志
     * @param msg
     */
    static log(...msg) {
        if (this.logstatus) {
            console.log(msg)
        }
    }

    /**
     * 异步请求
     * @param param
     * @param {string} url
     * @param success
     * @param error
     */
    static ajax(param, url: string, success, error = null) {
        $.ajax({
            type: "POST",
            timeout: 3000,
            url: url,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            async: false,
            data: JSON.stringify(param),
            success: success,
            error: error
        })
    }
}