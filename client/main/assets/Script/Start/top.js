var common = require('common');
var sceneManager = require('sceneManager');
var platformUtils = require('PlatformUtils');
var httpUtils = require('HttpUtils');

cc.Class({
    extends: cc.Component,

    properties: {
        btnFriendsTop: cc.Button,
        btnWorldTop: cc.Button,
        btnGroupTop: cc.Button,
        sprRanking: cc.Sprite,
        sprGroupRanking: cc.Sprite,
        btnFriendRankingSprite: {
            default: [],
            type: cc.SpriteFrame,
            tooltip:'ButtonsGroupOfFriendRanking',
        },
        btnWorldRankingSprite: {
            default: [],
            type: cc.SpriteFrame,
            tooltip:'ButtonsGroupOfWorldRanking',
        },
        btnSound: {
            default: null,
            type: cc.AudioClip
        },
    },

    onLoad:function () {
        this.sprRanking.node.active = false;
        this.sprGroupRanking.node.active = false;
        this.btnGroupTop.node.active = false;
        if(D.commonState.shareTicket) {
            this.showGroupTop(D.commonState.shareTicket);
            D.commonState.shareTicket = null;
        }
        else {
            this.onFriendsTop();
        }
    },    
    //好友排行
    onFriendsTop:function() {
        this.onBtnSound();
        this.sprRanking.node.active = true;
        this.btnGroupTop.node.active = true;
        this.btnFriendsTop.getComponent(cc.Sprite).spriteFrame = this.btnFriendRankingSprite[0];
        this.btnWorldTop.getComponent(cc.Sprite).spriteFrame = this.btnWorldRankingSprite[1];

        let hero = {};
        hero.id = D.currHero.id;
        hero.kind = D.currHero.kind;
        hero.subSeq = D.currHero.subSeq;
        hero.level = D.currHero.level;
        hero.tag = D.currHero ? D.currHero.kind+"_"+D.currHero.subSeq: "1_1";
        platformUtils.getHigthScore(function(highestScore){
            if(CC_WECHATGAME) {
                platformUtils.getUserInfo(function(userInfo) {
                    console.log(userInfo);
                    window.wx.postMessage({
                        type: 'friendsRank',
                        selfAvatarUrl: userInfo.avatarUrl,
                        selfNickname: userInfo.nickName,
                        selfOpenId: userInfo.openId,
                        selfScore: highestScore,
                        hero: hero,
                    });
                });
            }       
        });
    },
    //世界排行
    onWorldTop: function() {
        this.onBtnSound();
        this.sprRanking.node.active = true;
        this.btnGroupTop.node.active = true;
        this.btnFriendsTop.getComponent(cc.Sprite).spriteFrame = this.btnFriendRankingSprite[1];
        this.btnWorldTop.getComponent(cc.Sprite).spriteFrame = this.btnWorldRankingSprite[0];
        let skey = platformUtils.getUserSkey();

        let hero = {};
        hero.id = D.currHero.id;
        hero.kind = D.currHero.kind;
        hero.subSeq = D.currHero.subSeq;
        hero.level = D.currHero.level;
        hero.tag = D.currHero ? D.currHero.kind+"_"+D.currHero.subSeq: "1_1";
        platformUtils.getHigthScore(function(highestScore){
            if(CC_WECHATGAME) {
                platformUtils.getUserInfo(function(userInfo) {
                    console.log(userInfo);
                    window.wx.postMessage({
                        type: 'friendsRank2',
                        selfAvatarUrl: userInfo.avatarUrl,
                        selfNickname: userInfo.nickName,
                        selfOpenId: userInfo.openId,
                        selfScore: highestScore,
                        hero: hero,
                    });
                });
            }
            // httpUtils.get(D.UrlDomain+'/rank/world', {Authorization: skey, Version:D.Versioin}, function(res) {
            //     if(res && res.data) {                    
            //         if(CC_WECHATGAME) {
            //             platformUtils.getUserInfo(function(userInfo) {
            //                 console.log(userInfo);
            //                 window.wx.postMessage({
            //                     type: 'worldRank',
            //                     selfAvatarUrl: userInfo.avatarUrl,
            //                     selfNickname: userInfo.nickName,
            //                     selfOpenId: userInfo.openId,
            //                     selfScore: highestScore,
            //                     hero: hero,
            //                     rank: res.data,
            //                 });
            //             });
            //         }
            //     }
            // });
        });
    },
    //发起群分享
    onGroupTop: function() {
        this.onBtnSound();
        let cfg = common.getShareCfgByType(D.ShareTypeGroup);
        let title = cfg.title;
        let imageUrl = cfg.imageUrl;
        platformUtils.shareAppMessage(title, imageUrl, '', function(res){
            if(res) {
                common.sysMessage('分享成功！');
                platformUtils.requestBill(100007, 8, 200, 1);
            }
            else {
                platformUtils.requestBill(100007, 8, 200, 0);
            }
        },true);
    },
    showGroupTop: function(shareTicket) {
        this.sprGroupRanking.node.active = true;
        this.btnGroupTop.node.active = false;
        
        //群排行
        let hero = {};
        hero.id = D.currHero? D.currHero.id:1;
        hero.kind = D.currHero? D.currHero.kind:1;
        hero.subSeq = D.currHero? D.currHero.subSeq:1;
        hero.level = D.currHero? D.currHero.level:1;
        hero.tag = D.currHero? D.currHero.kind+"_"+D.currHero.subSeq : "1_1";
        platformUtils.getHigthScore(function(highestScore){
            if(CC_WECHATGAME) {
                platformUtils.getUserInfo(function(userInfo) {
                    window.wx.postMessage({
                        type: 'groupRank',
                        selfAvatarUrl: userInfo.avatarUrl,
                        selfNickname: userInfo.nickName,
                        selfOpenId: userInfo.openId,
                        selfScore: highestScore,
                        shareTicket: shareTicket,
                        hero: hero,
                    });
                });
            }
        });
    },
    onBackMain: function() {   
        this.onBtnSound();     
        if(CC_WECHATGAME) {
            let _this = this;
            window.wx.postMessage({
                type: 'cleanRank',
                isShowRankTop3: _this.isShowRankTop3,
            });
        }
        // this.node.parent.removeChild(this.node);
        common.removePopUpLayer(this);
    },
    update(dt) {
    },
    //按钮声音
    onBtnSound: function(){
        if( ! D.isVoideClose){
            cc.audioEngine.play(this.btnSound);
        }
    },
});
