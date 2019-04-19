var common = require('common');
var platformUtils = require('PlatformUtils');

cc.Class({
    extends: cc.Component,

    properties: {
        lab_score: cc.Label,
        btn_video: cc.Button,
        btn_skip: cc.Button,

        btnSound: {
            default: null,
            type: cc.AudioClip
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        // this.node.runAction(cc.sequence(cc.delayTime(0.3),cc.callFunc(function(){
        //     platformUtils.createBannerAd(true); 
        // },this)));

        // let skipWidget = this.btn_skip.node.getComponent(cc.Widget);
        // if(skipWidget){
        //     skipWidget.bottom -= 180;
        //     this.btn_skip.node.runAction(cc.sequence(cc.delayTime(1),cc.callFunc(function(){
        //         skipWidget.bottom += 180;
        //         //广告
        //         // platformUtils.createBannerAd(true); 
        //     },this)));
        // }

        // let skipWidget = this.btn_skip.node.getComponent(cc.Widget);
        // if(skipWidget){
        //     let offset = Device.needOffsetPixel() ? 280 : 180;
        //     skipWidget.bottom -= offset;
        //     this.btn_skip.node.runAction(cc.sequence(cc.delayTime(1),cc.callFunc(function(){
        //         platformUtils.createBannerAd(true); 
        //         skipWidget.bottom += offset;
        //     },this)));
        // }

        platformUtils.createBannerAd(true); 
    },

    // update (dt) {},

    initData: function(score){
        this.score = score;
        this.lab_score.string = String(score);
        if(score == 0){
            this.btn_video.interactable = false;
        }
    },

    onBtnVideo: function(){
        this.onBtnSound(); 

        platformUtils.requestBill(100008, 8, 200, 0);
        let _this = this;
        platformUtils.createRewardedVideoAd('doublestar', function() {
            platformUtils.hideWxLayer();
            common.removePopUpLayer(_this);
            _this.gameMain.commitCoin(true);
            _this.gameMain.showGameSettle();
            // console.log("")
            common.sysMessage("恭喜获得"+_this.score*2+"星星");

            platformUtils.requestBill(100008, 8, 200, 1);
        });
    },

    onBtnSkip: function(){
        this.onBtnSound(); 
        common.removePopUpLayer(this);
        this.gameMain.commitCoin();
        this.gameMain.showGameSettle();
        if(this.score>0){
            common.sysMessage("恭喜获得"+this.score+"星星");
        }
    },

    onBtnSound: function(){
        if( ! D.isVoideClose){
            cc.audioEngine.play(this.btnSound);
        }
    },

});
