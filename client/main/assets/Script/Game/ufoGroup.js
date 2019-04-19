var poolClass = require('pool');
var common = require('common');

const ufoG = cc.Class({
   name: 'ufoG',
   properties: {
       name: '',
       prefab: cc.Prefab,
       size:0,
   }
});

cc.Class({
    extends: cc.Component,

    properties: {
        ufoG: {
            default: [],
            type: ufoG
        },
        mainScript: {
            default: null,
            type: require('main'),
        },
        perDis:80,

        ufoTimesNum:0, ///道具多少倍产出

        //掉落礼包
        giftDropLevel: 1, //掉落关卡条件
        giftDropCount: 0, //本局掉落次数
        giftDropRate: 10, //当前掉落概率
    },

    // use this for initialization
    onLoad: function () {
        poolClass.initPoolBatch(this, this.ufoG);
    },
    // 填充弹药
    startAction: function () {
    //    this.makeLvlUfoByXY(6, 0, 300, 2, 3) 
    //    this.makeLvlUfoByXY(7, 0, 300, 3, 3) 
    //    this.makeLvlUfoByXY(11, 0, 300, 4, 3) 
    //    this.makeLvlUfoByXY(15, 0, 300, 5, 3) 
    //    this.makeLvlUfoByXY(18, 0, 300, 3, 3) 
    //    this.makeLvlUfoByXY(8, 0, 300, 1, 3) 
    //    this.makeLvlUfoByXY(9, 0, 300, 1, 3) 
    //    this.makeLvlUfoByXY(10, 0, 300, 1, 3) 
    //    this.makeLvlUfoByXY(12, 0, 300, 1, 3) 
    //    this.makeLvlUfoByXY(2, 0, 300, 1, 3) 
    //    this.makeLvlUfoByXY(16, 0, 300, 1, 3) 
    //    this.makeLvlUfoByXY(14, 0, 300, 1, 3) 

        Notification.on('make_star_globle_event', this.makeNewUfoByEnemy, this);
        Notification.on('level_reward_event', this.passLevelHandler, this);
        Notification.on('updateUfoTimes_event', this.updteUfoTimesHandler, this);
    },
   
    //随机生成的位置
    getPositionOfNewUfo: function(newEnemy) {
        //位于上方，先不可见
        // let randx = cc.randomMinus1To1() * (this.node.parent.width / 2 - newEnemy.width / 2);
        let randx = Math.random() * (this.node.parent.width / 2 - newEnemy.width / 2);
        let randy = this.node.parent.height / 2 + newEnemy.height / 2;
        return cc.v2(randx,randy);
    },

    makeNewUfoByEnemy: function (event) {
        //////
        //监测是不是礼包
        if (event.dropID >= 10000) {
            this.makeNewUfoByEnemyHandler2(event)
            return
        }
        //////
        this.makeNewUfoByEnemyHandler1(event)

        ////
        if (D.gamePause) {
           this.node.pauseAllActions()
        }
    },

    makeNewUfoByEnemyHandler1: function (event){
        let self = this
        let dealyCallFunC = function () {
            let ufo = self.makeNewUfo(event)
            if (ufo) {
                ufo.throwHandler()
            }
        }.bind(this)

        if (event.dropID == 18 && this.ufoTimesNum > 1) {
            if(this.node){
                var rep = cc.repeat(cc.sequence(cc.delayTime(0.15), cc.callFunc(dealyCallFunC)), this.ufoTimesNum);            
                this.node.runAction(rep)
            }
        } else {
            if(this.node){
                var rep = cc.sequence(cc.delayTime(0.15), cc.callFunc(dealyCallFunC));
                this.node.runAction(rep)
            }
        }
    },

    makeNewUfoByEnemyHandler2: function (event) {
       /* 
        speed: this.runspeed,
            x: this.node.x,
                y: this.node.y,
                    dropID: this.dropID, */
        let dropAry = []
        let func1 = function (itemID, Num) {
            if (itemID > 0 && Num > 0) {
                for (var i = 0; i < Num; i++) {
                    let obj = {}
                    obj.dropID = dropMoreCfg.type_1
                    obj.speed = event.speed
                    obj.x = event.x
                    obj.y = event.y
                    dropAry.push(obj)
                }
            }
        }

        //监测是不是礼包
        let dropMoreCfg = common.getJsonCfgByID("DropMore", event.dropID)
        func1(dropMoreCfg.type_1, dropMoreCfg.Num_1)
        func1(dropMoreCfg.type_2, dropMoreCfg.Num_2)
        func1(dropMoreCfg.type_3, dropMoreCfg.Num_3)
        func1(dropMoreCfg.type_4, dropMoreCfg.Num_4)
        func1(dropMoreCfg.type_5, dropMoreCfg.Num_5)
        func1(dropMoreCfg.type_6, dropMoreCfg.Num_6)

        let len = dropAry.length
        if (len <= 0) {
            return
        }
        ///
        dropAry.sort()
        ///
      /*   let self = this
        let aAry = [0,-1,1]
        let action;
        let hanFun = function () {
            for (var idx = 0; idx < 3; idx++){
                if (dropAry.length > 0) {
                    let obj = dropAry.shift()

                    // obj.x = obj.x + 50 * aAry[idx]
                    obj.x = obj.x - 50 + Math.random()*100

                    let ufo = self.makeNewUfo(obj)
                    ufo.throwHandler()
                }
            }
        }

        var rep = cc.repeat(cc.sequence(cc.delayTime(0.15), cc.callFunc(hanFun)), len);
        action = this.node.runAction(rep) */


        /////////////////

        for (var idx = 0; idx < dropAry.length; idx++) {
            let obj = dropAry[idx]
            // obj.x = obj.x + 50 * aAry[idx]
            obj.x = obj.x - 50 + Math.random() * 100

            let ufo = this.makeNewUfo(obj)
            if (ufo) {
                ufo.throwHandler()
            }
            
        }
    },

    // 生成ufo
    makeNewUfo:function(event){

        let ufoInfo = this.ufoG[event.dropID];
        if (!ufoInfo) {
            return
        }
        
        let poolName = ufoInfo.name + 'Pool';
        let newNode = poolClass.borrowNewNode(this[poolName], ufoInfo.prefab, this.node);
        newNode.setPosition(cc.v2(event.x, event.y));
        let ufo = newNode.getComponent('ufo');
        ufo.initData();
        ufo.ufoGroup = this;
        ufo.speed = event.speed;
        
        ufo.hero = this.mainScript.hero
        return ufo
        
    },

    levelRewardFinish:function(){
        Notification.emit('level_Reward_Finish_event');
    },

    passLevelHandler:function(event) {
        let lvl = event.lvl;
        let lvlNum = 1;
        let levels_All = common.getJsonCfgs("levels_All");
        if (levels_All && levels_All.length >= lvl){
            let lvCfg = levels_All[lvl-1];
            if(lvCfg){
                let lvls = lvCfg.rewardLevel.split(",");
                let idx = Math.random()*lvls.length;
                lvlNum = lvls[Math.floor(idx)];
                lvlNum = lvlNum > 0 ? lvlNum : 1;
                console.log('======= passLevelHandler lvlNum='+lvlNum + " ,idx="+idx);
            }
        }

        let rewardAry = common.getJsonCfgs("level_pass_reward_"+lvlNum);
        if (!rewardAry || rewardAry.length <= 0){
            return;
        }

        let startX = -cc.winSize.width * 0.5 + 50;
        let startY = cc.winSize.height ;
        
        let len = rewardAry.length;

        let tNum = (this.perDis * len + cc.winSize.height/2) / 1000
        /////
        var delay = cc.delayTime(1 + tNum);
        var finish = cc.callFunc(this.levelRewardFinish, this);
        this.node.runAction(cc.sequence(delay, finish))


        //////
        for (var index = len-1; index >= 0; index--) {
            var element = rewardAry[index];
            if (element.reward1 > 0){
                this.makeLvlUfoByXY(element.reward1, startX, startY, 1, len-index)
            }
            if (element.reward2 > 0) {
                this.makeLvlUfoByXY(element.reward2, startX, startY, 2, len -index)
            }
            if (element.reward3 > 0) {
                this.makeLvlUfoByXY(element.reward3, startX, startY, 3, len -index)
            }
            if (element.reward4 > 0) {
                this.makeLvlUfoByXY(element.reward4, startX, startY, 4, len -index)
            }
            if (element.reward5 > 0) {
                this.makeLvlUfoByXY(element.reward5, startX, startY, 5, len -index)
            }
            if (element.reward6 > 0) {
                this.makeLvlUfoByXY(element.reward6, startX, startY, 6, len -index)
            }
        }
    },

    updteUfoTimesHandler:function( event ){
        this.node.stopAllActions()
        this.ufoTimesNum = event.timesNum;
        let time = event.time
        if(time > 0){
            this.node.runAction(cc.sequence(cc.delayTime(time), cc.callFunc(this.resetUpdteUfoTimesHandler, this)))
        }
    },

    resetUpdteUfoTimesHandler:function(){
        this.ufoTimesNum = 0;
        Notification.emit("change_bullet_buff", { item: "item_2" });
    },

    //一关结束，到下一关的奖励
    makeLvlUfoByXY: function (dropID,startX,startY,ix,iy){
        
        var data = {};
        data.dropID = dropID;
        data.x = startX + this.perDis * ix
        data.y = startY + this.perDis * iy
        data.speed = 1000
        
        let ufo  = this.makeNewUfo(data)
        if (ufo) {
            ufo.moveHandler()
        }
    },

    gameOver: function () {
        this.node.stopAllActions()
        Notification.off('make_star_globle_event', this.makeNewUfoByEnemy);
        Notification.off('level_reward_event', this.passLevelHandler);
        Notification.off('updateUfoTimes_event', this.updteUfoTimesHandler);
        this.resetGfitDrop();
    },
    gamePause: function () {
        this.node.pauseAllActions();

        let ufoAry = new Array(...this.node.children);
        for (let i = 0; i < ufoAry.length; i++) {
            let ufo = ufoAry[i].getComponent('ufo')
            if (ufo ) {
                ufo.gamePause()
            }
        }
    },
    gameResume: function () {
        this.node.resumeAllActions();
        
        let ufoAry = new Array(...this.node.children);
        for (let i = 0; i < ufoAry.length; i++) {
            let ufo = ufoAry[i].getComponent('ufo')
            if (ufo) {
                ufo.gameResume()
            }
        }
    },
    // 销毁
    destroyUfo: function (node) {
        poolClass.returnNode(this, node);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    giftDrop: function(x,y){
        //1.每关最多触发1次礼包掉落，触发后间隔2~4关，再次触发，
        //每轮游戏最多触发2次
        //玩家满血不会触发礼包掉落
        //概率从10%递增，每次递增5%，一直到50%（最大）

        if(this.mainScript.enemyGroup.mainLevel < this.giftDropLevel){
            return false;
        }

        if(this.giftDropCount >= 2){
            return false;
        }

        if(this.mainScript.hero.hp/this.mainScript.hero.maxHP > 0.8){
            return false;
        }

        let num = Math.random()*100;
        if( num > this.giftDropRate){
            if(this.giftDropRate < 50){
                this.giftDropRate += 10;
            }
            return false;
        }

        this.giftDropCount += 1;
        this.giftDropRate = 10;
        this.giftDropLevel += Math.floor(2 + Math.random()*3);
        this.makeNewUfoByEnemy({speed:45, x:x, y:y, dropID:16});

        return true;
    },

    resetGfitDrop: function(){
        this.giftDropLevel = 1;
        this.giftDropCount = 0;
        this.giftDropRate = 10;
    },

    dropRedPacket: function(x,y){
        this.makeNewUfoByEnemy({speed:20, x:x, y:y, dropID:19});
    }

});
