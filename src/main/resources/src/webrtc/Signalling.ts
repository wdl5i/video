import {Common} from "../utils/Common";
import {netIP} from "./netip"

declare var RTCPeerConnection;
declare var $;


/**
 * 信令交互
 */
export abstract class Signalling {
    protected peerConnection;
    protected sn;//设备序列号
    protected clientID;//浏览器生成唯一标识
    protected serverIp;//交互服务器ip
    protected serverPort;//交互服务器端口
    protected url;//访问http url
    protected sendChannel;
    protected receiveChannel;
    protected netip;


    constructor(sn, serverIp, serverPort) {
        this.sn = sn;
        this.serverIp = serverIp;
        this.serverPort = serverPort;
        this.clientID = 'web_' + Common.clientID();
    }

    /**
     * 创建RTCPeerConnection
     * @returns {peerConnection}
     */
    createRTCPeerConnection() {
        // stun和turn服务器
        var iceServer = {
            "iceServers": [{
                "url": "stun:stun.l.google.com:19302"
            }, {
                "url": "turn:numb.viagenie.ca",
                "username": "webrtc@live.com",
                "credential": "muazkh"
            }]
        };
        var config = {
            optional: [
                {DtlsSrtpKeyAgreement: true}
            ]
        }
        var rtcPeerConnection = new RTCPeerConnection(null, config);
        Common.log('createRTCPeerConnection created:', rtcPeerConnection != null)
        return rtcPeerConnection
    }

    /**
     * 创建发送 sdp
     * @param {peerConnection} pc
     */
    sendOffer(pc: RTCPeerConnection) {
        var offerOption = {
            offerToReceiveAudio: 1,
            offerToReceiveVideo: 1
        };
        var that = this;
        pc.createOffer(function (offer) {
            pc.setLocalDescription(new RTCSessionDescription(offer));
            that.createOfferSuccessCallback(pc)
        }, function (data) {
            that.sendOfferFailureCallback(pc, data);
        }, offerOption);
    }

    /**
     * 发送 candidate
     * @param pc
     */
    iceCandidate(pc: RTCPeerConnection) {
        var that = this;
        pc.onicecandidate = function (event) {
            if (event.candidate) {
                // Send the candidate to the remote peer
                that.iceCandidateSuccessCallback(pc, event);
            } else {
                // All ICE candidates have been sent
            }
        }
    }

    addStream(pc: RTCPeerConnection) {
        pc.onaddstream = function (event) {
            Common.log("addstream ")
            var achan = parseInt(event.stream.id.substring(12));
            if (achan == 0) {
                $("#video")[0].srcObject = event.stream;
            }
        }
    }

    createDataChannel(pc) {
        var that = this;
        that.sendChannel = pc.createDataChannel("sendDataChannel");
        Common.log("create datachannel000000000")
        that.sendChannel.binaryType = "arraybuffer";
        that.sendChannel.onopen = () => that.onSendChannelOpen.apply(that);
        that.sendChannel.onclose = () => that.onSendChannelClose.apply(that);
        that.sendChannel.onmessage = (event) => that.onReceiveMessageCallback.apply(that, [event]);
        that.peerConnection.ondatachannel = (event) => {
            Common.log("ondatachannel");
            that.receiveChannel = event.channel;
            that.receiveChannel.binaryType = "arraybuffer";
            that.receiveChannel.onopen = () => that.onReceiveChannelStateChange.apply(that);
            that.receiveChannel.onclose = () => that.onReceiveChannelStateChange.apply(that);
            that.receiveChannel.onmessage = (event) => that.onReceiveMessageCallback.apply(that, [event]);
        };
    }

    onSendChannelOpen() {
        var that = this;
        Common.log("sendChannel open");
        that.netip = new netIP();
        //if(!that.isTalk){
        //window.g_netip = this.netip;
        //}
        that.netip.setDataChannel(that.sendChannel);
        var LoginData = {
            EncryptType: "NONE",
            LoginType: "DVRIP-Web",
            PassWord: "1",
            UserName: "admin"
        };
        that.netip.sendOverNetIP(LoginData, 1000);
    }

    onSendChannelClose() {
        var that = this;
        Common.log("sendChannel close");
        // if(!that.bManualCloseDC){//设备可能在升级
        //     console.log("detected disconnect!!!!!!!!");
        //     window.g_boffline = true;
        //     window.ReConnect();
        // }
    }

    onReceiveMessageCallback(event) {
        var that = this;
        Common.log("Received Message", event);
        var arr = new Uint8Array(event.data, 0, 20);
        var aMsgId = arr[14] + arr[15] * 256;
        if (aMsgId == 1001) {//登录回复
            var aSID = arr[4] + arr[5] * 256 + arr[6] * 65536 + arr[7] * 16777216;
            Common.log("--------aSID:", aSID);
            that.netip.setSID(aSID);
            that.netip.heartBeat();
            if (false) {//that.isTalk){
                //that.startOrStopTalkOverNetIP(that.netip, true);
            } else {
                //window.g_SetupAlarmChan();
                //setTimeout(window.MonitDigitalStatus, 100);
                //window.youtils.showLoading(false);
                that.startOrStopMonitorOverNetIP(true, 0, 1);
            }
        } else if (aMsgId == 1504) {//报警消息
            var arr2 = new Uint8Array(event.data, 20, event.data.byteLength - 22);
            var alarmInfoTxt = "";
            for (var i = 0; i < arr2.length; i++) {
                alarmInfoTxt += String.fromCharCode(arr2[i]);
            }
            var alarmInfo = JSON.parse(alarmInfoTxt);
            //window.HandleAlarmLog(alarmInfo);
        } else if (aMsgId == 1007) {//心跳回复
            that.netip.heartbeatfailnum = 0;
        }
    }

    onReceiveChannelStateChange() {
        var that = this;
        if (this.receiveChannel.readyState == "open") {
            Common.log("receiveChannel open");
            // if(window.g_promisereadytopreview){
            //     window.g_promisereadytopreview();
            // }
        } else {
            Common.log("receiveChannel close");
        }
    }

    startOrStopMonitorOverNetIP(start, channel, stream_type) {
        var that = this;
        var MonitorData = {
            Name: "OPMonitor",
            OPMonitor: {
                Action: start ? "Start" : "Stop",
                Parameter: {
                    Channel: channel,
                    CombinMode: "NONE",
                    StreamType: stream_type == 0 ? "Main" : "Extra",
                    TransMode: "TCP"
                }
            },
            SessionID: "0x" + that.netip.getSID().toString(16)
        };
        that.netip.sendOverNetIP(MonitorData, 1410);
    }

    /**
     * 设置本地sdp 成功回调
     * @param {peerConnection} pc
     * @param {RTCSessionDescription} sdp
     */
    abstract createOfferSuccessCallback(pc: RTCPeerConnection);

    /**
     * 设置本地sdp 失败回调
     * @param {peerConnection} peerConnection
     * @param {DOMError} data
     */
    abstract sendOfferFailureCallback(peerConnection: RTCPeerConnection, data: DOMError);

    /**
     * iec candidate 回调
     * @param {peerConnection} peerConnection
     * @param {RTCPeerConnectionIceEvent} data
     */
    abstract iceCandidateSuccessCallback(peerConnection: RTCPeerConnection, data: RTCPeerConnectionIceEvent);
}