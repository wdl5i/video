/**
 * ajax 实现的信令交互
 */
import {Heartbeat} from "./Heartbeat";
import {Common} from "../utils/Common";
import {ParamConfig} from "./ParamConfig";
import {Signalling} from "./Signalling";

export class AjaxWebRtc extends Signalling {
    /*变量定义*/
    private heartbeat;// 心跳检测，获取设备sdp、iceCandidate


    constructor(sn: string, serverIp: string, serverPort: number) {
        super(sn, serverIp, serverPort);
        this.url = 'http://' + this.serverIp + ':' + this.serverPort
        this.heartbeat = new Heartbeat(this.url)
    }

    /**
     * 初始化
     */
    init() {
        Common.log('AjaxWebRtc init')
        var that = this;
        that.coturn(function (data) {
            var RTCAccessProtocol = data.RTCAccessProtocol
            if (RTCAccessProtocol.Header.ErrorNum == '200') {
                that.peerConnection = that.createRTCPeerConnection();
                that.createDataChannel(that.peerConnection);
                that.sendOffer(that.peerConnection);
                that.iceCandidate(that.peerConnection);
                that.addStream(that.peerConnection);
            }
        })
    }

    /**
     * coturn(开源的iceserver)
     * @param success 成功回调
     */
    coturn(success) {
        var param = ParamConfig.coturn(this.clientID, this.sn)
        this.ajax(param, success)
    }

    createOfferSuccessCallback(pc: RTCPeerConnection) {
        var that = this;
        var sdp = pc.localDescription.sdp;
        Common.log('sendOfferSuccessCallback', sdp)
        //发送sdp 到信令服务器
        var param = ParamConfig.sdpOffer(that.clientID, that.sn, sdp)
        that.ajax(param, function (data) {
            Common.log('heartbeat startAnswer')
            var rtcAccessProtocol = data.RTCAccessProtocol;
            var errno = rtcAccessProtocol.Body.errno;
            if (errno == null) {
                that.heartbeat.startAnswer(that.sn, that.clientID, pc)
                that.heartbeat.startIceCandidate(that.sn, that.clientID, pc)
            } else {
                Common.log("device: ", that.sn, ' offline', ' errno:', errno);
            }
        })


    }

    sendOfferFailureCallback(peerConnection: RTCPeerConnection, error: DOMError) {
        Common.log('sendOfferFailureCallback', error)
    }


    iceCandidateSuccessCallback(peerConnection: RTCPeerConnection, data: RTCPeerConnectionIceEvent) {
        var that = this;
        Common.log('iceCandidateSuccessCallback', data)
        var param = ParamConfig.iceCandidate(that.clientID, that.sn, data);
        that.ajax(param, function (data) {
            Common.log('heartbeat startIceCandidate')
            // that.heartbeat.startIceCandidate(that.sn, that.clientID, peerConnection)
        })
    }


    /**
     * 异步请求
     * @param param
     * @param success
     */
    ajax(param, success) {
        Common.ajax(param, this.url, success);
    }
}
