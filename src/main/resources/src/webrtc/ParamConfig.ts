/**
 * 请求参数配置类
 */
export class ParamConfig {

    static coturn(clientID: string, sn: string) {
        return {
            "RTCAccessProtocol": {
                "Header": {
                    "MessageType": "MSG_COTURN_REQ"
                },
                "Body": {
                    "SrcUuid": clientID,
                    "DstUuid": sn,
                    "AuthCode": "xxxxxxxxxxxxxxxx"
                }
            }
        }
    }

    static sdpOffer(clientID: string, sn: string, sdp) {
        return {
            "RTCAccessProtocol": {
                "Header": {
                    "MessageType": "MSG_CONNECT_REQ"
                },
                "Body": {
                    "DstUuid": sn,
                    "SrcUuid": clientID,
                    "AuthCode": "xxxxxxxxxxxxxxxx",
                    "channel": "0",
                    "streamType": "0",
                    "sdp": sdp,
                    "type": "offer"
                }
            }
        }
    }

    static iceCandidate(clientID: string, sn: string, candidate: RTCPeerConnectionIceEvent) {
        return {
            "RTCAccessProtocol": {
                "Header": {
                    "MessageType": "MSG_CONNECT_REQ"
                },
                "Body": {
                    "DstUuid": sn,
                    "SrcUuid": clientID,
                    "candidate": candidate.candidate
                }
            }
        }
    }

    static sdpAnswer(clientID: string, sn: string) {
        return {
            "RTCAccessProtocol": {
                "Header": {
                    "MessageType": "MSG_SDP_REQ"
                },
                "Body": {
                    "DstUuid": sn,
                    "SrcUuid": clientID
                }
            }
        }
    }

    static iceCandidateAnswer(clientID: string, sn: string) {
        return {
            "RTCAccessProtocol": {
                "Header": {
                    "MessageType": "MSG_NEW_CONNECT_REQ"
                },
                "Body": {
                    "DstUuid": sn,
                    "SrcUuid": clientID
                }
            }
        }
    }
}