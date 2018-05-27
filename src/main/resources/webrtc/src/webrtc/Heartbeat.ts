/**
 * 心跳检测
 */
import {Common} from "../utils/Common";
import {ParamConfig} from "./ParamConfig";

export class Heartbeat {
    private url;
    private heartbeatAnswer;
    private heartbeatIceCandidate;
    private heartbeatAnswerCount = 0;
    private heartbeatIceCandidateCount = 0;


    constructor(url) {
        this.url = url;
    }

    startAnswer(sn: string, clientID: string, peerConnection: RTCPeerConnection) {
        var _this = this;
        var param = ParamConfig.sdpAnswer(clientID, sn);
        _this.heartbeatAnswer = setInterval(function () {
            Common.log('heartbeatAnswer', ++_this.heartbeatAnswerCount > 10000 ? _this.heartbeatAnswerCount = 1 : _this.heartbeatAnswerCount)
            _this.ajax(param, function (data) {
                var RTCAccessProtocol = data.RTCAccessProtocol;
                if (RTCAccessProtocol.Header.ErrorNum == '200') {
                    _this.closeAnswer();
                    var sdp = new RTCSessionDescription();
                    sdp.sdp=RTCAccessProtocol.Body.sdp;
                    sdp.type="answer"
                    Common.log(sdp)
                    peerConnection.setRemoteDescription(sdp)
                }
            })
        }, 1000)
    }

    closeAnswer() {
        if (this.heartbeatAnswer != null) {
            clearInterval(this.heartbeatAnswer);
        }
    }

    startIceCandidate(sn: string, clientID: string, peerConnection: RTCPeerConnection) {
        var _this = this;
        var param = ParamConfig.iceCandidateAnswer(clientID, sn)
        if (_this.heartbeatIceCandidate == null) {
            _this.heartbeatIceCandidate = setInterval(function () {
                Common.log('heartbeatIceCandidate', ++_this.heartbeatIceCandidateCount > 10000 ? _this.heartbeatIceCandidateCount = 1 : _this.heartbeatIceCandidateCount)
                _this.ajax(param, function (data) {
                    var RTCAccessProtocol = data.RTCAccessProtocol;
                    if (RTCAccessProtocol.Header.ErrorNum == '200') {
                        peerConnection.addIceCandidate(new RTCIceCandidate(RTCAccessProtocol.Body.candidate));
                    }
                })
            }, 1000)
        }
    }

    closeIceCandidate() {
        if (this.heartbeatIceCandidate != null) {
            clearInterval(this.heartbeatIceCandidate)
        }
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
