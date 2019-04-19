var poolClass = require('pool');
var myeval = require('../Common/myeval');
var common = require('common');

// 子弹生成的位置
const bulletPosition = cc.Class({
    name: 'bulletPosition',
    properties: {
        positionX: {
            default: '',
            tooltip: '子弹相对Hero的位置'
        }
    }
});

// 无限时长子弹
const infiniteBullet = cc.Class({
    name: 'infiniteBullet',
    properties: {
        name: '',
        rate: 0,
        size: 0,
        prefab: cc.Prefab,
        position: {
            default: [],
            type: bulletPosition,
            tooltip: '子弹位置'
        }
    }
});

// 有限时长子弹
const finiteBullet = cc.Class({
    extends: infiniteBullet,
    name: 'finiteBullet',
    properties: {
        duration: 0,
        ufoBulletName: ''
    }
});

////////////////////

// 无限时长子弹
const enemyInfiniteBullet = cc.Class({
    name: 'enemyInfiniteBullet',
    properties: {
        name: '',
        rate: 0,
        size: 0,
        prefab: cc.Prefab,
        position: {
            default: [],
            type: bulletPosition,
            tooltip: '子弹位置'
        }
    }
});
////////////
// 激光子弹
const jiguangBullet = cc.Class({
    name: 'jiguangBullet',
    properties: {
        name: '',
        rate: 0,
        size: 0,
        prefab: cc.Prefab,
        position: {
            default: [],
            type: bulletPosition,
            tooltip: '子弹位置'
        }
    }
});

///////受击
const beAttackedEff = cc.Class({
    name: 'beAttackedEff',
    properties: {
        name: '',
        rate: 0,
        size: 0,
        prefab: cc.Prefab,
        position: {
            default: [],
            type: bulletPosition,
            tooltip: '子弹位置'
        }
    }
});

///////导弹
const enemyMissileBullet = cc.Class({
    name: 'enemyMissileBullet',
    properties: {
        name: '',
        rate: 0,
        size: 0,
        prefab: cc.Prefab,
        position: {
            default: [],
            type: bulletPosition,
            tooltip: '子弹位置'
        }
    }
});

///僚机子弹
const liaojiBullet = cc.Class({
    name: 'liaojiBullet',
    properties: {
        name: '',
        rate: 0,
        size: 0,
        prefab: cc.Prefab,
        position: {
            default: [],
            type: bulletPosition,
            tooltip: '子弹位置'
        }
    }
});


///僚机子弹
const enemyDaoDanBullet = cc.Class({
    name: 'enemyDaoDanBullet',
    properties: {
        name: '',
        rate: 0,
        size: 0,
        prefab: cc.Prefab,
        position: {
            default: [],
            type: bulletPosition,
            tooltip: '子弹位置'
        }
    }
});


///Boss 攻击 特殊子弹
const enemyBossBullet_1 = cc.Class({
    name: 'enemyBossBullet_1',
    properties: {
        name: '',
        rate: 0,
        size: 0,
        prefab: cc.Prefab,
        position: {
            default: [],
            type: bulletPosition,
            tooltip: '子弹位置'
        }
    }
});


/////////////////////

// 有限时长子弹
cc.Class({
    extends: cc.Component,

    properties:() => ({

        mainScript: {
            default: null,
            type: require('main'),
        },
        infiniteBullet: {
            default: null,
            type: infiniteBullet,
            tooltip: '无限子弹'
        },
        finiteBullet: {
            default: [],
            type: finiteBullet,
            tooltip: '有限子弹'
        },
        enemyInfiniteBullet: {
            default: null,
            type: enemyInfiniteBullet,
            tooltip: '敌人子弹无限子弹'
        },
        jiguangBullet: {
            default: null,
            type: jiguangBullet,
            tooltip: '激光子弹'
        },
        beAttackedEff: {
            default: null,
            type: beAttackedEff,
            tooltip: '受击动画'
        },
        enemyMissileBullet: {
            default: null,
            type: enemyMissileBullet,
            tooltip: '受击动画'
        },
        liaojiBullet: {
            default: null,
            type: liaojiBullet,
            tooltip: '僚机跑弹动画'
        },
        enemyDaoDanBullet:{
            default: null,
            type: enemyDaoDanBullet,
            tooltip: 'Boss炮弹动画'
        },
        enemyBossBullet_1: {
            default: null,
            type: enemyBossBullet_1,
            tooltip: 'Boss炮弹动画'
        },
        

        bulletSound: {
            default: null,
            type: cc.AudioClip,
        },
        bulletSound2: {
            default: null,
            type: cc.AudioClip,
        },
        tmpSpriteFrame:{
            default: null,
            type: cc.SpriteFrame,
        },
        hero: cc.Node,
        heroAttackSpeedNum:0,
        isFireStatus:false,
        isStopEnemyBullet:false,
    }),

    onLoad: function () {
        // 初始化对象池
        poolClass.initPool(this, this.infiniteBullet);
        poolClass.initPoolBatch(this, this.finiteBullet);

        // //敌方飞机发射的子弹
        poolClass.initPool(this, this.enemyInfiniteBullet);
        poolClass.initPool(this, this.jiguangBullet);
        poolClass.initPool(this, this.enemyMissileBullet);

        poolClass.initPool(this, this.beAttackedEff);
        poolClass.initPool(this, this.liaojiBullet);
        poolClass.initPool(this, this.enemyDaoDanBullet);
        poolClass.initPool(this, this.enemyBossBullet_1);

        // this.node.on('send_bullet_event', this.enmySendBulletEvent,this);
      
        ///
        // this.beattackedHandler(0, 0)
    },
   
    startAction:function(){
        Notification.on('send_bullet_event_globle', this.enmySendBulletEvent, this);

        Notification.on('level_begin_event', this.levelBeginlHandler, this);
        Notification.on('level_over_event', this.levelOverHandler, this);
        Notification.on('stop_bullet_event', this.levelOverHandler, this);


        let heroCfg = common.getGameHeroCfg()
        this.heroAttackSpeedNum = heroCfg.initAttackSpeed + (heroCfg.initAttackSpeed * heroCfg.attackSpeedRadix/100)*D.currHero.attackSpeedLevel;

        this.startNormalShoot()
    },

    levelOverHandler: function () {
        this.stopShootHandler()
    },
    levelBeginlHandler: function () {
        if (!this.isFireStatus) {
            this.startNormalShoot()
        }
    },
    // 发射子弹，定时器
    startNormalShoot: function (event) {
        this.stopShootHandler();
        this.starShootHandler();

        if (event){
            Notification.emit("change_bullet_buff", { item: "item_11" });
            if(this.node.finitAct != null){
                this.node.stopAction(this.node.finitAct);
                this.node.finitAct = null;
            }
        }
    },
    stopShootHandler:function(){
        this.isFireStatus = false
        this.node.stopAction(this.normalShootAction);
        this.node.stopAction(this.doubleShootAction);
    },
   
    //一弹道 射击
    starShootHandler: function () {
        if (this.jiguangBulletNow) {
            return
        }
        this.stopShootHandler()
        let attackSpeedLevel = this.heroAttackSpeedNum
        if (attackSpeedLevel > 20) {
            attackSpeedLevel = 20
        }
        let delayAction = cc.delayTime(1 / attackSpeedLevel)
        let callFunc = cc.callFunc(this.startShoot, this)
        var repeat = cc.repeatForever(cc.sequence(delayAction, callFunc));
        this.normalShootAction = this.node.runAction(repeat)

        this.isFireStatus = true
    },

    startShoot:function(){
        if (D.currHero.kind == 1) {
            this.startShoot_1()
        }
        else if (D.currHero.kind == 2){
            this.startShoot_2();
        } 
        else if (D.currHero.kind == 4) {
            this.startShoot_4();
        } else{
            this.startShoot_3()
        }
        // cc.audioEngine.play(this.bulletSound2);
    },

    startShoot_1: function () {
        this.makeNewBullet(this.infiniteBullet);
    },

    startShoot_2: function (foreMax) {
        let hero = this.hero.getComponent('hero');
        
        if (!this.shootCount) {
            this.shootCount = 0
        }

        if (foreMax || hero._skinSubSeq == 5) {
            if (this.shootCount % 2 == 0) {
                this.makeNewBullet(this.infiniteBullet, 1, -15, -50, -20, "bullet/bullet_new_2_1",5);
                this.makeNewBullet(this.infiniteBullet, 1, 0, -50, -20, "bullet/bullet_new_2_1", 5);
                this.makeNewBullet(this.infiniteBullet, 1, 0, 50, -20, "bullet/bullet_new_2_1", 5);
                this.makeNewBullet(this.infiniteBullet, 1, 15, 50, -20, "bullet/bullet_new_2_1", 5);
            } else {
                this.makeNewBullet(this.infiniteBullet, 1, 0, -50, -20, "bullet/bullet_new_2_2", 5);
                this.makeNewBullet(this.infiniteBullet, 1, 0, 50, -20, "bullet/bullet_new_2_2",5);
            }
            this.makeNewBullet(this.infiniteBullet, 2, 0, 0, -20, "bullet/bullet_new_2_4", 5);

        }else if (hero._skinSubSeq == 1) {
            this.makeNewBullet(this.infiniteBullet, 1, -5, 0, -50, "bullet/bullet_new_2_1",2);
            this.makeNewBullet(this.infiniteBullet, 1, 5, 0, -50, "bullet/bullet_new_2_1", 2);

        } else if (hero._skinSubSeq == 2) {
            if (this.shootCount % 2 == 0) {
                this.makeNewBullet(this.infiniteBullet, 1, -10, -50, -20, "bullet/bullet_new_2_1",3);
                this.makeNewBullet(this.infiniteBullet, 1, 0, 0, -20, "bullet/bullet_new_2_1", 3);
                this.makeNewBullet(this.infiniteBullet, 1, 10, 50, -20, "bullet/bullet_new_2_1", 3);
            } else {
                this.makeNewBullet(this.infiniteBullet, 1, 0, 0, -20, "bullet/bullet_new_2_2", 3);
            }

        }else if (hero._skinSubSeq == 3) {
            if (this.shootCount % 2 == 0) {
                this.makeNewBullet(this.infiniteBullet, 1, -15, -50, -20, "bullet/bullet_new_2_1", 4);
                this.makeNewBullet(this.infiniteBullet, 1, 0, -30, -20, "bullet/bullet_new_2_1", 4);
                this.makeNewBullet(this.infiniteBullet, 1, 0, 30, -20, "bullet/bullet_new_2_1", 4);
                this.makeNewBullet(this.infiniteBullet, 1, 15, 50, -20, "bullet/bullet_new_2_1", 4);
            } else {
                this.makeNewBullet(this.infiniteBullet, 1, 0, -30, -20, "bullet/bullet_new_2_2", 4);
                this.makeNewBullet(this.infiniteBullet, 1, 0, 30, -20, "bullet/bullet_new_2_2", 4);
            }

        } else if (hero._skinSubSeq == 4) {
            if (this.shootCount % 2 == 0) {
                this.makeNewBullet(this.infiniteBullet, 1, -15, -50, -20, "bullet/bullet_new_2_1", 5);
                this.makeNewBullet(this.infiniteBullet, 1, 0, -50, -20, "bullet/bullet_new_2_1", 5);
                this.makeNewBullet(this.infiniteBullet, 1, 0, 50, -20, "bullet/bullet_new_2_1", 5);
                this.makeNewBullet(this.infiniteBullet, 1, 15, 50, -20, "bullet/bullet_new_2_1", 5);
            } else {
                this.makeNewBullet(this.infiniteBullet, 1, 0, -50, -20, "bullet/bullet_new_2_2", 5);
                this.makeNewBullet(this.infiniteBullet, 1, 0, 50, -20, "bullet/bullet_new_2_2", 5);
            }
            this.makeNewBullet(this.infiniteBullet, 1, 0, 0, -20, "bullet/bullet_new_2_3", 5);
          } 

         this.shootCount++
    },

    startShoot_3: function (foreMax) {
        // this.makeNewBullet(this.infiniteBullet);
        let hero = this.hero.getComponent('hero');

        if (!this.shootCount) {
            this.shootCount = 0
        }

        let self = this
        let sendCirBullet = function (offX=0,offY=0,rotation = 0) {
           let num = 8
           for (var i = 0; i < num; i++) {
               let angle = i * 360 / num

               let targetX = Math.cos(2 * Math.PI / 360 * angle) * 65;
               let targetY = Math.sin(2 * Math.PI / 360 * angle) * 65;
               self.makeNewBullet(self.infiniteBullet, 1, rotation, targetX + offX, targetY + offY, "bullet/bullet_new_3_1", num, 800);
           }
        }
        
        let sendDaoBullet = function (offX = 0, offY = 0, rotation = 0,tt = 0.5) {
           
            let bullet = self.makeNewBullet(self.infiniteBullet, 1, rotation,  0,  -30, "bullet/bullet_new_3_2", 1, 800);
            bullet.stopMove = true

            let callback = function () {
                bullet.stopMove = false
            }
            let act1 = cc.moveBy(tt, cc.v2(offX , offY))
            let act2 = cc.callFunc(callback)
            bullet.node.runAction(cc.sequence(act1, act2))
        }
       
      if (foreMax || hero._skinSubSeq == 5) {
        
        sendCirBullet(0, 0, -10);
        sendCirBullet(0, 0, 10);
        sendDaoBullet(-120, -80,2)
        sendDaoBullet(120, -80, 2)
        sendDaoBullet(-80, -30, 1)
        sendDaoBullet(80, -30, 1)

        } else if (hero._skinSubSeq == 1) {
            sendCirBullet(0, 0, 0);

        } else if (hero._skinSubSeq == 2) {
            sendCirBullet(0, 0, 0);
            sendDaoBullet(-100, -80)
            sendDaoBullet(100, -80)

        } else if (hero._skinSubSeq == 3) {
            sendCirBullet(0, 0, -10);
            sendCirBullet(0, 0, 10);

        } else if (hero._skinSubSeq == 4) {
          sendCirBullet(0, 0, -10);
          sendCirBullet(0, 0, 10);
          sendDaoBullet(-120, -80, 2)
          sendDaoBullet(120, -80, 2)
        }

        this.shootCount++
    },


    startShoot_4: function (foreMax) {

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
        let dis = 3 * d

        let buttle = self.makeNewBullet(self.infiniteBullet, 1, 0, -25 - 1 * dis, -50, "bullet/bullet_new_4_1", 4, 800);
        buttle.needPlaySound = false

        self.makeNewBullet(self.infiniteBullet, 1, 0, -1 * dis, -50, "bullet/bullet_new_4_2", 4, 800);
        self.makeNewBullet(self.infiniteBullet, 1, 0, 25 + dis, -50, "bullet/bullet_new_4_1", 4, 800);

        buttle = self.makeNewBullet(self.infiniteBullet, 1, 0, dis, -50, "bullet/bullet_new_4_2", 4, 800);
        buttle.needPlaySound = false
    },

    // 更换子弹
    changeBullet: function (ufoBulletName,timeNum) {
        if (this.jiguangBulletNow) {
            return
        }
        
        this.stopShootHandler()

        for (let i = 0; i < this.finiteBullet.length; i++) {
            if (this.finiteBullet[i].ufoBulletName === ufoBulletName) {
                this.sendDoubleBullet(this.finiteBullet[i]);
                this.isFireStatus = true
                if(this.node.finitAct != null){
                    this.node.stopAction(this.node.finitAct);
                    this.node.finitAct = null;
                }
                this.node.finitAct = this.node.runAction(cc.sequence(cc.delayTime(timeNum), cc.callFunc(this.startNormalShoot, this)) )
                
            }
        }
    },

    sendDoubleBullet: function (bulletInfo){
        this.startDoubleShoot = function () {
            if (D.currHero.kind == 2) {
                this.startShoot_2(true);
            } else if (D.currHero.kind == 3) {
                this.startShoot_3(true);
            }
            else if (D.currHero.kind == 4) {
                this.startShoot_4(true);
            } 
            else {
                this.makeNewBullet(bulletInfo,2);
             }
        }
        
        let attackSpeedLevel = this.heroAttackSpeedNum

        if (D.currHero.kind == 4) {
            attackSpeedLevel = 20
        }

        if (attackSpeedLevel > 20) {
            attackSpeedLevel = 20
        }

        var repeat = cc.repeatForever(cc.sequence(cc.delayTime(1 / attackSpeedLevel), cc.callFunc(this.startDoubleShoot, this)));
        this.doubleShootAction = this.node.runAction(repeat)
    },

    // 生成子弹
    makeNewBullet: function (bulletInfo, attackTimesNum = 1,rotation = 0,offX = 0,offY = 0,url=null,perNum = 1,moveSpeed = 1500) {
        let poolName = bulletInfo.name + 'Pool';
        let pos = this.hero.getPosition();
        pos.y = pos.y + 50 
       
        let hero = this.hero.getComponent('hero');
        let bullet;
        if (attackTimesNum == 2 && D.currHero.kind != 2) {
            bullet = this.creatreBullet2(poolName, bulletInfo.prefab, pos)
        }
        else{
            bullet = this.creatreBullet(poolName, bulletInfo.prefab, pos, url)
        }
        bullet.node.x += offX;
        bullet.node.y += offY;
        bullet.setMoveRotation(rotation)
        bullet.speed = moveSpeed
        bullet.attackNum = hero.attackNum / perNum * attackTimesNum;

        return bullet
    },

    creatreBullet: function (poolName, prefab, pos, url){
        let newNode = poolClass.borrowNewNode(this[poolName], prefab, this.node);
        newNode.setPosition(pos);
        let bullet = newNode.getComponent('bullet');

        bullet.bulletGroup = this;
        bullet.setIsPlayer(true)
        let hero = this.hero.getComponent('hero');

        bullet.getComponent(cc.Sprite).sizeMode = cc.Sprite.SizeMode.RAW;
        ////子弹
        if (!this.bulletObj) {
            this.bulletObj = {}
            
        }

        if (!url) {
            if (hero._skinKind == 4) {
                url = 'bullet/bullet_' + hero._skinKind + "_1";
            }else{
                url = 'bullet/bullet_' + hero._skinKind + "_" + hero._skinSubSeq;
            }
        }

        if(this.bulletObj[url]){
            bullet.getComponent(cc.Sprite).spriteFrame = this.bulletObj[url];
        }else{
            var _this = this;
            cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
                _this.bulletObj[url] = spriteFrame
                bullet.getComponent(cc.Sprite).spriteFrame = _this.bulletObj[url];
            });
        }

        if (hero._skinKind == 2) {
            bullet.node.setScale(1.2)
        }

        if (hero._skinSubSeq >= 3 || hero._skinKind == 3) {
            bullet.getComponent(cc.BoxCollider).size.width = 100

            if (hero._skinSubSeq == 5) {
                bullet.getComponent(cc.BoxCollider).size.width = 130
            }
        }

       /*  if (!this.tmpSpriteFrame) {
            let url = 'bullet/bullet_' + hero._skinKind + "_" + hero._skinSubSeq;

            if (hero._skinKind == 2) {
                url = 'bullet/bullet_new_2_1';
            }
           
            var _this = this;
            cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
                _this.tmpSpriteFrame = spriteFrame;

                bullet.getComponent(cc.Sprite).spriteFrame = spriteFrame;

             

                bullet.node.setScale(1.2)
            });
        }

        if (this.tmpSpriteFrame) {
            bullet.getComponent(cc.Sprite).spriteFrame = this.tmpSpriteFrame;

           
            bullet.node.setScale(1.2)
        }
 */
        return bullet
    },

    creatreBullet2: function (poolName, prefab, pos) {
        let newNode = poolClass.borrowNewNode(this[poolName], prefab, this.node);
        newNode.setPosition(pos);
        let bullet = newNode.getComponent('bullet');

        bullet.bulletGroup = this;
        bullet.setIsPlayer(true)
        let hero = this.hero.getComponent('hero');

        bullet.getComponent(cc.Sprite).sizeMode = cc.Sprite.SizeMode.RAW;
        ////子弹
        if (!this.tmp2SpriteFrame) {
            // let tmpSeq = hero._skinSubSeq + 1
            // if (tmpSeq > 5) {
            //     tmpSeq = 5
            // }
            let tmpSeq =  5
            let url = 'bullet/bullet_' + hero._skinKind + "_" + tmpSeq;
            var _this = this;
            cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
                _this.tmp2SpriteFrame = spriteFrame;

                bullet.getComponent(cc.Sprite).spriteFrame = spriteFrame;

                // if (hero._skinSubSeq >= 3 || hero._skinKind == 3) {
                //     if (tmpSeq == 5) {
                //         bullet.getComponent(cc.BoxCollider).size.width = 130
                //     } else {
                //         bullet.getComponent(cc.BoxCollider).size.width = 100
                //     }
                // }
            });
        }

        if (this.tmp2SpriteFrame) {
            bullet.getComponent(cc.Sprite).spriteFrame = this.tmp2SpriteFrame;
        }

        bullet.getComponent(cc.BoxCollider).size.width = 130
       
        return bullet
    },



    creatreLiaojiBullet: function (poolName, prefab, pos) {
        let newNode = poolClass.borrowNewNode(this[poolName], prefab, this.node);
        newNode.setPosition(pos);
        let bullet = newNode.getComponent('bullet');
        bullet.bulletGroup = this;
        bullet.speed = 16;
        bullet.isLiaojiDaoDan = true
        bullet.setIsPlayer(true)
        bullet.getComponent(cc.Sprite).sizeMode = cc.Sprite.SizeMode.RAW;
        bullet.hero = this.hero;

        return bullet
    },
    
    //获取子弹位置
    getPositionOfBullet: function(positionStr){
        let heroP = this.hero.getPosition();
        let newV2_x = heroP.x + this.hero.width *  positionStr //myeval.cal(positionStr);
        let newV2_y = heroP.y;
        return cc.v2(newV2_x, newV2_y);
    },
   

    ////////////////////////////////////////////////////////////////////////////
    enmySendBulletEvent: function (event) {
        if(this.isStopEnemyBullet){
            return;  
        } 

        let enemyInfo = event;
        // let enemy = event.target;
        if (enemyInfo.bossBulletType > 0) {
            if (enemyInfo.bossBulletType == 2) {
                this.enemySendDaoDanBullet(enemyInfo, this.enemyDaoDanBullet)
            } else if (enemyInfo.bossBulletType == 1) {
                this.enemySendDaoDanBullet(enemyInfo, this.enemyBossBullet_1)
            }
        }
        else{
            this.enemySendBullet(enemyInfo);
        }
    },

    enemySendBullet: function (enemyInfo){

        // cc.audioEngine.play(this.bulletSound);
        // cc.audioEngine.play(cc.url.raw("resources/subpack/sound/bullet.mp3"), false, 1)

        // console.log("---------------enemySendBullet: function------", enemyInfo.x, enemyInfo.y);

        let bulletInfo = this.enemyInfiniteBullet;

        let poolName = bulletInfo.name + 'Pool';
        for (let i = 0; i < bulletInfo.position.length; i++) {

            let newNode = poolClass.borrowNewNode(this[poolName], bulletInfo.prefab, this.node);
            
            let newV2_x = enemyInfo.x + myeval.cal(bulletInfo.position[i].positionX);
            let newV2_y = enemyInfo.y;
            newNode.setPosition(cc.v2(newV2_x, newV2_y));
            // console.log("---------------enemySendBullet: function---newNode.x, newNode.y---", newNode.x, newNode.y);
            let bullet = newNode.getComponent('bullet')
            bullet.bulletGroup = this;
            bullet.setIsPlayer(false);
            bullet.speed = enemyInfo.speed * 1.2+50; //子弹 的速度是飞机的 1.2倍
            bullet.attackNum = enemyInfo.attackNum;

            bullet.moveRotation = enemyInfo.rotation
            bullet.getComponent(cc.Sprite).sizeMode = cc.Sprite.SizeMode.RAW;

            
        

            ////子弹
            // enemyInfo.defaultSkin = "anim_res/liaojibullet/liaoji_1"
            if (enemyInfo.defaultSkin) {
                bullet.getComponent(cc.Animation).stop()
                let url = enemyInfo.defaultSkin;

                if (this.bulletObj[url]) {
                    bullet.getComponent(cc.Sprite).spriteFrame = this.bulletObj[url];
                } else {
                    var _this = this;
                    cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
                        _this.bulletObj[url] = spriteFrame
                        bullet.getComponent(cc.Sprite).spriteFrame = _this.bulletObj[url];
                    });
                }
            }else{
                bullet.getComponent(cc.Animation).play()
            }
           

            if (enemyInfo.enemyType == 2 || enemyInfo.enemyType == 3){
                bullet.node.scale = 1.5;
            }else{
                bullet.node.scale = 1;
            }

            /////移动
            if (enemyInfo.stepMovePos) {
                bullet.stopMove = true
                this.ctrlMoveBullet(bullet, enemyInfo)
            }
        }

    },

    ctrlMoveBullet: function (bullet, enemyInfo){

        let callback = function () {
            bullet.stopMove = false
        }

        let act1 = cc.moveTo(0.5, enemyInfo.stepMovePos)
        let act2 = cc.callFunc(callback)
        bullet.node.runAction(cc.sequence(act1, act2))
    },

    enemySendDaoDanBullet: function (enemyInfo, bulletInfo) {
        if(this.isStopEnemyBullet){
          return;  
        } 
      
        // let bulletInfo = this.enemyDaoDanBullet;

        let poolName = bulletInfo.name + 'Pool';
   
        let newNode = poolClass.borrowNewNode(this[poolName], bulletInfo.prefab, this.node);

        let newV2_x = enemyInfo.x /* + myeval.cal(bulletInfo.position[i].positionX) */;
        let newV2_y = enemyInfo.y;
        newNode.setPosition(cc.v2(newV2_x, newV2_y));
        let bullet = newNode.getComponent('bullet')
        bullet.bulletGroup = this;
        bullet.setIsPlayer(false);
        bullet.speed = enemyInfo.speed;
        bullet.attackNum = enemyInfo.attackNum;

        bullet.moveRotation = enemyInfo.rotation
        bullet.getComponent(cc.Sprite).sizeMode = cc.Sprite.SizeMode.RAW;
    },
    

    


    /////
    //敌方导弹
    missileBulletHandler: function (newV2_x, newV2_y) {

        let bulletInfo = this.enemyMissileBullet;
        let poolName = bulletInfo.name + 'Pool';
        let newNode = poolClass.borrowNewNode(this[poolName], bulletInfo.prefab, this.node);
        newNode.setPosition(cc.v2(newV2_x, newV2_y));

        let bullet = newNode.getComponent('bullet')
        bullet.bulletGroup = this;
        bullet.setMoveRotation(180);
        bullet.setIsPlayer(false);
        bullet.speed = 650;
        bullet.attackNum = 100000000;
    },

    //////激光
    sendJiGuangBullet: function () {
        let self = this
        this.stopShootHandler();

        this.node.stopAction(this.jiguangStopAct)
        if (!this.jiguangBulletNow) {
            let bulletInfo = this.jiguangBullet;
            let poolName = bulletInfo.name + 'Pool';

            let newNode = poolClass.borrowNewNode(this[poolName], bulletInfo.prefab, this.node);
            let bullet = newNode.getComponent('bullet')
            bullet.bulletGroup = this;
            bullet.hero = this.hero;
            bullet.isJiGuamg = true;

            bullet.setIsPlayer(true);
            bullet.checkJiGuangSound();

            this.jgBullet = bullet
        }
        this.jiguangBulletNow = true

        let callback = function () {
            self.closeJiGuangBullet()
        }

        let itemCfg = common.getJsonCfgByID("Items",12)
        if (itemCfg) {
           this.jiguangStopAct = this.node.runAction(cc.sequence(cc.delayTime(itemCfg.periodTime), cc.callFunc(callback)))
        }
    },

    closeJiGuangBullet:function(){
        this.jiguangBulletNow = false;
        if (this.jgBullet) {
            this.jgBullet.getComponent('bullet').forceRemove();
        }
        this.startNormalShoot()
        Notification.emit("change_bullet_buff", { item: "item_12" });
    },

    //////
    beattackedHandler:function(ix,iy,scale){
        let attackInfo = this.beAttackedEff;
        let poolName = attackInfo.name + 'Pool';
        let newNode = poolClass.borrowNewNode(this[poolName], attackInfo.prefab, this.node);
        newNode.setPosition(cc.v2(ix, iy));

        let bullet = newNode.getComponent('beattackAni')
        bullet.bulletGroup = this;
        bullet.playEff();
        if (!scale){scale=1;}
        // bullet.node.scale = scale;
    },

    ///////////////////
    liaojiHandler:function(isShow){
        this.liaojiStatus = isShow

        this.callBackFunc = function () {
            this.startLiaojiShoot()
        }

        this.node.stopAction(this.liaojiAction)
        this.liaojiAction = -1;
       
        let delayAction = cc.delayTime(1)
        let callFunc = cc.callFunc(this.callBackFunc, this)
        var repeat = cc.repeatForever(cc.sequence(delayAction, callFunc));
        this.liaojiAction = this.node.runAction(repeat)
    },

    startLiaojiShoot: function () {
        if (!this.liaojiStatus) {
            return
        }

        ////
        let bulletInfo = this.liaojiBullet;
        let hero = this.hero.getComponent('hero');
        let poolName = bulletInfo.name + 'Pool';
        ////
        let pos = this.mainScript.getLiaojiPoint(1)
        let bullet = this.creatreLiaojiBullet(poolName, bulletInfo.prefab, pos)
        bullet.attackNum = hero.attackNum / 2;

        let pos2 = this.mainScript.getLiaojiPoint(2)
        let bullet2 = this.creatreLiaojiBullet(poolName, bulletInfo.prefab, pos2)
        bullet2.attackNum = hero.attackNum / 2;

    },

    getNearEnemyByPos: function (thisPoint) {
       return this.mainScript.getNearEnemyByPos(thisPoint)
    },
    /////////////////////////////
    gameOver:function(){

        this.node.stopAllActions()
        this.isFireStatus = false;
        this.jiguangBulletNow = false;

        Notification.off('send_bullet_event_globle', this.enmySendBulletEvent);
        Notification.off('level_begin_event', this.levelBeginlHandler);
        Notification.off('level_over_event', this.levelOverHandler);
        Notification.off('stop_bullet_event', this.levelOverHandler);
    },

    gamePause: function () {
        this.node.pauseAllActions();
    },

    gameResume: function () {
        this.node.resumeAllActions();
    },
    
    //销毁子弹
    destroyBullet: function (node) {
        // bullet中是由bulletGroup调用，所以当前this为bulletGroup
        poolClass.returnNode(this, node);
    },

    stopEnemyBullet: function(){
        this.isStopEnemyBullet = true;
    },

    resumeEnemyBullet: function(){
        this.isStopEnemyBullet = false;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
