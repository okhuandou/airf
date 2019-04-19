var common = require('common');
var sceneManager = require('sceneManager');
var platformUtils = require('PlatformUtils');
var poolClass = require('pool');
var storageUtils = require('StorageUtils');
var taskUtils = require('taskUtils');

cc.Class({
    extends: cc.Component,

    properties: {
        btnStart: {
            default: null,
            type: cc.Button
        },
        btn_upgrade: {
            default: null,
            type: cc.Button
        },
        btnSound: {
            default: null,
            type: cc.AudioClip
        },
        topPrefab: cc.Prefab,
        upgradePrefab: cc.Prefab,
        shareAwardPrefab: cc.Prefab,
        followAwardPrefab: cc.Prefab,
        btnShare: cc.Button,
        // btnFollowMp: cc.Button,
        // btnMoreGame: cc.Button,
        sprPlane: cc.Sprite,
        dailySignInPrefab: cc.Prefab,
        planeBulSpr: cc.Sprite,
        planeBulPrefab: cc.Prefab,
        hallSound: {
            default: null,
            type: cc.AudioClip,
        },
        // btnWinxin: cc.Button,
        sprSoundOpen: cc.Sprite,
        sprSoundClose: cc.Sprite,
        btn_chuzhan_arrow_right: cc.Sprite,
        btn_chuzhan_arrow_left: cc.Sprite,
        nodeGuide: cc.Node,
        btnMoreGame2: cc.Button,
        // labMoreGameRedpoint: cc.Label,
        btn_txt_chuzhan:cc.Sprite,
        btn_txt_5000gm:cc.Sprite,
        btn_txt_gzjs:cc.Sprite,
        btn_txt_cz_bg:cc.Sprite,
        btn_txt_7rlq:cc.Sprite,
        redPointNode: cc.Node,
        // followRedPointNode: cc.Node,
        shareRedPointNode: cc.Node,

        btn_video: cc.Button,
        btn_share: cc.Button,
        btn_moregame_menu: cc.Button,
        lotteryDrawPrefab: cc.Prefab,
        lotteryRed: cc.Sprite,
        btn_newgifts: cc.Button,
        newGiftsPrefab: cc.Prefab,
        dailyTaskPrefab: cc.Prefab,
        friendHelpPrefab: cc.Prefab,
        spr_task_red: cc.Sprite,
        battlePrefab: cc.Prefab,

        node_redpacket: cc.Node,
        node_notice_item: cc.Node,
        lab_redpacket: cc.Label,
        richtext_award: cc.RichText,
        redpacketCrashPrefab: cc.Prefab,
    },

    queryDeal:function (query) {
        if(query) {
            console.log("queryDeal=",JSON.stringify(query));
            switch(query.type) {
                case 'shareAward':
                this.onFromRewardShare(query.fromUserId);
                break;
                case 'shareUnlock':
                this.onFromUnlockShare(query.fromUserId);
                break;
                case 'shareQzb':
                this.onFromQzbShare(query.fromUserId);
                break;
                case 'shareHelp':
                this.onFromRewardShareTips(query.fromUserId);
                break;
                case 'shareBattle':
                this.onFromBattleShare(query.fromUserId);
                break;
            }  
        }    
    },
    // use this for initialization
    onLoad: function () {
        D.curSceneName = "Start";
        this.btn_txt_chuzhan.node.active = false
        this.btn_txt_5000gm.node.active = false
        this.btn_txt_gzjs.node.active = false
        this.btn_txt_cz_bg.node.active = false
        this.btn_txt_7rlq.node.active = false
        
        common.hideLoading();
        common.clearPopLayer();
        
        let _this = this;
        console.log("start onLoad.......................");
        poolClass.initPool(this,this.planeBulPrefab.data);
        if(Device.needOffsetPixel()){ //iphone x适配
            let btn_node = this.node.getChildByName('btn_node').getComponent(cc.Widget);
            if (btn_node){
                btn_node.top =  btn_node.top + 70;
            }
            this.node_redpacket.getComponent(cc.Widget).top += 70;
        }
        //////////////////先做大厅基本的展示，再弹框
        // this.btnWinxin.node.active = false;
        this.btn_upgrade.node.setScale(-1,1);

        //这里需要做一下按钮调整，所以先隐藏掉
        let btnShareX = _this.btnShare.node.position.x;
        this.btnShare.node.active = false;
        if( ! D.isVoideClose) {
            this.sprSoundOpen.node.opacity = 255;
            this.sprSoundClose.node.opacity = 0;
        }else{
            this.sprSoundOpen.node.opacity = 0;
            this.sprSoundClose.node.opacity = 255;
        }
        // this.btnFollowMp.node.active = false;
        // this.btnMoreGame.node.active = false;
        platformUtils.requestShareCfg('giftInMain', function(res) {
            // _this.btnFollowMp.node.active = true;
            // _this.btnMoreGame.node.active = true;
            if( ! res) {
                //隐藏
                // _this.btnFollowMp.node.x = btnShareX;
                _this.btnShare.node.active = false;
            }            
            else {                
                _this.btnShare.node.active = true;
                _this.btn_share.node.active = true;
            }
        });
        //大厅分享获得星星
        this.btn_share.node.active = false;
        this.btn_video.node.active = false;
        platformUtils.requestShareCfg('shareAwardInMain,videoAwardInMain', function(res) {
            if(res['shareAwardInMain'] == 's') {
                _this.btn_share.node.active = true;
            }else if(res['videoAwardInMain'] == 'v') {
                _this.btn_video.node.active = true;
            }
        });

        ///////点击切换飞机
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.btn_chuzhan_arrow_right.node.on(cc.Node.EventType.TOUCH_START, this.touchRight, this);
        this.btn_chuzhan_arrow_left.node.on(cc.Node.EventType.TOUCH_START, this.touchLeft, this);


        //飞机动画
        this.movePlane(this.sprPlane.node.y);
        // this.onPlaneBullet(1,1);
        platformUtils.requestHeroList(function(res){
            res.forEach(element => {
                if(element.status == 2) {
                    //出战
                    console.log("出战", element);
                }
                // if(element.kind == 2) {    //关注礼包红点
                //     if(element.status == 1 || element.status == 2) {
                //         _this.followRedPointNode.active = false;
                //     }
                // }
            });
            if( ! D.currHero   ) {
                console.log(" curr hero is null...");
            }
            console.log('D.currHero', JSON.stringify(D.currHero));
            let currHeroKind = D.currHero ? D.currHero.kind: 1;
            let currHeroIdx = D.currHero.subSeq ? D.currHero.subSeq: 1;
            let currHeroLv = D.currHero.level ? D.currHero.level: 1;
            _this.onUpdatePlaneBulletLevel(currHeroKind, currHeroIdx);
        });
        
        //微信相关判断
        if(CC_WECHATGAME) {
            if(D.wxLaunchOption) {
                let isSticky = D.wxLaunchOption.isSticky;
                let shareTicket = D.wxLaunchOption.shareTicket;
                let query = D.wxLaunchOption.query;
                if(isSticky || D.wxLaunchOption.scene == 1104 || (D.wxLaunchOption.__public && D.wxLaunchOption.__public.scene == 1089)) {
                    //收藏了本游戏
                    this.onFollowThisApp();
                }
                if(shareTicket) {
                    this.gotoGroupRank(shareTicket);
                }
                this.queryDeal(query);
                D.wxLaunchOption = null;
            }
            wx.onShow(function(res) {
                console.log("onShow res=", JSON.stringify(res));
                console.log("D.wxShareTicket =", D.wxShareTicket);

                //回到前台，要再次监听关闭事件
                platformUtils.onHide(
                    function() {
                        //关闭按钮账单，PS：根据不同游戏的定义进行上报不同的key
                        platformUtils.requestBill(100001, 2, 200)
                    }
                );
                if(res.scene == 1089 || res.scene == 1104) {
                    _this.onFollowThisApp();
                }
                if(res.shareTicket && res.shareTicket != D.wxShareTicket) {
                    D.wxShareTicket = res.shareTicket;
                    _this.gotoGroupRank(res.shareTicket);
                }
                //_this.queryDeal(res.query);//由于query里面的参数是分享给别人的，这里不做处理
                if(res.query && res.query.type == 'shareAward') {
                    _this.onFromRewardShare(res.query.fromUserId);
                }else if(res.query && res.query.type == 'shareHelp') {
                    _this.onFromRewardShareTips(res.query.fromUserId);
                }else if(res.query && res.query.type == 'shareBattle') {
                    _this.onFromBattleShare(res.query.fromUserId);
                    _this.isShareBattle = true;
                }
                
                _this.playBackgroupMusic();
            });
           
        }

        
        if(CC_WECHATGAME) 
        {
            //广告
            platformUtils.createBannerAd();
            // platformUtils.gameClub();
        }
        //助力礼包红点
        if(D.commonState.shareFriendNum >= 6){
            this.shareRedPointNode.active = false;
        }

        if(!D.SvrCfgs.nav2 || D.SvrCfgs.nav2.length == 0){
            this.btn_moregame_menu.node.active = false;
        }

        this.replayBackgroupMusic();

        this.initShareAndVideo();

        this.initkSign();
        this.initUpgrade();
        this.initLotteryRed();
        this.initNewGifts();
        this.initMoreGame2();
        this.initRedpacket();
        // platformUtils.setItemByLocalStorage('TodayWxVideoCnt', 0);
    },

    initkSign: function(){
        console.log("---------- initkSign");
        let _this = this;
        //签到弹框
        platformUtils.requestGameInfo(function(res) {
            D.commonState.userGameInfo.coin = res.coin;
            D.commonState.userGameInfo.qzb = res.qzb;

            let money = D.commonState.userGameInfo ? D.commonState.userGameInfo.money : "0:00";
            _this.lab_redpacket.string = "￥" + money;

            //签到
            _this.redPointNode.active = false;
            if(platformUtils.getItemByLocalStorage('todayCanSign',true) && !D.isAutoPopedDailySign){
                _this.redPointNode.active = true;
                _this.onBtnSignIn(null,true);
                D.isAutoPopedDailySign = true;
            }else{  //已签到过
                let signTimeLocal = platformUtils.getItemByLocalStorage('signTime');
                if(signTimeLocal != 'undefined'){
                    let signTime = new Date(signTimeLocal);
                    let nowTime = new Date();
            
                    let signDate = signTime.getDate();//日
                    let signMonth = signTime.getMonth();//月
                    let signYear = signTime.getFullYear();//年
            
                    let nowDate = nowTime.getDate();
                    let nowMonth = nowTime.getMonth();
                    let nowYear = nowTime.getFullYear();
                    let isSameflag = signYear == nowYear &&  signMonth == nowMonth && signDate == nowDate?true:false;

                    if( ! isSameflag && !D.isAutoPopedDailySign){
                        _this.redPointNode.active = true;
                        _this.onBtnSignIn(null,true);
                        D.isAutoPopedDailySign = true;
                    }else if( ! platformUtils.getItemByLocalStorage('signShare') && ! D.commonState.signShare && !D.isAutoPopedDailySign){//没分享弹框
                        D.commonState.signShare = true;;
                        _this.redPointNode.active = true;
                        _this.onBtnSignIn(null,true);
                        D.isAutoPopedDailySign = true;
                    }else if(platformUtils.getItemByLocalStorage('signShare') && ! D.commonState.signShare){
                        D.commonState.signShare = true;;
                        let signShare = new Date(platformUtils.getItemByLocalStorage('signShare'));
                        let nowTime = new Date();
                
                        let signDate = signShare.getDate();//日
                        let signMonth = signShare.getMonth();//月
                        let signYear = signShare.getFullYear();//年
                
                        let nowDate = nowTime.getDate();
                        let nowMonth = nowTime.getMonth();
                        let nowYear = nowTime.getFullYear();
                        let isSameflag = signYear == nowYear &&  signMonth == nowMonth && signDate == nowDate?true:false;
                        if( ! isSameflag && !D.isAutoPopedDailySign){ //今日没分享过弹框
                            _this.redPointNode.active = true;
                            _this.onBtnSignIn(null,true);
                            D.isAutoPopedDailySign = true;
                        }
                    }
                }
            }
        });
    },

    initUpgrade: function(){
        if(sceneManager.preSceneName != "Game"){
            return;
        }

        let _this = this;
        let mCoin = 0;
        platformUtils.requestGameInfo(function(res) {
           mCoin = res.coin; 
        });

        let heroCfgs = common.getJsonCfgs('hero');
        let canUpgrade = function(heroInfo){
            let state = false;
            if(!heroCfgs || heroCfgs.length == 0){
                return state;
            }

            for (let index = 0; index < heroCfgs.length; index++) {
                let heroCfg = heroCfgs[index];
                if( heroInfo.id == heroCfg.id) {
                    let powerLevel = heroInfo.powerLevel > 0 ? heroInfo.powerLevel : 1;
                    let powerNeed = heroCfg.powerNeed + heroCfg.powerNeedIncr*(heroInfo.powerLevel - 1);
                    if(mCoin >= powerNeed){
                        state = true;
                        break;
                    }

                    let bloodLevel = heroInfo.bloodLevel > 0 ? heroInfo.bloodLevel : 1;
                    let bloodNeed = heroCfg.bloodNeed + heroCfg.bloodNeedIncr*(heroInfo.bloodLevel - 1);
                    if(mCoin >= bloodNeed){
                        state = true;
                        break;
                    }

                    let attackSpeedLevel = heroInfo.attackSpeedLevel > 0 ? heroInfo.attackSpeedLevel : 1;
                    let speedNeed = heroCfg.attackSpeedNeed + heroCfg.attackSpeedNeedIncr*(heroInfo.attackSpeedLevel - 1);
                    if(mCoin >= speedNeed){
                        state = true;
                        break;
                    }
                }
            }
            return state;
        }

        let isCanUpgrade = false;
        platformUtils.requestHeroList(function(res){
            res.every(element => {
                if(element.status == 1 || element.status == 2) {
                    //拥有
                    isCanUpgrade = canUpgrade(element);
                    if(isCanUpgrade){
                        return false;
                    }
                }
            });
        });

        if(isCanUpgrade){
            this.gotoUpgrade();
            common.sysMessage("您可以升级飞机，快速提升实力啦！");
        }
    },

    initLotteryRed: function(){
        let freeCount = D.lotteryFreeDrawCount - storageUtils.lotteryFreeCount();
        let freeTime = storageUtils.lotteryFreeTime();
        let freeCanDraw = freeCount > 0 && freeTime == 0;

        let videoNum = platformUtils.lotteryVideoCount();
        let videoTime = Math.floor(Date.now()/1000) - platformUtils.getItemByLocalStorage('LotteryVideoPreTime',0);
        videoTime = videoTime > storageUtils.lotteryVideoDelay ? 0 : storageUtils.lotteryVideoDelay - videoTime;
        let videoCanDraw = videoNum > 0 && videoTime == 0;

        let isRed = freeCanDraw || videoCanDraw;
        this.lotteryRed.node.active = isRed;
    },

    initNewGifts: function(){
        this.btn_newgifts.node.active = false;
        let _this = this;
        platformUtils.requestShareCfg('newGifts', function(res) {
            if(res == 's') {
                _this.btn_newgifts.node.active = true;
            }
        });
    },

    initMoreGame2: function(){
        if(!D.SvrCfgs.cgnav || D.SvrCfgs.cgnav.length == 0){
            this.btnMoreGame2.node.active = false;
            return
        }

        let _this = this;
        // let moreGameIcon = function(){
        //     let url = "moregame/moregame_icon_"+_this.btnMoreGame2.icon;
        //     cc.loader.loadRes(url,cc.SpriteFrame,function(err,spriteFrame){
        //         _this.btnMoreGame2.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        //     });
        // }
        let moreGameIcon = function(){
            let url = D.moreGameBaseUrl + "icon2/icon"+_this.btnMoreGame2.icon+".png";
            cc.loader.load(url, function(err, texture){
                _this.btnMoreGame2.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
            });
        }

        let updateMoregame = function(){
            _this.btnMoreGame2.count += 1;
            if(_this.btnMoreGame2.count%2 == 0){
                _this.btnMoreGame2.icon += 1;
                if(_this.btnMoreGame2.icon > D.SvrCfgs.cgnav.length ){
                    _this.btnMoreGame2.icon = 1;
                }
                // console.log("============= updateMoregame, icon= "+_this.btnMoreGame2.icon);
                moreGameIcon();
            }
        }

        _this.btnMoreGame2.node.active = true;
        _this.btnMoreGame2.node.rotation = 0;
        _this.btnMoreGame2.count = 0;
        _this.btnMoreGame2.icon = 1;
        moreGameIcon();
        _this.btnMoreGame2.node.runAction(cc.repeatForever(cc.sequence(cc.repeat(cc.sequence(cc.rotateBy(0.3, 15), cc.rotateBy(0.3, -15)),2),cc.delayTime(1.5),cc.callFunc(updateMoregame,_this) ) ) );
    },
   
    touchEnd: function (event) {
        console.log("touchEnd");
        let touchDelta = event.touch.getDelta()
        // this.hero.node.x += touchDelta.x

        console.log("touchMove2.x......................", touchDelta.x);
        // this.hero.node.y += touchDelta.y

        let startPos = event.touch._startPoint
        let endPos = event.touch._point
        let disX = endPos.x - startPos.x
        if (disX > 0 && Math.abs(disX) > 100) {
            ///向左
            this.currSHowHeroKind --
        } else if (disX < 0 && Math.abs(disX) > 100) {
            ///向右
            this.currSHowHeroKind ++
        }
        else{
            return
        }

        this.checkShowHero()
    },
    ///
    touchRight:function(){
        this.currSHowHeroKind--;
        this.checkShowHero()
    },
    ///
    touchLeft:function(){
        this.currSHowHeroKind++;
        this.checkShowHero()
    },
    checkShowHero:function(){
        if (this.currSHowHeroKind > 4) {
            this.currSHowHeroKind = 1
        } else if (this.currSHowHeroKind < 1) {
            this.currSHowHeroKind = 4
        }
        /////////////////
        let currSHowHero = null
        if (D.commonState.heroList) {
            for (let i = 0; i < D.commonState.heroList.length; i++) {
                let element = D.commonState.heroList[i];
                if (element.kind == this.currSHowHeroKind) {
                    currSHowHero = element
                    break;
                }
            }
        }
        
        if (!currSHowHero) {
            this.currSHowHeroIdx = 1
        }
        else{
            this.currSHowHeroIdx = currSHowHero.subSeq
        }

        if (this.currSHowHeroIdx <= 0) {
            this.currSHowHeroIdx = 1
        }
        ////////////////
        this.setPlane(this.currSHowHeroKind, this.currSHowHeroIdx);
        this.onPlaneBullet(this.currSHowHeroKind, this.currSHowHeroIdx);
    },
    ////
    start: function(){
        console.log("start start.......................");
        platformUtils.requestBill(100002, 1, 100);

        // this.guideStrength();

        Notification.on("remove_all_poplayer", this.onRemoveAllPoplayer, this);
    },

    onDestroy: function(){
        Notification.off("remove_all_poplayer", this.onRemoveAllPoplayer);

        if(this.btn_video.isSchedule){
            this.unschedule(this.videoTimeTicket);
        }
    },

    setPlane: function(currHeroKind, currHeroIdx) {    
        //出战 飞机plane
        let url = "plane/plane_"+currHeroKind+ "_" + currHeroIdx;
        let _this = this;
        console.log(url);
        cc.loader.loadRes(url, cc.SpriteFrame, function(err, spriteFrame) {
            _this.sprPlane.spriteFrame = spriteFrame;
        });
        
        ///
        this.currSHowHeroKind = currHeroKind
        this.currSHowHeroIdx = currHeroIdx
        if(this.btn_txt_chuzhan == undefined || this.btn_txt_chuzhan == null || !this.btn_txt_chuzhan.node){
            return;
        }
        /////设置
        for (let i = 0; i < D.commonState.heroList.length; i++) {
            let element = D.commonState.heroList[i];
            if (element.kind == this.currSHowHeroKind) {
               
                this.btn_txt_chuzhan.node.active = true
                this.btn_txt_5000gm.node.active = false
                this.btn_txt_gzjs.node.active = false
                this.btn_txt_7rlq.node.active = false
                this.btn_txt_cz_bg.node.active = false
                return
            }
        }

        this.btn_txt_chuzhan.node.active = false
        this.btn_txt_5000gm.node.active = false
        this.btn_txt_gzjs.node.active = false
        this.btn_txt_7rlq.node.active = false
        this.btn_txt_cz_bg.node.active = false

        if (this.currSHowHeroKind == 2) {
            this.btn_txt_gzjs.node.active = true
            this.btn_txt_cz_bg.node.active = true
        } else if (this.currSHowHeroKind == 3) {
            this.btn_txt_5000gm.node.active = true
            this.btn_txt_cz_bg.node.active = true
        } else if (this.currSHowHeroKind == 4) {
            this.btn_txt_7rlq.node.active = true
            this.btn_txt_cz_bg.node.active = true
        }
    },

    movePlane: function(sprPlaneY){
        //移动飞机
        var moveUp = cc.moveTo(3, cc.v2(this.sprPlane.node.x, sprPlaneY+40)).easing(cc.easeCubicActionIn());
        var moveDown = cc.moveTo(3, cc.v2(this.sprPlane.node.x, sprPlaneY-40)).easing(cc.easeCubicActionOut());
        let movePlane = cc.repeatForever(cc.sequence(moveUp, moveDown));
        this.sprPlane.node.runAction(movePlane);
        this.sprPlane.node.setScale(1.3,1.3);
    },

    //从奖励分享进来，需要给分享的人发奖励
    onFromRewardShare: function(fromUserId) {
        platformUtils.requestonFromRewardShare(fromUserId);
    },
    onFromRewardShareTips: function(fromUserId) {
        platformUtils.requestonFromHelpShare(fromUserId,function(res){
            common.sysMessage("你帮了"+ res.name +"大忙，助力成功!");
        });
    },
    //好友挑战
    onFromBattleShare: function(fromUserId){
        this.onBtnBattle({fromUserId:fromUserId});
    },
    //从解锁分享进来，需要给分享的人发飞机
    onFromUnlockShare:function(fromUserId) {
         //TODO 暂时不做，从解锁分享进来，需要给分享的人发飞机
    },
    onFromQzbShare: function(fromUserId) {
        platformUtils.requestAddQzbFriend(fromUserId);
    },
    //收藏了本游戏，然后做一下处理
    onFollowThisApp: function() {
        let _this = this;
        platformUtils.requestFollowAward(function(res){
            _this.checkShowHero();
        },this);
    },
    //弹出群分享
    gotoGroupRank: function(shareTicket) {
        D.commonState.shareTicket = shareTicket;
        // common.showPopUpLayer(this.topPrefab);
        this.gotoTop();
    },

    gotoStartGame: function () {

        /////判断
        /////设置
        for (let i = 0; i < D.commonState.heroList.length; i++) {
            let element = D.commonState.heroList[i];
            if (element.kind == this.currSHowHeroKind) {
                element.status = 2;
                D.currHero = element;

                this.toGame()
                return
            }
        }

      
        if (this.currSHowHeroKind == 2) {
            this.gotoFollow()
        } else if (this.currSHowHeroKind == 3) {
            let self = this

            if (D.commonState.userGameInfo.coin < 5000) {
                common.sysMessage("您的星星数量不足");
                return
            }
            
            platformUtils.requestNewHeroUseCoin(this.currSHowHeroKind, function (res) {
                if (res.hero) {
                    for (let i = 0; i < D.commonState.heroList.length; i++) {
                        let element = D.commonState.heroList[i];
                        if (element.kind == this.currSHowHeroKind) {
                            return
                        }
                    }
                    ///
                    D.commonState.heroList.push(res.hero)

                    self.checkShowHero()
                }
            });
        }
    },

    toGame:function(){
        //////

        let callback = function(){
            platformUtils.requestBill(100002, 2, 200);
            if (!D.isVoideClose) {
                cc.audioEngine.stop(D.commonState.hallAudioID);
                D.commonState.hallAudioID = 0;
                cc.audioEngine.play(this.btnSound);
            }
            this.node.stopAllActions();
            platformUtils.hideWxLayer();
            // 转场
            let cname = !sceneManager.isLoadedGame ? 'Tmp' : 'Game'
            sceneManager.loadScene(cname);
        }
        let _this = this;
        cc.loader.loadRes("prefabs/beginFight", function(err,prefab){
            platformUtils.hideWxLayer();
            let layer = common.showPopUpLayer(prefab, null, null, null, function() {
                platformUtils.showWxLayer();
            });
            let script = layer.getComponent("beginFight");
            if(script){
                script.setCallBack(callback,_this.currSHowHeroKind);
            }
        });
    },

    //强化
    gotoUpgrade: function() {
        platformUtils.requestBill(100002, 3, 200);
        this.onBtnSound();
        this.node.stopAllActions();
        platformUtils.hideWxLayer();
        let layer = common.showPopUpLayer(this.upgradePrefab, null, null, null, function() {
            platformUtils.showWxLayer();
        });
        let script = layer.getComponent("upgrade");
        if(script){
            let idx = this.currSHowHeroKind - 1 < 0 ? 0 : this.currSHowHeroKind - 1;
            script.setCurPageIndex(idx);
        }
    },

    //排行榜
    gotoTop:function() {
        platformUtils.requestBill(100002, 4, 200);
        this.onBtnSound();
        platformUtils.hideWxLayer();
        common.showPopUpLayer(this.topPrefab, null, null, null, function() {
            platformUtils.showWxLayer();
        });
    },
    
    //邀请好友
    onBtnInvite:function() {
        platformUtils.requestBill(100002, 5, 200);
        this.onBtnSound();
        platformUtils.hideWxLayer();
        common.showPopUpLayer(this.shareAwardPrefab, null, null, null, function() {
            platformUtils.showWxLayer();
        });
    },

    //关注礼包
    gotoFollow: function() {
        platformUtils.requestBill(100002, 6, 200);
        this.onBtnSound();
        platformUtils.hideWxLayer();
        common.showPopUpLayer(this.followAwardPrefab, null, null, null, function() {
            platformUtils.showWxLayer();
        });
    },
    
    //更多游戏
    gotoMoreGame: function() {
        platformUtils.requestBill(100002, 7, 200);        
        wx.offHide();//需要取消关闭小程序的事件，否则跳转小程序会被全部关掉
        this.onBtnSound();
        if(CC_WECHATGAME) {
            platformUtils.requestCfg(function() {
                wx.previewImage({
                    current: D.wxMoreGameUrls[Math.floor(Math.random()*(D.wxMoreGameUrls.length))], // 当前显示图片的http链接
                    urls: D.wxMoreGameUrls, // 需要预览的图片http链接列表
                    success:function(){
    
                    },
                });
            });
        }
    },
    //大厅音乐
    playBackgroupMusic: function() {
        cc.audioEngine.stopAll();
        D.commonState.hallAudioID = cc.audioEngine.play(this.hallSound, true,0.3);
    },
    replayBackgroupMusic: function() {
        if(D.commonState.hallAudioID == 0 || D.commonState.hallAudioID == undefined){
            D.commonState.hallAudioID = cc.audioEngine.play(this.hallSound, true,0.3);
        }else{
            cc.audioEngine.play(D.commonState.hallAudioID);
        }
    },
    //关闭声音
    onCloseVoide() {
        if( ! D.isVoideClose) {
            cc.audioEngine.pauseAll();
            cc.audioEngine.pauseMusic();
            D.isVoideClose = true;
            this.sprSoundOpen.node.opacity = 0;
            this.sprSoundClose.node.opacity = 255;
        }
        else {
            cc.audioEngine.resumeAll();
            cc.audioEngine.resumeMusic();
            D.isVoideClose = false;
            this.sprSoundOpen.node.opacity = 255;
            this.sprSoundClose.node.opacity = 0;
        }
        if( ! D.isVoideClose){
            if(D.commonState.hallAudioID != 0){
                cc.audioEngine.play(D.commonState.hallAudioID);
            }else{
                D.commonState.hallAudioID = cc.audioEngine.play(this.hallSound, true,0.3);
            }
        }
    },
    onPlaneBullet:function(skinKind,skinLevel){
        if (skinKind >= 2) {
            this.startShoot = function () {
                this.onPlaneBullet2(skinKind, skinLevel)
            } 
            let attackSpeedLevel = 7
            if (skinKind == 3) {
                attackSpeedLevel = 2
            } else if (skinKind == 4) {
                attackSpeedLevel = 5
            }
           
            let delayAction = cc.delayTime(1 / attackSpeedLevel);
            let callFunc = cc.callFunc(this.startShoot, this);
            let repeat = cc.repeatForever(cc.sequence(delayAction, callFunc));
            this.planeBulSpr.node.stopAllActions();
            this.planeBulSpr.node.runAction(repeat);
        } else if (skinKind == 1) {
            this.onPlaneBullet1(skinKind, skinLevel)
        }
    },

    onPlaneBullet1: function (skinKind, skinLevel) {
        if (skinLevel > 5) {
            skinLevel = 5
        }
        let url = 'bullet/bullet_' + skinKind + "_" + skinLevel;
        this.startShoot = function () {
            let pos = cc.v2(this.sprPlane.node.x, this.sprPlane.node.y - 40);
            let poolName = this.planeBulPrefab.data.name + 'Pool';
            let newNode = poolClass.borrowNewNode(this[poolName], this.planeBulPrefab.data, this.planeBulSpr.node);

            newNode.moveRotation = 0

            newNode.setPosition(pos);
        }
        let herosCfg = common.getJsonCfgs('hero');
        let heroCfg = {};
        herosCfg.forEach(item => {
            if (item.kind == skinKind && item.subSeq == skinLevel) {
                heroCfg = item;
            }
        });
        // let attackSpeedLevel = heroCfg.initAttackSpeed + (heroCfg.initAttackSpeed * heroCfg.attackSpeedRadix/100)*D.currHero.attackSpeedLevel;
        // if (attackSpeedLevel > 20) {
        //     attackSpeedLevel = 20;
        // }
        let attackSpeedLevel = 7
        let delayAction = cc.delayTime(1 / attackSpeedLevel);
        let callFunc = cc.callFunc(this.startShoot, this);
        let repeat = cc.repeatForever(cc.sequence(delayAction, callFunc));
        this.planeBulSpr.node.stopAllActions();
        let _this = this;
        cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
            _this.planeBulPrefab.data.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            _this.planeBulSpr.node.runAction(repeat);
        });
    },

    onPlaneBullet2: function (skinKind, skinLevel) {
        if (skinKind == 2) {
            this.startShoot_2(skinKind, skinLevel)
            
        } else if (skinKind == 3) {
            this.startShoot_3(skinKind, skinLevel)
        } else if (skinKind == 4){
            this.startShoot_4(skinKind, skinLevel)
        }
    },

    ////////////////////////////
    startShoot_2: function (skinKind, skinLevel) {
        if (!this.shootCount) {
            this.shootCount = 0
        }

        if ( skinLevel == 5) {
            if (this.shootCount % 2 == 0) {
                this.makeNewBullet( 1, -15, -50, -20, "bullet/bullet_new_2_1");
                this.makeNewBullet( 1, 0, -50, -20, "bullet/bullet_new_2_1");
                this.makeNewBullet( 1, 0, 50, -20, "bullet/bullet_new_2_1");
                this.makeNewBullet( 1, 15, 50, -20, "bullet/bullet_new_2_1");
            } else {
                this.makeNewBullet( 1, 0, -50, -20, "bullet/bullet_new_2_2");
                this.makeNewBullet( 1, 0, 50, -20, "bullet/bullet_new_2_2");
            }
            this.makeNewBullet( 2, 0, 0, -20, "bullet/bullet_new_2_4");

        } else if (skinLevel == 1) {
            this.makeNewBullet( 1, -5, 0, -50, "bullet/bullet_new_2_1");
            this.makeNewBullet( 1, 5, 0, -50, "bullet/bullet_new_2_1");

        } else if (skinLevel == 2) {
            if (this.shootCount % 2 == 0) {
                this.makeNewBullet( 1, -10, -50, -20, "bullet/bullet_new_2_1");
                this.makeNewBullet( 1, 0, 0, -20, "bullet/bullet_new_2_1");
                this.makeNewBullet( 1, 10, 50, -20, "bullet/bullet_new_2_1");
            } else {
                this.makeNewBullet( 1, 0, 0, -20, "bullet/bullet_new_2_2");
            }

        } else if (skinLevel == 3) {
            if (this.shootCount % 2 == 0) {
                this.makeNewBullet( 1, -15, -50, -20, "bullet/bullet_new_2_1");
                this.makeNewBullet( 1, 0, -30, -20, "bullet/bullet_new_2_1");
                this.makeNewBullet( 1, 0, 30, -20, "bullet/bullet_new_2_1");
                this.makeNewBullet( 1, 15, 50, -20, "bullet/bullet_new_2_1");
            } else {
                this.makeNewBullet( 1, 0, -30, -20, "bullet/bullet_new_2_2");
                this.makeNewBullet( 1, 0, 30, -20, "bullet/bullet_new_2_2");
            }

        } else if (skinLevel == 4) {
            if (this.shootCount % 2 == 0) {
                this.makeNewBullet( 1, -15, -50, -20, "bullet/bullet_new_2_1");
                this.makeNewBullet( 1, 0, -50, -20, "bullet/bullet_new_2_1");
                this.makeNewBullet( 1, 0, 50, -20, "bullet/bullet_new_2_1");
                this.makeNewBullet( 1, 15, 50, -20, "bullet/bullet_new_2_1");
            } else {
                this.makeNewBullet( 1, 0, -50, -20, "bullet/bullet_new_2_2");
                this.makeNewBullet( 1, 0, 50, -20, "bullet/bullet_new_2_2");
            }
            this.makeNewBullet( 1, 0, 0, -20, "bullet/bullet_new_2_3");
        }

        this.shootCount++
    },

    startShoot_3: function (skinKind, skinLevel) {

        if (!this.shootCount) {
            this.shootCount = 0
        }

        let self = this
        let sendCirBullet = function (offX = 0, offY = 0, rotation = 0) {
            let num = 10
            let perNum = 360 / num
            let R = 65
            for (var i = 0; i < num; i++) {
                var hd = (Math.PI/180 ) * perNum * i;
                let targetX= R * Math.cos(hd)
                let targetY = R * Math.sin(hd)
                if (hd % Math.PI == 0) {
                    targetY = 0
                }

                self.makeNewBullet(1, rotation, targetX + offX, targetY + offY, "bullet/bullet_new_3_1",800);
            }
        }

        let sendDaoBullet = function (offX = 0, offY = 0, rotation = 0, tt = 0.5) {

            let bullet = self.makeNewBullet( 1, rotation, 0, -30, "bullet/bullet_new_3_2");
            bullet.stopMove = true

            let callback = function () {
                bullet.stopMove = false
            }
            let act1 = cc.moveBy(tt, cc.v2(offX, offY))
            let act2 = cc.callFunc(callback)
            bullet.runAction(cc.sequence(act1, act2))
        }

        if (skinLevel == 5) {

            sendCirBullet(0, 0, -10);
            sendCirBullet(0, 0, 10);
            sendDaoBullet(-120, -80, 2)
            sendDaoBullet(120, -80, 2)
            sendDaoBullet(-80, -30, 1)
            sendDaoBullet(80, -30, 1)

        } else if (skinLevel == 1) {
            sendCirBullet(0, 0, 0);

        } else if (skinLevel == 2) {
            sendCirBullet(0, 0, 0);
            sendDaoBullet(-100, -80)
            sendDaoBullet(100, -80)

        } else if (skinLevel == 3) {
            sendCirBullet(0, 0, -10);
            sendCirBullet(0, 0, 10);

        } else if (skinLevel == 4) {
            sendCirBullet(0, 0, -10);
            sendCirBullet(0, 0, 10);
            sendDaoBullet(-120, -80, 2)
            sendDaoBullet(120, -80, 2)
        }

        this.shootCount++
    },

    startShoot_4: function (skinKind, skinLevel) {

        if (!this.shootCount) {
            this.shootCount = 0
        }

        let self = this
        if (!this.ddddd) {
            this.ddddd = 1
            this.shootCount = 0
        }

        this.shootCount += this.ddddd
        if (this.shootCount >= 10) {
            this.ddddd = -1
            this.shootCount = 10
        } else if (this.shootCount < 0) {
            this.ddddd = 1
            this.shootCount = 0
        }

        let d = this.shootCount
        let dis =  3 * d

        self.makeNewBullet(1, 0, -25 -1 * dis, -50, "bullet/bullet_new_4_1", 800);
        self.makeNewBullet(1, 0, -1 * dis, -50, "bullet/bullet_new_4_2", 800);
        self.makeNewBullet(1, 0, 25 + dis, -50, "bullet/bullet_new_4_1", 800);
        self.makeNewBullet(1, 0,   dis, -50, "bullet/bullet_new_4_2", 800);
    },

    

    // 生成子弹
    makeNewBullet: function (attackTimesNum = 1, rotation = 0, offX = 0, offY = 0, url = null, moveSpeed = 1500) {
        let pos = cc.v2(this.sprPlane.node.x, this.sprPlane.node.y);
        pos.y = pos.y + 50
        let poolName = this.planeBulPrefab.data.name + 'Pool';
        let bullet = this.creatreBullet(poolName, pos, url)
        bullet.x += offX;
        bullet.y += offY;
        bullet.speed = moveSpeed
        bullet.moveRotation = rotation

        return bullet
    },

    creatreBullet: function (poolName, pos, url) {
        let newNode = poolClass.borrowNewNode(this[poolName], this.planeBulPrefab.data, this.planeBulSpr.node);
        newNode.setPosition(pos);
        newNode.getComponent(cc.Sprite).sizeMode = cc.Sprite.SizeMode.RAW;
        ////子弹
        if (!this.bulletObj) {
            this.bulletObj = {}
        }

        if (this.bulletObj[url]) {
            newNode.getComponent(cc.Sprite).spriteFrame = this.bulletObj[url];
        } else {
            var _this = this;
            cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
                _this.bulletObj[url] = spriteFrame
                newNode.getComponent(cc.Sprite).spriteFrame = _this.bulletObj[url];
            });
        }

        return newNode
    },


    //////////////////////////////////////////////////
    onUpdatePlaneBulletLevel: function(skinKind,skinLevel){
        this.node.stopAllActions();

        this.currSHowHeroKind = skinKind
        this.currSHowHeroIdx = skinLevel
        this.checkShowHero()
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        let ary = this.planeBulSpr.node.children
        let rmAry = new Array()
        for (let index = 0; index < ary.length; index++) {
            const element = ary[index];
            if (element.name == 'planeBullet' && !element.stopMove) {
                let speed = element.speed;
                if (!speed){
                    speed = 1500
                }

                let totalBulletY = this.sprPlane.node.y + 800;
                if (element.y > totalBulletY) {
                    // this.planeBulSpr.node.removeChild(element);
                    rmAry.push(element)
                } else {
                    let R = dt * speed;
                    let ly = R * Math.cos(Math.PI / 180 * element.moveRotation)
                    let lx = R * Math.sin(Math.PI / 180 * element.moveRotation)

                    element.rotation = element.moveRotation;
                    element.x += lx;
                    element.y += ly;
                }
            }
        }

        for (let index = 0; index < rmAry.length; index++) {
            const element = rmAry[index];
            this.planeBulSpr.node.removeChild(element);
        }
      
    },

    //按钮声音
    onBtnSound: function(){
        if( ! D.isVoideClose){
            cc.audioEngine.play(this.btnSound);
        }
    },
    onBtnSignIn: function(event,isCallFun){
        if(this.isShareBattle){
            this.isShareBattle = false;
            return;
        }

        platformUtils.hideWxLayer();
        let dailySignPre = common.showPopUpLayer(this.dailySignInPrefab);
        dailySignPre.position = cc.v2(cc.winSize.width/2,cc.winSize.height/2);

        let _this = this;
        let onClose = function(){
            if(platformUtils.lotteryVideoCount() > 0) {
                _this.onBtnLottery();
            }
        }

        if(isCallFun){
            let script = dailySignPre.getComponent("dailySignIn");
            if(script){
                script.setCallback(onClose);
            }
        }
        
    },

    onBtnLottery: function(){
        this.onBtnSound();
        platformUtils.hideWxLayer();
        common.showPopUpLayer(this.lotteryDrawPrefab);
    },

    //接入客服系统
    onGameService: function() {
        if(CC_WECHATGAME) {
            wx.offHide();
            wx.openCustomerServiceConversation({});
        }
    },

    //强化指引
    guideStrength: function(){
        let _this = this;
        let begin = function(){

            let point = _this.nodeGuide.getChildByName("point");
            let line1 = _this.nodeGuide.getChildByName("line1");
            let line2 = _this.nodeGuide.getChildByName("line2");

            let delay = 0;
            if(point){
                point.active = true;
                point.scale = 0;
                point.stopAllActions();
                point.runAction(cc.scaleTo(0.4,1));
                delay += 0.4;
            }
            if (line1){
                line1.active = true;
                line1.scaleY  = 0;
                line1.stopAllActions();
                line1.runAction(cc.sequence(cc.delayTime(delay), cc.scaleTo(0.4,1,1)) );
                delay += 0.4;
            }
            if (line2){
                line2.active = true;
                line2.scaleY  = 0;
                line2.stopAllActions();
                line2.runAction(cc.sequence(cc.delayTime(delay), cc.scaleTo(0.4,1,1)) );
                delay += 0.4;
            }
        }
        
        let btnAnim =  function(){

            let point = _this.nodeGuide.getChildByName("point");
            let line1 = _this.nodeGuide.getChildByName("line1");
            let line2 = _this.nodeGuide.getChildByName("line2");
            point.active = false;
            line1.active = false;
            line2.active = false;

            _this.btn_upgrade.node.stopAllActions();
            _this.btn_upgrade.node.runAction(cc.sequence(cc.scaleTo(0.5,1.2),cc.delayTime(0.1), cc.scaleTo(0.5,1)));
        }

        this.nodeGuide.stopAllActions();
        let act1 = cc.callFunc(begin, this);
        let act2 = cc.delayTime(1.6);
        let act3 = cc.callFunc(btnAnim, this);
        let act4 = cc.delayTime(1.5);
        this.nodeGuide.runAction(cc.repeatForever(cc.sequence(act1,act2,act3,act4)));
    },

    onMoreGame2: function() {
        let getAppKey = function(idx){
            if(idx && idx > 0){
                return D.SvrCfgs.cgnav[idx-1];
            }
            return "";
        }

        if(CC_WECHATGAME) {
            wx.offHide();//需要取消关闭小程序的事件，否则跳转小程序会被全部关掉
            let appId = getAppKey(this.btnMoreGame2.icon);
            let path = common.getMoreGamePath(appId);
            console.log("============= onMoreGame2, appId=,path=",appId,path);
            wx.navigateToMiniProgram({
                appId: appId,
                path: path,
                success: function(res) {
                    platformUtils.requestBill(100002, 8, 200, appId);
                    console.log('navigateToMiniProgram', res);
                },
                fail: function(res) {
                    console.log('navigateToMiniProgram', res);
                },
                complete: function(res) {
                    console.log('navigateToMiniProgram', res);
                },
            }); 

            this.btnMoreGame2.node.getChildByName("spr_red_point").active = false;           
        }
    },

    initShareAndVideo: function(){
        // platformUtils.setItemByLocalStorage('TodayWxVideoCnt', 5)
        let setRedNum = function(node,num,haveCount){
            let redNode = node.getChildByName("sp_redpoint");
            redNode.active = true;
            redNode.getChildByName("lab_num").getComponent(cc.Label).string = String(num);
            node.stopAllActions();
            node.rotation = 0;
            if(haveCount){
                node.runAction(cc.repeatForever(cc.sequence(cc.repeat(cc.sequence(cc.rotateTo(0.3, 15), cc.rotateTo(0.3, -15), cc.rotateTo(0.1, 0)),2), cc.delayTime(1.5))));
            }else{
                redNode.active = false;
            }
        }

        if(this.btn_share.node.active ==  true){
            let canShare = platformUtils.isTodayWxAwardShareBeyond();
            let shareNum = D.wxAwardShareMaxNum - platformUtils.getItemByLocalStorage('TodayWxAwardShareCnt', 0);
            setRedNum(this.btn_share.node, shareNum, canShare);
        }
        
        if(!this.btn_video.node.active){
            return;
        }
        
        platformUtils.isTodayWxVideoBeyond();
        let videoNum = D.wxVideoMaxNum - platformUtils.getItemByLocalStorage('TodayWxVideoCnt', 0);
        let todayVideoVal = platformUtils.getItemByLocalStorage('TodayStartVodieDate');
        if(todayVideoVal){
            let todayDate = new Date(todayVideoVal);
            if(!common.isSameDay(todayDate)) {
                platformUtils.setItemByLocalStorage("TodayStartVodieCount",0);
            }
        }
        let todayVideoNum = 2 - platformUtils.getItemByLocalStorage("TodayStartVodieCount",0);
        videoNum = Math.min(videoNum, todayVideoNum);
        let canVideo = videoNum > 0;

        let preTime = platformUtils.getItemByLocalStorage("createRewardedVideoAdTime", 0);
        let delayTime = Math.floor(Date.now()/1000) - preTime;
        if(delayTime < 20 && canVideo){
            this.videoTimeCountDown(20-delayTime);
            this.btn_video.node.rotation = 0;
            this.btn_video.node.stopAllActions();

            this.btn_video.interactable = false;
            this.btn_video.node.getChildByName("sp_redpoint").getChildByName("lab_num").getComponent(cc.Label).string = String(videoNum);
            return;
        }else{
            this.btn_video.interactable = true;
            this.btn_video.node.getChildByName("txt_time").active = false;
            this.btn_video.node.getChildByName("spr_desc").active = true;
            setRedNum(this.btn_video.node, videoNum, canVideo);
        }

        if(!canVideo){
            this.btn_video.interactable = false;
        }
    },

    onShareGetCoin: function(){
        let _this = this;
        let cfg = common.getShareCfgByType(D.ShareTypeFriend);
        let title = cfg.title;
        let imageUrl = cfg.imageUrl;
        platformUtils.shareAppMessageCallback(title, imageUrl, "", function(res) {
            if( ! platformUtils.isTodayWxAwardShareBeyond()) {
                common.sysMessage('您今日领取次数已达上限，请明天再来！');
                return;
            }
            if(res == true) {
                //奖励金币
                platformUtils.requestAddCoin(D.AwardCoinShare, D.ReasonAddCoinShare, function(res) {
                    _this.initShareAndVideo();
                });
                common.sysMessage('分享获得 '+D.AwardCoinShare+" 星星！");

                platformUtils.requestBill(100007, 12, 200, 1);
                platformUtils.setTodayWxAwardShare();
            }else {
                platformUtils.requestBill(100007, 12, 200, 0);
            }
        });
    },

    onVideoGetCoin: function(){
        if(! platformUtils.isTodayWxVideoBeyond()){
            common.sysMessage("您今日领取次数已达上限，请明天再来！");
            return;
        }
        console.log("=========== start.onVideoGetCoin  111111 ");

        platformUtils.requestBill(100008, 4, 200, 0);
        let _this = this;
        platformUtils.createRewardedVideoAd('dating', function(res) {
            //视频回调获得奖励
            platformUtils.requestAddCoin(D.AwardCoinVideo, D.ReasonAddCoinVideo, function(res1) {
                //update my coin
                // Notification.emit('upgradeCoin', res.currCoin);
            });

            platformUtils.requestBill(100008, 4, 200, 1);
            platformUtils.setTodayWxVideo();

            common.sysMessage('恭喜您领取了'+ D.AwardCoinVideo +"星星");

            platformUtils.setItemByLocalStorage("createRewardedVideoAdTime", Math.floor(Date.now()/1000));
            platformUtils.setItemByLocalStorage("TodayStartVodieCount",platformUtils.getItemByLocalStorage("TodayStartVodieCount",0)+1);
            platformUtils.setItemByLocalStorage('TodayStartVodieDate', new Date());
            _this.initShareAndVideo();

        });
    },

    videoTimeCountDown: function(delayTime){
        if(this.btn_video.isSchedule) return;

        this.btn_video.delayTime = delayTime;
        this.schedule(this.videoTimeTicket, 1, delayTime);
        this.btn_video.isSchedule = true;
        this.btn_video.node.getChildByName("spr_desc").active = false;
        this.videoTimeTicket();
    },

    videoTimeTicket: function(){
        let txt_time = this.btn_video.node.getChildByName("txt_time");
        if(this.btn_video.delayTime <= 0){
            if(txt_time){
                txt_time.active = false;
            }
            this.btn_video.isSchedule = false;
            this.unschedule(this.videoTimeTicket);
            this.initShareAndVideo();
            return;
        }

        this.btn_video.delayTime -= 1;
        if(txt_time){
            txt_time.active = true;
            let strTime = this.btn_video.delayTime >= 10 ? "00:" : "00:0";
            txt_time.getComponent(cc.Label).string = strTime+this.btn_video.delayTime;
        }

    },

    onRemoveAllPoplayer: function(){
        this.initShareAndVideo();
        this.initLotteryRed();
        platformUtils.createBannerAd(); 
    },

    onMoregameMenu: function(){

        if(this.btn_moregame_menu.opening){
            return;
        }
        this.onBtnSound();

        let _this = this;
        let btnFinish = function(){
            _this.btn_moregame_menu.opening = false;
            let scaleX = _this.btn_moregame_menu.node.x > 0 ? -1 : 1;

            let spr_arrow = _this.btn_moregame_menu.node.getChildByName("spr_arrow");
            if(spr_arrow){
                spr_arrow.scaleX = scaleX;
            }
        }
        let layerFinish = function(node){
            if(!node) return;

            let script = node.getComponent("moreGame");
            if(_this.btn_moregame_menu.node.x < 0 ){
                node.active = false;
            }else{
                if(script){
                    script.setGraphicsVisible(true);
                }
            }
        }

        let anim = function(nodeMoregame){
            _this.btn_moregame_menu.node.stopAllActions();
            nodeMoregame.stopAllActions();

            let toX = _this.btn_moregame_menu.node.x < 0 ? 490 : -490;
            let act1 = cc.moveBy(0.45,cc.v2(toX,0));
            let act2 = cc.callFunc(btnFinish,_this);
            let act3 = cc.moveBy(0.45,cc.v2(toX,0));
            let act4 = cc.callFunc(layerFinish,_this);

            _this.btn_moregame_menu.node.runAction(cc.sequence(act1,act2));
            nodeMoregame.runAction(cc.sequence(act3,act4));

            if(_this.btn_moregame_menu.node.x > 0 ){
                let script = nodeMoregame.getComponent("moreGame");
                if(script){
                    script.setGraphicsVisible(false);
                }
            }
        }

        let mgLayer = this.node.getChildByName("moregameTag");
        if(mgLayer){
            mgLayer.active = true;
            anim(mgLayer);
            this.btn_moregame_menu.opening = true;
            return;
        }

        cc.loader.loadRes("prefabs/moreGame", function(err, prefab){
            if(!_this.node.getChildByName("moregameTag")){
                let layer = cc.instantiate(prefab);
                _this.node.addChild(layer);
                layer.x = -490;
                layer.name = "moregameTag";
                layer.zIndex = 1000;
                _this.btn_moregame_menu.node.zIndex = 1001;

                anim(layer);
                _this.btn_moregame_menu.opening = true;
                let spr_red = _this.btn_moregame_menu.node.getChildByName("spr_red");
                if(spr_red){
                    spr_red.active = false;
                }
            }
            
        });
    },
    
    onBtnNewgifts: function(){
        this.onBtnSound();
        platformUtils.hideWxLayer();
        common.showPopUpLayer(this.newGiftsPrefab);
    },

    onBtnDailytask: function(){
        this.onBtnSound();
        let _this = this;
        let handleGo = function(type){
            switch(type){
                case "battle":
                    if (_this.currSHowHeroKind == 2 || _this.currSHowHeroKind == 3) {
                        let element = D.commonState.heroList[0];
                        element.status = 2;
                        D.currHero = element;
                        _this.toGame();
                    }else{
                        _this.gotoStartGame();
                    }
                break;
                case "invite":
                    _this.onBtnInvite();
                break;
                case "upgrade":
                    _this.gotoUpgrade();
                break;
            }
        }

        let close = function(){
            if(!taskUtils.isRed()){
                _this.spr_task_red.node.active = false;
            }
        }

        platformUtils.hideWxLayer();
        let layer = common.showPopUpLayer(this.dailyTaskPrefab);
        let script = layer.getComponent("dailyTask")
        if(script){
            script.setCallback(handleGo,close);
        }
    },

    onBtnFriendHelp: function(){
        this.onBtnSound();

        platformUtils.hideWxLayer();
        common.showPopUpLayer(this.friendHelpPrefab, null, null, null, function() {
            platformUtils.showWxLayer();
        });
    },

    onBtnBattle: function(event){
        this.onBtnSound();

        let fromUserId = platformUtils.getUserId();
        if(event && event.fromUserId){
            fromUserId = event.fromUserId;
        }
        platformUtils.hideWxLayer();
        let layer = common.showPopUpLayer(this.battlePrefab, null, null, null, function() {
            platformUtils.showWxLayer();
        });
        let script = layer.getComponent("battleLayer");
        if(script){
            // fromUserId = 38349;
            // D.commonState.userInfo = {uid:38349};
            // fromUserId = 38449;
            // console.log(D.commonState.userInfo);
            script.requestData(fromUserId,false);
        }
    },

    initRedpacket: function(){
        this.node_redpacket.active = false;

        let _this = this;
        platformUtils.requestShareCfg('redpacket_test', function(res) {
            if(res == 's') {
                _this.openRedpacket();
            }
        });
    },

    openRedpacket: function(){
        this.node_redpacket.active = true;
        this.node_notice_item.active = false;
        this.noticeIdx = 0;

        let _this = this;
        let notice = function(){
            if(!D.commonState.notice || D.commonState.notice.length == 0) return;

            _this.node_notice_item.active = true;
            _this.noticeIdx = _this.noticeIdx > D.commonState.notice.length - 1 ? 0 : _this.noticeIdx;
            let name = D.commonState.notice[_this.noticeIdx];
            let award = 20 + Math.floor(Math.random()*2*100)/100;
            _this.richtext_award.string = "<color=#ffffff>恭喜:</c><color=#ffef4b>"+ name +"</c><color=#ffffff>成功提取</c><color=#ffef4b><size=28>"+ award +"元</size></color>";
            
            _this.node_notice_item.stopAllActions();
            let noticeWidth = _this.richtext_award.node.width + 100;
            _this.node_notice_item.x = _this.node_redpacket.x + noticeWidth;
            let act1 = cc.moveBy(8,cc.v2(-noticeWidth*2 - 200,0));
            let act2 = cc.callFunc(function(){
                _this.noticeIdx++;
                notice();
            },_this);
            _this.node_notice_item.runAction(cc.sequence(act1,act2));
        }

        platformUtils.requestNotice(function(res){
            notice();
        });
    },

    onBtnRedpacket: function(){
        this.onBtnSound();
        platformUtils.hideWxLayer();
        let layer = common.showPopUpLayer(this.redpacketCrashPrefab, null, null, null, function() {
            platformUtils.showWxLayer();
        });
    },

});
