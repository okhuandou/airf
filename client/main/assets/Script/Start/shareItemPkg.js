var common = require('common');
var sceneManager = require('sceneManager');
var platformUtils = require('PlatformUtils');

cc.Class({
    extends: cc.Component,

    properties: {
        labItemID: cc.Label,
        btnSound: {
            default: null,
            type: cc.AudioClip
        },
    },

    onClosePrefab: function(){
        this.onBtnSound();  
        common.removePopUpLayer(this);
        Notification.emit("pauseToStart",this);
    },

     //看视频
    onViedo: function() {        
        this.onBtnSound();  
        let _this = this;
        platformUtils.requestShareCfg('giftInGame', function(res) {
            //默认视频方式，不需要做代码处理
            if(res == 'v') {
                //隐藏
                platformUtils.createRewardedVideoAd('game', function() {
                    common.sysMessage('恭喜获得分享大礼包！');
                    common.removePopUpLayer(_this);
                    Notification.emit("giveAwayItemPkg",_this.labItemID.string);
                    Notification.emit("pauseToStart",_this);
                });
            }
        });
    },
    onLoad () {
    },
    //按钮声音
    onBtnSound: function(){
        if( ! D.isVoideClose){
            cc.audioEngine.play(this.btnSound);
        }
    },
    // start () {},

    // update (dt) {},
});
