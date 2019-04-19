var poolClass = require('pool');
var common = require('common');
var platformUtils = require('PlatformUtils');


const enemyG = cc.Class({
    name: 'enemyG',
    properties: {
        name: '',
        prefab: cc.Prefab,
        freq: 0,
        size: 0
    }
});

cc.Class({
    extends: cc.Component,
    properties: {
        enemyGroup: {
            default: [],
            type: enemyG,
        },
        mainScript: {
            default: null,
            type: require('main'),
        },
        mainLevel:1,
        mainLineGamePlaying:false,
        currlevel: 1,  ////当前玩家在打哪一关？ 跟mainLevel的区别在于 mainLevel不会有特殊关，而currlevel会有
        nextOrderNum:0,
        enemyCount :0,

        randomAry:[],
        randomIdx:0,
        bossCount:0,//当前场景有多少个BOSS

        makeMissileNumAry:[],
        needShowMissileWarning : true,

        maxTotleLvl:0,//总配置有多少关
        currCoundNum:0,//第几关了

        perDis: 80,
    },

    // use this for initialization
    onLoad: function () {
        poolClass.initPoolBatch(this, this.enemyGroup);
        this.randomAry = [1, 2, 3,4]
        let levelCfg = common.getJsonCfgs("levels_All")
        this.maxTotleLvl = levelCfg.length
    },

    // 敌机出动
    startAction: function () {
        Notification.on('boss_die_event', this.bossDieHandler, this);
        Notification.on('level_Reward_Ani_Finish_event', this.rewardFinishHandler, this);

        this.bossCount = 0;

        // this.schedule(this.updateMakeEnemyTime,1)
        
        this.mainLevel = 1;
        this.mainLineGamePlaying = true
        this.currlevel = this.mainLevel;
        this.currCoundNum = this.mainLevel;

        // this.updateNext(31)
        this.updateNext(1)
        // this.updateNext(28)
    },
    
    updateNext: function (idx) {
        if (idx <= 0 ){
            return
        }

        this.mainScript.updateLevelInfo(this.currlevel+"-"+idx,idx);

        var levelsCfgAry = common.getJsonCfgs("level_" + this.currlevel);
        var itemCfg ;
        for(var i = 0; i < levelsCfgAry.length; i++) {
            itemCfg = levelsCfgAry[i];
            if (itemCfg.orderNum == idx) {
                this.updateMakeEnemyTime(itemCfg);
                this.checkGuide(itemCfg);
                break;
            }
        }
    },

    checkGuide: function(itemCfg){
        //配置 todo
        //炸弹指引，1-31
        if(itemCfg.id == 2 && itemCfg.orderNum == 22){
            this.mainScript.guideItem(1);
        }
    },

    randomsort:function(a, b) {
        return Math.random() > .5 ? -1 : 1;
        //用Math.random()函数生成0~1之间的随机数与0.5比较，返回-1或1
    },

    updateMakeEnemyTime:function(itemCfg){
        
        var enemyID = itemCfg.enemyID;
        // var enemyID = 13;
        var route = itemCfg.route;
        var num = itemCfg.num;
        var delayTime = itemCfg.delayTime;
        var speed = itemCfg.speed;
        var ballistic = itemCfg.ballistic;

        /////
        var boomNum = itemCfg.boomNum;
        if (!boomNum) {
            boomNum = "0";
        }

        let boomNumAry = boomNum.split(",")
        var makeMissileNum = 0
        if (boomNumAry.length == 1) {
            makeMissileNum = Number(boomNumAry[0])
        }else{
            let t1 = Number(boomNumAry[0])
            let t2 = Number(boomNumAry[1])
            makeMissileNum = t1 + Math.ceil(Math.random() * Math.abs(t2 - t1))
        }
        if (makeMissileNum > 0 ) {
            this.makeMissileNumAry.push(makeMissileNum)

            this.checkShowWarningPreView()            
        }

        ///////
        this.randomAry.sort(this.randomsort);

        var drop = itemCfg.drop
        drop = drop + "";
        let dropAry = drop.split(",")
        //
        route = route+''
        var routeAry = route.split(",")
        //
        var nowIdx = 1

        let enemyCfg = common.getJsonCfgByID("enemy", enemyID);

       

        function dealyCallBack() {
            
            let dropID = 0;
            if (dropAry.length == 1) {
                dropID = Number(dropAry[0])
            }
            else {
                for (var index = 0; index < dropAry.length; index++) {
                    var element = dropAry[index];
                    var itemAry = element.split("#")
                    if (itemAry[0] == nowIdx) {
                        dropID = itemAry[1]
                        break;
                    }
                }
            }

            ///////
            let routeType = 0
            if (routeAry.length == 1) {
                routeType = Number(routeAry[0])
            }
            else {
                for (var index = 0; index < routeAry.length; index++) {
                    var element = routeAry[index];
                    var itemAry = element.split("#")
                    if (itemAry[0] == nowIdx) {
                        routeType = itemAry[1]
                        break;
                    }
                }
            }

            if (enemyCfg.type == 3 && this.bossCount <= 0 ) {
                let params = {}
                params.enemyInfo = this.enemyGroup[enemyID - 1]
                params.enemyCfg = enemyCfg
                params.routeType = routeType
                params.dropID = dropID
                params.ballistic = ballistic

                this.node.runAction(cc.sequence(cc.delayTime(3),
                    cc.callFunc(this.delayMakeNewEnemy, this,params)))

                this.mainScript.showWarningView()
            }
            else{

                if (routeAry.length == 1 && routeType > 1000){
                    this.lineupUpdateMake(routeType,ballistic)
                }
                else{
                    this.makeNewEnemy(this.enemyGroup[enemyID - 1], enemyCfg, routeType, dropID, ballistic);
                }
            }

            nowIdx ++;
        }

        if (routeAry.length == 1 && Number(routeAry[0]) > 1000) {
            num = 1
        }
        for (var i = 0; i < num;i++){
            var delay = cc.delayTime(i * delayTime);
            var finish = cc.callFunc(dealyCallBack, this);
            this.node.runAction(cc.sequence(delay, finish))
        }

        /////
        function nextCall(params) {
            if (itemCfg.nextOrderNum > 0){
                this.updateNext(itemCfg.nextOrderNum )
            }
        }

        
        if (speed < 0) {
            this.nextOrderNum = itemCfg.nextOrderNum
            return;
        }
        this.nextOrderNum = -1;

        var delay2 = cc.delayTime(speed);
        // var delay2 = cc.delayTime(0.5);
        var finish2 = cc.callFunc(nextCall, this);
        this.node.runAction(cc.sequence(delay2, finish2))
    },

    ////
    lineupUpdateMake: function (lineupID, ballistic) {
        
        let lineUpEnemyAry = common.getJsonCfgs("lineup_" + lineupID);
        if (!lineUpEnemyAry || lineUpEnemyAry.length <= 0) {
            return;
        }
        let len = lineUpEnemyAry.length;
        let runspeed = 1000

        let getLineupRunSpeed = function (enemyStr) {
            var itemAry = enemyStr.split("#")
            let enemyID = 0
            if (itemAry.length == 1) {
                enemyID = Number(itemAry[0])
            }
            else {
                enemyID = Number(itemAry[0])
            }

            if (enemyID > 0) {
                let enemyCfg = common.getJsonCfgByID("enemy", enemyID);
                if (runspeed > enemyCfg.runspeed) {
                    runspeed = enemyCfg.runspeed
                }
            }
        }

        ////找出最慢的一家飞机 速度
        for (var index = len - 1; index >= 0; index--) {
            var element = lineUpEnemyAry[index];
            getLineupRunSpeed(element.enemy1)
            getLineupRunSpeed(element.enemy2)
            getLineupRunSpeed(element.enemy3)
            getLineupRunSpeed(element.enemy4)
            getLineupRunSpeed(element.enemy5)
            getLineupRunSpeed(element.enemy6)
            getLineupRunSpeed(element.enemy7)
        }

        //////
        for (var index = len - 1; index >= 0; index--) {
            var element = lineUpEnemyAry[index];

            this.handlerLineupItem(1, element.enemy1, ballistic, len - index, runspeed)
            this.handlerLineupItem(2, element.enemy2, ballistic, len - index, runspeed)
            this.handlerLineupItem(3, element.enemy3, ballistic, len - index, runspeed)
            this.handlerLineupItem(4, element.enemy4, ballistic, len - index, runspeed)
            this.handlerLineupItem(5, element.enemy5, ballistic, len - index, runspeed)
            this.handlerLineupItem(6, element.enemy6, ballistic, len - index, runspeed)
            this.handlerLineupItem(7, element.enemy7, ballistic, len - index, runspeed)
        }
    },

   
    handlerLineupItem: function (idx, enemyStr, ballistic, colNum, runspeed) {
        /////
        let enemyID = 0
        let dropID = 0
        var itemAry = enemyStr.split("#")
        if (itemAry.length == 1) {
            enemyID = Number(itemAry[0])
        }
        else {
            enemyID = Number(itemAry[0])
            dropID = Number(itemAry[1])
        }

        if (enemyID > 0 ) {
            this.makeLineupByXY(idx, enemyID, dropID, ballistic, colNum, runspeed)
        }
    },

    //一关结束，到下一关的奖励
    makeLineupByXY: function (idx, enemyID, dropID, ballistic, colNum, runspeed) {
        let startX = -cc.winSize.width * 0.5 + 50;
        let startY = cc.winSize.height;

        let enemyCfg = common.getJsonCfgByID("enemy", enemyID);
        let enemyInfo = this.enemyGroup[enemyID - 1]
        let enemy = this.makeNewEnemy(enemyInfo, enemyCfg, 1000, dropID, ballistic, runspeed)
        enemy.node.x = startX + this.perDis * idx
        enemy.node.y = startY + this.perDis * colNum
    },

    ////
    checkShowWarningPreView:function(){
        if (this.makeMissileNumAry.length > 0 ) {
            let num = this.makeMissileNumAry.shift();
            this.showWarningPreView(num)
        }
    },

    showWarningPreView: function (num){
        let gameHeroPx = D.gameHeroPx
        let tmpDis = 130
        let detaX = 0
        if (num % 2 == 0) {
            detaX = -1 * tmpDis * 0.5 + 10
        }
       
        for (var i = 0; i < num; i++) {
            let y = Math.ceil(i / 2)
            let z = Math.floor(i % 2) == 1?1:-1
            let bX = gameHeroPx + tmpDis * y * z

            this.mainScript.showMissileView(i, bX + detaX, cc.winSize.height * 0.5 - 50, this.needShowMissileWarning)
            this.needShowMissileWarning = false;
        }
    },

    ///boss死亡    
    bossDieHandler:function(){
        this.bossCount --;

        if (this.bossCount <= 0) {
            
            D.gameBossAttacking = false

            if (this.nextOrderNum <= 0) {
                this.mainScript.hideKillBossTime();
                this.mainScript.removeAllBullet();
                this.notifyKillAllBoss()
                Notification.emit('level_over_event', {
                    lvl: this.currlevel,
                });
            }
            else{
                this.updateNext(this.nextOrderNum);
            }
        }
    },
    //玩家的飞机要飞到 最上方， 切换屏幕， 
     notifyKillAllBoss:function () {
        this.mainScript.levelPass()
    },

    notifyLevelOver:function () {
        Notification.emit('level_over_event', {
            lvl: this.currlevel,
        });
    },
    
    //下一关
    rewardFinishHandler:function(){
        ////
        let nextLevel = -1
       
        ///
        if (this.mainLineGamePlaying) {
            this.mainLineGamePlaying = false
            
            ///判断是否主线关 还是随机关卡
            let levelCfg = common.getJsonCfgByID("levels_All", this.mainLevel)
            if (levelCfg) {
                let rateOrderNum = Number(levelCfg.RateOrderNum)
                let rateNextNum = Number(levelCfg.RateNextNum)

                if (rateOrderNum > 0 && Math.random() * 100 < rateOrderNum) {
                    nextLevel = Number(levelCfg.orderNum)
                }
                else if (rateNextNum > 0 && Math.random() * 100 < rateNextNum) {
                    nextLevel = Number(levelCfg.nextNum)
                }
                else {

                    //每一关开始 都重置 显示导弹来了的效果
                    this.needShowMissileWarning = true;

                    this.mainLevel++
                    nextLevel = this.mainLevel
                    this.mainLineGamePlaying = true
                }
            }
        }
        else{
            //每一关开始 都重置 显示导弹来了的效果
            this.needShowMissileWarning = true;

            this.mainLevel++
            /////////////////
            nextLevel = this.mainLevel
            this.mainLineGamePlaying = true
        }
        
       
       //////////////////////


        if (nextLevel < 0 ){
            return
        }

        if (nextLevel < 10000 ) {
            this.mainLevel = nextLevel
        }
        if (this.mainLevel > this.maxTotleLvl) {
            this.mainLevel = 1;
        }

        this.currCoundNum++;
        ///////
        this.currlevel = nextLevel
        this.updateNext(1)

        Notification.emit('level_begin_event');

        let preMax = platformUtils.getItemByLocalStorage("PassedMaxLevel", 0);
        if(this.mainLevel - 1 > preMax){
            platformUtils.setItemByLocalStorage("PassedMaxLevel", this.mainLevel - 1);
            console.log("------ next level, this.mainLevel - 1,preMax",this.mainLevel - 1,preMax);
        }
    },
    //游戏结束
    gameOver:function(){
        this.node.stopAllActions();
        let enemy = new Array(...this.node.children);
        for (let i = 0; i < enemy.length; i++) {
            enemy[i].getComponent('enemy').gamePause()
        }

        Notification.off('boss_die_event', this.bossDieHandler);
        Notification.off('level_Reward_Ani_Finish_event', this.rewardFinishHandler);
    },
    gamePause:function(){
        this.node.pauseAllActions();
        let enemy = new Array(...this.node.children);
        for (let i = 0; i < enemy.length; i++) {
            enemy[i].getComponent('enemy').gamePause()
        }
    },
    gameResume:function(){
        this.node.resumeAllActions();
        let enemy = new Array(...this.node.children);
        for (let i = 0; i < enemy.length; i++) {
            enemy[i].getComponent('enemy').gameResume()
        }
    },

    delayMakeNewEnemy: function (target, params){
        let enemyInfo = params.enemyInfo
        let enemyCfg = params.enemyCfg
        let routeType = params.routeType
        let dropID = params.dropID
        let ballistic = params.ballistic

        target.getComponent("enemyGroup").makeNewEnemy(enemyInfo, enemyCfg, routeType, dropID, ballistic)
    },
    // 生成敌机
    makeNewEnemy: function (enemyInfo, enemyCfg, routeType, dropID, ballistic, runspeed) {
        if (!enemyInfo){
            return
        }

        let poolName = enemyInfo.name + 'Pool';
        let newNode = poolClass.borrowNewNode(this[poolName], enemyInfo.prefab, this.node);
        let pos = this.getPositionOfNewEnemy(newNode, routeType);
        newNode.setPosition(pos);
        let enemy = newNode.getComponent('enemy');
        enemy.enemyGroup = this; 

        enemy.dropID = dropID;
        enemy.ballistic = ballistic;
                
        //火力
        let hl = enemyCfg.initPower + (this.currCoundNum - 1) * enemyCfg.powerRadix ;
        //攻速
        let attackSpeed =  enemyCfg.initAttackSpeed;
        //生命值
        // let hp = enemyCfg.initBlood + 100 * hl;
        let hp = enemyCfg.initBlood + enemyCfg.initBlood*(this.currlevel - 1) * this.currlevel / 2;
        //护甲
        let armor = enemyCfg.initArmor;
        //飞机类型
        enemy.enemyType = enemyCfg.type;
        //击落分值
        enemy.score = enemyCfg.rewardPoint;
        //限定时间
        enemy.limitStr = enemyCfg.limitAry;

        //
        enemy.enemyCfgID = enemyCfg.id;

        if (!runspeed) {
            runspeed = enemyCfg.runspeed
        }
        enemy.runspeed = runspeed

        if (enemy.enemyType == 3) {
            this.mainScript.showKillBossTime();
            this.bossCount ++;

            if (this.bossCount > 0) {
                D.gameBossAttacking = true
            }
        }

        enemy.currlevel = this.currlevel
        // 初始化敌机状态
        enemy.enemyInit(hl, attackSpeed, hp, armor, routeType, pos.x, pos.y);

        return enemy
    },
    //敌机随机生成的位置
    getPositionOfNewEnemy: function (newEnemy, routeType) {
        /* 飞行路线（0左上往下，1右上往下，2顶中往下，3左弧形，4右弧形，5斜出左，6斜出右） */
        let randx = 0
        let randy = cc.winSize.height/2 + newEnemy.height / 2;

        if (routeType == 0){
            let idx = this.randomAry[this.randomIdx];
            randx = -this.node.parent.width / 2 + idx * (this.node.parent.width - 100 - newEnemy.width) / 8
            // randx = -this.node.parent.width / 2 + Math.random() * (this.node.parent.width - newEnemy.width)/2;

            this.randomIdx++;
            if (this.randomIdx > this.randomAry.length) {
                this.randomIdx = 0
            }
        }
        else if (routeType==1){
            // randx =  Math.random() * (this.node.parent.width - newEnemy.width) / 2;
            let idx = this.randomAry[this.randomIdx];
            randx = 100+ idx * ((this.node.parent.width-100 - newEnemy.width) / 8-20)
            
            this.randomIdx++;
            if (this.randomIdx > this.randomAry.length) {
                this.randomIdx = 0
            }

        }
        else if (routeType == 2) {
            let idx = this.randomAry[this.randomIdx];

            // randx = - newEnemy.width * 0.5 ;
            randx = -100 + idx * 50
            
            this.randomIdx++;
            if (this.randomIdx > this.randomAry.length) {
                this.randomIdx = 0
            }
        }
        else if (routeType == 3){
            randx = -cc.winSize.width * 0.5 - 100
            randy = 100
        }
        else if (routeType == 4){
            randx = cc.winSize.width * 0.5 + 100
            randy = 100

        }
        else if (routeType == 5){
            randx = this.node.parent.width / 2;
            randy = this.node.parent.height * 1 / 3;
        }
        else if (routeType == 6){
            randx = -this.node.parent.width / 2;
            randy = this.node.parent.height * 1 / 3;
        }

       
        return cc.v2(randx,randy);
    },
    // 销毁
    destroyEnemy: function (node, score = 0) {
        poolClass.returnNode(this, node);
        score && this.mainScript.changeScore(score);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
