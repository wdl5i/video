import {QueryStatus} from "./status/QueryStatus";
import {AjaxWebRtc} from "./webrtc/AjaxWebRtc";
import {WebSocketWebRtc} from "./webrtc/WebSocketWebRtc";
import {Common} from "./utils/Common";

/**
 * web rtc. 包含查询设备状态(寻址)、webrtc ajax 信令交互方式、webrtc websocket 信令交互方式
 * 简明流程：
 *     1.通过设备序列号，查询设备状态，获取设备是否在线：在线（信令服务ip，信令服务port）
 *     2.向信令服务交换消息实现网络穿透，建立p2p
 *     3.建立wetrtc(p2p)后，建立数据通道，传递接受数据
 * @author mrava
 * @date 2018-1-2
 * @version 1.0
 */

declare var window

window.XmWebRtc = class {
    private statusObj: QueryStatus;


    constructor() {
        this.statusObj = new QueryStatus();

    }

    /**
     * 日志控制
     * @param b
     */
    static log(b) {
        Common.logstatus = b;
    }

    /**
     * 查询设备状态
     * @param {object} uuid
     * @param success
     * @param error
     */
    queryStatus(uuid: object, success, error) {
        this.statusObj.status(uuid, success, error)
    }

    /**
     * 局域网WebRtc
     */
    initLocalHostWebRtc() {
        //TODO 待定实现
    }

    /**
     * ajax 外网WebRtc
     * @param {string} sn
     * @param {string} ip
     * @param {number} port
     * @returns {AjaxWebRtc}
     */
    initAjaxWebRtc(sn: string, ip: string, port: number) {
        var ajaxWebRtc = new AjaxWebRtc(sn, ip, port);
        ajaxWebRtc.init();
        return ajaxWebRtc;
    }

    /**
     * WebSocket 外网WebRtc
     * @param {string} sn
     * @param {string} ip
     * @param {number} port
     * @returns {WebSocketWebRtc}
     */
    // initWebSocketWebRtc(sn: string, ip: string, port: number) {
    //     //TODO 待定实现
    //     return new WebSocketWebRtc(sn, ip, port);
    // }
}
