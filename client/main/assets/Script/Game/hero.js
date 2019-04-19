var common = require('common');
var platformUtils = require('PlatformUtils');
cc.Class({
    extends: cc.Component,

    properties: () => ({
        bulletGroup: {
            default: null,
            type: require('bulletGroup'),
        },
        mainScript: {
            default: null,
            type: require('main'),
        },
        hp: 100,
        maxHP:100,
        attackNum:100,
        attackSpeed:0,
        armorNum:0,
        level:1,

        defentHurtNum:0,
        isSuperBuffByDis:false,
        isSuperBuffByTime:false,
        superBuffByDisNum:0,

        reLifeBuff:false,
        heroBuffs: [], //玩家身上buff
    }),

    // use this for initialization
    onLoad: function () {
        
        // 获取碰撞检测系统
        let manager = cc.director.getCollisionManager();
        // 开启碰撞检测系统
        manager.enabled = true;
        
        ////////////////
        let hlLevel = D.currHero.powerLevel
        let attackSpeedLevel = D.currHero.attackSpeedLevel
        let bloodLevel = D.currHero.bloodLevel

        let heroCfg = common.getGameHeroCfg()

        this.attackNum = heroCfg.initPower + (hlLevel-1) * heroCfg.powerRadix;
        
        this.attackSpeed = heroCfg.initAttackSpeed + (heroCfg.initAttackSpeed * heroCfg.attackSpeedRadix/100)*attackSpeedLevel;
        // 生命属性 = 初始值 + 成长 *（等级 - 1）
        this.maxHP = heroCfg.initBlood + heroCfg.bloodRadix * (bloodLevel - 1);
        this.armorNum = heroCfg.initArmor + this.attackNum / 7 + this.attackSpeed / 14;
        ////
        this.loadSkin(heroCfg.subSeq)


        // this.attackNum = 10
        this._skinKind = D.currHero.kind
        this._skinSubSeq = heroCfg.subSeq
        //
        //侦听事件
        Notification.on('change_bullet_buff', this.onChangeBulletEnd, this);
        Notification.on('enemy_onCollision_hero', this.onEnemyCollisionHero, this);
    },

    start: function(){

        //签到尾气
        let state = false;
        platformUtils.requestItemList(function(res){
            if(res){
                res.forEach(val => {
                    console.log("====== isHeroNewGas=== val:"+val);
                    if(val.id == ItemConst.SignHeroGas){
                        state = true;
                    }
                });
            }
        });

        if(state){
            let _this = this;
            cc.loader.loadRes("prefabs/hero_newgas", function(err,prefab){
                let new_gas = cc.instantiate(prefab);
                _this.node.addChild(new_gas);
                let hero_gas = _this.node.getChildByName("hero_gas");
                new_gas.position = hero_gas.position;
                _this.node.removeChild(hero_gas);
            });
        }
    },

    loadSkin: function (subSeq){
        //飞机皮肤
        let url = 'plane/plane_' + D.currHero.kind + "_" + subSeq;
        // let url = 'plane/plane_' +  + "_" + 1;
        var _this = this;
        cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
            _this.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });

    },
    initData:function(){
        this.hp = this.maxHP;
        this.mainScript.updateHeroHP(this.hp);
        this.defentHurtNum = 0;

        this.node.active = true;
        this.heroBuffs = [];
    },

    addChargeBuff: function(){
        //出战前购买道具
        let _this = this;
        D.beginFightBuffs.forEach(function(value,idx){
            _this.addHeroItemEffect("item_"+value)
        });
    },

    // 碰撞组件
    onCollisionEnter: function (other, self) {
        if (other.node.group === 'ufo'){
            // let heartItem = other.node.getComponent('ufo');
            //添加获得道具
            this.addHeroItemEffect(other.node.name);

        } else if (other.node.group === 'enemy'){

            var enemyItem = other.node.getComponent('enemy');
            if (enemyItem.isLife()){
                
                if (this.defentHurtNum > 0) {
                    this.defentHurtNum--;
                    if (this.defentHurtNum <= 0) {
                        this.removeDefentBuffhandler()
                    }
                    return
                }

                if (!this.isSuperBuffByTime && !this.isSuperBuffByDis) {
                    // 更新主界面玩家血量
                    let hurtNum = Math.ceil(enemyItem.attackNum * enemyItem.attackNum / (enemyItem.attackNum + this.armorNum * 5));
                    this.addHeroHP(-hurtNum*2);
                    // this.addHeroHP(-Math.abs(enemyItem.attackNum * 2));
                    // this.addHeroHP(-this.hp);

                    this.checkLife();
                }
            }
        }
        else if (other.node.group === 'bullet')
        {
            let bullet = other.node.getComponent('bullet');

            if (!bullet.isPlayerBullet()){

                if (this.defentHurtNum > 0) {
                    this.defentHurtNum--;
                    if (this.defentHurtNum <= 0 ) {
                        this.removeDefentBuffhandler()
                    }
                    return
                }

                if (!this.isSuperBuffByTime && !this.isSuperBuffByDis) {
                    // 更新主界面玩家血量
                    let hurtNum = Math.ceil(bullet.attackNum * bullet.attackNum / (bullet.attackNum + this.armorNum * 5));
                    this.addHeroHP(-hurtNum);
                    this.checkLife();
                }
               
            }
        }
    },
    /**
     * 添加英雄道具效果
     * type: 物品类型
     */
    addHeroItemEffect:function(type){
        switch (type) {
            case 'item_1'://抵挡一次伤害
                this.defentBuffhandler();
                break;
            case "item_2":
                var itemCfg = common.getJsonCfgByID("Items", 2)    
                Notification.emit("updateUfoTimes_event", { timesNum: 2, time: itemCfg.periodTime});
                this.addHeroBuff({name:"item_2",time:itemCfg.periodTime});
                break;
            case "item_3":
                var itemCfg = common.getJsonCfgByID("Items", 3)   
                Notification.emit("updateUfoTimes_event", { timesNum: 3, time: itemCfg.periodTime })
                this.addHeroBuff({name:"item_2",time:itemCfg.periodTime});
                break;
            case "item_4":
                var itemCfg = common.getJsonCfgByID("Items", 4)   
                Notification.emit("updateUfoTimes_event", { timesNum: 5, time: itemCfg.periodTime })
                this.addHeroBuff({name:"item_2",time:itemCfg.periodTime});
                break;
            case "item_5":
                var itemCfg = common.getJsonCfgByID("Items", 5)   
                Notification.emit("updateUfoTimes_event", { timesNum: 8, time: itemCfg.periodTime })
                this.addHeroBuff({name:"item_2",time:itemCfg.periodTime});
                break;
            case 'item_6'://增加自身血量10%
                this.addHPByPercent(10);
                break;
            case 'item_7'://增加自身血量20%
                // 更新主界面玩家血量
                this.addHPByPercent(20);
                break;
            case "item_8": //自动吸取掉落的所有道具
                this.magnetHandler();
                break
            case "item_9": //无敌状态向前冲刺  冲刺距离
                var itemCfg = common.getJsonCfgByID("Items", 9)
                this.spurtHandlerBySpeed(itemCfg.sprintDisID);
                break;
            case "item_10"://无敌状态向前冲刺  冲刺时间
                var itemCfg = common.getJsonCfgByID("Items", 10)
                this.spurtHandlerByTime(itemCfg.sprintTime);
                break;
            case 'item_11':
                var itemCfg = common.getJsonCfgByID("Items", 11)
                this.bulletGroup.changeBullet('item_11', itemCfg.periodTime);
                this.addHeroBuff({name:"item_11",time:itemCfg.periodTime});
                break;
            case 'item_12'://激光炮
                var itemCfg = common.getJsonCfgByID("Items", 12)
                this.bulletGroup.sendJiGuangBullet();
                this.addHeroBuff({name:"item_12",time:itemCfg.periodTime});
                break;
            case 'item_14'://僚机
                var itemCfg = common.getJsonCfgByID("Items", 14)
                this.mainScript.showLiaojiHandler();
                this.addHeroBuff({name:"item_14",time:itemCfg.periodTime});
                break;
            case 'item_15':
                this.mainScript.receiveBomb();
                break;
            case 'item_16':
                this.mainScript.onListinShareItemPkg(16);
                break;
            case 'item_17':
                this.mainScript.onListinShareItemPkg(17);
                break;
            case 'item_18':
                this.mainScript.addStarNum(1);
                break;
            case 'item_19':
                this.mainScript.addRedPacket();
                break;
        }
    },
    checkLife:function(){
        if (this.hp <= 0) {
            // let anim = this.getComponent(cc.Animation);
            // let animName = this.node.name + '_exploding';
            // anim.play(animName);
            // anim.on('finished', this.onHandleDestroy, this);

            this.onHandleDestroy()
        }
    },

    addHPByPercent:function (perNum) {
        let hNum = this.maxHP * perNum
        this.addHeroHP(hNum)
    },

    addHeroHP: function( hp){

        //复活  3秒钟无敌状态
        if (this.reLifeBuff && hp <= 0) {
            return
        }

        this.hp += hp;

        if (this.hp > this.maxHP){
            this.hp = this.maxHP;
        }
        if (this.hp < 0) {
            this.hp = 0;
        }

        var tmpHp = this.hp;
        if (tmpHp < 0) {
            tmpHp = 0;
        }
        
        if (hp < 0 && tmpHp > 0)
        {
            this.mainScript.showBeHurtEffView();
        }

        this.mainScript.updateHeroHP(tmpHp);
    },

    reLife:function(){
        this.initData()
        this.reLifeBuff  = true

        let action1 = cc.delayTime(3)
        var finish = cc.callFunc(this.closeRelifeBuff, this);
        this.node.runAction(cc.sequence(action1, finish))

        //无敌护盾
        this.showHeroShield();
    },

    closeRelifeBuff:function(){
        this.reLifeBuff = false
        this.removeHeroShield();
    },

    //游戏结束
    gameOver:function(){
        Notification.off('change_bullet_buff', this.onChangeBulletEnd);
        Notification.off('enemy_onCollision_hero', this.onEnemyCollisionHero);
    },

    onHandleDestroy: function () {
        // this.offDrag();
        // 游戏结束转场
        this.mainScript.gameOver();

        // this.node.active = false
    },

/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
    //抵挡一次伤害
    defentBuffhandler:function(){
        this.defentHurtNum++;
        this.showHeroShield();
        this.addHeroBuff({name:"item_1",num:this.defentHurtNum});
    },
    removeDefentBuffhandler:function(){
        this.removeHeroShield();
        this.removeHeroBuff({name:"item_1"});
    },

    showHeroShield: function(){
        if (this.node.getChildByName("HeroShieldTag")){
            return;
        }

        let _this = this;
        cc.loader.loadRes("prefabs/shieldEff", function(err,prefab){
            let newNode = cc.instantiate(prefab);
            _this.node.addChild(newNode, 100, "HeroShieldTag");

            let animPlay = newNode.getChildByName("animPlay").getComponent(cc.Animation);
            animPlay.play();

            let animEnd = newNode.getChildByName("animEnd").getComponent(cc.Animation);
            animEnd.node.active = false;
        });
    },

    removeHeroShield: function(){
        let animShield = this.node.getChildByName("HeroShieldTag");
        if (!animShield || this.defentHurtNum > 0) return;

        let animPlay = animShield.getChildByName("animPlay").getComponent(cc.Animation);
        animPlay.node.active = false;

        let _this = this;
        let finish = function(){
            animShield.stopAllActions();
            _this.node.removeChild(animShield);
        }

        let animEnd = animShield.getChildByName("animEnd").getComponent(cc.Animation);
        animEnd.node.active = true;
        animEnd.play();
        animShield.runAction(cc.sequence(cc.delayTime(1.35),cc.callFunc(finish,_this)) );
    },

    ///得到磁铁
    magnetHandler:function(){
        if (this.node.getChildByName("magnetEffTag")){
            return;
        }

        this.unschedule(this.magnetDealyCall)
        let itemCfg = common.getJsonCfgByID("Items", 8);
        if (!D.magnetStatus) {
            this.addHeroBuff({name:"item_8",time:itemCfg.periodTime});
        }
        ///
        let _this = this;
        this.magnetDealyCall = function (i) {
            D.magnetStatus = false;
            _this.removeHeroBuff({name:"item_8"});

            let magnetEff = _this.node.getChildByName("magnetEffTag");
            if(magnetEff){
                _this.node.removeChild(magnetEff);
            }
        }.bind(this);

        D.magnetStatus = true;

        this.scheduleOnce(this.magnetDealyCall, itemCfg.periodTime);

        //特效
        cc.loader.loadRes("prefabs/magnetEff", function(err, prefab){
            let eff = cc.instantiate(prefab);
            _this.node.addChild(eff);
            eff.position = cc.v2(0,-20);
            eff.name = "magnetEffTag";
        });
        
    },
    //冲刺
    spurtHandlerByTime:function(timeNum){
        this.isSuperBuffByTime = true;
        this.unschedule(this.resetSpurtHandlerByTime);

        if (!this.spurtByTimeNode) {
            let self = this;
            cc.loader.loadRes('game/buff_huzhao.png', cc.SpriteFrame, function (err, spriteFrame) {
                self.spurtByTimeNode = new cc.Node('spurtByTimeNode')
                const sprite = self.spurtByTimeNode.addComponent(cc.Sprite)
                sprite.spriteFrame = spriteFrame
                self.node.addChild(self.spurtByTimeNode)
    
                self.spurtByTimeNode.runAction(cc.repeatForever(cc.sequence(cc.fadeIn(0.5), cc.fadeOut(0.3))))
            })  
            this.addHeroBuff({name:"item_10"});
        }

        this.scheduleOnce(this.resetSpurtHandlerByTime, timeNum);
        
    },
    resetSpurtHandlerByTime:function () {
        this.isSuperBuffByTime = false;

        if (this.spurtByTimeNode) {
            this.node.removeChild(this.spurtByTimeNode);
            this.spurtByTimeNode = null
        }
        this.removeHeroBuff({name:"item_10"});
    },
    //冲刺
    spurtHandlerBySpeed:function (disNum) {
        if (this.spurtByDisNode) {
            return
        }

        this.isSuperBuffByDis =  true;
        this.superBuffByDisNum = this.mainScript.juliNum +  disNum /100;

        let self = this;
        cc.loader.loadRes('game/buff_huzhao', cc.SpriteFrame, function (err, spriteFrame) {
            self.spurtByDisNode = new cc.Node('spurtByDisNode')
            const sprite = self.spurtByDisNode.addComponent(cc.Sprite)
            sprite.spriteFrame = spriteFrame
            self.node.addChild(self.spurtByDisNode)

            self.spurtByDisNode.runAction(cc.repeatForever(cc.sequence(cc.fadeIn(0.5),cc.fadeOut(0.3))))
        })  
        this.addHeroBuff({name:"item_10"});
    },
    resetSpurtHandlerBySpeed: function () {
        this.isSuperBuffByDis = false;

        if (this.spurtByDisNode) {
            this.node.removeChild(this.spurtByDisNode);
            this.spurtByDisNode = null
        }
        this.removeHeroBuff({name:"item_9"});
    },

    addHeroBuff: function(buff){
        if (!this.heroBuffs) return;
        
        var isHave = this.heroBuffs.some(function(value) {
            return value.name == buff.name;
        }); 
        if (!isHave){
            this.heroBuffs.push(buff);
        }
        //一局战斗配置
        if(buff.time == -1){
            return;
        }

        this.mainScript.addHeroBuff(buff,this.heroBuffs);
        this.mainScript.tipsGetItem(buff.name);
    },

    removeHeroBuff: function(buff){
        if (!this.heroBuffs) return;

        var newBuffs = this.heroBuffs.filter(function(value, index) {
            return value.name != buff.name;
        }); 

        this.heroBuffs = newBuffs;
        this.mainScript.removeHeroBuff(buff,this.heroBuffs);

        let id = buff.name.split('_')[1];
        let cfg = common.getJsonCfgByID("Items",id);
        if(cfg && cfg.periodTime != -1){
            this.mainScript.removeHeroBuff(buff,this.heroBuffs);
        }
        
    },

    clearAllBuff: function(){
        this.removeHeroBuff({name:"item_11"});

        this.removeHeroBuff({name:"item_1"});
        this.defentHurtNum = 0;

        if(this.magnetDealyCall){
            this.magnetDealyCall();
            this.unschedule(this.magnetDealyCall)
        }

        if(this.resetSpurtHandlerByTime){
            this.resetSpurtHandlerByTime();
            this.unschedule(this.resetSpurtHandlerByTime);
        }
    },

    onChangeBulletEnd: function(event){
        this.removeHeroBuff({name:event.item});
    },

    onEnemyCollisionHero: function(event){
        if (this.defentHurtNum > 0) {
            this.defentHurtNum--;
            if (this.defentHurtNum <= 0) {
                this.removeDefentBuffhandler()
            }
            return
        }
        let hurtNum = Math.ceil(event.attackNum * event.attackNum / (event.attackNum + this.armorNum * 5));
        this.addHeroHP(-hurtNum*2);
        this.checkLife();
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (D.gameStatuePause) {
            return
        }
        
        if (this.isSuperBuffByDis){
            if (this.mainScript.juliNum > this.superBuffByDisNum ) {
                this.resetSpurtHandlerBySpeed()
            }
        }
    },
});
