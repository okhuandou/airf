var common = require('common');
var httpUtils = require('HttpUtils');

var platformUtils = {

    init: function(hideCallback) {
        
        console.log('cc.game.getFrameRate() = ', cc.game.getFrameRate());
        if(CC_WECHATGAME) {
            let sysInfo = wx.getSystemInfoSync();
            if(sysInfo.platform == 'ios') {
                wx.setPreferredFramesPerSecond(60);
                cc.game.setFrameRate(60);
            }
            else {                
                wx.setPreferredFramesPerSecond(30);
                cc.game.setFrameRate(30);
            }
            console.log('init wx......', sysInfo.platform, cc.game.getFrameRate())

            cc.macro.ENABLE_CULLING = false;
            cc.macro.ENABLE_TILEDMAP_CULLING = false;
            
            this.onHide(hideCallback);
            
            wx.showShareMenu({withShareTicket: false});
            let cfg = common.getShareCfgByType(D.ShareTypeFriend);
            let title = cfg.title;
            let imageUrl = cfg.imageUrl;
            wx.onShareAppMessage(function() {
                wx.offHide();
                console.log('onShareAppMessage...',title,imageUrl);
                return {
                    title: title,
                    imageUrl: imageUrl,
                    query: '',
                }
            });
        }
        else {
            cc.game.setFrameRate(60);
        }
    },
    onHide: function(hideCallback) {
        if(CC_WECHATGAME) {
            let _this = this;
            wx.onHide(function() {
                if(hideCallback) hideCallback();
                /*wx.exitMiniProgram({
                    success:function(res) {
                    },
                    fail:function(res) {
                    },
                    complete:function(res) {
                    },
                });*/
            });
        }
    },

    login: function(callback) {
        if(CC_WECHATGAME) {
            let _this = this;
            window.wx.login({
                success: function(res) {
                    if (res.code) {
                        _this.requestLogin(res.code, callback);
                    } else {
                        //console.log('登录失败！' + res.errMsg)
                        callback(false);
                    }
                }  
            });
            // window.wx.checkSession({
            //     success: function(){
            //         //session_key 未过期，并且在本生命周期一直有效
            //         callback(true);
            //     },
            //     fail: function(){
            //         // session_key 已经失效，需要重新执行登录流程
            //         window.wx.login({
            //             success: function(res) {
            //                 if (res.code) {
            //                     _this.requestLogin(res.code, callback);
            //                 } else {
            //                     //console.log('登录失败！' + res.errMsg)
            //                     callback(false);
            //                 }
            //             }  
            //         });
            //     }
            // });
        }
        else {
            let skey = this.getUserSkey();
            if(skey) {
                let openid = this.getItemByLocalStorage('openid');
                let uid = this.getItemByLocalStorage('uid');
                D.commonState.userInfo = {openid:openid, uid:uid};
                callback(true);
            }
            else {
                let code = common.guid();
                this.requestLogin(code, callback);
            }
        }
    },
    requestLogin(code, callback) {
        let _this = this;
        let pf = '';
        let model = '';
        if(CC_WECHATGAME) {
            let name = null;
            let img = null;
            let sysInfo = wx.getSystemInfoSync();
            pf = sysInfo.platform;
            model = sysInfo.model;
            if(D.commonState.platform_userinfo ) {
                name = D.commonState.platform_userinfo.nickName;
                img = D.commonState.platform_userinfo.avatarUrl;
            }
            let fromAppId = D.wxFromAppID ? D.wxFromAppID: '';
            let fromUserId = 0;
            let fromType = '';
            if(D.wxLaunchOption && D.wxLaunchOption.query) {
                fromUserId = D.wxLaunchOption.query.fromUserId;
                if( ! fromUserId || fromUserId == undefined) fromUserId = 0;
                fromType = D.wxLaunchOption.query.type;
            }
            httpUtils.post(D.UrlDomain+'/user/login', {Version:D.Versioin}, {code:code, name:name, img:img,pf:pf,model:model,fromAppId:fromAppId,fromUserId:fromUserId,fromType:fromType}, function(res) {
                console.log('user登录返回：', JSON.stringify(res));
                if(res !== -1 && res.code == 0) {
                    _this.setItemByLocalStorage('skey', res.data.skey);
                    D.commonState.skey = res.data.skey;
                    D.commonState.userInfo = res.data;
                    callback(true);
                }
            });
        }
        else {
            httpUtils.post(D.UrlDomain+'/test/login', {Version:D.Versioin}, {code: code, name:'', img:''}, function(res) {
                console.log('test登录返回：', JSON.stringify(res));
                if(res !== -1 && res.code == 0) {
                    _this.setItemByLocalStorage('skey', res.data.skey);
                    _this.setItemByLocalStorage('openid', res.data.openid);
                    _this.setItemByLocalStorage('uid', res.data.uid);
                    D.commonState.skey = res.data.skey;
                    D.commonState.userInfo = res.data;
                    callback(true);
                }
            });
        }
    },
    getUserSkey: function() {
        if(D.commonState.skey) {
            return D.commonState.skey;
        }
        return this.getItemByLocalStorage('skey');
    },
    getUserId: function() {
        if(D.commonState && D.commonState.userInfo) {
            return D.commonState.userInfo.uid;
        }
        return 0;
    },
    getUserInfo: function(callback) {
        if(D.commonState.platform_userinfo) {
            callback(D.commonState.platform_userinfo);
        }
        else {
            if(CC_WECHATGAME) {
                let sysInfo = wx.getSystemInfoSync();
                let sdkVersion = sysInfo.SDKVersion;
                if (sdkVersion >= "2.0.1") {
                    let width = 200;
                    let height = 85;
                    if(sysInfo.screenWidth > 700) {
                        width = 300;
                        height = 127;
                    }
                    if(sysInfo.screenWidth > 1000) {
                        width = 400;
                        height = 170;
                    }
                    var left = sysInfo.screenWidth/2 - width/2;
                    var top = sysInfo.screenHeight*0.75;
                    let wxLoginButton = wx.createUserInfoButton({
                        type: 'image',
                        image: 'src/btn_blue.png',
                        style: {
                            left: left,
                            top: top,
                            width: width,
                            height: height,
                            lineHeight: 40,
                            backgroundColor: '#ff0000',
                            color: '#ffffff',
                            textAlign: 'center',
                            fontSize: 16,
                            borderRadius: 4
                        }
                    });
                    wxLoginButton.onTap((res) => {
                        console.log(JSON.stringify(res));
                        if(res.errMsg == "getUserInfo:ok") {
                            D.commonState.platform_userinfo = res.userInfo;
                            wxLoginButton.destroy();
                            callback(D.commonState.platform_userinfo);
                        }
                        else {
                            window.wx.showModal({
                                title: '友情提醒',
                                content: '请允许微信获得授权!',
                                confirmText: "好的",
                                showCancel: false,
                                success: res => {
                                    console.log(res);
                                },
                                fail: res => {
                                    console.log(res);
                                },
                                complete: res => {
                                    console.log(res);
                                },         
                            });
                        }
                    });
                }
                else {
                    window.wx.getUserInfo({
                        withCredentials: true,
                        lang: 'zh_CN',
                        success: function(res) {
                            D.commonState.platform_userinfo = res.userInfo;
                            callback(D.commonState.platform_userinfo);
                        },
                        fail: function(res) {
                            window.wx.showModal({
                                title: '友情提醒',
                                content: '请允许微信获得授权!',
                                confirmText: "好的",
                                showCancel: false,
                                success: res => {
                                    console.log(res);
                                },
                                fail: res => {
                                    console.log(res);
                                },
                                complete: res => {
                                    console.log(res);
                                },         
                            });
                        },
                        complete: function(res) {
                            
                        }
                    });
                }
            }
        }
    },
    getItemByLocalStorage: function (key, defaultValue) {
        try {
            let value = cc.sys.localStorage.getItem(key);
            if (value === undefined || value === null || value === '') {
                if(defaultValue != undefined && defaultValue !== null && defaultValue !== '') {
                    cc.sys.localStorage.setItem(key, defaultValue);
                }
                return defaultValue;
            }
            if (typeof defaultValue === 'boolean') {
                if (typeof value === 'boolean') {
                    return value;
                }
                return "true" == value;
            } else if (typeof defaultValue === 'number') {
                return Number(value);
            }
            return value;
        }
        catch(e) {
            return defaultValue;
        }
    },
    setItemByLocalStorage: function (key, value) {
        cc.sys.localStorage.setItem(key, value);
    },
    //分享
    shareAppMessage: function(title, imageUrl, queryString, callback, isShareGroup) {
       this.shareAppMessageCallback(title, imageUrl, queryString, callback, isShareGroup);
    },
    //分享
    shareAppMessageCallback: function(title, imageUrl, queryString, callback, isShareGroup) {
        if (CC_WECHATGAME) {
            wx.offHide();
            if(isShareGroup) wx.showShareMenu({withShareTicket: isShareGroup});
            else wx.showShareMenu({withShareTicket: false});
            console.log("title="+title+",querystring="+queryString+",imgurl="+imageUrl);
            window.wx.shareAppMessage({
                title: title,
                query: queryString,
                imageUrl: imageUrl,
                // success: (res) => {
                //     console.log("shareAppMessage", res);
                //     if(callback) callback(true);
                // },
                // fail: (res) => {
                //     console.log("shareAppMessage fail", res);
                //     if(callback) callback(false);
                // },
                // complete: (res) => {
                //     console.log("shareAppMessage complete", res);
                // }
            });
            callback(true);
        }else{
            if(callback){
                callback(-1);
            }
        }
    },
    //视频广告
    createRewardedVideoAd: function(key, successCallback, target) {
        if(false &&　CC_WECHATGAME) {
            let sysInfo = wx.getSystemInfoSync();
            let sdkVersion = sysInfo.SDKVersion;
            if (sdkVersion >= "2.0.4") {
                let rewardedVideoAd = wx.createRewardedVideoAd({ adUnitId: D.wxVideoAdUnitId[key], muted:true });
                cc.audioEngine.pauseAll();
                rewardedVideoAd.show().catch(err => {
                    console.log("createRewardedVideoAd show", key, D.wxVideoAdUnitId[key], err);
                    rewardedVideoAd.load().then(() => rewardedVideoAd.show());
                });
                rewardedVideoAd.onClose(res => {
                    console.log("createRewardedVideoAd onClose", res);
                    cc.audioEngine.resumeAll();
                    if (res && res.isEnded || res === undefined) {
                        if(target && successCallback){
                            successCallback.apply(target);
                        }else{
                            successCallback();
                        }
                    }else{
                        common.sysMessage("观看完整广告才能获得免费奖励");
                    }
                    rewardedVideoAd.offClose();
                    rewardedVideoAd.offLoad();
                    rewardedVideoAd.offError();
                    rewardedVideoAd = null;
                });
            }
        }else{
            successCallback(-1);
        }
    },
    hideWxLayer: function() {
        this.hideBannerAd();
        // this.closeGameClub();
    },
    showWxLayer: function() {
        this.createBannerAd();
        // this.gameClub();
    },
    hideBannerAd: function() {
        if(CC_WECHATGAME) {
            let oldBannerAd = D.commonState.wxBannerAd;
            if(oldBannerAd) {
                oldBannerAd.hide();
            }
        }
    },
    //banner广告
    createBannerAd: function(special) {
        return;
        if(common.popLayerNum > 0 && !special) return;
        
        if(CC_WECHATGAME) {
            let sysInfo = wx.getSystemInfoSync();
            let sdkVersion = sysInfo.SDKVersion;
            if (sdkVersion >= "2.0.4") {
                let oldBannerAd = D.commonState.wxBannerAd;
                if(oldBannerAd) {
                    // oldBannerAd.show();
                    // return;
                    oldBannerAd.destroy();
                    oldBannerAd = null;
                }
                console.log(sysInfo);
                var w = sysInfo.screenWidth / 2;
                var h = sysInfo.screenHeight;
                let bannerAd = wx.createBannerAd({
                    adUnitId: D.wxAdUnitId,
                    style: {
                        width: 600,
                        height: 181,
                        top: h - 181 + 0.1,
                        left: 0
                    }
                });
                bannerAd.onResize(res => {
                    console.log('banner resize.', JSON.stringify(res));
                    bannerAd.style.width = res.width;
                    bannerAd.style.height = res.height;
                    bannerAd.style.left = w - bannerAd.style.realWidth / 2 + 0.1;
                    bannerAd.style.top = h - bannerAd.style.realHeight + 0.1;
                    console.log(bannerAd);
                });
                bannerAd.show();
                D.commonState.wxBannerAd = bannerAd;
            }
        }
    },
    //游戏圈
    gameClub: function() {
        // if(CC_WECHATGAME) {
        //     if(D.wxGameClubBtn) {
        //         D.wxGameClubBtn.show();
        //         return;
        //     }
            
        //     let sysInfo = wx.getSystemInfoSync();
        //     console.log('wechat game club....', JSON.stringify(sysInfo))
        //     let sdkVersion = sysInfo.SDKVersion;
        //     if (sdkVersion >= "2.0.3") {
        //         let width = 40;
        //         let height = 40;
        //         if(sysInfo.screenWidth < 350) {
        //             width = 36;
        //             height = 36;
        //         }
        //         if(sysInfo.screenWidth > 700) {
        //             width = 80;
        //             height = 80;
        //         }
        //         if(sysInfo.screenWidth > 1000) {
        //             width = 100;
        //             height = 100;
        //         }
        //         var left = sysInfo.screenWidth/10 - width/2;
        //         var top = sysInfo.screenHeight*0.01;
        //         if(sysInfo.model == 'iPhone X') {
        //             top = sysInfo.screenHeight*0.05;
        //         }
        //         console.log("sysInfo.screenWidth", sysInfo.screenWidth);
        //         console.log("sysInfo.screenHeight", sysInfo.screenHeight);
        //         let clubBtn = wx.createGameClubButton({
        //             type: 'image',
        //             // image: 'src/btn_weixin.png',
        //             icon: "white",//"green",//
        //             style: {
        //                 left: left,
        //                 top: top,
        //                 width: width,
        //                 height: height,
        //                 lineHeight: 40,
        //                 backgroundColor: '#ff0000',
        //                 color: '#ffffff',
        //                 textAlign: 'center',
        //                 fontSize: 16,
        //                 borderRadius: 4
        //             }
        //         });
        //         clubBtn.show();
        //         D.wxGameClubBtn = clubBtn;

        //         if(D.curSceneName != "Start"){
        //             this.closeGameClub();
        //         }
        //     }
        // }
    },
    closeGameClub: function() {
        // if(CC_WECHATGAME) {
        //     if(D.wxGameClubBtn) {
        //         D.wxGameClubBtn.destroy();
        //         D.wxGameClubBtn = null;
        //     }
        // }
    },
    requestGameInfo: function(callback) {
        if(D.commonState.userGameInfo) {
            callback(D.commonState.userGameInfo);
            return ;
        }
        httpUtils.get(D.UrlDomain+'/user/game-info', {Authorization: this.getUserSkey(), Version:D.Versioin}, function(res) {
            if(res !== -1 && res.code == 0) {
                D.commonState.userGameInfo = res.data;
                callback(res.data);
                console.log("***************",res.data);
            }
        });
    },
    //获取最高分
    getHigthScore: function(callback) {
        let _this = this;
        let highestScore = this.getItemByLocalStorage('highestScore', 0);
        if( ! highestScore || highestScore <=0) {
            this.requestGameInfo(function(userGameInfo) {
                console.log("getHigthScore userGameInfo", JSON.stringify(userGameInfo));
                if( ! userGameInfo.higthScore) userGameInfo.higthScore = 0;
                callback(userGameInfo.higthScore);
            });
        }
        else {
            console.log("getHigthScore highestScore", highestScore);
            callback(highestScore);
        }
    },
    //设置获取最高分
    setAndGetHigthScore: function(score, callback) {
        let _this = this;
        let highestScore = this.getItemByLocalStorage('highestScore', 0);
        if( ! highestScore || highestScore <=0) {
            this.requestGameInfo(function(userGameInfo) {
                if( ! userGameInfo.higthScore) userGameInfo.higthScore = 0;
                if(score > userGameInfo.higthScore) {
                    _this.requestUpdateHigthScore(score);
                    callback(score);
                }
                else {                
                    callback(userGameInfo.higthScore);
                }
            });
        }
        else {
            if(score > highestScore) {
                _this.requestUpdateHigthScore(score);
                callback(score);
            }
            else {                
                callback(highestScore);
            }
        }
    },
    //最高分
    requestUpdateHigthScore: function(score) {
        this.setItemByLocalStorage('highestScore', score);
        httpUtils.post(D.UrlDomain+'/user/update-best-score', {Authorization: this.getUserSkey(), Version:D.Versioin}, {higthScore:score}, function(res) {
            
        });
    },
    requestAddCoin: function(coin, reason, callback) {
        httpUtils.post(D.UrlDomain+'/user/add-coin', {Authorization: this.getUserSkey(), Version:D.Versioin}, {coin: coin, reason: reason}, function(res) {
            if(res !== -1 && res.code == 0) {
                D.commonState.userGameInfo.coin = res.data.currCoin;
                if(callback) callback(res.data);
            }
        });
    },
    requestHeroList: function(callback) {
        if(D.commonState.heroList) {
            callback(D.commonState.heroList);
            return;
        }
        let fightHeroKind = this.getItemByLocalStorage('fightHeroKind', 1);
        console.log('fightHeroKind', fightHeroKind);
        httpUtils.get(D.UrlDomain+'/hero/list', {Authorization: this.getUserSkey(), Version:D.Versioin}, function(res) {
            if(res !== -1 && res.code == 0) {
                D.commonState.heroList = res.data;

                ////容错
                let found = false
                for (let i = 0; i < D.commonState.heroList.length; i++) {
                    let element = D.commonState.heroList[i];
                    if (element.kind == fightHeroKind) {
                        found = true
                        break;
                    }
                }
                if (!found) {
                    fightHeroKind = 1
                }

                ///////////////////////
                for(let i=0; i<D.commonState.heroList.length; i++) {
                    let element = D.commonState.heroList[i];
                    console.log("hero list init---" + element.kind + "_" + element.subSeq);
                    if(element.kind == fightHeroKind) {
                        D.currHero = element;
                        element.status = 2;
                        break;
                    }
                }
                callback(res.data);
            }
        });
    },
    requestHeroUpgrade: function(kind, type, callback) {
        let _this = this;
        httpUtils.post(D.UrlDomain+'/hero/upgrade', {Authorization: this.getUserSkey(), Version:D.Versioin}, {kind:kind,type:type}, function(res) {
            if(res !== -1 && res.code == 0) {
                let hero = res.data.hero;
                if(D.commonState.heroList) {
                    for(let i=0; i<D.commonState.heroList.length; i++) {
                        let element = D.commonState.heroList[i];
                        if(element.kind == hero.kind) {
                            D.commonState.heroList[i] = hero;
                        }
                    }
                }                
                if(D.currHero && D.currHero.kind > 0 && D.currHero.kind == hero.kind) {
                    D.currHero = hero;
                }
                _this.requestGameInfo(function(userGameInfo) {
                    if(userGameInfo) userGameInfo.coin = res.data.myCoin;
                });
                callback(res.data);
            }else if(res.code == 2010){
                callback(res.code);
            }
        });
    },
    requestUpdateFightStatus: function(heroKind, callback) {
        if(D.commonState.heroList) {
            D.commonState.heroList.forEach(element => {
                if(element.kind == heroKind) {
                    element.status = 2;
                    console.log("requestUpdateFightStatus", heroKind);
                    D.currHero = element;
                }
                else {
                    if(element.status == 2) element.status = 1;
                }
            });
        }
        this.setItemByLocalStorage('fightHeroKind', heroKind);
        // httpUtils.get(D.UrlDomain+'/hero/fight?kind='+ heroKind, {Authorization: this.getUserSkey()}, function(res) {
        //     if(res !== -1 && res.code == 0) {
        //         callback(res.data);
        //     }
        // });
    },
    requestUpdateHeroStatus: function(heroKind, fromStatus, toStatus, callback) {
        if(D.commonState.heroList) {
            D.commonState.heroList.forEach(element => {
                if(element.kind == heroKind) {
                    element.status = toStatus;
                }
            });
        }
        httpUtils.post(D.UrlDomain+'/hero/update-status', {Authorization: this.getUserSkey(), Version:D.Versioin}, {kind:heroKind,fromStatus:fromStatus,toStatus:toStatus}, function(res) {
            if(res !== -1 && res.code == 0) {
                callback(res.data);
            }
        });
    },
    requestNewHeroUseCoin: function(heroKind, callback) {
        httpUtils.get(D.UrlDomain+'/hero/get-use-coin?kind='+ heroKind, {Authorization: this.getUserSkey(), Version:D.Versioin}, function(res) {
            if(res !== -1 && res.code == 0) {
                let hero = res.data.hero;
                if(D.commonState.heroList) {
                    let flag = false;
                    for(let i=0; i<D.commonState.heroList.length; i++) {
                        let element = D.commonState.heroList[i];
                        if(element.kind == hero.kind) {
                            D.commonState.heroList[i] = hero;
                            flag = false;
                            break;
                        }else{
                            flag = true;
                        }
                    }
                    if(flag) {
                        D.commonState.heroList.push(hero);
                    }
                }
                callback(res.data);
            }
        });
    },
    requestonFromRewardShare: function(fromUserId) {
        let _this = this;
        this.getUserInfo(function(res) {
            let name = res.nickName;
            let headimg = res.avatarUrl;
            httpUtils.post(D.UrlDomain+'/share/award/be-opened', {Authorization: _this.getUserSkey(), Version:D.Versioin}, {fromUserId:fromUserId,name:name,headimg:headimg}, function(res) {
                if(res !== -1 && res.code == 0) {
                    
                }
            });
        });
    },
    requestShareAwardList:function(callback) {
        httpUtils.get(D.UrlDomain+'/share/award/list-friends', {Authorization: this.getUserSkey(), Version:D.Versioin}, function(res) {
            if(res !== -1 && res.code == 0) {
                callback(res.data);
            }
        });
    },
    requestShareAward:function(awardId, callback) {
        httpUtils.get(D.UrlDomain+'/share/award/'+awardId, {Authorization: this.getUserSkey(), Version:D.Versioin}, function(res) {
            if(res !== -1 && res.code == 0) {
                callback(res.data);
            }else if(res.code == 2020 || res.code == 2021){
                callback(res.code);
            }
        });
    },
    requestHelp: function(fromKey, callback) {
        httpUtils.post(D.UrlDomain+'/share/help',{Authorization: this.getUserSkey(), Version:D.Versioin}, {fromKey:fromKey}, function(res){
            console.log('/share/help', res);
        })
    },

    requestHelpList:function(callback) {
        httpUtils.post(D.UrlDomain+'/share/help/list', {Authorization: this.getUserSkey(), Version:D.Versioin},{}, function(res) {
            if(res !== -1 && res.code == 0) {
                if(callback){
                    callback(res.data);
                }
            }
        });
    },
    requestHelpReceive:function(id, callback) {
        httpUtils.get(D.UrlDomain+'/share/help/recv/'+id, {Authorization: this.getUserSkey(), Version:D.Versioin}, function(res) {
            if(res !== -1 && res.code == 0) {
                callback(res.data);
            }else if(res.code == 2020 || res.code == 2021){
                callback(res.code);
            }
        });
    },

    requestCfg: function(callback) {
        if(D.SvrCfgsReturn === false) {
            httpUtils.get(D.UrlDomain+'/cfgs?ver='+D.Versioin, {Authorization: this.getUserSkey(), Version:D.Versioin}, function(res) {
                if(res !== -1 && res.code == 0) {
                    D.SvrCfgs = res.data;
                    // D.SvrCfgs.navName = ["阿波罗"];
                    // D.SvrCfgs.nav = ["wx5079dbb42e9672b7"];
                    // D.SvrCfgs.cgnav = ["wx5079dbb42e9672b7"];
                    console.log(D.SvrCfgs)
                    D.SvrCfgs.ShareCfgs = {};
                    res.data.shares.forEach(element => {
                        D.SvrCfgs.ShareCfgs[element.func] = element.mode;
                    });
                    if(res.data.urls) {
                        D.wxMoreGameUrls = res.data.urls;
                    }
                    D.SvrCfgsReturn = true;
                    callback();
                }
            });
        }
        else {
            callback();
        }
    },
    requestShareCfg:function(keys, callback) {
        if(D.SvrCfgsReturn === false) {
            let _this = this;
            this.requestCfg(function() {
                _this.doCallbackShareCfg(keys, callback);
            })
        }
        else {
            this.doCallbackShareCfg(keys, callback);
        }
    },
    doCallbackShareCfg: function(keys, callback) {
        var keysArr = String(keys).split(',');
        if(keysArr.length == 1) {
            callback(D.SvrCfgs.ShareCfgs[keys]);
        }
        else {
            let res = {};
            keysArr.forEach(element => {
                res[element] = D.SvrCfgs.ShareCfgs[element];
            });
            callback(res);
        }
    },
    requestAddQzbFriend: function(fromUserId) {
        httpUtils.post(D.UrlDomain+'/user/add-qzb-friend',{Authorization: this.getUserSkey(), Version:D.Versioin}, {fromUserId:fromUserId}, function(res){
            console.log('/user/add-qzb-friend', res);
        })
    },
    //请求助力币复活    增加 qzbNum >0 , 减少 qzbNum <0
    requestRecover:function(qzbNum,callback) {
        let _this = this;
        httpUtils.post(D.UrlDomain+'/user/add-qzb',{Authorization: this.getUserSkey(), Version:D.Versioin}, {qzb:qzbNum}, function(res){
            if(res !== -1 && res.code == 0) {
                _this.requestGameInfo(function(userGameInfo) {
                    userGameInfo.qzb = res.data.currQzb;
                    if(userGameInfo.qzb < 0) userGameInfo.qzb = 0;
                });
                callback(true);
            }else if(res.code == 2011){
                callback(false);
            }
        })
    },
    //关注奖励飞机
    requestFollowAward: function(callback,callbackObj) {
        httpUtils.post(D.UrlDomain+'/hero/award',{Authorization: this.getUserSkey(), Version:D.Versioin}, {}, function(res){
            if(res !== -1 && res.code == 0) {
                let hero = res.data.hero;
                if(D.commonState.heroList) {
                    let flag = false;
                    for(let i=0; i<D.commonState.heroList.length; i++) {
                        let element = D.commonState.heroList[i];
                        if(element.kind == hero.kind) {
                            D.commonState.heroList[i] = hero;
                            flag = true;
                        }
                    }
                    if(flag) {
                        D.commonState.heroList.push(hero);

                        if (callback) {
                            callback.apply(callbackObj)
                        }
                    }
                }
            }
        })
    },
    //签到
    requestSignIn: function(num,callback){
        httpUtils.post(D.UrlDomain+'/sign/sign-in/v2',{Authorization: this.getUserSkey(), Version:D.Versioin}, {signNum:num}, function(res){
            if(res !== -1 && res.code == 0) {
                callback(res.data);
            }
        })
    },
    requestSignList: function(callback){
        httpUtils.post(D.UrlDomain+'/sign/list',{Authorization: this.getUserSkey(), Version:D.Versioin},{},function(res){
            if(res !== -1 && res.code == 0){
                callback(res.data);
            }
        })
    },
    requestBill: function(card,slot,act,ext1,ext2,ext3,ext4,ext5) {
        httpUtils.post(D.UrlDomain+'bill/v2',{Authorization: this.getUserSkey(), Version:D.Versioin},{
            card: card,
            slot: slot,
            act: act,
            ext1: ext1 || 0,
            ext2: ext2 || 0,
            ext3: ext3 || 0,
            ext4: ext4 || 0,
            ext5: ext5 || 0,
        },function(res){});
    },
    isTodayWxVideoBeyond: function() {
        let todayWxVideoVal = platformUtils.getItemByLocalStorage('TodayWxVideo');
        let res = false;
        if(todayWxVideoVal) {
            let todayWxVideo = new Date(todayWxVideoVal);
            if(common.isSameDay(todayWxVideo)) {
                return platformUtils.getItemByLocalStorage('TodayWxVideoCnt', 0) < D.wxVideoMaxNum;
            }
            else {
                platformUtils.setItemByLocalStorage('TodayWxVideoCnt', 0);
                res = true;
            }
        }
        else res = true;
        return res;
    },
    setTodayWxVideo: function() {
        platformUtils.setItemByLocalStorage('TodayWxVideoCnt', platformUtils.getItemByLocalStorage('TodayWxVideoCnt', 0) + 1);
        platformUtils.setItemByLocalStorage('TodayWxVideo', new Date());
    },
    isTodayWxAwardShareBeyond: function() {
        let todayWxAwardShareVal = platformUtils.getItemByLocalStorage('TodayWxAwardShare');
        let res = false;
        if(todayWxAwardShareVal) {
            let todayWxAwardShare = new Date(todayWxAwardShareVal);
            if(common.isSameDay(todayWxAwardShare)) {
                return platformUtils.getItemByLocalStorage('TodayWxAwardShareCnt', 0) < D.wxAwardShareMaxNum;
            }
            else {
                platformUtils.setItemByLocalStorage('TodayWxAwardShareCnt', 0);
                res = true;
            }
        }
        else res = true;
        return res;
    },
    setTodayWxAwardShare: function() {
        platformUtils.setItemByLocalStorage('TodayWxAwardShareCnt', platformUtils.getItemByLocalStorage('TodayWxAwardShareCnt', 0) + 1);
        platformUtils.setItemByLocalStorage('TodayWxAwardShare', new Date());
    },

    requestItemList: function(callback,isUpdate){
        if(D.commonState.itemList && !isUpdate){
            callback(D.commonState.itemList)
            return;
        }
        httpUtils.post(D.UrlDomain+'/item/list',{Authorization: this.getUserSkey(), Version:D.Versioin},{},function(res){
            if(res !== -1 && res.code == 0){
                callback(res.data);
                D.commonState.itemList = res.data;
            }
        })
    },

    //幸运抽奖剩余视频次数
    lotteryVideoCount: function(){
        //跨天
        let todayLotteryVal = platformUtils.getItemByLocalStorage('TodayLotteryVideoTime');
        if(todayLotteryVal){
            let todayDate = new Date(todayLotteryVal);
            if(!common.isSameDay(todayDate)) {
                platformUtils.setItemByLocalStorage("TodayLotteryVideoCnt",0);
            }
        }

        let totoalVideoNum = D.wxVideoMaxNum - platformUtils.getItemByLocalStorage('TodayWxVideoCnt', 0);
        let curVideoCnt = D.lotteryVideoDrawCount - platformUtils.getItemByLocalStorage('TodayLotteryVideoCnt', 0);
        let canCnt = totoalVideoNum > curVideoCnt ? curVideoCnt : totoalVideoNum;
        
        return canCnt;
    },

    //新手礼包邀请列表
    requestInviteNewList: function(callback){
        if(D.commonState.newgiftsList){
            if(callback){
                callback(D.commonState.newgiftsList)
            }
            return;
        }


        httpUtils.get(D.UrlDomain+'/share/invite-new/list', {Authorization: this.getUserSkey(), Version:D.Versioin}, function(res) {
            if(res !== -1 && res.code == 0){
                if(callback){
                    callback(res.data);
                }
                D.commonState.newgiftsList = res.data;
            }
        });
    },

    //新手礼包领取奖励
    requestNewgiftsReceive: function(callback){
        httpUtils.post(D.UrlDomain+'/share/invite-new/recv',{Authorization: this.getUserSkey(), Version:D.Versioin},{},function(res){
            if(res !== -1 && res.code == 0){
                if(callback){
                    callback(res.data);
                }
            }
        });
    },

    //助力好友
    requestonFromHelpShare: function(fromUserId, callback) {
        console.log("助力了好友,111111111,fromUserId="+fromUserId);
        httpUtils.get(D.UrlDomain+'/user/base-info?fuserId='+fromUserId, {Authorization: this.getUserSkey(), Version:D.Versioin}, function(res) {
            console.log("助力了好友,res=",res);
            if(res !== -1 && res.code == 0){
                if(callback){
                    callback(res.data);
                }
            }
        });
    },

    //好友对战列表
    requestBattleList: function(fromUserId,callback){
        httpUtils.get(D.UrlDomain+'/match/list/'+fromUserId, {Authorization: this.getUserSkey(), Version:D.Versioin}, function(res) {
            if(res !== -1 && res.code == 0){
                if(callback){
                    callback(res.data);
                }
            }
        });
    },

    //发起对战
    requestBattleAdd: function(heroKind,heroSeq,score,callback){
        httpUtils.post(D.UrlDomain+'/match/add', {Authorization: this.getUserSkey(), Version:D.Versioin},{heroKind:heroKind,heroSeq:heroSeq,score:score}, function(res) {
            // if(res !== -1 && res.code == 0){
                if(callback){
                    callback(res.data);
                }
            // }
        });
    },

    //上报对战分数
    requestBattleAddScore: function(data, callback){
        httpUtils.post(D.UrlDomain+'/match/add-user', {Authorization: this.getUserSkey(), Version:D.Versioin}, data, function(res) {
            // if(res !== -1 && res.code == 0){
                if(callback){
                    callback(res.data);
                }
            // }
        });
    },

    //好友对战列表
    requestBattleRecv: function(callback){
        httpUtils.get(D.UrlDomain+'/match/recv', {Authorization: this.getUserSkey(), Version:D.Versioin}, function(res) {
            if(res !== -1 && res.code == 0){
                if(callback){
                    callback(res.data);
                }
            }
        });
    },

    //红包掉落金币
    requestRedpacketReady: function(reason, callback){
        httpUtils.get(D.UrlDomain+'/user/ready-money/'+reason, {Authorization: this.getUserSkey(), Version:D.Versioin}, function(res) {
            if(res !== -1 && res.code == 0){
                if(callback){
                    callback(res.data);
                }
            }
        }); 
    },

    //红包存入金币
    requestRedpacketAdd: function(reason,money, callback){
        httpUtils.post(D.UrlDomain+'/user/add-money', {Authorization: this.getUserSkey(), Version:D.Versioin},{reason:reason,money:money}, function(res) {
            if(res !== -1 && res.code == 0){
                if(callback){
                    callback(res.data);
                }
            }
        }); 
    },

    //公告
    requestNotice: function(callback){
        if(D.commonState.notice){
            callback(D.commonState.notice);
            return;
        }
        httpUtils.get(D.UrlDomain+'/notice/list', {Authorization: this.getUserSkey(), Version:D.Versioin}, function(res) {
            if(res !== -1 && res.code == 0){
                D.commonState.notice = res.data;
                if(callback){
                    callback(res.data);
                }
            }
        }); 
    },
};
module.exports = platformUtils;