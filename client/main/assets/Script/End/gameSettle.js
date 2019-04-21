var common = require('common');
var sceneManager = require('sceneManager');
var platformUtils = require('PlatformUtils');
var taskUtils = require('taskUtils');

cc.Class({
    extends: cc.Component,

    properties: {
        sprHeadimg: cc.Sprite,
        labBestScore: cc.Label,
        labScore: cc.Label,
        labQzb: cc.Label,
        labQzDescr: cc.Label,
        
        labTopRemain: cc.Label,
        topPrefab: cc.Prefab,
        upgradePrefab: cc.Prefab,
        btnSound: {
            default: null,
            type: cc.AudioClip
        },


    },

    onLoad: function() {
        this.initData(D.commonState.gameScore);
        platformUtils.requestBill(100006, 1, 100);
        platformUtils.hideWxLayer();

        let visible = D.SvrCfgs.nav2 && D.SvrCfgs.nav2.length > 0;
    },

    start: function(){
        let curCount = platformUtils.getItemByLocalStorage("GameSettleCount", 0) + 1;
        platformUtils.setItemByLocalStorage("GameSettleCount", curCount);

        // 强化 
        // if(this.isCanUpgrade()){
        //     this.onGotoUpgrade();
        //     common.sysMessage("您可以升级飞机，快速提升实力啦！");
        //     return;
        // }

        // 幸运转盘  1.每三次结算  2.可观看视频
        let isLottery = curCount >= 3 && platformUtils.lotteryVideoCount() > 0;
        if(isLottery){
            cc.loader.loadRes("prefabs/lotteryDraw", function(err, prefab){
                let layer = common.showPopUpLayer(prefab);
            });
            platformUtils.setItemByLocalStorage("GameSettleCount", 0);
        }

        //任务上报
        taskUtils.taskReport(taskUtils.TaskType.FLY_KM,D.commonState.gameDist);
    },

    isCanUpgrade: function(){
        let _this = this;
        let mCoin = 0;
        platformUtils.requestGameInfo(function(res) {
           mCoin = res.coin; 
        });

        let herosCfg = common.getJsonCfgs('hero');
        let canUpgrade = function(heroInfo){
            let state = false;
            herosCfg.every((heroCfg,idx) => {
                if( heroInfo.id == heroCfg.id) {
                    let powerLevel = heroInfo.powerLevel > 0 ? heroInfo.powerLevel : 1;
                    let powerNeed = heroCfg.powerNeed + heroCfg.powerNeedIncr*(heroInfo.powerLevel - 1);
                    if(mCoin >= powerNeed){
                        state = true;
                        return false;
                    }

                    let bloodLevel = heroInfo.bloodLevel > 0 ? heroInfo.bloodLevel : 1;
                    let bloodNeed = heroCfg.bloodNeed + heroCfg.bloodNeedIncr*(heroInfo.bloodLevel - 1);
                    if(mCoin >= bloodNeed){
                        state = true;
                        return false;
                    }

                    let attackSpeedLevel = heroInfo.attackSpeedLevel > 0 ? heroInfo.attackSpeedLevel : 1;
                    let speedNeed = heroCfg.attackSpeedNeed + heroCfg.attackSpeedNeedIncr*(heroInfo.attackSpeedLevel - 1);
                    if(mCoin >= speedNeed){
                        state = true;
                        return false;
                    }
                }
            });

            return state;
        }

        let isUpgrade = false;
        platformUtils.requestHeroList(function(res){
            res.every(element => {
                if(element.status == 1 || element.status == 2) {
                    //拥有
                    isUpgrade = canUpgrade(element);
                    if(isUpgrade){
                        return false;
                    }
                }
            });
        });

        return isUpgrade;
    },

    initData: function(score) {
        if(CC_WECHATGAME) {
            platformUtils.getUserInfo(function(userInfo) {
                window.wx.postMessage({
                    type: 'gameSettleRank',
                    selfAvatarUrl: userInfo.avatarUrl,
                    selfOpenId: userInfo.openId,
                });
            });
        }
        this.initScore();
    },

    onBackMain: function() {
        this.onBtnSound(); 
        sceneManager.loadScene('Start');
        D.commonState.isBattle = false;
        D.commonState.battleFromUserId = 0;
    },

    onGotoTop: function() {
        this.onBtnSound(); 
        
        let layer = common.showPopUpLayer(this.topPrefab);
        layer.getComponent('top').isShowRankTop3 = true;
        platformUtils.requestBill(100006, 2, 200);
    },

    onGotoUpgrade: function() {
        this.onBtnSound(); 
        
        common.showPopUpLayer( this.upgradePrefab);
        platformUtils.requestBill(100006, 3, 200);
    },

    onGameAgain: function() {
        this.onBtnSound(); 

        let _this = this;
        let callback = function(){
            if(CC_WECHATGAME) {
                let _this = _this;
                window.wx.postMessage({
                    type: 'cleanRank',
                    isShowRankTop3: null,
                });
            }
            common.removePopUpLayer(_this);
            // _this.gameMain.newGameAgain();
            platformUtils.requestBill(100006, 4, 200);
            sceneManager.loadScene('Tmp');
        }

        cc.loader.loadRes("prefabs/beginFight", function(err,prefab){
            let layer = common.showPopUpLayer(prefab);
            let script = layer.getComponent("beginFight");
            if(script){
                script.setCallBack(callback,D.currHero.kind);
            }
        });
    },

    onFriendHelp: function(){
        this.onBtnSound(); 
        
        // platformUtils.requestBill(100006, 5, 200);
        // //助力分享
        // let cfg = common.getShareCfgByType(D.ShareTypeZhuli);
        // let title = cfg.title;
        // let imageUrl = cfg.imageUrl;
        // let fromUserId = platformUtils.getUserId();
        // platformUtils.shareAppMessage(title, imageUrl, "type=shareQzb&fromUserId="+fromUserId, function(res) {
        //     if(res) {
        //         common.sysMessage('分享成功！');
        //         platformUtils.requestBill(100007, 3, 200, 1);
        //     }
        //     else {
        //         platformUtils.requestBill(100007, 3, 200, 0);
        //     }
        // });

        //发起挑战
        let _this = this;
        let gotoBattle = function(){
            let cfg = common.getShareCfgByType(D.ShareTypeBattle);
            let title = cfg.title;
            let imageUrl = cfg.imageUrl;
            let fromKey = platformUtils.getUserSkey();
            let fromUserId = platformUtils.getUserId();
            platformUtils.shareAppMessage(title, imageUrl, "type=shareBattle&fromUserId="+fromUserId, function(res){
                if(res) {
                    common.sysMessage('发起挑战成功！');
                    platformUtils.requestBill(100007, 15, 200, 1);
                    // taskUtils.taskReport(taskUtils.TaskType.INVITE);
                }
                else {
                    platformUtils.requestBill(100007, 15, 200, 0);
                }
            });
        }

        platformUtils.requestBattleList(platformUtils.getUserId(), function(res){
            if(res && res.items && res.items.length > 0){
                gotoBattle();
            }else{
                platformUtils.requestBattleAdd( D.currHero.kind,D.currHero.subSeq,D.commonState.gameScore,function(res){
                    gotoBattle();
                });
            }
        });
    },
    
    update(dt) {
        
    },

    initScore: function(){
        let _this = this;
        platformUtils.getHigthScore(function(highestScore) {
            _this.labBestScore.string = String(highestScore);
        });
        platformUtils.requestGameInfo(function(userGame) {
            _this.labQzb.string = userGame.qzb+"";
        });
        this.labScore.string = String(D.commonState.gameScore);
        //this.labTopRemain.string = "每周一刷新排行榜";//String("排行榜：剩余" + 4 + "天刷新");
        
        platformUtils.getUserInfo(function(userInfo) {
            _this.loadHeadPic(_this.sprHeadimg, userInfo.avatarUrl)
        });
    },

    loadHeadPic: function(node, imgUrl){
        cc.loader.load({url: imgUrl, type: 'png'}, function(error, tex){
            node.spriteFrame = new cc.SpriteFrame(tex);
        });
    },
    onBtnSound: function(){
        if( ! D.isVoideClose){
            cc.audioEngine.play(this.btnSound);
        }
    },



});
