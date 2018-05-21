/**
 * websocket 方式实现的信令交互
 */
import {Common} from "../utils/Common";
import {Signalling} from "./Signalling";
import {ParamConfig} from "./ParamConfig";

export class WebSocketWebRtc extends Signalling {

    private webSocket = null;

    constructor(sn: string, serverIp: string, serverPort: number) {
        super(sn, serverIp, serverPort);
        this.url = 'ws://' + this.serverIp + ':' + this.serverPort
        this.initWebSocket(this.url)
    }

    /**
     * 初始化webSocket
     * @param url
     */
    private initWebSocket(url) {
        Common.log('WebSocketWebRtc init')
        if ('WebSocket' in window) {
            this.webSocket = new WebSocket(url);
            // webSocket 事件监听回调
            this.webSocket.onopen = (event) => {
                Common.log('webSocket onopen', event)
                var param = ParamConfig.coturn(this.clientID, this.sn)
                Common.log("send coturn", param);
                this.sendMsg(param);
            }
            this.webSocket.onerror = (event) => {
                Common.log('webSocket onerror', event)
            }
            this.webSocket.onmessage = (event) => {
                Common.log('--------webSocket onmessage', event.data)
                try {
                    var response = JSON.parse(event.data);
                    var RTCAccessProtocol = response.RTCAccessProtocol;
                    var header = RTCAccessProtocol.Header;
                    if (header != null) {
                        var body = RTCAccessProtocol.Body;
                        var messageType = header.MessageType;
                        if (messageType == 'MSG_COTURN_RSP') {
                            this.setOnCoturn(body);
                        } else if (messageType = 'MSG_CONNECT_REQ') {
                            this.setOnSdpOrIceCandidate(body)
                        } else {
                            Common.log("not found messageType", messageType)
                        }
                    }
                } catch (e) {
                    Common.log("exception",e)
                }
            }
            this.webSocket.onclose = (event) => {
                Common.log('webSocket onclose', event)
            }
            //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
            window.onbeforeunload = () => {
                this.close();
            }
        } else {
            alert('Not support websocket')
        }
    }

    /**
     * 设置本地coturn
     * @param body
     */
    setOnCoturn(body) {
        var that = this;
        that.peerConnection = that.createRTCPeerConnection();
        that.createDataChannel(that.peerConnection);
        that.sendOffer(that.peerConnection);
        that.iceCandidate(that.peerConnection);
        that.addStream(that.peerConnection);
    }

    /**
     * 设置 answer sdp
     * @param body
     */
    setOnSdpOrIceCandidate(body) {
        var that = this;
        Common.log("------------------------",body)
        if (body.sdp != null) {
            var sdp = new RTCSessionDescription();
            sdp.sdp = body.sdp;
            sdp.type = "answer"
            Common.log('setRemoteDescription', sdp)
            that.peerConnection.setRemoteDescription(sdp)
        }
        if (body.candidate != null) {
            Common.log('addIceCandidate', body.candidate)
            this.peerConnection.addIceCandidate(new RTCIceCandidate(body.candidate));
        }
    }


    createOfferSuccessCallback(pc: RTCPeerConnection) {
        var that = this;
        var sdp = pc.localDescription.sdp;
        Common.log('sendOfferSuccessCallback', sdp)
        //发送sdp 到信令服务器
        var param = ParamConfig.sdpOffer(that.clientID, that.sn, sdp)
        this.sendMsg(param);
    }

    sendOfferFailureCallback(peerConnection: RTCPeerConnection, data: DOMError) {
    }

    iceCandidateSuccessCallback(peerConnection: RTCPeerConnection, data: RTCPeerConnectionIceEvent) {
        var that = this;
        Common.log('iceCandidateSuccessCallback', data)
        var param = ParamConfig.iceCandidate(that.clientID, that.sn, data);
        this.sendMsg(param);
    }

    sendMsg(msg) {
        if (this.webSocket != null) {
            if (msg instanceof Object) {
                msg = JSON.stringify(msg)
            }
            this.webSocket.send(msg)
        } else {
            alert('webSocket not init.')
        }
    }

    close() {
        if (this.webSocket != null) {
            this.webSocket.close()
        }
    }

}