var common = require('common');
var sceneManager = require('sceneManager');
var platformUtils = require('PlatformUtils');

cc.Class({
    extends: cc.Component,

    properties: {
        btnViedo: cc.Button,
        sprKanshipin: cc.Sprite,
        sprFenxiang:cc.Sprite,
        shareMode: cc.string,
        sprCloseSound: cc.Sprite,
        sprOpenSound: cc.Sprite,
        btnSound: {
            default: null,
            type: cc.AudioClip
        },
    },

    onLoad: function() {
        this.btnViedo.node.active = false;
        let _this = this;
        platformUtils.requestShareCfg('getBombPauseGame', function(res) {
            //默认视频方式，不需要做代码处理
            if(res == 'v') {
                //隐藏
                _this.btnViedo.node.active = true;
                _this.sprKanshipin.node.active = true;
                _this.sprFenxiang.node.active = false;
            }
            else {
                if(res == 's') {
                    _this.btnViedo.node.active = true;
                    _this.sprKanshipin.node.active = false;
                    _this.sprFenxiang.node.active = true;
                }
            }
            _this.shareMode = res;
        });

        if(D.isVoideClose) {
            this.sprCloseSound.node.opacity = 0;
            this.sprOpenSound.node.opacity = 255;
        }else{
            this.sprCloseSound.node.opacity = 255;
            this.sprOpenSound.node.opacity = 0;
        }
    },

    //继续游戏
    onGameContinue: function() {
        this.onBtnSound(); 
        // this.node.parent.removeChild(this.node);
        common.removePopUpLayer(this);
        this.gameMain.pauseToStart();
    },
    //看视频
    onViedo: function() {
        this.onBtnSound(); 
        if(this.gameMain.videoGetBombMax <= 0){
            common.sysMessage("本局看视频领取次数已达上限!");
            return;
        }

        let _this = this;
        if(this.shareMode == 'v') {
            if( ! platformUtils.isTodayWxVideoBeyond()) {
                common.sysMessage('次数已用完，明天再来！');
                return;
            }
            platformUtils.requestBill(100008, 2, 200, 0);
            platformUtils.createRewardedVideoAd('zanting', function() {
                //视频奖励炸弹两个
                D.commonState.labBombAmount += 2;
                Notification.emit('upgradeBomb', D.commonState.labBombAmount);
                common.sysMessage('恭喜获得2个炸弹！');
                // platformUtils.setTodayWxVideo();
                platformUtils.requestBill(100008, 2, 200, 1);
                _this.gameMain.videoGetBombMax -= 1;
            });
        }
        else if(this.shareMode == 's') {
            if( ! platformUtils.isTodayWxAwardShareBeyond()) {
                common.sysMessage('次数已用完，明天再来！');
                return;
            }
            let cfg = common.getShareCfgByType(D.ShareTypeFriend);
            let title = cfg.title;
            let imageUrl = cfg.imageUrl;
            platformUtils.shareAppMessageCallback(title, imageUrl, "", function(res) {
                if(res == true) {
                    //视频奖励炸弹两个
                    D.commonState.labBombAmount += 2;
                    Notification.emit('upgradeBomb', D.commonState.labBombAmount);
                    common.sysMessage('恭喜获得2个炸弹！');
                    platformUtils.setTodayWxAwardShare();
                    platformUtils.requestBill(100007, 2, 200, 1);
                }
                else {
                    platformUtils.requestBill(100007, 2, 200, 0);
                }
            });
        }
    },
    //关闭声音
    onCloseVoide() {
        this.onBtnSound(); 
        if( ! D.isVoideClose) {
            cc.audioEngine.pauseAll();
            cc.audioEngine.pauseMusic();
            this.sprCloseSound.node.opacity = 0;
            this.sprOpenSound.node.opacity = 255;
            D.isVoideClose = true;
        }
        else {
            cc.audioEngine.resumeAll();
            cc.audioEngine.resumeMusic();
            this.sprCloseSound.node.opacity = 255;
            this.sprOpenSound.node.opacity = 0;
            D.isVoideClose = false;
        }
    },
    onBtnSound: function(){
        if( ! D.isVoideClose){
            cc.audioEngine.play(this.btnSound);
        }
    },

    handBackStart: function(){
        this.onBtnSound(); 
        this.gameMain.gameEndAndRelease();
        this.gameMain.commitCoin();
        sceneManager.loadScene('Start');
        D.commonState.isBattle = false;
        D.commonState.battleFromUserId = 0;
    },
});
