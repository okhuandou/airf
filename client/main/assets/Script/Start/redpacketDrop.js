var common = require('common');
var platformUtils = require('PlatformUtils');
var storageUtils = require('StorageUtils');

cc.Class({
    extends: cc.Component,

    properties: {
        node_award_bg: cc.Node,
        node_award: cc.Node,
        node_open: cc.Node,
        spr_video: cc.Sprite,
        lab_award: cc.Label,
        lab_have: cc.Label,
        btn_award: cc.Button,
        spr_have_bg: cc.Sprite,

        btnSound: {
            default: null,
            type: cc.AudioClip
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node_award.active = false;
        this.node_award_bg.active = false;

        this.spr_have_bg.node.active = false;
        this.lab_have.node.active = false;
    },

    start () {
        let money = D.commonState.userGameInfo.money ? D.commonState.userGameInfo.money : "0:00"
        this.lab_have.string = "余额:"+money+"元";

        this.initState();
    },

    // update (dt) {},

    initWithData: function(reason,gameLevel){
        this.reason = reason;
        this.gameLevel = gameLevel;
    },

    initState: function(){
        if(storageUtils.redpacketVideoCount() > 0) return;

        let _this = this;
        platformUtils.requestShareCfg('redpacket_test', function(res) {
            if(res == 's' && storageUtils.redpacketShareCount() > 0) {
                _this.changeShareIcon();
                _this.isShare = true;
            }
        });
    },

    changeShareIcon: function(){
        let _this = this;
        cc.loader.loadRes("redpacket/redpacket", cc.SpriteAtlas, function(err,atlas){
            let frame = atlas.getSpriteFrame("redpacket_share");
            if(frame){
                _this.spr_video.spriteFrame = frame;
            }
        });
    },

    onBtnOpen: function(){
        this.onBtnSound();

        let _this = this;
        platformUtils.requestRedpacketReady(this.reason,function(res){
            _this.node_open.active = false;
            _this.node_award.active = true;
            _this.node_award_bg.active = true;

            _this.spr_have_bg.node.active = true;
            _this.lab_have.node.active = true;

            _this.money = res.money;
            _this.canGetMoney = res.canGetMoney;
            _this.lab_award.string = "￥" + res.money;
            common.sysMessage("恭喜您获得"+res.money+"元");

            _this.spr_video.node.rotation = 0;
            _this.spr_video.node.runAction(cc.repeatForever(cc.sequence(cc.repeat(cc.sequence(cc.rotateTo(0.3, 15), cc.rotateTo(0.3, -15), cc.rotateTo(0.1, 0)),2), cc.delayTime(1.5))));
        });
    },

    onBtnAward: function(){
        this.onBtnSound();

        if(this.isShare){
            this.onShare();
            return;
        }

        let _this = this;
        platformUtils.requestBill(100008, 7, 200, 0);
        platformUtils.createRewardedVideoAd('redpacket_test', function() {
            console.log("=========== video back")
            platformUtils.requestBill(100008, 7, 200, 1);
            _this.reward();

            platformUtils.setItemByLocalStorage('TodayRedpacketVideoDate',new Date());
            platformUtils.setItemByLocalStorage("RedpacketVideoCount",platformUtils.getItemByLocalStorage("RedpacketVideoCount",0) + 1);
        });
    },

    onShare: function(){
        let _this = this;
        let cfg = common.getShareCfgByType(D.ShareTypeFriend);
        let title = cfg.title;
        let imageUrl = cfg.imageUrl;
        platformUtils.shareAppMessageCallback(title, imageUrl, "", function(res) {
            if(res) {
                //奖励金币
                _this.reward();
                platformUtils.requestBill(100007, 16, 200, 1);

                platformUtils.setItemByLocalStorage('TodayRedpacketShareDate',new Date());
                platformUtils.setItemByLocalStorage("RedpacketShareCount",platformUtils.getItemByLocalStorage("RedpacketShareCount",0) + 1);
            }else {
                platformUtils.requestBill(100007, 16, 200, 0);
            }
        });
    },

    reward: function(){
        let _this = this;
        platformUtils.requestRedpacketAdd(this.reason,this.money,function(res){
            console.log("------- reward",res);
            D.commonState.userGameInfo.money = res.mymoney;
            _this.lab_have.string = "余额:"+res.mymoney;
            common.sysMessage("存入成功");

            _this.spr_video.node.rotation = 0;
            _this.spr_video.node.stopAllActions();
            _this.btn_award.node.active = false;

            if(_this.gameLevel <= 3){
                let tag = "redpacketAwardLevel"+_this.gameLevel;
                platformUtils.setItemByLocalStorage(tag, true);
            }
        });
    },

    onBtnClose: function(){
        this.onBtnSound();
        common.removePopUpLayer(this);
        this.gameMain.pauseToStart();
    },

    onBtnSound: function(){
        if( ! D.isVoideClose){
            cc.audioEngine.play(this.btnSound);
        }
    },
});
