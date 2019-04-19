var common = require('common');
var sceneManager = require('sceneManager');
var platformUtils = require('PlatformUtils');

cc.Class({
    extends: cc.Component,

    properties: {
        txt_score: cc.Label,
        btnVideo: cc.Button,
        nQzb: cc.Integer,
        txt_diamond: cc.Label,
        txt_need: cc.Label,
        btnZhuli: cc.Button,
        sprMyqzb: cc.Sprite,
        btnSound: {
            default: null,
            type: cc.AudioClip
        },
        scoreChangeSound: {
            default: null,
            type: cc.AudioClip
        },
        scoreBreakingSound: {
            default: null,
            type: cc.AudioClip
        },

        btn_skip: cc.Button,
    },
    
    onLoad: function() {
        this.btnVideo.node.active = false;
        this.btnZhuli.node.active = false;
        this.sprMyqzb.node.active = false;
        this.adapteBtn();
        let _this = this;
        platformUtils.requestShareCfg('gameOverRevive,gameOverZhuli', function(res) {
            if(D.commonState.gameContinueCounter == 0) {
                //优先视频
                if(res['gameOverRevive'] == 'v') {
                    //隐藏
                    _this.btnVideo.node.active = true;
                }
                else if(res['gameOverZhuli'] == 's') {
                    //隐藏
                    _this.btnZhuli.node.active = true;
                    _this.sprMyqzb.node.active = true;
                }
            }
            else {
                //优先分享
                if(res['gameOverZhuli'] == 's') {
                    //隐藏
                    _this.btnZhuli.node.active = true;
                    _this.sprMyqzb.node.active = true;
                }
                else if(res['gameOverRevive'] == 'v') {
                    //隐藏
                    _this.btnVideo.node.active = true;
                }
            }
            
            _this.adapteBtn();
        });
        this.initData(D.commonState.gameScore, D.commonState.gameDist);

        platformUtils.requestBill(100005, 1, 100);
        // platformUtils.hideWxLayer();

        //广告
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
        //     platformUtils.hideWxLayer();
        //     this.btn_skip.node.runAction(cc.sequence(cc.delayTime(1),cc.callFunc(function(){
        //         platformUtils.createBannerAd(true); 
        //         skipWidget.bottom += offset;
        //     },this)));
        // }

        platformUtils.createBannerAd(true);
    },

    onDestroy: function(){
        // platformUtils.hideWxLayer();
    },

    adapteBtn: function(){
        if(this.btnVideo.node.active == true && this.btnZhuli.node.active == false){
            this.btnZhuli.node.y = this.btnVideo.node.y - 131;
            this.txt_score.node.y = 96;
        } else if(this.btnVideo.node.active == false && this.btnZhuli.node.active == true){
            this.btnZhuli.node.y = this.btnVideo.node.y - 65;
            this.txt_score.node.y = 96;
        }
        else if(this.btnVideo.node.active == false && this.btnZhuli.node.active == false){
            this.txt_score.node.y = 0;
        }
        else if(this.btnVideo.node.active == true && this.btnZhuli.node.active == true){
            this.txt_score.node.y = 96;
        }
    },
    
    initData: function(score, gameDist) {
        this.onScoreChangeSound();//计算分数转动声音
        this.initUserInfo(score);
        if(CC_WECHATGAME) {
            // platformUtils.getUserInfo(function(userInfo) {
            //     window.wx.postMessage({
            //         type: 'gameOverRank',
            //         score: score,
            //         selfAvatarUrl: userInfo.avatarUrl,
            //         selfNickname: userInfo.nickName,
            //         selfOpenId: userInfo.openId,
            //     });
            // });
        }
        this.txt_need.string = D.recoverHpCost;
        let _this = this;
        platformUtils.requestGameInfo(function(userGame) {
            _this.nQzb = userGame.qzb;
            _this.txt_diamond.string = userGame.qzb+"个";
        });

        platformUtils.setAndGetHigthScore(score, function(highestScore) {    
            if(score >= highestScore){  //破纪录声音
                _this.onScoreBreakingSound();
            }
        });
    },

    /**
     * 角色信息
     */
    initUserInfo: function(score){
        let _this = this;    
        _this.txt_score.string = score+"";
        platformUtils.getUserInfo(function(userInfo) {
            // _this.txt_name.string = String(userInfo.nickname);
            // _this.txt_hight.string = String(score+"KM");
            // _this.loadImgFromUrl(_this.img_head, userInfo.avatarUrl );
        });
    },

    // loadImgFromUrl: function (target, imgUrl) {
    //     if(!imgUrl)return;
    //     cc.loader.load({url: imgUrl, type: 'png'}, function(err, texture){
    //         if(err) return;
    //         target.spriteFrame = new cc.SpriteFrame(texture);
    //     });
    // },

    /**
     * 不再游戏，并结算
     */
    onSkipGameAndSettle: function() {
        this.onBtnSound(); 
        // this.node.parent.removeChild(this.node);
        platformUtils.hideWxLayer();
        common.removePopUpLayer(this);
        // this.gameMain.commitCoin();
        this.gameMain.showGameAward();
        this.gameMain.gameEndAndRelease();
    },
    /**
     * 观看视频，复活继续游戏
     */
    onGameContinue: function() {
        platformUtils.requestBill(100008, 3, 200, 0);
        this.onBtnSound(); 
        // this.btnVideo.interactable = false;
        let _this = this;

        /*if( ! platformUtils.isTodayWxVideoBeyond()) {
            common.sysMessage('次数已用完，明天再来！');
            return;
        }*/
        platformUtils.createRewardedVideoAd('fuhuo', function() {
            platformUtils.hideWxLayer();
            common.removePopUpLayer(_this);
            _this.gameMain.recoverHpAndGame(100);
            //platformUtils.setTodayWxVideo();
            platformUtils.requestBill(100008, 3, 200, 1);
        });
    },

    onShare: function() {
        this.onBtnSound(); 
        platformUtils.requestBill(100005, 2, 200, 0);
        if (this.nQzb >= D.recoverHpCost)
        {
            let _this = this;
            let shareBack = function(res){
                _this.scheduleOne(function(){
                    let curTime = Date.now()/1000;
                    console.log("----- share back---curTime=,shareTime=",curTime,_this.shareTime)
                    if(curTime - _this.shareTime < 2.5){
                        common.sysMessage('请分享到不同的群内');
                        return;
                    }
                    if (state){
                        platformUtils.hideWxLayer();
                        common.removePopUpLayer(_this);
                        _this.gameMain.recoverHpAndGame(100);
                        platformUtils.requestBill(100005, 2, 200, 1);
                    }
                    else {
                        _this.doAwardQzbShare();
                    }
                },0.01);
            }
			// this.btnZhuli.interactable = false; 
            //消耗助币，并复活
            _this.shareTime = Date.now()/1000;
            platformUtils.requestRecover(D.recoverHpCost*-1, function(state){
                shareBack(res);
            });
            return;
        }
        else {
            this.doAwardQzbShare();
        }
    },

    doAwardQzbShare: function() {
        this.onBtnSound(); 
        let cfg = common.getShareCfgByType(D.ShareTypeSettle);
        let title = cfg.title;
        let imageUrl = cfg.imageUrl;
        // if(CC_WECHATGAME) {
            
        //     /*if( ! platformUtils.isTodayWxAwardShareBeyond()) {
        //         common.sysMessage('次数已用完，明天再来！');
        //         return;
        //     }*/

        //     let sysInfo = wx.getSystemInfoSync();
        //     //根据iphone6作为参照指标，然后根据实际的设备调整
        //     let x = 35/375 * sysInfo.screenWidth;
        //     let y = 315/667 * sysInfo.screenHeight;
        //     let width = 680/375 * sysInfo.screenWidth;
        //     let height = 1200/667 * sysInfo.screenHeight;
        //     imageUrl = canvas.toTempFilePathSync({
        //         x: x,
        //         y: y,
        //         width: width,
        //         height: height,
        //         destWidth: 300,
        //         destHeight: 400
        //     });
        // }
        // let fromKey = platformUtils.getUserSkey();
        // platformUtils.shareAppMessage(title, imageUrl, "type=shareQzb&fromKey="+fromKey, function(res){
        //     if(res) {
        //         common.sysMessage('分享成功，需要好友点击你的分享才能获得钻石！');
        //         platformUtils.requestBill(100007, 1, 200, 1);
        //     }
        //     else {
        //         platformUtils.requestBill(100007, 1, 200, 0);
        //     }
        // });
        let _this = this;
        platformUtils.shareAppMessage(title, imageUrl, '', function(res){
            if(res) {
                let qzb = 2;
                platformUtils.requestRecover(qzb, function(res){   
                    if(res) {
                        common.sysMessage('分享成功获得 '+qzb+' 个钻石 ！');
                        platformUtils.requestGameInfo(function(userGame) {
                            _this.nQzb = userGame.qzb;
                            _this.txt_diamond.string = userGame.qzb+"个";
                        });
                    }
                    //platformUtils.setTodayWxAwardShare();
                });
                platformUtils.requestBill(100007, 1, 200, 1);
            }
            else {
                platformUtils.requestBill(100007, 1, 200, 0);
            }
        });
    },

    update(dt) {
    },
    onBtnSound: function(){
        if( ! D.isVoideClose){
            cc.audioEngine.play(this.btnSound);
        }
    },
    onScoreChangeSound: function(){
        if( ! D.isVoideClose){
            cc.audioEngine.play(this.scoreChangeSound);
        }
    },
    onScoreBreakingSound: function(){
        if( ! D.isVoideClose){
            cc.audioEngine.play(this.scoreBreakingSound);
        }
    }

});
