export class netIP{
    protected HeadFlag = 0xff;
    protected Version = 0;
    protected Reserved1 = 0;
    protected Reserved2 = 0;
    protected SID = 0;//
    protected Seq = 0;//
    protected TotalPacket = 0;
    protected CurPacket = 0;
    protected MsgId = 1000;//
    protected DataLen;//

    protected DC;

    public heartbeatinterval = null;

    public heartbeatfailnum = 0;

    setDataChannel(adc){
        this.DC = adc;
    };

    setSID(asid){
        this.SID = asid;
    };

    getSID(){
        return this.SID;
    };

    sendOverNetIP(adata, amsgid, myself){
        if(!myself){
            myself = this;
        }
        console.log("MsgId = ", amsgid);
        var data = JSON.stringify(adata);
        myself.DataLen = data.length;
        myself.MsgId = amsgid;
        var ui8a = new Uint8Array(20+data.length);
        var head = myself.GetHead();
        for(var i=0; i<20; i++){
            ui8a[i] = head[i];
        }
        for(var i=0; i<data.length; i++){
            ui8a[20+i] = data.charCodeAt(i);
        }
        myself.DC.send(ui8a.buffer);
        myself.Seq++;
        if(amsgid == 1006){
            myself.heartbeatfailnum++;
            if(myself.heartbeatfailnum > 3){//认为设备断线了
                console.log("detected disconnect!!!!!!!!");
                //window.g_boffline = true;
                //window.ReConnect();
            }
        }
    };

    heartBeat(){
        var heartbeatdata = {
            Name : "KeepAlive",
            SessionID : "0x" + this.SID.toString(16)
        };
        var self = this;
        this.heartbeatinterval = setInterval(self.sendOverNetIP, 10000, heartbeatdata, 1006, self);//文档有误，保活消息id不是1005
    };

    Get8(num, seg){
        return (num & (0xff000000>>((seg-1)*8))) >> ((4-seg)*8);
    }

    GetHead(){
        return new Uint8Array([this.HeadFlag, this.Version, this.Reserved1, this.Reserved2, this.Get8(this.SID,4), this.Get8(this.SID,3), this.Get8(this.SID,2), this.Get8(this.SID,2), this.Get8(this.Seq,4), this.Get8(this.Seq,3), this.Get8(this.Seq,2), this.Get8(this.Seq,1),
            this.TotalPacket, this.CurPacket, this.Get8(this.MsgId,4), this.Get8(this.MsgId,3), this.Get8(this.DataLen,4), this.Get8(this.DataLen,3), this.Get8(this.DataLen,2), this.Get8(this.DataLen,1)]);
    }
}