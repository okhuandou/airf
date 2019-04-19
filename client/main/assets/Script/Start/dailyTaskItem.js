var common = require('common');
var taskUtils = require('taskUtils');

cc.Class({
    extends: cc.Component,

    properties: {
        node_award: cc.Node,
        spr_icon: cc.Sprite,
        lab_num: cc.Label,

        rtx_desc: cc.RichText,
        btn_go: cc.Button,
        btn_receive: cc.Button,

        btnSound: {
            default: null,
            type: cc.AudioClip
        },
    },

    

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    start () {
        Notification.on("task_update_state", this.updateTaskState, this);
    },

    onDestroy: function(){
        Notification.off("task_update_state", this.updateTaskState);
    },

    // update (dt) {},


    initWithData: function(data){
        let config = common.getJsonCfgByID("task",data.taskId);
        this.curConfig = config;

        //奖励
        let award = config.coin > 0 ? config.coin : config.qzb;
        this.lab_num.string = 'x' + award;

        if(config.coin == 0){
            let _this = this;
            cc.loader.loadRes("game/icon_item_qzb",cc.SpriteFrame,function(err,spriteFrame){
                _this.spr_icon.spriteFrame = spriteFrame;
            });
        }
        
        let labLen = 12;
        //两种奖励
        if(config.coin > 0 && config.qzb > 0){
            labLen = 8;
            this.addNewAward();
        }

        let desc = config.name.replace("{need}","@");
        desc = this.insertFlg(desc,"\n",labLen-1);
        desc = desc.replace("@",config.need);
        desc = "<color=#feffff>"+ desc +"</c>" + "</c><color=#ffe760>(@1/@2)</color>"
        let param1 = data.currNum > config.need ? config.need : data.currNum;
        let param2 = config.need;
        if(config.kind == taskUtils.TaskType.FLY_KM){
            param1 = param1 + "KM";
            param2 = param2 + "KM";
        }
        desc = desc.replace("@1",param1);
        desc = desc.replace("@2",param2);
        this.rtx_desc.string = desc;

        let isFinish = data.currNum >= this.curConfig.need;
        //可领取
        if(data.isComplete == 1){
            this.btn_receive.node.active = true;
            this.btn_go.node.active = false;
            if(data.isReceive == 1){
               this.btn_receive.interactable = false; 
            }
        }else{
            this.btn_receive.node.active = false;
            this.btn_go.node.active = true;
        }
    },

    addNewAward: function(){

        let newAward = this.node.getChildByName("newAwardTag");
        if(!newAward){
            newAward = cc.instantiate(this.node_award);
            newAward.name = "newAwardTag";
            this.node.addChild(newAward);
            let offsetx = this.node_award.width + 5;
            newAward.x = this.node_award.x + offsetx;
            this.rtx_desc.node.x = this.rtx_desc.node.x + offsetx;
            cc.loader.loadRes("game/icon_item_qzb",cc.SpriteFrame,function(err,spriteFrame){
                let spr_icon = newAward.getChildByName("spr_icon");
                if(spr_icon){
                    spr_icon.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                }
            });
        }

        let lab_num = newAward.getChildByName("lab_num");
        if(lab_num){
            lab_num.getComponent(cc.Label).string = "x"+this.curConfig.qzb;
        }
    },

    insertFlg: function(str,flg,idx){
        var newstr="";
        var tmp=str.substring(0, idx);
        newstr = tmp + flg + str.substring(idx,str.length);
        return newstr;
    },

    onBtnReceive: function(){
        this.onBtnSound()

        let _this = this;
        taskUtils.requestTaskReceive(this.curConfig.id, function(res){
            common.receiveAward(res.award);
            taskUtils.updateTaskList(res.taskId, res.next);
            // _this.initWithData(rew.next);
        });
    },

    onBtnGo: function(){
        this.onBtnSound()

        let type = "";
        switch(this.curConfig.kind){
            case taskUtils.TaskType.COIN: 
            case taskUtils.TaskType.FLY_KM:
            case taskUtils.TaskType.BATTLE_NUM:
                type = "battle";
            break;
            // case taskUtils.TaskType.INVITE: 
            case taskUtils.TaskType.INVITE_SUC: 
                type = "invite";
            break;
            case taskUtils.TaskType.UPGRADE_COST: 
                type = "upgrade";
            break;
        }

        if(type != ""){
            this.mainScript.handlerBtnGo(type);
        }
    },

    onBtnSound: function(){
        if( ! D.isVoideClose){
            cc.audioEngine.play(this.btnSound);
        }
    },

    updateTaskState: function(event){
        if(this.curConfig.id == event.oldId){
            this.initWithData(event.info);
        }
    },


});
