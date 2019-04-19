var poolClass = require('pool');
var common = require('common');
var sceneManager = require('sceneManager');
var platformUtils = require('PlatformUtils');
var gameUtils = require("gameUtils");
var storageUtils = require('StorageUtils');

cc.Class({
    extends: cc.Component,
    properties: () => ({
        btnPause: cc.Button,
        // gameScheduler: cc.Node,
        // labScheduler: cc.Label,
        labScoreDisplay: cc.Label,
        labBombAmount: cc.Label,
        // hpNum: cc.Label,
        txt_juliNum: cc.Label,
        starNum: cc.Label,
        txt_level_info:cc.Label,
        txt_kill_boss_time:cc.Label,
        labBombDisplay: cc.Node,
        img_kill_boss_time: cc.Sprite,
        node_buffs: cc.Node,
        isGamePlaying:false,
        btnPauseSprite: {
          default: [],
          type: cc.SpriteFrame,
          tooltip:'ButtonsGroupOfPauseTheGame',
        },
        hero: {
            default: null,
            type: require('hero')
        },
        bulletGroup: {
            default: null,
            type: require('bulletGroup')
        },
        enemyGroup: {
            default: null,
            type:require('enemyGroup')
        },
        ufoGroup: {
            default: null,
            type:require('ufoGroup')
        },
        effGroup: {
            default: null,
            type: require('effGroup')
        },
        bgm: {
            default: null,
            type: cc.AudioClip
        }, 
        soundGameOver: {
            default: null,
            type: cc.AudioClip
        },
        soundBomb: {
            default: null,
            type: cc.AudioClip
        },
        soundBtn: {
            default: null,
            type: cc.AudioClip
        },

        heroHPBar: {
            default: null,
            type: cc.ProgressBar,
            tooltip: '血量条'
        },
        //游戏结束
        gameoverPrefab: cc.Prefab,
        gameSettlePrefab: cc.Prefab,
        gamePausePrefab: cc.Prefab,
        juliNum:0,
        juliNumWxSync: 0,
        killBossTimeMax:30,
        currKillBossTime:0,
        videoGetBombMax: 2, //看视频领炸弹次数
        //道具分享
        shareItemPkgPrefab: cc.Prefab,

        hero_liaoji_1: cc.Sprite,
        hero_liaoji_2: cc.Sprite,
        txt_cdStart: cc.Label,
        spr_help_add: cc.Sprite,
        txt_helpadd: cc.Label,

        stopMoveHero:false,
        gameFightingID: cc.String,
        battlePrefab: cc.Prefab,
        redpacketPrefab: cc.Prefab,
        gameAwardPrefab: cc.Prefab,

        btn_speed: cc.Button,
        gameSpeed: 1,
    }),

    onLoad: function () {
        
        D.curSceneName = "Game";

        if(Device.needOffsetPixel()){ //iphone x适配
            let btn_node =  this.node._parent.getChildByName('Canvas').getChildByName('spr_node').getComponent(cc.Widget);
            if (btn_node){
                btn_node.top =  btn_node.top + 70;
            }
        }
        this.hero_liaoji_1.node.active = false
        this.hero_liaoji_2.node.active = false

        if ((CC_EDITOR || CC_DEBUG || CC_DEV)) {
            this.txt_level_info.node.active = true;
        }else{
            this.txt_level_info.node.active = false;
        }
        this.initState();

        if( ! D.isVoideClose){
            cc.audioEngine.stopAll()
            this.currentBGMusic = cc.audioEngine.play(this.bgm, true, 0.4);
        }
        this.labBombDisplay.on(cc.Node.EventType.TOUCH_START, this.useBomb,this);
        this.ufoGroup.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);  

        //注册监听炸弹的变化
        Notification.on("upgradeBomb",this.onListenBombChange,this);
        //注册监听分享礼包回调,赠送商品
        Notification.on("giveAwayItemPkg",this.onListenGiveAwayItemPkg,this);
        Notification.on("pauseToStart",this.pauseToStart,this);
        // this.showMissileView(0, cc.winSize.height * 0.5 - 50)
        Notification.on('shake_game_bg', this.sharkBg, this);
        Notification.on('level_Reward_Finish_event', this.rewardFinishHandler, this);

        platformUtils.hideWxLayer();
        this.node.runAction(cc.sequence(cc.delayTime(0.5),cc.callFunc(function(){
            platformUtils.hideWxLayer();//牵制关闭游戏圈
        })));

        D.gameBossAttacking = false;
    },
    onDestroy:function (params) {
        Notification.off("upgradeBomb", this.onListenBombChange);
        //注册监听分享礼包回调,赠送商品
        Notification.off("giveAwayItemPkg", this.onListenGiveAwayItemPkg);
        Notification.off("pauseToStart", this.pauseToStart);
        // this.showMissileView(0, cc.winSize.height * 0.5 - 50)
        Notification.off('shake_game_bg', this.sharkBg);
        Notification.off('level_Reward_Finish_event', this.rewardFinishHandler);

        this.hero.gameOver();
        D.beginFightBuffs = [];
        cc.director.getScheduler().setTimeScale(1);
        this.savePassLevel();
    },

    start: function(){
        common.hideLoading();
        common.clearPopLayer();
        platformUtils.hideWxLayer();//牵制关闭游戏圈

        this.checkReadyGoEff();
    },

    checkReadyGoEff: function(){
        let _this = this;
        let radyGo = function(){
            _this.readyGoEff();
        }
        
        if(!gameUtils.isNewExplain()){
            radyGo();
            return;
        }

        D.commonState.pauseState = true;
        D.gameStatuePause = true;
        this.hero.node.y = cc.winSize.height * 0.5 * -1 - 200;
        cc.loader.loadRes("prefabs/newExplain", function(err, prefab){
            let layer = common.showPopUpLayer(prefab, common.PopUpBg.Gray, common.PopUpAction.None, new cc.Color(0, 0, 0, 80));
            let script = layer.getComponent("newExplain");
            if(script){
                script.setCallback(radyGo);
            }
        });
    },
 
    initState: function () {
        this.gameFightingID = common.guid();
        platformUtils.requestBill(100003, 1, 100, this.gameFightingID);

        D.commonState.pauseState = false;
        D.gameStatuePause = false;

        D.commonState.labBombAmount = 3;
        this.labBombAmount.string = "x"+String(D.commonState.labBombAmount);

        D.commonState.gameScore = 0;
        D.commonState.gameDist = 0;
        this.labScoreDisplay.string = D.commonState.gameScore.toString();
        this.btnPause.active = true;
        this.labBombDisplay.active = true

        this.starNum.string = String(0)
        this.juliNum = 0
        this.juliNumWxSync = 0;
        this.txt_juliNum.string = String(this.juliNum)
        this.txt_cdStart.node.active = false;
        ///
        this.hero.node.active = true;
        let heroObj = this.hero.getComponent("hero")
        this.updateHeroHP(heroObj.maxHP)
        
        this.hideKillBossTime();

        D.commonState.gameContinueCounter = 0;

        if(CC_WECHATGAME) {
            window.wx.postMessage({
                type: 'clean',
            });
        }

        this.spr_help_add.node.active = false;
        let _this = this;
        gameUtils.getFriendHelpAdd(function(addNum){
            if(addNum > 0){
                _this.spr_help_add.node.active = true;
                _this.txt_helpadd.string = addNum + "%";
            }
        });

        gameUtils.redpacketInitState();
    },

    readyGoEff:function () {
        D.commonState.pauseState = true;
        D.gameStatuePause = true;

        let self = this
        let callBack = function(){
            self.effGroup.showReadyView(self.newGuide, self);
        }

        this.hero.initData();
        this.hero.node.x = 0;
        this.hero.node.y = cc.winSize.height * 0.5 * -1 - 200;
       
        let tarY = cc.winSize.height * 0.5 * -1 + 300
        this.hero.node.stopAllActions()
        this.hero.node.runAction(cc.sequence(cc.moveTo(0.3, cc.v2(0, tarY)), cc.blink(0.3, 3), cc.delayTime(0.5),cc.callFunc(callBack)));
    },

    newGuide: function(){

        let _this = this;
        let guideFinsh = function(){
            _this.gameStart();
            platformUtils.setItemByLocalStorage('newGuide1',true)
        }

        // platformUtils.setItemByLocalStorage('newGuide',false)
        //新手引导
        if( ! platformUtils.getItemByLocalStorage('newGuide1',false)){
            platformUtils.requestBill(100004, 1, 100);
        // if( true){
            D.commonState.pauseState = true;
            D.gameStatuePause = true;

            cc.loader.loadRes("prefabs/guideLayer", function(err,prefab){
                let layer = common.showPopUpLayer(prefab, common.PopUpBg.Gray, common.PopUpAction.None, new cc.Color(0, 0, 0, 80));
                let script = layer.getComponent("guideLayer");
                if(script){
                    script.startAnim(guideFinsh, _this);
                }
            });
            return;
        }

        this.gameStart();
    },

    guideItem: function(id){

        if(D.commonState.pauseState){
            return;
        }

        let key = 'guideItem_id'+id;
        let _this = this;
        let guideFinsh = function(){
            if(!_this.labBombDisplay.guiding){
                return;
            }
            _this.doGamePause();
            _this.useBomb();
        }
        // platformUtils.setItemByLocalStorage(key,false)
        let showGuide = function(){
            if(D.commonState.pauseState){
                return;
            }
            if( !platformUtils.getItemByLocalStorage(key,false)){
                if(!_this.labBombDisplay.guiding){
                    return;
                }
                if(D.commonState.pauseState){
                    return;
                }
                this.doGamePause();
                cc.loader.loadRes("prefabs/guideItem", function(err,prefab){
                    let layer = common.showPopUpLayer(prefab, common.PopUpBg.None, common.PopUpAction.None, new cc.Color(0, 0, 0, 50));
                    _this.labBombDisplay.guideLayer = layer;
                    layer.removeComponent(cc.BlockInputEvents);
                    let script = layer.getComponent("guideItem");
                    if(script){
                        script.guide(_this.labBombDisplay, guideFinsh, _this);
                    }
                });
            }
        }

        this.labBombDisplay.runAction(cc.sequence(cc.delayTime(6),cc.callFunc(showGuide,this)));
        this.labBombDisplay.guiding = true;
    },

    gameStart:function(){
        D.commonState.pauseState = false;
        D.gameStatuePause = false;

        this.isGamePlaying = true;

        this.enemyGroup.startAction();
        this.bulletGroup.startAction();
        this.ufoGroup.startAction();

        this.hero.addChargeBuff();

      
    },

    showLiaojiHandler:function(){
        this.hero_liaoji_1.node.active = true
        this.hero_liaoji_2.node.active = true
        this.bulletGroup.liaojiHandler(true)
        let itemCfg = common.getJsonCfgByID("Items", 14);

        this.hideLiaojiHandler = function () {
            this.hero_liaoji_1.node.active = false
            this.hero_liaoji_2.node.active = false
            this.bulletGroup.liaojiHandler(false)
            Notification.emit("change_bullet_buff", { item: "item_14" });
        }

        // this.node.stopAction(this.liaojiAction)
        // this.liaojiAction = -1
        
        // this.liaojiAction = this.node.runAction(cc.sequence(cc.delayTime(itemCfg.periodTime), cc.callFunc(this.hideLiaojiHandler, this)))
    },
    
    getLiaojiPoint:function (liaojiID) {
        if (liaojiID == 1) {
          
            return cc.v2(/* this.hero_liaoji_1.node.x + */ this.hero.node.x - 100,  this.hero.node.y)
        }
        
        return cc.v2(/* this.hero_liaoji_2.node.x + */ this.hero.node.x + 100, this.hero.node.y)
    },

    startFireEvent:function () {
        this.bulletGroup.levelBeginlHandler()
    },
    //显示敌人来了的警告
    showWarningView:function () {
        this.effGroup.showWarningView(this.startFireEvent,this)
    },
    //显示导弹来了
    showMissileView: function (idx,missileX, missileY, needShowMissileWarning) {
        // if (idx == 1) {
        //     missileX = this.hero.node.x
        // }

        this.effGroup.showMissilePreView(missileX,missileY)
        if (needShowMissileWarning){
            this.effGroup.showGameMissileView()
        }
        
        let self = this;

        let dealyCallBack = function(){
            self.enemyGroup.checkShowWarningPreView()
            self.bulletGroup.missileBulletHandler(missileX, missileY)
        }
        
        var delay = cc.delayTime(2);
        var finish = cc.callFunc(dealyCallBack, this);
        this.node.runAction(cc.sequence(delay, finish))
    },

    //暂停回来，

    //恢复血量，继续游戏
    recoverHpAndGame: function (newHpNum) {
        D.gameStatuePause = false
        this.stopMoveHero = false
        this.isGamePlaying = true;
        this.btnPause.active = true;
        this.labBombDisplay.active = true;
        D.commonState.gameContinueCounter ++;

        if(CC_WECHATGAME) {
            window.wx.postMessage({
                type: 'clean',
            });
        }

        ///
        let self = this;
        let callBack = function () {
            self.doResumeGame();
            if(self.levelPassing == true){
                self.hero.closeRelifeBuff();
                self.heroFlyTop();
            }
        }

        this.hero.node.stopAllActions()

        this.hero.reLife();
        this.hero.node.x = 0;
        this.hero.node.y = cc.winSize.height * 0.5 * -1 - 200;
        let tarY = cc.winSize.height * 0.5 * -1 + 300
        this.hero.node.runAction(cc.sequence(cc.moveTo(0.3, cc.v2(0, tarY)), cc.blink(0.3, 3), cc.delayTime(0.5), cc.callFunc(callBack)));
    },

    //再来新的一局
    newGameAgain: function () {
        //重置游戏内容
        D.isKillBossTimeStatus = false;
        D.gameBossAttacking = false;
        D.gameStatuePause = false
        this.stopMoveHero = false

        //上传分数
        this.commitCoin()

        this.enemyGroup.gameOver();
        this.bulletGroup.gameOver();
        this.ufoGroup.gameOver();

        this.removeAllEnemy(true)
        this.removeAllBullet(true)
        this.removeAllUfo();
        this.clearHeroBuff();

        this.initState();
        this.checkReadyGoEff();
        this.savePassLevel();

        if (!D.isVoideClose) {
            cc.audioEngine.stopAll()

            let _this = this;
            let callback = function(){
                _this.currentBGMusic = cc.audioEngine.play(_this.bgm, true,0.4);
            }
            this.node.runAction(cc.sequence(cc.delayTime(0.1),cc.callFunc(callback, this)));
            
        }
    },

    clearHeroBuff: function(){
        this.hero.clearAllBuff();

        if(this.hideLiaojiHandler){
            this.hideLiaojiHandler();
        }
        // this.bulletGroup.closeJiGuangBullet();
        this.ufoGroup.resetUpdteUfoTimesHandler();
    },

    showBeHurtEffView:function(){
        this.effGroup.showBeHurtEffView()
    },
    
   //上传分数
    commitCoin:function(isDouble){
        let coinNum = Number(this.starNum.string)
        if(isDouble){
            coinNum *=2;
        }
        platformUtils.requestAddCoin(coinNum, D.ReasonAddCoinFight, function () { })
        this.starNum.string = "0"
    },

    savePassLevel: function(){
        let level = platformUtils.getItemByLocalStorage("preEedGameLevel", 0);
        if(level == this.enemyGroup.mainLevel){
            platformUtils.setItemByLocalStorage("preEedGameLevelCount", platformUtils.getItemByLocalStorage("preEedGameLevelCount", 0) + 1);
        }else{
            platformUtils.setItemByLocalStorage("preEedGameLevelCount",1);
        }

        platformUtils.setItemByLocalStorage("preEedGameLevel", this.enemyGroup.mainLevel);
    },

    // 游戏结束
    gameOver: function () {
        if (!this.isGamePlaying){
            return
        }
        
        this.isGamePlaying = false;
        if( ! D.isVoideClose){
            cc.audioEngine.play(this.soundGameOver);
        }

        let _this = this;
        let effFinish = function(){
            _this.btnPause.active = false;
            _this.labBombDisplay.active = false;

            platformUtils.requestShareCfg('gameOverRevive,gameOverZhuli', function(res) {
                console.log('requestShareCfg', JSON.stringify(res));
                if( ( ! res['gameOverRevive'] && ! res['gameOverZhuli']) || D.commonState.gameContinueCounter >= 2) {
                    _this.gameEndAndRelease();
                    // _this.showGameSettle();
                    _this.showGameAward();
                }
                else {
                    let gameoverLayer = common.showPopUpLayer(_this.gameoverPrefab);
                    let gameoverScript = gameoverLayer.getComponent('gameover');
                    gameoverScript.gameMain = _this;
                }
            });
        }

        this.doPauseGame();
        D.commonState.gameDist = this.juliNum;
        D.gameStatuePause = true;

        this.submitScore();

        this.effGroup.heroDieEff(effFinish, this, this.hero.node);

        
    },


    handlebtnPause: function () {
        if( ! D.isVoideClose){
            cc.audioEngine.play(this.soundBtn);
        }
        if(D.commonState.pauseState){
            return;
        }

        this.doGamePause();

        let gamePauseLayer = common.showPopUpLayer(this.gamePausePrefab);
        let gamePauseScript = gamePauseLayer.getComponent('gamePause');
        //声音label
        let labels = gamePauseScript.node.getComponentsInChildren(cc.Label);
        labels.forEach((item,idx) => {
            if(item.node.name == "lab_close_voice"){
                item._string = D.isVoideClose?"开启":"静音";
            }
        });
        gamePauseScript.gameMain = this;

    },
    doGamePause: function() {        
        if (D.commonState.pauseState) {
            this.doResumeGame()
            return
        }
        this.doPauseGame()
    },
 
    doResumeGame:function(){
        D.gameStatuePause = false;

        this.enemyGroup.gameResume();
        this.bulletGroup.gameResume();
        this.ufoGroup.gameResume();
        if( ! D.isVoideClose){
            cc.audioEngine.resume(this.currentBGMusic);
        }
        
        D.commonState.pauseState = false
    },

    doPauseGame: function () {
        D.gameStatuePause = true;
        this.enemyGroup.gamePause();
        this.bulletGroup.gamePause();
        this.ufoGroup.gamePause();

        if( ! D.isVoideClose){
            cc.audioEngine.pause(this.currentBGMusic);
        }
        D.commonState.pauseState = true
    },

    //暂停回来，继续游戏
    pauseToStart: function(){
        this.txt_cdStart.node.active = true;
        this.txt_cdStart.string = '3';

        let _this = this;
        let callback = function(){
            let num = parseInt(_this.txt_cdStart.string);
            num -= 1;
            if(num < 1){
                _this.doGamePause();
                _this.txt_cdStart.node.stopAllActions();
                _this.txt_cdStart.node.active = false;
            }
            else{
                _this.txt_cdStart.string = String(num);
            }
        }

        let act1 = cc.delayTime(1);
        let act2 = cc.callFunc(callback,_this);
        let act3 = cc.delayTime(1);
        let act4 = cc.callFunc(callback,_this);
        let act5 = cc.delayTime(1);
        let act6 = cc.callFunc(callback,_this);
        this.txt_cdStart.node.runAction(cc.sequence(act1,act2,act3,act4,act5, act6));
    },

    // 使用tnt炸弹
    useBomb: function () {
        cc.log("===D.commonState.labBombAmount==", D.commonState.labBombAmount);
        if(this.txt_cdStart.node.active == true){
            return;
        }

        //新手引导
        let isGuide = false;
        if(this.labBombDisplay.guiding && this.labBombDisplay.guideLayer){
            this.labBombDisplay.guiding = false;

            let script = this.labBombDisplay.guideLayer.getComponent("guideItem");
            if(script){
                script.close();
            }
            platformUtils.setItemByLocalStorage("guideItem_id1",true)

            this.labBombDisplay.guideLayer = null;
            isGuide = true;
            
            if(D.commonState.pauseState){
                this.doGamePause();
            }
        }

        if (D.commonState.labBombAmount > 0 || isGuide ) {
            // 音效
            if( ! D.isVoideClose){
                cc.audioEngine.play(this.soundBomb);
            }
            
            let a = false
            let enemyItem;
            let enemyAry = new Array(...this.enemyGroup.node.children);
            for (let i = 0; i < enemyAry.length; i++) {
                enemyItem = enemyAry[i].getComponent('enemy')

                if (enemyItem && enemyItem.isInWinsize()) {
                    enemyItem.tntBombHandler();
                }
                a = true
            }

            let b = this.removeAllBullet();

            if (a || b) {
                if(!isGuide){
                    D.commonState.labBombAmount--;
                }
                this.labBombAmount.string = "x" + String(D.commonState.labBombAmount);

                //爆炸动画
                let _this = this;
                let bombFinish = function(){
                    this.bulletGroup.resumeEnemyBullet();
                }   
                this.effGroup.showBigBoom(bombFinish, this);
                this.bulletGroup.stopEnemyBullet();

                //抖屏
                this.sharkBg();
            }
            else
            {
                common.sysMessage("没有可以炸毁的物体");
            }
        }else{
            common.sysMessage("全屏炸弹数量不足");
        }
    },

    //全屏点击
    touchMove:function(event){
        if (D.gameStatuePause || this.stopMoveHero) {
            return
        }

        let touchDelta = event.touch.getDelta()
        this.hero.node.x += touchDelta.x
        this.hero.node.y += touchDelta.y
        
        let wx = cc.winSize.width * 0.5 - 50
        let wh = cc.winSize.height * 0.5 - 50
        if (this.hero.node.x < -wx) {
            this.hero.node.x = -wx
        } else if (this.hero.node.x > wx) {
            this.hero.node.x = wx
        } else if (this.hero.node.y < -wh) {
            this.hero.node.y = -wh
        } else if (this.hero.node.y > wh) {
            this.hero.node.y = wh
        }
    },
    // 移除所有敌人的子弹
    removeAllBullet: function (isForce){
        let isEnemy = false
        let bulletAry = new Array(...this.bulletGroup.node.children);
        for (let i = 0; i < bulletAry.length; i++) {
            let bullet = bulletAry[i].getComponent('bullet')
            if (bullet && isForce) {
                isEnemy = true
                bullet.forceRemove()
            }
            else if (bullet && !bullet.isPlayerBullet()) {
                isEnemy = true
                this.bulletGroup.destroyBullet(bullet.node);
            }
        }
        return isEnemy
    },
    removeAllEnemy:function(isForce){
        let isEnemy = false
        let enemy = new Array(...this.enemyGroup.node.children);
        for (let i = 0; i < enemy.length; i++) {
            if (isForce){
                isEnemy = true
                enemy[i].getComponent('enemy').forceRemove()
            }else{
                isEnemy = true
                enemy[i].getComponent('enemy').explodingAnim();
            }
        }
        return isEnemy
    },

    removeAllUfo:function(){
        let ufoAry = new Array(...this.ufoGroup.node.children);
        for (let i = 0; i < ufoAry.length; i++) {
            ufoAry[i].getComponent('ufo').removeUfo()
        }

    },
    // 接收炸弹
    receiveBomb: function () {
        D.commonState.labBombAmount++;
        this.labBombAmount.string = "x" + String(D.commonState.labBombAmount);
    },
    
    // 分数
    changeScore: function (score) {
        D.commonState.gameScore += score;
        this.labScoreDisplay.string = D.commonState.gameScore.toString();
    },
   
    //游戏结束并释放资源
    gameEndAndRelease: function() {
        
        this.hero.node.active = true;
        this.enemyGroup.gameOver();
        this.bulletGroup.gameOver();
        this.ufoGroup.gameOver();
        
        poolClass.clearAllPool();
    },

    showGameAward: function(){
        let gameAwardLayer = common.showPopUpLayer(this.gameAwardPrefab);
        let script = gameAwardLayer.getComponent('gameAward');
        script.initData(Number(this.starNum.string));
        script.gameMain = this;
    },

    showGameSettle: function(){
        if(D.commonState.isBattle && D.commonState.battleFromUserId != platformUtils.getUserId()){
            this.showBattleResult();
            return;
        }

        let gameSettleLayer = common.showPopUpLayer(this.gameSettlePrefab);
        let gameSettleScript = gameSettleLayer.getComponent('gameSettle');
        gameSettleScript.gameMain = this;
    },

    showBattleResult: function(){
        
        let _this = this;
        let showResutl = function(){
            let layer = common.showPopUpLayer(_this.battlePrefab);
            let script = layer.getComponent("battleLayer");
            if(script){
                script.requestData(D.commonState.battleFromUserId, true);
            }
        }

        if(D.commonState.battleFromUserId == platformUtils.getUserId()){
            platformUtils.requestBattleAdd(this.hero._skinKind,this.hero._skinSubSeq,D.commonState.gameScore,function(res){
                showResutl();
            });
        }else{
            let data = { 
                fromUserId:D.commonState.battleFromUserId,
                heroKind:this.hero._skinKind,
                heroSeq:this.hero._skinSubSeq,
                score:D.commonState.gameScore 
            };
                
            platformUtils.requestBattleAddScore(data,function(res){
                showResutl();
            });
        }
    },

    //更新玩家自己的血量
    updateHeroHP:function (num) {
        // this.hpNum.string = String(Math.floor(num));
        ///
        let heroObj = this.hero.getComponent("hero")
        let totalNum = heroObj.maxHP
        this.heroHPBar.progress = num / totalNum
    },

    addStarNum:function(num){
        let n = Number(this.starNum.string);
        this.starNum.string = String(Math.floor(num + n) );

        //特效
        if(this.hero.starEff){
            // let starEff = this.hero.node.getChildByName("starEffTag");
            // console.log("1111111111111111111")
            // if(starEff){
            //     let anim = starEff.getComponent(cc.Animation);
            //     console.log("2222222222222222")
            //     if(anim){
            //         console.log("333333333333333")
            //         anim.play();
            //     }
            // }
            return;
        }

        let _this = this;
        let finish = function(){
            _this.hero.starEff = false;
        }
        this.hero.starEff = true;
        this.effGroup.starEff(this.hero.node, finish, this);
    },

    updateJuLiNum:function(){

        if (D.gameBossAttacking) {
            return
        }
        
        // this.juliNum
        this.juliNum += 0.01;

        this.txt_juliNum.string = String(this.juliNum.toFixed(2)+"km");

        if(this.juliNumWxSync == 0 || this.juliNum - this.juliNumWxSync >= 0.5) {
            this.nearFriend(this.juliNumWxSync == 0 ? 0 : 5);
            this.juliNumWxSync = this.juliNum;
        }
    },

    updateLevelInfo:function( str,idx ){
        this.txt_level_info.string = str;
        this.level_idx = idx;
    },

    //显示BOSS击杀加成时间
    showKillBossTime:function(){
        if (D.isKillBossTimeStatus) {
            return
        }

        // D.isKillBossTimeStatus = true
        // this.img_kill_boss_time.node.active = true;
        this.currKillBossTime = this.killBossTimeMax;
        this.killBossTimeCallback = function () {
            if (this.currKillBossTime <= 0) {
                this.hideKillBossTime()
            }
            this.updateKillBossTime();
            this.currKillBossTime--;
        }
        this.schedule(this.killBossTimeCallback, 1);
        this.updateKillBossTime();
    },

    hideKillBossTime:function(){
        D.isKillBossTimeStatus = false
        this.img_kill_boss_time.node.active = false;
        this.unschedule(this.killBossTimeCallback);
    },

    updateKillBossTime:function() {
        D.isKillBossRemainTime = this.killBossTimeMax - this.currKillBossTime;

        var date = new Date(this.currKillBossTime*1000);
        this.txt_kill_boss_time.string = date.getMinutes() + ':' + date.getSeconds() ;
    },

    isKillBossTime:function () {
        // return this.img_kill_boss_time.node.active
        return false;
    },

    update: function (dt) {
        if (D.gameStatuePause) {
            return
        }
        D.gameHeroPx = this.hero.node.x
        D.gameHeroPy =  this.hero.node.y //自己的坐标记录下来

        this.updateJuLiNum()
    },

    //更新炸弹数量
    onListenBombChange: function(event){
        this.labBombAmount.string = "x"+String(D.commonState.labBombAmount);
    },

    //////////////
    levelPass: function(){
        this.levelPassing = true;
        this.heroFlyTop();
    },

    heroFlyTop:function(bgPath,event){
        this.stopMoveHero = true

        let _this = this;
        let animEnd = function(){
            _this.changeRewardBg(bgPath,event)
        }

        let act1 = cc.moveTo(1, cc.v2(this.hero.node.x,cc.winSize.height*0.5 + 200));
        let act2 = cc.delayTime(1);
        let act3 = cc.callFunc(animEnd, this);
        this.hero.node.stopAllActions();
        this.hero.node.runAction(cc.sequence(act1,act2,act3));
    },

    changeRewardBg: function(bgPath,event){
        if(bgPath == null){
            bgPath = "bg/reward_bg";
        }
        if(event == null){
            event = 'level_reward_event';
        }

        this.hero.node.x = 0;
        this.hero.node.y = cc.winSize.height * 0.5 * -1 - 200;;

        let _this = this;
        let resetState = function(){
            _this.stopMoveHero = false;
            Notification.emit(event,{lvl: _this.enemyGroup.currlevel});
        }

        let flyBack = function(){
            let act1 = cc.moveTo(0.5, cc.v2(0, cc.winSize.height * 0.5 * -1 + 300));
            let act2 = cc.delayTime(0.5);
            let act3 = cc.callFunc(resetState, _this);
            _this.hero.node.stopAllActions();
            _this.hero.node.runAction(cc.sequence(act1,act2,act3));
        }
        
        let nodeBg = this.node.parent.getChildByName('Canvas').getChildByName("nodeBg");
        cc.loader.loadRes(bgPath,cc.SpriteFrame, function(err, spriteFrame){
            for (var i = 1; i <= 3; i++) {
                let bg = nodeBg.getChildByName("bg"+i);
                if(bg){
                    _this.changeBgAnim(spriteFrame, flyBack)
                }
            }
        });
    },

    rewardFinishHandler: function(){
        this.heroFlyTop("bg/fighting_bg", "level_Reward_Ani_Finish_event")
        this.levelPassing = false;
    },

    changeBgAnim: function(spriteFrame, callback){

        let nodeBg = this.node.parent.getChildByName('Canvas').getChildByName("nodeBg");

        let setFrame = function(){
            for (var i = 1; i <= 3; i++) {
                let bg = nodeBg.getChildByName("bg"+i);
                if(bg){
                    bg.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                }
            }

            if(callback){
                callback();
            }
        }

        let act1 = cc.fadeOut(0.3);
        let act2 = cc.callFunc(setFrame,this);
        let act3 = cc.fadeIn(0.3);
        nodeBg.stopAllActions();
        nodeBg.runAction(cc.sequence(act1,act2,act3));
    },

    //监听道具  res道具ID
    onListinShareItemPkg: function(res){
        let itemValue = common.getJsonCfgs("Items")[res].dropValue;
        let items = itemValue.split(",");
        let itemOne;
        let itemOneValue;
        let itemTwo;
        let itemTwoValue;
        let itemThr;
        let itemThrValue;
        items.forEach((element,idx)=>{
            switch(idx){
                case 0:
                    itemOne = element.split("#")[0];
                    itemOneValue = element.split("#")[1];
                    break;
                case 1:
                    itemTwo = element.split("#")[0];
                    itemTwoValue = element.split("#")[1];
                    break;
                case 2:
                    itemThr = element.split("#")[0];
                    itemThrValue = element.split("#")[1];
                    break;
            }
        });

        let parent = cc.director.getScene("Game");
        let sharePkgPre = null;     //分享礼包prefab
        let hero = null;            //英雄hero
        parent._children.forEach((item,idx) => {
            if(item._name == "mainScript"){
                item._components.forEach((subItem,subIdx) => {
                    sharePkgPre = subItem.shareItemPkgPrefab;
                    hero = subItem.hero;
                });
            }
        });

        //道具url资源
        let _this = this;
        let urls = ["items/item_"+itemOne, "items/item_"+itemTwo,"items/item_"+itemThr];
        cc.loader.loadResArray(urls, cc.SpriteFrame, function (err, assets) {
            if (err) {
                cc.error(err);
                return;
            }
            //分别加载三个道具icon
            sharePkgPre.data.children[3].children[0]._components[0].spriteFrame = assets[0];
            sharePkgPre.data.children[3].children[1]._components[0].string = "x"+itemOneValue;
            sharePkgPre.data.children[4].children[0]._components[0].spriteFrame = assets[1];
            sharePkgPre.data.children[4].children[1]._components[0].string = "x"+itemTwoValue;
            sharePkgPre.data.children[5].children[0]._components[0].spriteFrame = assets[2];
            sharePkgPre.data.children[5].children[1]._components[0].string = "x"+itemThrValue;
            sharePkgPre.data.getChildByName('lab_itemid').getComponent(cc.Label).string = res+'';
            
            let pos = new cc.Vec2(cc.winSize.width/2,cc.winSize.height/2);
            let shareItemPrefab = common.createPopUpLayer(parent, sharePkgPre,pos);
           
            parent.addChild(shareItemPrefab);
            _this.doGamePause();
        });
    },
    //监听分享礼包回调，赠送道具
    onListenGiveAwayItemPkg: function(itemID){
        let itemValue = common.getJsonCfgs("Items")[itemID].dropValue;
        let items = itemValue.split(",");
        let itemOne;
        let itemOneValue;
        let itemTwo;
        let itemTwoValue;
        let itemThr;
        let itemThrValue;
        items.forEach((element,idx)=>{
            switch(idx){
                case 0:
                    itemOne = element.split("#")[0];
                    itemOneValue = element.split("#")[1];
                    break;
                case 1:
                    itemTwo = element.split("#")[0];
                    itemTwoValue = element.split("#")[1];
                    break;
                case 2:
                    itemThr = element.split("#")[0];
                    itemThrValue = element.split("#")[1];
                    break;
            }
        });
        this.addHeroItem(itemOne,itemOneValue);
        this.addHeroItem(itemTwo,itemTwoValue);
        this.addHeroItem(itemThr,itemThrValue);
        this.pauseToStart();
    },
    addHeroItem: function(type,value){
        switch(type){
            case 18:
                this.addStarNum(value);
            default:
                for(let idx=0;idx<value;idx++){
                    this.hero.addHeroItemEffect('item_'+type);
                }
        }
    },
    
    //玩家身上道具状态
    addHeroBuff: function(buff, buffArr){
        if (!buff) return;
        if (buff.time == -1) return;

        let _this = this;
        var addBuff = function(buf){
            let url = "prefabs/heroBuff";
            cc.loader.loadRes(url, function(err, prefab){
                let nodeBuff = cc.instantiate(prefab);
                _this.node_buffs.addChild(nodeBuff, 1,"herobuff_tag_"+ buf.name);
                let script = nodeBuff.getComponent("heroBuff");
                if(script){
                    script.addBuff(buf);
                }
                _this.updateBuffPos(buffArr);
            });
        }

        var updateBuff = function(buf, nodeBuff){
            let script = nodeBuff.getComponent("heroBuff");
            if(script){
                script.updateBuff(buf);
            }
        }

        let nodeBuff = this.node_buffs.getChildByName("herobuff_tag_"+ buff.name);
        if(!nodeBuff){
            addBuff(buff);
        }else{
            updateBuff(buff,nodeBuff);
        }
    },

    removeHeroBuff: function(buff, buffArr){
        if(buff == null) return;

        let nodeBuff = this.node_buffs.getChildByName("herobuff_tag_"+ buff.name);
        if(nodeBuff){
            this.node_buffs.removeChild(nodeBuff);
        }

        this.updateBuffPos(buffArr);
    },

    updateBuffPos: function(buffArr){
        let spIdx = 1;
        let _this = this;
        buffArr.forEach(function(buff, idx){
            if(buff.time != -1){
                let nodeBuff = _this.node_buffs.getChildByName("herobuff_tag_"+buff.name);
                if(nodeBuff){
                    let nodePos = _this.node_buffs.getChildByName("img_buff"+spIdx)
                    if(nodePos){
                        nodeBuff.position = nodePos.position;
                    }
                }
                spIdx += 1;
            }
        });
    },

    //获取道具提示文字
    tipsGetItem: function(item){
        if(this.hero.itemTios) return;

        let _this = this;
        let finish = function(){
            _this.hero.itemTios = false;
        }

        this.effGroup.getItemTips(this.hero.node, item, finish, this);
        this.hero.itemTios = true;
    },

    ///获取坐标上最近的敌人
    getNearEnemyByPos: function (thisPoint){
        let targetPoint;
        let targetObj = null;
        let nestNum = 99999999;
        let enemyAry = new Array(...this.enemyGroup.node.children);
        for (let i = 0; i < enemyAry.length; i++) {
            let enemy = enemyAry[i].getComponent('enemy')
            if (enemy && enemy.isLife() && enemy.isInWinsize()) {
                targetPoint = enemy.node.getPosition()
                var delta = targetPoint.subSelf(thisPoint);
                var distance = delta.mag();
                if (nestNum > distance) {
                    targetObj = enemy
                    nestNum = distance
                }
            }
        }
        return targetObj
    },

    sharkBg: function(){
        let nodeBg = this.node.parent.getChildByName('Canvas').getChildByName("nodeBg");
        if(nodeBg){
            nodeBg.stopAllActions();
            nodeBg.runAction(new cc.shake(0.5,30,30));
        }
    },

    nearFriend: function(near) {
        if(D.commonState.isBattle) return;
        
        if(CC_WECHATGAME) {
            let _this = this;
            platformUtils.getUserInfo(function(userInfo) {
                window.wx.postMessage({
                    type: 'nearInGame',
                    score: D.commonState.gameScore,
                    dist: _this.juliNum,
                    near: near,
                    selfAvatarUrl: userInfo.avatarUrl,
                    selfOpenId: userInfo.openId,
                });
            });
        }
    },
    submitScore: function() {
        let score = D.commonState.gameScore;
        let gameDist = D.commonState.gameDist;
        platformUtils.requestBill(100005, 3, 100, score, gameDist*100/60, this.enemyGroup.mainLevel, this.gameFightingID);
        let hero = {};
        hero.id = D.currHero.id;
        hero.kind = D.currHero.kind;
        hero.subSeq = D.currHero.subSeq;
        hero.level = D.currHero.level;
        hero.tag = ((D.currHero&&D.currHero.kind>0)?D.currHero.kind:1)+"_"+((D.currHero&&D.currHero.subSeq>0)?D.currHero.subSeq:1);
        let _this = this;
        platformUtils.setAndGetHigthScore(score, function(highestScore) {        
            if(CC_WECHATGAME) {
                platformUtils.getUserInfo(function(userInfo) {
                    window.wx.postMessage({
                        type: 'submitUserData',
                        score: score,
                        highestScore: highestScore,
                        dist: gameDist,
                        selfAvatarUrl: userInfo.avatarUrl,
                        selfOpenId: userInfo.openId,
                        hero: hero,
                    });
                });
            }
        });
    },

    onBtnSpeed: function(){
        let tag = 1;
        if(this.isAddSpeed){
            this.gameSpeed = 1;
            this.isAddSpeed = false;
        }else{
            this.gameSpeed = 1.6;
            this.isAddSpeed = true;
            tag = 2
        }
        cc.director.getScheduler().setTimeScale(this.gameSpeed);

        let _this = this;
        cc.loader.loadRes("game/icon_game_speed_"+tag, cc.SpriteFrame, function(err,spriteFrame){
            _this.btn_speed.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
    },

    dropRedPacket: function(x,y){
        if(!gameUtils.redPacketIsDrop(this.enemyGroup.mainLevel,this.level_idx)){
            // console.log("============ main can not dropRedPacket ")
            return;
        }
        console.log("============  dropRedPacket ")
        let _this = this;
        platformUtils.requestShareCfg('redpacket_test', function(res) {
            if(res == 's') {
                if(storageUtils.redpacketShareCount() > 0 || storageUtils.redpacketVideoCount() > 0){
                    _this.ufoGroup.dropRedPacket(x,y);
                }
            }
        });
        
    },

    addRedPacket: function(){
        if( ! D.isVoideClose){
            cc.audioEngine.play(this.soundBtn);
        }
        if(D.commonState.pauseState){
            return;
        }
        this.doGamePause();

        let reason = gameUtils.redpacketReason;
        console.log("--------- main addRedPacket,---reason=",reason);
        let layer = common.showPopUpLayer(this.redpacketPrefab);
        let script = layer.getComponent("redpacketDrop");
        if(script){
            script.initWithData(reason,this.enemyGroup.mainLevel);
            script.gameMain = this;
        }

        gameUtils.curLevelDropNum ++;
    },
});
