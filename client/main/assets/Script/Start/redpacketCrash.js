var common = require('common');
cc.Class({
    extends: cc.Component,

    properties: {
        lab_money: cc.Label,

        btnSound: {
            default: null,
            type: cc.AudioClip
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.lab_money.string = "￥" + D.commonState.userGameInfo.money;

        var platformUtils = require('PlatformUtils');
        platformUtils.setItemByLocalStorage("PassedMaxLevel", 0);
        platformUtils.setItemByLocalStorage("preEedGameLevel", 0);
        platformUtils.setItemByLocalStorage("preEedGameLevelCount", 0);
    },

    // update (dt) {},

    onBtnClose: function(){
        this.onBtnSound();
        common.removePopUpLayer(this);
    },

    onBtnSound: function(){
        if( ! D.isVoideClose){
            cc.audioEngine.play(this.btnSound);
        }
    },
});
