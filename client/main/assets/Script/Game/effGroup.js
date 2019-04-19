var poolClass = require('pool');
var common = require('common');

const gameEffG = cc.Class({
   name: 'gameEffG',
   properties: {
       name: '',
       prefab: cc.Prefab,
       size:0,
   }
});

cc.Class({
    extends: cc.Component,

    properties: {
        gameEffG: {
            default: [],
            type: gameEffG
        },
        mainScript: {
            default: null,
            type: require('main'),
        },
    },

    // use this for initialization
    onLoad: function () {
        poolClass.initPoolBatch(this, this.gameEffG);
    },
    // 填充弹药
    startAction: function () {

    },

    showReadyView: function (callback, callbackObj) {

        let effInfo = this.gameEffG[0];
        let newNode = cc.instantiate(effInfo.prefab);
        this.node.addChild(newNode);

        newNode.setPosition(cc.v2(0,0));

        let self = this;
        
        let animR = newNode.getChildByName("ready").getComponent(cc.Animation);
        let animG = newNode.getChildByName("go").getComponent(cc.Animation);
        animG.node.active = false

        let goComplete = function(){
            animR.node.active = false
            animG.node.active = false
            self.node.removeChild(newNode);

            if (callback) {
                callback.apply(callbackObj)
            }
        };

        let goeffHandler = function() {
            animR.node.active = false
            animG.node.active = true
            animG.play('go');
            animG.on('finished',  goComplete, this); 
        };

        animR.play('readygo');
        animR.on('finished', goeffHandler, this); 
    },

    showWarningView: function (callback, callbackObj){
        let effInfo = this.gameEffG[1];
        let newNode = cc.instantiate(effInfo.prefab);
        this.node.addChild(newNode);
        newNode.setPosition(cc.v2(0, 0));

        let self = this;
        let onComplete = function () {
            self.node.removeChild(newNode);

            if (callback) {
                callback.apply(callbackObj)
            }
        };

        let dd = newNode.getComponent(cc.Sprite)
        var act1 = cc.fadeIn(0.3)
        var act2 = cc.fadeOut(0.5)
        var repeatAction = cc.repeat(cc.sequence(act1, act2), 3);
        dd.node.runAction(cc.sequence(repeatAction, cc.callFunc(onComplete)) )
    },
    //显示导弹来了警告
    showGameMissileView: function (callback, callbackObj){
        let effInfo = this.gameEffG[2];
        let newNode = cc.instantiate(effInfo.prefab);
        this.node.addChild(newNode);
        // newNode.setPosition(cc.v2(cc.winSize.width * 0.5, cc.winSize.height * 0.5));
        newNode.setPosition(cc.v2(0, 200));

        let animNode = newNode.getChildByName("gameeff_missile_warning_light").getComponent(cc.Sprite);

        let self = this;
        let onComplete = function () {
            self.node.removeChild(newNode);

            if (callback) {
                callback.apply(callbackObj)
            }
        };

        var act1 = cc.fadeIn(0.3)
        var act2 = cc.fadeOut(0.5)
        var repeatAction = cc.repeat(cc.sequence(act1, act2), 3);
        animNode.node.runAction(cc.sequence(repeatAction, cc.callFunc(onComplete)))
    },

    showMissilePreView: function (missileX, missileY, callback, callbackObj){
        let effInfo = this.gameEffG[3];
        let newNode = cc.instantiate(effInfo.prefab);
        this.node.addChild(newNode);
        newNode.setPosition(cc.v2(cc.winSize.width*Math.random(), missileY));

        let animNode = newNode.getChildByName("gameeff_missile_warning_pre_flag").getComponent(cc.Sprite);

        let self = this;
        let onComplete = function () {
            self.node.removeChild(newNode);

            if (callback) {
                callback.apply(callbackObj)
            }
        };

        var act1 = cc.fadeIn(0.3)
        var act3 = cc.fadeOut(0.5)
        var repeatAction = cc.repeat(cc.sequence(act1, act3), 3);
        animNode.node.runAction(cc.sequence(repeatAction, cc.callFunc(onComplete)))

        var act2 = cc.moveTo(0.5, cc.v2(missileX, missileY))
        newNode.runAction(act2)
    },
    ///显示被攻击 掉血
    showBeHurtEffView: function (callback, callbackObj){
        if (this.isPlayingBeHurtEff) {
            return
        }

        this.isPlayingBeHurtEff = true

        let effInfo = this.gameEffG[4];
        let newNode = cc.instantiate(effInfo.prefab);
        this.node.addChild(newNode);
        newNode.setPosition(cc.v2(0, 0));
        let self = this;

        let animR = newNode.getComponent(cc.Animation)
        let goComplete = function () {
            self.node.removeChild(newNode);
            self.isPlayingBeHurtEff = false

            if (callback) {
                callback.apply(callbackObj)
            }
        };
        animR.play('alphe_once');
        animR.on('finished', goComplete, this); 
    },

    //全屏炸弹
    showBigBoom: function(callback, callbackObj){
        let effInfo = this.gameEffG[5];
        let newNode = cc.instantiate(effInfo.prefab);
        this.node.addChild(newNode);

        newNode.setPosition(cc.v2(0,0));

        for (var i = 1; i <= 4; i++) {
            let node = newNode.getChildByName("anim"+i);
            if(node){
                let anim = node.getComponent(cc.ParticleSystem);
                anim.stopSystem();
            }
        }

        let _this = this;
        let end = function(){
            newNode.stopAllActions();
            _this.node.removeChild(newNode);
            if(callback){
                callback.apply(callbackObj);
            }
        }

        newNode.idx = 1;
        let next = function(){
            let name ="anim"+newNode.idx
            let node = newNode.getChildByName(name);
            if (node){
                let anim = node.getComponent(cc.ParticleSystem);
                anim.resetSystem();
            }
            newNode.idx = newNode.idx + 1
        }

        let act1 = cc.callFunc(next, this);
        let act2 = cc.delayTime(0.1);
        let act3 = cc.callFunc(next, this);
        let act4 = cc.delayTime(0.1);
        let act5 = cc.callFunc(next, this);
        let act6 = cc.delayTime(0.1);
        let act7 = cc.callFunc(next, this);
        let act8 = cc.delayTime(0.2);
        let act9 = cc.callFunc(end, this);
        newNode.runAction(cc.sequence(act1,act2,act3,act4,act5,act6,act7,act8,act9));
    },

    //获得道具文字提示
    getItemTips: function(parent, item, callback, callbackObj){
        let effInfo = this.gameEffG[6];
        let newNode = cc.instantiate(effInfo.prefab);
        parent.addChild(newNode);
        newNode.setPosition(cc.v2(0,25));
        newNode.active = false;
        newNode.zIndex = 99;

        let _this = this;
        let finish = function(){
            parent.removeChild(newNode);
            if (callback) {
                callback.apply(callbackObj)
            }
        }

        let url = "items/tips_" + item;
        cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
            newNode.active = true;
            newNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            let anim = newNode.getComponent(cc.Animation);
            anim.on("finished", finish, _this);
            anim.play("get_item_tips");
        });
    },

    //自己飞机死亡特效
    heroDieEff: function(callback, callbackObj, parent){
        let effInfo = this.gameEffG[7];
        let newNode = cc.instantiate(effInfo.prefab);
        this.node.addChild(newNode);
        newNode.setPosition(parent.position);
        newNode.idx = 1;

         for (var i = 1; i <= 4; i++) {
            let tmpNode = newNode.getChildByName("anim"+i);
            if(tmpNode){
                tmpNode.active = false;
            }
        }

        let _this = this;
        let finish = function(){
            _this.node.removeChild(newNode);
            if (callback) {
                callback.apply(callbackObj)
            }
        }

        let next = function(){
            let name = "anim"+newNode.idx;
            let node = newNode.getChildByName(name);
            if(node){
                node.active = true;
                let anim = node.getComponent(cc.Animation);
                anim.play("hero_die");
                if(newNode.idx == 3){
                    anim.on("finished",finish,_this)
                }
            }

            newNode.idx = newNode.idx + 1;
        }

        let hideHero = function(){
            parent.active = false;
        }

        let act1 = cc.callFunc(next, this);
        let act2 = cc.delayTime(0.25);
        let act3 = cc.callFunc(next, this);
        let act4 = cc.delayTime(0.25);
        let act5 = cc.callFunc(next, this);
        let act6 = cc.delayTime(0.15);
        let act7 = cc.callFunc(hideHero, this);
        newNode.runAction(cc.sequence(act1,act2,act3,act4,act5,act6,act7));
    },

    //吃到星星特效
    starEff: function(parent, callback, callbackObj){
        let effInfo = this.gameEffG[8];
        let newNode = cc.instantiate(effInfo.prefab);
        newNode.name = "starEffTag";
        parent.addChild(newNode);

        let _this = this;
        let finish = function(){
            parent.removeChild(newNode);
            if (callback) {
                callback.apply(callbackObj)
            }
        }

        let anim = newNode.getComponent(cc.Animation);
        anim.on("finished", finish, this);
        anim.play("starEff");
    },

    gameOver: function () {
        this.node.stopAllActions()
    },
    gamePause: function () {
        this.node.pauseAllActions();

       /*  let ufoAry = new Array(...this.node.children);
        for (let i = 0; i < ufoAry.length; i++) {
            let ufo = ufoAry[i].getComponent('ufo')
            if (ufo ) {
                ufo.gamePause()
            }
        } */
    },
    gameResume: function () {
        this.node.resumeAllActions();
        
       /*  let ufoAry = new Array(...this.node.children);
        for (let i = 0; i < ufoAry.length; i++) {
            let ufo = ufoAry[i].getComponent('ufo')
            if (ufo) {
                ufo.gameResume()
            }
        } */
    },
    // 销毁
    destroyUfo: function (node) {
        poolClass.returnNode(this, node);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
