var common = require('common');
var platformUtils = require('PlatformUtils');
var timeUtils = require('TimeUtils');

cc.Class({
    extends: cc.Component,

    properties: {
        rht_desc: cc.RichText,
        // lab_name: cc.Label,
        spr_head: cc.Sprite,
        btn_invite: cc.Button,
        btn_award: cc.Button,
        pgb_help: cc.ProgressBar,
        lab_time: cc.Label,
        nod_helping: cc.Node,
        lab_add: cc.Label,

        btnSound: {
            default: null,
            type: cc.AudioClip
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        common.iphonexAdapter(this.node);
    },

    // update (dt) {},

    initWithData: function(data){
        // data.remainSec = 594;
        // data.name = "591";
        // data.isRecv = 1;

        this.data = data;

        let isHelped = data.isRecv == 1 && data.remainSec == 0;
        if(data.headimg != null && !isHelped){
            common.createImage(data.headimg, this.spr_head);
        }

        let desc = "";
        let friendName = data.name == undefined ? "" : data.name;
         //1:已领取
        if(data.isRecv == 1) {
            if(isHelped){
                this.btn_invite.node.active = true;
                this.btn_invite.interactable = false;
                this.btn_invite.node.getChildByName("spr_lab").getComponent(cc.Sprite).setState(1);
                this.btn_award.node.active = false;
                desc = "<color=#ffffff>这里空着呢，快邀请朋友\n来助力</color>";
            }else{
                this.btn_award.node.active = false;
                this.btn_invite.node.active = false;
                desc = "<color=#ffe760>"+ friendName +"</color>";
            }
        }else{
            if(friendName != ""){ //可领奖
                this.btn_invite.node.active = false;
                this.btn_award.node.active = true;
                desc = "<color=#ffe760>你的好友帮你了大忙，点击\n开始助力收益吧！</color>";
            }else{ //未邀请
                this.btn_invite.node.active = true;
                this.btn_award.node.active = false;
                desc = "<color=#ffffff>这里空着呢，快邀请朋友\n来助力</color>";
            }
        }
        this.rht_desc.string = desc;

        if(data.isNew){
            this.lab_add.string = "+10%";
        }

        this.nod_helping.active = false;
        this.help_time = data.remainSec ? data.remainSec : 0;
        if(this.help_time > 0){
            this.countDown();
        }
    },

    countDown: function(){
        this.nod_helping.active = true;
        this.btn_award.node.active = false;

        let totalTime = 600;
        let _this = this;
        this.lab_time.node.stopAllActions();
        let ticket = function(){
            _this.lab_time.string = timeUtils.secondsToHMS(_this.help_time);
            let precent = _this.help_time/totalTime;
            _this.pgb_help.progress = precent;
            if(_this.help_time <= 0){
                _this.lab_time.node.stopAllActions();
                _this.isHelping = false;
                _this.data.remainSec = 0;
                _this.initWithData(_this.data);
            }
            _this.help_time -= 1;
        }

        let act1 = cc.delayTime(1.0);
        let act2 = cc.callFunc(ticket,this);
        this.lab_time.node.runAction(cc.repeatForever(cc.sequence(act1,act2)));
        ticket();
    },

    onBtnHelp: function(){
        this.onBtnSound();

        let cfg = common.getShareCfgByType(D.ShareTypeZhuli);
        let title = cfg.title;
        let imageUrl = cfg.imageUrl;
        let fromKey = platformUtils.getUserSkey();
        let fromUserId = platformUtils.getUserId();
        platformUtils.shareAppMessage(title, imageUrl, "type=shareHelp&fromUserId="+fromUserId, function(res){
            if(res) {
                common.sysMessage('分享成功！');
                platformUtils.requestBill(100007, 14, 200, 1);
                // taskUtils.taskReport(taskUtils.TaskType.INVITE);
            }
            else {
                platformUtils.requestBill(100007, 14, 200, 0);
            }
            platformUtils.setItemByLocalStorage("curFriendHelpNum",D.commonState.friendHelpNum);
        });
    },

    onBtnAward: function(){
        this.onBtnSound();

        let _this = this;
        platformUtils.requestHelpReceive(this.data.id, function(res){
            if(res == 2020 || res == 2021){
                common.sysMessage("助力分享没达标!");
            }else{
                res.isRecv = 1;
                _this.initWithData(res);
            }
        });
    },

    onBtnSound: function(){
        if( ! D.isVoideClose){
            cc.audioEngine.play(this.btnSound);
        }
    },

});
