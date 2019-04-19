// 子弹生成的位置
const EnemybulletPosition = cc.Class({
    name: 'EnemybulletPosition',
    properties: {
        positionX: {
            default: '',
        },
        positionY: {
            default: '',
        }
    }
});

cc.Class({
    extends: cc.Component,

    properties: {
        score: {
            default: 0,
            type: cc.Integer,
            tooltip: '敌机分数',
        },
        initSpriteFrame: {
            default: null,
            type: cc.SpriteFrame,
            tooltip: '初始化图像'
        },
        explosionSound: {
            default: null,
            type: cc.AudioClip
        }, 
        beAttackedSound: {
            default: null,
            type: cc.AudioClip
        },
        bossAttackedSound: {
            default: null,
            type: cc.AudioClip
        },
        hpBar:{
            default:null,
            type:cc.ProgressBar,
            tooltip:'血量条'
        },
        position: {
            default: [],
            type: EnemybulletPosition,
            tooltip: '子弹位置'
        },
        armorNum:0, //护甲
        attackNum:0,
        circleCenterX:0,
        circleCenterY:0,
        routeType:0,
        rationNumCount:90,
        dropID:0,
        enemyType: 1,//（1普通飞机，2大飞机，3BOSS机）
        ballistic:"0",
        _timer : 0,
        rewardPoint:0,
        limitStr:"",
        enemyCfgID:0,
        gas: cc.Node,
        bossBoom: cc.Animation,
        bossBoomIdx: 0,
        runspeed:180, //飞机飞行速度--配置表读取， 大boss有自己的轨迹 不用这个配置

        currlevel:1,///打的是哪一关
        bossOuting:false,//boss正在出来，不能受到伤害
    },

    // use this for initialization
    onLoad: function () {
        let manager = cc.director.getCollisionManager();

        manager.enabled = true;

        // cc.director.getScheduler().scheduleUpdate(this, 0, false, this.updateTTTT)

        // this.node.scale = 1.5;


        /* if (!this.hptxt) {
            var node2 = new cc.Node("node");
            this.node.addChild(node2)
            node2.position = cc.v2(0,-100)
            var label = node2.addComponent(cc.Label);
            label.string = ""
            var color = new cc.Color(255, 100, 0);
            node2.color = color;

            this.hptxt = label
        } */

       
    },

    //boss 攻击
    checkBossShoot:function()
    {
        if (this.enemyCfgID == 9) {
            // this.boss9AttackHandler()
            this.boss9AttackHandlerNew()
        } else if (this.enemyCfgID == 10) {
            // this.boss10AttackHandler()
            this.boss10AttackHandlerNew()
        } else if (this.enemyCfgID == 11) {
            // this.boss11AttackHandler()
            this.boss11AttackHandlerNew()
        } else if (this.enemyCfgID == 12) {
            this.boss12AttackHandler()
        }else{
            this.boss13AttackHandler()
        }


        // this.schedule(this.sendBullet, 1);

        // this.node.runAction()
/* 
        let delayAction = cc.delayTime(1)
        let callFunc = cc.callFunc(this.sendBullet, this)
        var repeat = cc.repeatForever(cc.sequence(delayAction, callFunc));
        this.node.runAction(repeat) */
    },

    //检查是否需要发射子弹
    checkNeedShoot:function(){
        // this.scheduleOnce(this.sendBullet, 1);

        if (this.node.y < cc.winSize.height * 0.5) {
            let delayAction = cc.delayTime(0.5)
            let callFunc = cc.callFunc(this.sendBullet, this)
            var repeat = cc.sequence(delayAction, callFunc);
            this.node.runAction(repeat)
        }
        else{
            let delayAction = cc.delayTime(0.5)
            let callFunc = cc.callFunc(this.checkNeedShoot, this)
            var repeat = cc.sequence(delayAction, callFunc);
            this.node.runAction(repeat)
        }
    },

    enemyInit: function (hl, attackSpeed, maxHP, armor, rType, circlX, circleY) {
        if (!this.node){
            return
        }

        this.bossOuting = false

        // this.node.active = true;

        this._timer = 0;

        this.rationNumCount = 90;
        this.HP = maxHP;
        this.enemyHp = this.HP ;
        this.routeType = rType
        this.attackNum = hl;
        this.armorNum = armor;

        this.circleCenterX = circlX;
        this.circleCenterY = circleY;

        if(this.gas){
            this.gas.active = true;
        }
        this.node.enemyType = this.enemyType;

        // 找到node的Sprite组件
        let nSprite = this.node.getComponent(cc.Sprite);
        // 初始化spriteFrame
        if (nSprite.spriteFrame != this.initSpriteFrame){
            nSprite.spriteFrame = this.initSpriteFrame;
        }

        this.hpBar.progress = 1
        this.hpBar.node.active = false;

        
        this.node.opacity = 0;
        var action = cc.fadeIn(0.3);
        this.node.runAction(action);
        
        ////
     /*    if (this.hptxt) {
            this.hptxt.string = this.enemyHp
        }
 */

        let polygonCollider = this.node.getComponent(cc.PolygonCollider);
        if(polygonCollider){
            polygonCollider.enabled = true;
        }
        
        if (this.enemyType == 3) {
            this.bossRoadFun(this.checkBossShoot,this);
            // this.checkBossShoot();
            this.bossBoom.node.active = false;
            this.bossBoomIdx = 0;
            return
        }else if(this.routeType <= 2){
            this.node.rotation = 180;
            let t = cc.winSize.height / this.runspeed;
            let act1 = cc.moveTo(t,cc.v2(this.node.x, -cc.winSize.height/2 - this.node.height));
            let act2 = cc.delayTime(t);
            let self = this
            let act3 = cc.callFunc(function(){
                self.forceRemove();
            },this);
            this.node.runAction(cc.sequence(act1,act2,act3));
        }
        // 
        // this.checkNeedShoot();
        let ballisticAry = this.ballistic.split(",")
        if (ballisticAry.length == 1) {
            let ballistic = Number(ballisticAry[0])
            if ( ballistic <= 0 ){
                return  //表示不需要发射子弹
            }
        }

        this.checkNeedShoot();

        // this.node.setScale(1.5);

        this.node.setScale(1);// = 1;
       
    },
    //碰撞检测
    onCollisionEnter: function(other, self){
        if (this.enemyHp <= 0 ){
            return;
        }

        if (this.bossOuting) {
            return
        }

        if (other.node.group == "hero") {
            let hero = other.node.getComponent('hero');
            let hpNum = Math.ceil(hero.attackNum * hero.attackNum / (hero.attackNum + this.armorNum * 5));
            this.updateHp(-hpNum)
            Notification.emit("enemy_onCollision_hero", {attackNum:this.attackNum});
            return
        }

        if (other.node.group != 'bullet' && other.node.group != 'jiguang') {
            return;
        }

        let bullet = other.node.getComponent('bullet');
        if (!bullet.isPlayerBullet()) {
            return;
        }

        //激光然后 一切
        if (bullet.isJiGuamg) {
            this.enemyHp = 0
            this.checkLife();
            return 
        }

        ////
        /* 物理伤害=(火力攻击)^2/(火力攻击+护甲*5) */
       let hpNum = Math.ceil(bullet.attackNum * bullet.attackNum / (bullet.attackNum + this.armorNum * 5));

       this.updateHp(-hpNum)


        if (!D.isVoideClose && this.isLife() && bullet.needPlaySound) {
           cc.audioEngine.play(this.beAttackedSound);
       }

       
       
    }, 

    tntBombHandler:function(){
        let hpNum = this.enemyHp
        if (this.enemyType == 3) {
            hpNum = this.enemyHp * 0.1
        }
        
        this.updateHp(-hpNum)
    },

    updateHp:function(hpNum){
        //todo: for test
        this.enemyHp += hpNum

        if (this.enemyHp < 0) {
            this.enemyHp = 0
        }else{
            if (this.enemyCfgID == 9) {
                // this.boss9AttackHandler()
                this.boss9AttackHandlerNew()
            } else if (this.enemyCfgID == 10) {
                this.boss10AttackHandlerNew()
            } else if (this.enemyCfgID == 11) {
                this.boss11AttackHandlerNew()
            }
        }

        this.hpBar.progress = this.enemyHp / this.HP
        this.hpBar.node.active = true

        if (this.hpBar.node.getNumberOfRunningActions() <= 0) {
            this.hpBar.node.runAction(cc.blink(1, 2))
        }
        this.checkLife();

       
    /*   
        if (this.hptxt) {
            this.hptxt.string = this.enemyHp
        } */
    },

    checkLife:function(){
        if (this.enemyHp <= 0) {
            this.hpBar.node.active = false;
            if(this.gas){
                this.gas.active = false;
            }
            this.explodingAnim();
            return;
        }
    },

    isLife:function(){
        return this.enemyHp > 0;
    },

    isInWinsize:function(){
        if ( this.node.y <= -cc.winSize.height / 2
            || this.node.y >= cc.winSize.height / 2
            || this.node.x >= cc.winSize.width / 2
            || this.node.x <= -cc.winSize.width / 2
        ) {
            return false;
        }

        return true
    },

    explodingAnim: function () {
        // 播放爆炸音效
        if( ! D.isVoideClose){
            cc.audioEngine.play(this.explosionSound);
        }

        let _this = this;
        let endAnim = function(anim_name){
            let anim = _this.getComponent(cc.Animation);
            anim.play(anim_name);
            anim.on('finished',  _this.onHandleDestroy, _this);
            // _this.node.scale = 1.5;
        }

        let animName = "";
        if(this.enemyType ==1){
            endAnim('enemy_die_exploding');
        }else if(this.enemyType ==2){
            endAnim('enemy_die_middle');
        }else if(this.enemyType ==3){

            let bossFinish = function(){
                let anim = this.node.parent.getChildByName("bossBoomAnim")
                if(anim){
                    anim.stopAllActions();
                    _this.node.removeChild(anim);
                }
                _this.onHandleDestroy();
            }

            let next = function(){
                _this.bossBoomIdx += 1;
                let nodes = _this.node.getChildByName('nodeBooms');
                let name = "boom" + _this.bossBoomIdx;
                let nodePos = nodes.getChildByName(name);
                if(nodePos){
                    _this.bossBoom.node.position = nodePos.position;
                }else
                {
                    _this.bossBoom.node.stopAllActions();
                    _this.bossBoom.node.active = false;

                    cc.loader.loadRes("prefabs/bossBoom",function(err,prefab){
                        let anim = cc.instantiate(prefab.data);
                        _this.node.parent.addChild(anim)
                        anim.position = _this.node.position;
                        anim.name = "bossBoomAnim";
                        anim.runAction(cc.sequence(cc.delayTime(0.15),cc.callFunc(bossFinish,_this)));
                        // _this.node.active = false;
                    });
                    // Notification.emit('shake_game_bg');
                }
            }

            let delayAction = cc.delayTime(0.2);
            let callFunc = cc.callFunc(next, _this);
            this.bossBoom.node.active = true;
            this.bossBoom.play();
            this.node.stopAllActions();
            this.gas.active = false;
            var repeat = cc.repeatForever(cc.sequence(delayAction, callFunc));
            this.bossBoom.node.runAction(repeat);
            Notification.emit('stop_bullet_event');

            //敌人子弹消失
            this.enemyGroup.mainScript.removeAllBullet();
        }

        let polygonCollider = this.node.getComponent(cc.PolygonCollider);
        if(polygonCollider){
            polygonCollider.enabled = false;
        } 

        //礼包掉落
        if(this.dropID <= 0 && this.enemyType != 3){
            let isGift = this.enemyGroup.mainScript.ufoGroup.giftDrop(this.node.x, this.node.y);
            if(!isGift){
                if(this.enemyCfgID == 3 || this.enemyCfgID == 8){
                    this.enemyGroup.mainScript.dropRedPacket(this.node.x, this.node.y);
                }
            }
        }
    },

 
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (D.gameStatuePause) {
            return
        }

        if (this.enemyType == 3) {
            // this.bossRoadFun(dt);
            return
        }

        if (this.routeType == 1000){
            this.lineRoadFun(dt);
        } else if (this.routeType <= 2){

        }
        else if (this.routeType <= 4) {
            this.circleRoadFun(dt, this.routeType == 4);
        }
        else if (this.routeType <= 6) {
            this.obliqueRoadFun(dt, this.routeType==6);
        }
    },
    
    bossRoadFun:function (callback,callbackObj) {
       /*  this.node.rotation = 180;

        let startX =  0;
        let startY =  this.node.parent.height / 4;

        let action1 =  cc.moveTo(2, cc.v2(startX,startY ))
        let action2 =  cc.moveTo(2, cc.v2(-300,startY ))
        let action3 =  cc.moveTo(3, cc.v2(300,startY ))
        
        this.node.runAction(new cc.RepeatForever(cc.sequence(action1, action2, action3), 5)  ) */


        this.node.rotation = 180;
        this.bossOuting = true
        this.node.x = 0
        this.node.y = cc.winSize.height
        let startX = 0;
        let startY = this.node.parent.height / 4;

        let bossOutAction = cc.moveTo(2, cc.v2(startX, startY))
        let self = this;

        let omComplete = function(){
            if (callback) {
                callback.apply(callbackObj)
            }

            self.bossOuting = false
        }
        ////控制移动
        let action2 = cc.moveTo(1, cc.v2(startX, startY + 100))
        this.node.runAction(cc.sequence(bossOutAction, cc.callFunc(omComplete)))
    },

    //飞机直线掉落
    lineRoadFun: function (dt){
        // this.node.y -= dt * this.runspeed;
        // this.node.rotation = 180;

        let targetX = this.node.x
        let targetY = this.node.y - dt * this.runspeed * this.enemyGroup.mainScript.gameSpeed;
        let angle = JsUnit.getVectorRadians(this.node.x, this.node.y, targetX, targetY)
        this.node.rotation = angle;
        this.node.x = targetX
        this.node.y = targetY
        this._timer += 1;
        //出屏幕后 回收节点
        if (this.node.y < -this.node.parent.height / 2) {
            this.forceRemove()
        }
    },

    //弧形飞机
    circleRoadFun: function (dt, isRight){
        let R = 500
        if (isRight) {
            this.rationNumCount += dt * (1);
        }
        else {
            this.rationNumCount -= dt * (1);
        }

        let targetX = Math.cos(this.rationNumCount) * R + this.circleCenterX;
        let targetY = Math.sin(this.rationNumCount) * R + this.circleCenterY;
        let angle = JsUnit.getVectorRadians(this.node.x, this.node.y, targetX, targetY)
        this.node.rotation = angle;
        this.node.x = targetX
        this.node.y = targetY 

        if (isRight)
        {
            if (this.node.x > this.circleCenterX + R/2)
            {
                this.forceRemove();
            }
        }
        else
        {
            if (this.node.x < this.circleCenterX - R/2) {
                this.forceRemove();
            }
        }

    },

    //飞机斜着飞行
    obliqueRoadFun: function (dt,isRight) {
        let targetX = 0
        let targetY = this.node.y - dt * this.runspeed * this.enemyGroup.mainScript.gameSpeed;

        if (isRight){
            targetX = this.node.x + dt * this.runspeed * 0.5 * this.enemyGroup.mainScript.gameSpeed;
        }
        else{
            targetX = this.node.x - dt * this.runspeed * 0.5 * this.enemyGroup.mainScript.gameSpeed;
        }

        let angle = JsUnit.getVectorRadians(this.node.x, this.node.y, targetX, targetY)
        this.node.rotation = angle;
        this.node.x = targetX
        this.node.y = targetY


        //出屏幕后 回收节点
        if (this.node.y < -this.node.parent.height / 2) {
            this.forceRemove()
        }
    },

    forceRemove: function (score) {
       this.node.stopAllActions();

        if (score) {
           this.enemyGroup.destroyEnemy(this.node, score);
        }
        else{
            this.enemyGroup.destroyEnemy(this.node);
        }
   },
    
    sendBullet:function(){
        if (!this.node){ 
            return; 
        }
        ////
        let ballisticAry = this.ballistic.split(",")
        if (ballisticAry.length == 1) {
            let ballisticType = Number(ballisticAry[0])
            if (ballisticType > 0) {
                this.sendBullet2(ballisticType)
            }
        }
        else {
            for (var index = 0; index < ballisticAry.length; index++) {
                var ballisticType = Number(ballisticAry[index]);
                if (ballisticType > 0 ) {
                    this.sendBullet2(ballisticType)
                }
            }
        }
    },

    sendBullet2: function (ballisticType){
        if (ballisticType == 1){ //发一个直行子弹
            if (this.routeType > 2) {
                let angle = JsUnit.getVectorRadians(this.node.x, this.node.y, D.gameHeroPx, D.gameHeroPy)
                this.sendEvent(angle,0,0,this.speed)
            }
            else{
                this.sendEvent(this.node.rotation, 0, 0, this.speed)
            }
        }
        else if (ballisticType == 2){ //散弹  打三个
            if (this.routeType > 2) {
                let angle = JsUnit.getVectorRadians(this.node.x, this.node.y, D.gameHeroPx, D.gameHeroPy)
                this.bossAttackType3ByAngle(angle, this.speed)
            }
            else {
                this.bossAttackType3ByAngle(this.node.rotation, this.speed)
            }
        }
    },

    boss9AttackHandler:function () {
        ////boss的移动轨迹
        let startX = 0;
        let startY = this.node.parent.height / 4;

        let action1 = cc.moveTo(2, cc.v2(startX, startY))
        let action2 = cc.moveTo(1, cc.v2(startX, startY + 100))
        this.node.runAction(new cc.RepeatForever(cc.sequence(action1,action2))) 


        ////////////////////
        let self = this;
        let isR = false
        let callback = function(){
            //发射3个点的小炮
            let pos = cc.v2(Number(self.position[1].positionX), Number(self.position[1].positionY))
            if (!isR) {
                pos = cc.v2(Number(self.position[2].positionX), Number(self.position[2].positionY))
            }

            self.sendEvent(self.node.rotation - 15, pos.x, pos.y, 450)
            self.sendEvent(self.node.rotation, pos.x, pos.y, 450)
            self.sendEvent(self.node.rotation + 15, pos.x, pos.y, 450)

            isR = !isR
        }
       
        
        ////////////////////////////////
        let startRa = 180
        let callback3 = function () {
            self.sendEvent(startRa, 0, 0, 300)
            startRa = startRa + 13
        }
        
        if (this.currlevel == 2) {
            //////
            var actionRepeat = cc.repeatForever(cc.sequence(cc.callFunc(callback3), cc.delayTime(0.03)));       
            this.node.runAction(actionRepeat)
        }
        else
        {
            var repForever = cc.repeatForever(cc.sequence(cc.delayTime(2), cc.callFunc(callback),
                                                            cc.delayTime(2), cc.callFunc(callback),
                                                        ))
            this.node.runAction(repForever)


            var actionRepeat = cc.repeatForever(cc.sequence(cc.callFunc(callback3), cc.delayTime(0.02)));
            this.node.runAction(actionRepeat)
        }
    },

    boss9AttackHandlerNew:function(){
       
        let self = this
        
        //双弹
        let step1Fun = function () {
            //左右移动
            let startX = self.node.x;
            let startY = self.node.y;

            let action1 = cc.moveTo(2, cc.v2(startX - 200, startY))
            let action2 = cc.moveTo(2, cc.v2(startX + 200, startY))
            self.node.runAction(new cc.RepeatForever(cc.sequence(action1, action2)))

            ///每隔X秒发射子弹
            let callback = function () {
                let pos = cc.v2(Number(self.position[1].positionX), Number(self.position[1].positionY))
                self.sendEvent(self.node.rotation, pos.x, pos.y, 450)

                let pos2 = cc.v2(Number(self.position[2].positionX), Number(self.position[2].positionY))
                self.sendEvent(self.node.rotation, pos2.x, pos2.y, 450)
            }
            var repForever = cc.repeatForever(cc.sequence(cc.delayTime(0.5), cc.callFunc(callback)))
            self.node.runAction(repForever)
        }

        // 散弹
        let step2Fun = function () {
            //左右移动
            let startX = self.node.x;
            let startY = self.node.y;

            let action1 = cc.moveTo(1, cc.v2(0, startY))

            ///每隔X秒发射子弹
            let callback = function () {
                let pos = cc.v2(Number(self.position[0].positionX), Number(self.position[0].positionY))
                let angle = JsUnit.getVectorRadians(self.node.x + pos.x, self.node.y + pos.y, D.gameHeroPx, D.gameHeroPy)

                self.sendEvent(angle-30, pos.x, pos.y, 450)
                self.sendEvent(angle-20, pos.x, pos.y, 450)
                self.sendEvent(angle-10, pos.x, pos.y, 450)
                self.sendEvent(angle, pos.x, pos.y, 450)
                self.sendEvent(angle+10, pos.x, pos.y, 450)
                self.sendEvent(angle+20, pos.x, pos.y, 450)
                self.sendEvent(angle+30, pos.x, pos.y, 450)
               
            }
            let callback2 = function () {
                self.node.runAction(repForever)
            }
            var repForever = cc.repeatForever(cc.sequence(cc.delayTime(1), cc.callFunc(callback)))
            self.node.runAction(cc.sequence(action1, cc.callFunc(callback2)))
        }
        ////

        let step3Fun = function () {
            //双弹+ 散弹
            let startX = self.node.x;
            let startY = self.node.y;

            let action1 = cc.moveTo(0.5, cc.v2(-200, startY))
            let action2 = cc.moveTo(0.5, cc.v2(200, startY))
            let action3 = cc.moveTo(1, cc.v2(0, startY))
            let callback = function () {
                let pos = cc.v2(Number(self.position[1].positionX), Number(self.position[1].positionY))
                let pos2 = cc.v2(Number(self.position[2].positionX), Number(self.position[2].positionY))
                self.bossAttackType2(pos, pos2)
            }
            let callback2 = function () {
                let pos = cc.v2(Number(self.position[0].positionX), Number(self.position[0].positionY))
                let angle = JsUnit.getVectorRadians(self.node.x + pos.x, self.node.y + pos.y, D.gameHeroPx, D.gameHeroPy)

                self.sendEvent(angle - 30, pos.x, pos.y, 450)
                self.sendEvent(angle - 20, pos.x, pos.y, 450)
                self.sendEvent(angle - 10, pos.x, pos.y, 450)
                self.sendEvent(angle, pos.x, pos.y, 450)
                self.sendEvent(angle + 10, pos.x, pos.y, 450)
                self.sendEvent(angle + 20, pos.x, pos.y, 450)
                self.sendEvent(angle + 30, pos.x, pos.y, 450)
            }

            var repForever = cc.repeatForever(cc.sequence(  action1, cc.callFunc(callback), cc.delayTime(1), 
                                                            action2, cc.callFunc(callback), cc.delayTime(1),
                action3, cc.callFunc(callback2), cc.delayTime(1)))

            self.node.runAction(repForever)
        }
        let step4Fun = function () {
            //双弹+ 散弹
            let startX = self.node.x;
            let startY = self.node.y;

            let action1 = cc.moveTo(0.5, cc.v2(-200, startY))
            let action2 = cc.moveTo(0.5, cc.v2(200, startY))
            let action3 = cc.moveTo(1, cc.v2(0, startY))
            let callback = function () {
                //左右发3个子弹
                let pos = cc.v2(Number(self.position[1].positionX), Number(self.position[1].positionY))
                let pos2 = cc.v2(Number(self.position[2].positionX), Number(self.position[2].positionY))
                self.bossAttackType2(pos, pos2)
            }
            let callback2 = function () {
                //对着玩家 发散弹7个
                let pos = cc.v2(Number(self.position[0].positionX), Number(self.position[0].positionY))
                let angle = JsUnit.getVectorRadians(self.node.x + pos.x, self.node.y + pos.y, D.gameHeroPx, D.gameHeroPy)

                self.sendEvent(angle - 30, pos.x, pos.y, 450)
                self.sendEvent(angle - 20, pos.x, pos.y, 450)
                self.sendEvent(angle - 10, pos.x, pos.y, 450)
                self.sendEvent(angle, pos.x, pos.y, 450)
                self.sendEvent(angle + 10, pos.x, pos.y, 450)
                self.sendEvent(angle + 20, pos.x, pos.y, 450)
                self.sendEvent(angle + 30, pos.x, pos.y, 450)
            }

            let callback3 = function () {
                //发射大圆弹道
                self.bossAttackType3()
            }
            let callback3_1 = function () {
                //发射大圆弹道
                self.bossAttackType3_1()
            }

            var repForever = cc.repeatForever(cc.sequence(
                action1, cc.callFunc(callback3_1), cc.delayTime(0.5), cc.callFunc(callback3), cc.delayTime(1),
                action2, cc.callFunc(callback3_1), cc.delayTime(0.5), cc.callFunc(callback3), cc.delayTime(1),
                action3, cc.callFunc(callback2), cc.delayTime(1),
                action1, cc.callFunc(callback), cc.delayTime(1),
                action2, cc.callFunc(callback), cc.delayTime(1),
                action3, cc.callFunc(callback2), cc.delayTime(1),
            ))

            self.node.runAction(repForever)
        }
        // step4Fun()

        if (!this.playingStepAttack) {
            this.playingStepAttack = -1
        }
        let step = 1
        let peret = this.enemyHp / this.HP * 100
        if (peret > 80) {
            step = 1
        } else if (peret > 60) {
            step = 2
        } else if (peret > 40) {
            step = 3
        } else if (peret > 0) {
            step = 4
        }

        if (this.playingStepAttack == step) {
            return
        }

        this.playingStepAttack = step
        this.node.stopAllActions()
        if (this.playingStepAttack == 2) {
            step2Fun()
        } else if (this.playingStepAttack == 3) {
            step3Fun()
        } else if (this.playingStepAttack == 4) {
            step4Fun()
        }
        else
        {
            step1Fun()
        }
        //////
    },

    //////////////////////
    boss10AttackHandlerNew: function () {
        let self = this
        //双弹
        let step1Fun = function () {
            //飞机从中间口发射，发射三个并排子弹紧接圆圈花型子弹
            ///发射三个并排子弹
            let sendBulletTmp = function (sendAngle,angle){

                let fromX = Math.cos(2 * Math.PI / 360 * angle) * 65;
                let fromY = Math.sin(2 * Math.PI / 360 * angle) * 65;
                // sendEvent: function (rNum, offX = 0, offY = 0, speed = 350, defaultSkin = null, bossBulletType = -1, stepMovePos = null) {

                let toX =  Math.cos(2 * Math.PI / 360 * angle) * 20;
                let toY =  Math.sin(2 * Math.PI / 360 * angle) * 20;

                toX += self.node.x 
                toY += self.node.y - 300

                let bullet = self.sendEvent(angle, fromX, fromY, 650,null, -1, cc.v2(toX, toY) );
               
            }

            let callback = function () {
                let pos = cc.v2(0,0)
                let angle = JsUnit.getVectorRadians(self.node.x + pos.x, self.node.y + pos.y, D.gameHeroPx, D.gameHeroPy)
                self.sendEvent(angle, pos.x, pos.y, 450)

                let targetY = Math.cos(2 * Math.PI / 360 * (angle + 90)) * 65;
                let targetX = Math.sin(2 * Math.PI / 360 * (angle + 90)) * 65;
                self.sendEvent(angle + 10, pos.x + targetX, pos.y + targetY, 450)

                let targetY2 = Math.cos(2 * Math.PI / 360 * (angle - 90)) * 65;
                let targetX2 = Math.sin(2 * Math.PI / 360 * (angle - 90)) * 65;
                self.sendEvent(angle - 10, pos.x + targetX2, pos.y + targetY2, 450)
            }
            //圆圈花型子弹
            let callback2 = function () {
                let pos = cc.v2(0, 0)
                let sendAngle = JsUnit.getVectorRadians(self.node.x + pos.x, self.node.y + pos.y, D.gameHeroPx, D.gameHeroPy)
                let num = 8
                for (var i = 0; i < num; i++) {
                    let angle = i * 360 / num
                    sendBulletTmp(sendAngle, angle)
                }
            }

            var repForever = cc.repeatForever(cc.sequence(cc.delayTime(0.5), cc.callFunc(callback), cc.delayTime(0.3), cc.callFunc(callback2), cc.delayTime(1)))
            self.node.runAction(repForever)
        }

        // 散弹
        let step2Fun = function () {
            //以中心点向十个方位发射3+1炮弹（如图标识）
            let startX = self.node.x;
            let startY = self.node.y;

            let action1 = cc.moveTo(1.5, cc.v2(-200, startY))
            let action2 = cc.moveTo(1.5, cc.v2(200, startY))

          
            ///每隔X秒发射子弹
            let callback = function () {
                let num = 8
                for (var i = 0; i < num; i++) {
                    self.sendEvent(  i * 360 / num, 0, 0, 350)
                }
            }
            let callback1 = function () {
                let num = 8
                for (var i = 0; i < num; i++) {
                    self.sendEvent(i * 360 / num, 0, 0, 350, "enemybullet/bullet_small_6")
                }
            }
            var repForever = cc.repeatForever(cc.sequence(action1,cc.delayTime(0.2), cc.callFunc(callback),
                            cc.delayTime(0.2), cc.callFunc(callback),
                            cc.delayTime(0.2), cc.callFunc(callback),
                cc.delayTime(0.5), cc.callFunc(callback1),
                            cc.delayTime(0.5),
                            action2, cc.callFunc(callback),
                            cc.delayTime(0.2), cc.callFunc(callback),
                            cc.delayTime(0.2), cc.callFunc(callback),
                cc.delayTime(0.5), cc.callFunc(callback1),
                             cc.delayTime(0.5),
                            ))
            self.node.runAction(repForever)
        }
        ////

        let step3Fun = function () {
            //以中心点向十个方位发射3+1炮弹（如图标识）
            let startX = self.node.x;
            let startY = self.node.y;

            let action1 = cc.moveTo(0.5, cc.v2(0, startY))
            self.node.runAction(action1)

            let dR = 0
            ///每隔X秒发射子弹
            let callback = function () {
                let num = 8
                for (var i = 0; i < num; i++) {
                    self.sendEvent(dR + i * 360 / num, 0, 0, 450, "enemybullet/bullet_small_4")
                }
                dR = dR + 5
            }
            let callback3 = function () {
                let num = 8
                for (var i = 0; i < num; i++) {
                    self.sendEvent(i * 360 / num, 0, 0, 350, "enemybullet/bullet_small_4")
                }
            }

            var repForever = cc.repeatForever(cc.sequence( cc.delayTime(0.3),cc.callFunc(callback),
                cc.delayTime(0.1), cc.callFunc(callback),
                cc.delayTime(0.1), cc.callFunc(callback),
                cc.delayTime(0.1), cc.callFunc(callback),
                cc.delayTime(0.1), cc.callFunc(callback),
                cc.delayTime(0.3),

                cc.callFunc(callback3),
                cc.delayTime(0.2), cc.callFunc(callback3),
                cc.delayTime(0.2), cc.callFunc(callback3),
                cc.delayTime(0.3), cc.callFunc(callback3),
            ))
            self.node.runAction(repForever)
        }

        if (!this.playingStepAttack) {
            this.playingStepAttack = -1
        }
        let step = 1
        let peret = this.enemyHp / this.HP * 100
        if (peret > 80) {
            step = 1
        } else if (peret > 40) {
            step = 2
        } else if (peret > 0) {
            step = 3
        } 

        if (this.playingStepAttack == step) {
            return
        }

        this.playingStepAttack = step
        this.node.stopAllActions()
        if (this.playingStepAttack == 2) {
            step2Fun()
        } else if (this.playingStepAttack == 3) {
            step3Fun()
        }
        else {
            step1Fun()
        }
        ////
    },

    boss11AttackHandlerNew: function () {

        let self = this

        //直线密集炮攻击
        let step1Fun = function () {

            let startX = 0;
            let startY = cc.winSize.height / 4;

            let action1 = cc.moveTo(2, cc.v2(startX + 150, startY))
            let action2 = cc.moveTo(2, cc.v2(startX - 150, startY))
            let sqAction = cc.sequence(action1, action2)
            self.node.runAction(new cc.RepeatForever(sqAction, sqAction.reverse())) 

            /////
            let attCallback = function () {

                let pos1 = cc.v2(Number(self.position[2].positionX), Number(self.position[2].positionY))
                self.bossAttackTypeByTime(2, pos1, 800, null, 1)

                let pos2 = cc.v2(Number(self.position[3].positionX), Number(self.position[3].positionY))
                self.bossAttackTypeByTime(2, pos2, 800, null, 1)
            }

            self.node.runAction(cc.repeatForever(cc.sequence(cc.delayTime(2), cc.callFunc(attCallback), cc.delayTime(7))))


            ////左右散射
            let isR = false
            let callback = function () {
                //发射3个点的小炮
                let pos = cc.v2(Number(self.position[0].positionX), Number(self.position[0].positionY))
                if (!isR) {
                    pos = cc.v2(Number(self.position[1].positionX), Number(self.position[1].positionY))
                }
                // sendEvent: function (rNum, offX = 0, offY = 0, speed = 350, defaultSkin = null, bossBulletType = -1, stepMovePos = null) {
                self.sendEvent(self.node.rotation - 15, pos.x, pos.y)
                self.sendEvent(self.node.rotation, pos.x, pos.y)
                self.sendEvent(self.node.rotation + 15, pos.x, pos.y)

                isR = !isR
            }
 
            var repForever = cc.repeatForever(cc.sequence(cc.delayTime(0.1), cc.callFunc(callback),
                cc.delayTime(2), cc.callFunc(callback),
                cc.delayTime(3)
            ))
            self.node.runAction(repForever)
        }

        // 散弹
        let step2Fun = function () {
           //上下移动
            let startX = 0;
            let startY = cc.winSize.height / 4;

            let action1 = cc.moveTo(2, cc.v2(startX , startY))
            let action2 = cc.moveTo(1, cc.v2(startX , 0))
            let sqAction = cc.sequence(action1, action2)
            self.node.runAction(new cc.RepeatForever(sqAction, sqAction.reverse())) 

            let callback = function () {
                //发射大圆弹道
                self.bossAttackType3(-1, "enemybullet/bullet_small_4")
            }
            self.node.runAction(cc.repeatForever(cc.sequence(cc.delayTime(1.5), cc.callFunc(callback))))

             ////左右散射
            let isR = false
            let callback2 = function () {
                //发射3个点的小炮
                let pos = cc.v2(Number(self.position[0].positionX), Number(self.position[0].positionY))
                if (!isR) {
                    pos = cc.v2(Number(self.position[1].positionX), Number(self.position[1].positionY))
                }

                self.sendEvent(self.node.rotation - 15, pos.x, pos.y)
                self.sendEvent(self.node.rotation, pos.x, pos.y)
                self.sendEvent(self.node.rotation + 15, pos.x, pos.y)

                isR = !isR
            }
            var repForever = cc.repeatForever(cc.sequence(cc.delayTime(0.1), cc.callFunc(callback2),
                cc.delayTime(1.5), cc.callFunc(callback2),
                cc.delayTime(3)
            ))
            self.node.runAction(repForever)
        }
        ////

        let step3Fun = function () {

            //左右移动
            let startX = 0;
            let startY = cc.winSize.height / 4;

            let action1 = cc.moveTo(0.8, cc.v2(startX + 150, startY))
            let action2 = cc.moveTo(0.8, cc.v2(startX - 150, startY))
            let action3 = cc.moveTo(0.8, cc.v2(startX , startY))
            let cbFun1 = function () {
                self.bossAttackTypeXZByTime(2, 100, 0, false,550)
                self.bossAttackTypeXZByTime(2, -100, 0, true, 550)
            }


            let attCallback = function () {
                let angle = JsUnit.getVectorRadians(self.node.x , self.node.y, D.gameHeroPx, D.gameHeroPy)
                let pos1 = cc.v2(Number(self.position[2].positionX), Number(self.position[2].positionY))
                self.bossAttackTypeByTime(1, pos1, 800, null, 1, angle+10)
                self.bossAttackTypeByTime(1, pos1, 800, null, 1, angle-10)

                let pos2 = cc.v2(Number(self.position[3].positionX), Number(self.position[3].positionY))
                self.bossAttackTypeByTime(1, pos2, 800, null, 1, angle+10)
                self.bossAttackTypeByTime(1, pos2, 800, null, 1, angle-10)
            }

            var repForever = cc.repeatForever(cc.sequence(  action3, cc.callFunc(attCallback), cc.delayTime(1.5),
                                                            action1, cc.callFunc(cbFun1), cc.delayTime(2.5),
                                                            action3, cc.callFunc(attCallback),cc.delayTime(1.5), 
                                                            action2, cc.callFunc(cbFun1),cc.delayTime(2.5),
            ))
            self.node.runAction(repForever)
        }

        if (!this.playingStepAttack) {
            this.playingStepAttack = -1
        }
        let step = 1
        let peret = this.enemyHp / this.HP * 100
        if (peret > 65) {
            step = 1
        } else if (peret > 30) {
            step = 2
        } else if (peret > 0) {
            step = 3
        }

        if (this.playingStepAttack == step) {
            return
        }

        this.playingStepAttack = step
        this.node.stopAllActions()
        if (this.playingStepAttack == 2) {
            step2Fun()
        } else if (this.playingStepAttack == 3) {
            step3Fun()
        }
        else {
            step1Fun()
        }
    },
    ///
   /*  boss10AttackHandler:function(){
        ////boss初始状态
        let startX = 0;
        let startY = this.node.parent.height / 4;

        let action1 = cc.moveTo(2, cc.v2(startX, startY))
        let action2 = cc.moveTo(1, cc.v2(startX, startY + 100))
        this.node.runAction(new cc.RepeatForever(cc.sequence(action1, action2))) 
        
        let self = this;
        ////控制炮弹
        let callback1 = function () {
            
            // 发射外面单个的炮弹
            let pos = cc.v2(Number(self.position[0].positionX), Number(self.position[0].positionY))
            let angle = JsUnit.getVectorRadians(self.node.x + pos.x, self.node.y + pos.y, D.gameHeroPx, D.gameHeroPy)
            self.sendEvent(angle, pos.x, pos.y, 700, null, 2)

            pos = cc.v2(Number(self.position[1].positionX), Number(self.position[1].positionY))
            angle = JsUnit.getVectorRadians(self.node.x + pos.x, self.node.y + pos.y, D.gameHeroPx, D.gameHeroPy)
            self.sendEvent(angle, pos.x, pos.y, 700, null, 2)
        }
        this.node.runAction(new cc.RepeatForever(cc.sequence(cc.callFunc(callback1), cc.delayTime(4)))) 

        ////
        let callback2 = function(){
            let p1  = cc.v2(Number(self.position[4].positionX), Number(self.position[4].positionY))
            let p2  = cc.v2(Number(self.position[5].positionX), Number(self.position[5].positionY))
            self.bossAttackType2(p1, p2)
        }
        this.node.runAction(cc.repeatForever(cc.sequence(cc.callFunc(callback2), cc.delayTime(3)))) 

        ////
        let callback3 = function(){
            self.bossAttackType3(2)
        }
        this.node.runAction(cc.repeatForever(cc.sequence(cc.callFunc(callback3), cc.delayTime(7))))
    }, 

    boss11AttackHandler:function(){
        ////boss初始状态
        let startX = 0;
        let startY = this.node.parent.height / 4;

        let action1 = cc.moveTo(2, cc.v2(startX + 250, startY))
        let action2 = cc.moveTo(4, cc.v2(startX -250, startY ))
        let action3 = cc.moveTo(5, cc.v2(startX + 250, startY + 200 ))
        let action4 = cc.moveTo(4, cc.v2(startX - 250, startY + 200 ))
        let sqAction = cc.sequence(action1, action2, action3, action4)
        this.node.runAction(new cc.RepeatForever(sqAction, sqAction.reverse())) 

        ////
        let self = this;
        //////
        ////控制炮弹
        // let callback1 = function () {
        //     // 发射外面单个的炮弹
        //     let pos = cc.v2(Number(self.position[0].positionX), Number(self.position[0].positionY))
        //     let angle = JsUnit.getVectorRadians(self.node.x + pos.x, self.node.y + pos.y, D.gameHeroPx, D.gameHeroPy)
        //     self.sendEvent(angle, pos.x, pos.y, 700)

        //     pos = cc.v2(Number(self.position[1].positionX), Number(self.position[1].positionY))
        //     angle = JsUnit.getVectorRadians(self.node.x + pos.x, self.node.y + pos.y, D.gameHeroPx, D.gameHeroPy)
        //     self.sendEvent(angle, pos.x, pos.y, 700)
        // }
        // this.node.runAction(new cc.RepeatForever(cc.sequence(cc.callFunc(callback1), cc.delayTime(4)))) 
        ///////

        /////多子弹
        let callback1 = function () {
            
            let pos1 = cc.v2(Number(self.position[2].positionX), Number(self.position[2].positionY))
            self.bossAttackTypeByTime(2, pos1, 1000, null, 1)

            let pos2 = cc.v2(Number(self.position[3].positionX), Number(self.position[3].positionY))
            self.bossAttackTypeByTime(2, pos2, 1000, null, 1)
        }

        this.node.runAction(cc.repeatForever(cc.sequence(cc.delayTime(2),cc.callFunc(callback1), cc.delayTime(7)))) 

        
        ////左右散射
        let isR = false
        let callback = function () {
            //发射3个点的小炮
            let pos = cc.v2(Number(self.position[0].positionX), Number(self.position[0].positionY))
            if (!isR) {
                pos = cc.v2(Number(self.position[1].positionX), Number(self.position[1].positionY))
            }

            self.sendEvent(self.node.rotation - 15, pos.x, pos.y)
            self.sendEvent(self.node.rotation , pos.x, pos.y)
            self.sendEvent(self.node.rotation + 15, pos.x, pos.y)

            isR = !isR
        }

        let callback2 = function () {
            //发射大圆弹道
            self.bossAttackType3()
        }

        var repForever = cc.repeatForever(cc.sequence(cc.delayTime(0.1), cc.callFunc(callback),
            cc.delayTime(0.1), cc.callFunc(callback),
            cc.delayTime(3), cc.callFunc(callback2, this), cc.delayTime(2)
        ))
        this.node.runAction(repForever)
        ////////////////////////
       
    },
*/
    boss12AttackHandler:function(){
        this.node.rotation = 180;

        let startX = 0;
        let startY = this.node.parent.height / 4;
      
        let self = this;

        ////控制移动
        let action2 = cc.moveTo(1, cc.v2(startX, startY + 100))
        let action3 = cc.moveTo(2, cc.v2(startX-400, startY ))
        let action4 = cc.moveTo(2, cc.v2(startX+400, startY ))
        this.node.runAction(new cc.RepeatForever(cc.sequence(action2, action3, action4)))

        let callback2 = function () {
            //发射大圆弹道
            self.bossAttackType4()
        }
        this.node.runAction(new cc.RepeatForever(cc.sequence(cc.callFunc(callback2), cc.delayTime(1.5)))) 
    },

    boss13AttackHandler: function () {
        this.node.rotation = 180;

        let startX = 0;
        let startY = this.node.parent.height / 4;

        let self = this;

        // ////控制移动
        let action3 = cc.moveTo(2, cc.v2(startX - 200, startY))
        let action4 = cc.moveTo(2, cc.v2(startX + 200, startY))
        this.node.runAction(new cc.RepeatForever(cc.sequence( action3, action4)))

        let callback1 = function () {
            self.bossAttackTypeByTime(2, cc.v2(0,0), 1000, null, 1)
        }

        let startRa = this.node.rotation  - 90 //- Num / 2 * 10
        let callback2 = function () {
            self.sendEvent(startRa, 0, 0, 350)
            // self.sendEvent(startRa + 13, 0, 0, 350)
            startRa = startRa + 13
        }
        
        let action6 = cc.callFunc(callback1)
        var action7 = cc.repeat(cc.sequence(cc.callFunc(callback2), cc.delayTime(0.03)), 50);

        this.node.runAction(new cc.RepeatForever(cc.sequence(action6, cc.delayTime(3), action7, cc.delayTime(3))))
    },

    ///////////////////////////////
    bossAttackTypeByTime: function (timeNum, detPos, speedNum = 350, skinUrl = null, bossBulletType = -1, rotation = null){
        let action 
        let self = this
        if (!rotation) {
            rotation = self.node.rotation
        }
        let callbackBack = function () {
            self.sendEvent(rotation, detPos.x, detPos.y, speedNum, null, bossBulletType)
        }

        let stopCallBack = function(){
            self.node.stopAction(action)
        }
        action = this.node.runAction(cc.repeatForever(cc.sequence(cc.callFunc(callbackBack),cc.delayTime(0.1))))
        this.node.runAction(cc.sequence(cc.delayTime(timeNum), cc.callFunc(stopCallBack, this)))
    },

    //boss发射单个子弹
    bossAttackType:function(detPos, speedNum = 350 , skinUrl = null){
        let angle = JsUnit.getVectorRadians(this.node.x + detPos.x, this.node.y + detPos.y, D.gameHeroPx, D.gameHeroPy)
        this.sendEvent(this.node.rotation, detPos.x, detPos.y, speedNum, skinUrl)
    },
    ///boss攻击方式 朝着对方发射3个子弹
    bossAttackType3ByAngle: function (angle, speedNum) {
        this.sendEvent(angle - 15, 0, 0, speedNum)
        this.sendEvent(angle, 0, 0, speedNum)
        this.sendEvent(angle + 15, 0, 0, speedNum)
    },
    ///boss攻击方式 中间散射  每次发射3个
    bossAttackType1:function (params) {
        this.sendEvent(this.node.rotation - 15)
        this.sendEvent(this.node.rotation)
        this.sendEvent(this.node.rotation + 15)
    },
    ///boss攻击方式  两竖 每次发射3个
    bossAttackType2: function (pos1, pos2) {

        let self = this
        let callback = function () {
            if (pos1) {
                self.sendEvent(self.node.rotation, pos1.x, pos1.y, 600)
            }else{
                self.sendEvent(self.node.rotation, -50, 0, 600)
            }

            if (pos2) {
                self.sendEvent(self.node.rotation, pos2.x, pos2.y, 600)
            }else{
                self.sendEvent(self.node.rotation, 50, 0, 600)
            }
        }

        var rep = cc.repeat(cc.sequence(cc.delayTime(0.1), cc.callFunc(callback)), 3);
        this.node.runAction(rep)
    },

    ///
    bossAttackType7:function (params) {
        let startRa = this.node.rotation //- Num / 2 * 10
        let self = this
        let i = 0
        let callback = function () {
            self.sendEvent(startRa + i * 15, 0, 0, 350)
            i ++
        }

        var rep = cc.repeat(cc.sequence(cc.delayTime(0.05), cc.callFunc(callback)), 30);
        this.node.runAction(rep)
    },
    ///boss攻击方式 360度 散射 画一个圈圈
    bossAttackType3: function (bossBulletType = -1,skinUrl = null) {
      
        if (!D.isVoideClose && this.isLife()) {
            cc.audioEngine.play(this.bossAttackedSound);
        }

        let startRa = this.node.rotation //- Num / 2 * 10

        for (var i = 0; i < 24; i++) {
            this.sendEvent(startRa + i * 15, 0, 0, 350, skinUrl, bossBulletType)
        }
    },
    bossAttackType3_1: function (bossBulletType = -1) {

        if (!D.isVoideClose && this.isLife()) {
            cc.audioEngine.play(this.bossAttackedSound);
        }

        let startRa = this.node.rotation //- Num / 2 * 10

        for (var i = 0; i < 36; i++) {
            this.sendEvent(startRa + i * 10, 0, 0, 350, null, bossBulletType)
        }
    },

    //旋转转圈圈
    bossAttackTypeXZByTime: function (timeNum,offX = 0, offY = 0,isLeft = true,attSpeed = 350) {
        let action
        let self = this
        

        let startRa = 0//- Num / 2 * 10
        let callbackBack = function () {
            self.sendEvent(startRa, offX, offY, attSpeed)


            // bullet_small_4


            if (isLeft) {
                startRa = startRa + 13
            }
            else{
                startRa = startRa - 13
            }
           
        }

        let stopCallBack = function () {
            self.node.stopAction(action)
        }
        action = this.node.runAction(cc.repeatForever(cc.sequence(cc.callFunc(callbackBack), cc.delayTime(0.05))))
        this.node.runAction(cc.sequence(cc.delayTime(timeNum), cc.callFunc(stopCallBack, this)))
    },
   


    //左右两边 360度 圈圈散射
    bossAttackType4: function (params) {

        if (!D.isVoideClose && this.isLife()) {
            cc.audioEngine.play(this.bossAttackedSound);
        }

        let startRa = this.node.rotation //- Num / 2 * 10

        for (var i = 0; i < 12; i++) {
            this.sendEvent(startRa + i * 30, -150)
            this.sendEvent(startRa + i * 30, 150)
        }
    },

    ///boss攻击方式   每次发射6个  一个圆形的炮弹
    bossAttackType5: function (params) {
        let num = 0
        let a=[1,-1,2,-2,1,-1]
        let pX = this.node.x
        let pY = this.node.y
        let self = this
        let callback = function(){
            self.sendEventByPos(self.node.rotation, pX + a[num] * 30, pY,700)
            num ++
            self.sendEventByPos(self.node.rotation, pX + a[num] * 30, pY, 700)
            num++
        }

        var rep = cc.repeat(cc.sequence(cc.delayTime(0.1), cc.callFunc(callback) ), 3);
        this.node.runAction(rep)
    },

    ///boss攻击方式   每次发射6个  一个圆形的炮弹  朝着玩家打
    bossAttackType6: function () {

        let angle = JsUnit.getVectorRadians(this.node.x, this.node.y, D.gameHeroPx, D.gameHeroPy)

        let num = 0
        let a = [1, -1, 2, -2, 1, -1]
        let pX = this.node.x
        let pY = this.node.y
        let self = this
        let callback = function () {
            self.sendEventByPos(angle, pX + a[num] * 30, pY, 700)
            num++
            self.sendEventByPos(angle, pX + a[num] * 30, pY, 700)
            num++
        }

        var rep = cc.repeat(cc.sequence(cc.delayTime(0.1), cc.callFunc(callback)), 3);
        this.node.runAction(rep)
    },
   

    //////////////////////////////
    sendEvent: function (rNum, offX = 0, offY = 0, speed = 350, defaultSkin = null, bossBulletType = -1, stepMovePos = null) {
        Notification.emit('send_bullet_event_globle', {
            // speed: this.runspeed + 50,
            speed: speed,
            attackNum: this.attackNum,
            x: this.node.x + offX,
            y: this.node.y + offY,
            rotation: rNum,
            enemyCfgID: this.enemyCfgID,
            enemyType: this.enemyType,
            defaultSkin: defaultSkin,
            bossBulletType: bossBulletType, ///1boss 弹道， 2导弹
            stepMovePos: stepMovePos
        });
    },
    sendEventByPos: function (rNum, tX, tY = 0, speed = 350, defaultSkin = null, bossBulletType = -1) {
        Notification.emit('send_bullet_event_globle', {
            // speed: this.runspeed + 50,
            speed: speed,
            attackNum: this.attackNum,
            x: tX,
            y: tY,
            rotation: rNum,
            enemyCfgID: this.enemyCfgID,
            enemyType: this.enemyType,
            defaultSkin: defaultSkin,
            bossBulletType: bossBulletType///1boss 弹道， 2导弹
        });
    },

    getAttackNum:function () {
        return this.attackNum;    
    },

    dieHandler:function(){
        let score = this.score
        if (D.isKillBossTimeStatus && this.enemyType == 3 ) {
            // D.isKillBossRemainTime
            let limitAry = this.limitStr.split(",");

            let peret = 0;
            if (limitAry.length == 1) {
                peret = Number(limitAry[0])
            }
            else {
                for (var index = 0; index < limitAry.length; index++) {
                    var element = limitAry[index];
                    var itemAry = element.split("#")
                    if (itemAry[0] > D.isKillBossRemainTime) {
                        peret = Number(itemAry[1])
                    }
                }
            }
            score = score * (100 + peret)/100
        }
        this.forceRemove(score)
    },

    

    onHandleDestroy: function () {
        if (this.dropID > 0) {
            Notification.emit('make_star_globle_event', {
                speed: this.runspeed,
                x: this.node.x,
                y: this.node.y,
                dropID: this.dropID,
            });
        }

        this.dieHandler()

        if (this.enemyType == 3) {
            //是BOSS
            Notification.emit('boss_die_event');
        }
    },

    gamePause: function () {
        this.node.pauseAllActions();
    },

    gameResume: function () {
        this.node.resumeAllActions();
    },

});
