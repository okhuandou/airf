var common = require('common');
var sceneManager = require('sceneManager');
var platformUtils = require('PlatformUtils');
var storageUtils = require('StorageUtils');

cc.Class({
    extends: cc.Component,

    properties: {
        labName: cc.Label,
        
        //飞机升级等级展示
        layAirplaneUpgrade1: cc.Layout,
        sprAirplane1: cc.Sprite,
        sprAirplane2: cc.Sprite,
        labUpgradeInfoLevel: cc.Label,

        //飞机升级到最终版本
        layAirplaneUpgradeUltimate: cc.Layout,
        sprAirplaneUltimate: cc.Sprite,

        sprGotoLeft: cc.Sprite,
        sprGotoRigth: cc.Sprite,

        //攻击力信息组件
        labPowerLv: cc.Label,
        labPowerval: cc.Label,
        labBtnPower: cc.Label,
        labPowerNeed: cc.Label,
        btnPower: cc.Button,
        progPower: cc.ProgressBar,

        //攻速度信息组件
        labAttackSpeedLv: cc.Label,
        labAttackSpeedVal: cc.Label,
        labAttackSpeedNeed: cc.Label,
        labBtnAttackSpeed: cc.Label,
        btnAttackSpeed: cc.Button,
        progAttackSpeed: cc.ProgressBar,

        //生命力信息组件
        labBloodLv: cc.Label,
        labBloodVal: cc.Label,
        labBloodNeed: cc.Label,
        labBtnBlood: cc.Label,
        btnBlood: cc.Button,
        progBlood: cc.ProgressBar,

        labBtnDeal: cc.Label,
        sprBtnCzDeal: cc.Sprite,
        sprBtnFxDeal: cc.Sprite,
        sprBtnGzDeal: cc.Sprite,
        sprBtnDailySign: cc.Sprite,
        btnDeal: cc.Button,
        btnVideo: cc.Button,
        btnShare: cc.Button,
        labVideoAward: cc.Label,
        labShareAward: cc.Label,
        //my hero
        currHeroKind: cc.Integer,
        currHeroId: cc.Integer,
        currHeroLv: cc.Integer,
        currHeroIsGot: cc.Boolean,
        currPageIdx: cc.Integer,
        currHeroCfg: null,
        nextHeroLv: cc.Integer,
        //提示
        upgradeFail: {
            default: null,
            type: cc.Prefab,
        },
        prefabFollowAward: cc.Prefab,
        sprPlaneBullet: cc.Sprite,
        sprPlaneBullet1: cc.Sprite,
        sprPlaneBullet2: cc.Sprite,
        planeBulletPrefab1: cc.Prefab,
        planeBulletPrefab2: cc.Prefab,
        btnSound: {
            default: null,
            type: cc.AudioClip
        },
        awardPlaneSound: {
            default: null,
            type: cc.AudioClip
        },
        prefabDailySing: cc.Prefab,
        lab_signplane_descs: cc.Label,
    },

    onLoad:function() {
        
        let _this = this;
        this.btnVideo.node.active = false;
        this.btnShare.node.active = false;
        this.labVideoAward.string = String(D.AwardCoinVideo);
        this.labShareAward.string = String(D.AwardCoinShare);
        platformUtils.requestShareCfg('upgradeVideo', function(res) {
            if( ! res) return;

            if(res){
                _this.btnVideo.node.active = true;
                _this.initVideoState();
            }
        });

        this.lab_signplane_descs.node.active = false;
        //test
        // platformUtils.setItemByLocalStorage('TodayWxVideoCnt', 0);
        // platformUtils.setItemByLocalStorage('UpgradeVideoCount',0);
        // platformUtils.setItemByLocalStorage("UpgradeShareCount",0);
        // platformUtils.setItemByLocalStorage("TodayWxAwardShare",null);
    },

    initVideoState: function(){
        let videCount = storageUtils.upgradeVideoCount();
        if( ! platformUtils.isTodayWxVideoBeyond() || videCount <= 0) {
            //分享
            let _this = this;
            platformUtils.requestShareCfg('upgradeShare', function(res) {
                if(res){
                    _this.btnVideo.node.active = false;
                    let shareCount = storageUtils.upgradeShareCount();
                    if( !platformUtils.isTodayWxAwardShareBeyond() || shareCount <= 0 ){
                        _this.btnShare.node.active = true;
                        _this.btnShare.interactable = false;
                    }else{
                        _this.btnShare.node.active = true;
                    }
                }else{
                    _this.btnVideo.interactable = false;
                }
            });
        }
    },

    load: function(index, heroCfg, heroInfo) {
        console.log('heroInfo', JSON.stringify(heroInfo));
        this.labName.string = heroCfg.name;
        this.currPageIdx = index;

        let mCoin = 0;
        platformUtils.requestGameInfo(function(res) {
           mCoin = res.coin; 
        });

        this.currHeroKind = heroInfo && heroInfo.kind ? heroInfo.kind: heroCfg.kind;
        this.currHeroId = heroInfo && heroInfo.id ? heroInfo.id : heroCfg.id;
        this.currHeroLv = heroInfo && heroInfo.level ? heroInfo.level : 1;
        this.currHeroIsGot = heroInfo && (heroInfo.status == 1 || heroInfo.status == 2) ? true: false;
        this.currHeroCfg = heroCfg;
        this.currHeroIdx = heroCfg.subSeq;
        this.setHeroImgInfo(heroCfg,heroInfo);

        //攻击力
        let powerLv = heroInfo ? heroInfo.powerLevel : 1; 
        this.labPowerLv.string = "Lv" + powerLv;
        let powerNeed = heroCfg.powerNeed + heroCfg.powerNeedIncr*(powerLv - 1);
        this.labPowerNeed.string = powerNeed+"";
        this.labPowerval.string = "["+parseInt(heroCfg.initPower + heroCfg.powerRadix*(powerLv-1))+"]";
        if( ! this.currHeroIsGot || mCoin < powerNeed) {
            this.btnPower.interactable = false;
            this.btnPower.node.children[1].getComponent(cc.LabelOutline).color = new cc.color(104,94,94,255);
        }

        //生命值
        let bloodLv = heroInfo ? heroInfo.bloodLevel: 1;
        this.labBloodLv.string = "Lv" + bloodLv;
        let bloodNeed = heroCfg.bloodNeed + heroCfg.bloodNeedIncr*(bloodLv - 1);
        this.labBloodNeed.string = bloodNeed+"";
        this.labBloodVal.string = "["+parseInt(heroCfg.initBlood+heroCfg.bloodRadix*(bloodLv-1))+"]";
        if( ! this.currHeroIsGot || mCoin < bloodNeed) {
            this.btnBlood.interactable = false;
            this.btnBlood.node.children[1].getComponent(cc.LabelOutline).color = new cc.color(104,94,94,255);
        }

        //攻速
        let attackSpeedLv = heroInfo ? heroInfo.attackSpeedLevel : 1;
        attackSpeedLv = attackSpeedLv > 0 ? attackSpeedLv: 1;
        this.labAttackSpeedLv.string = "Lv" + attackSpeedLv;
        let speedNeed = heroCfg.attackSpeedNeed + heroCfg.attackSpeedNeedIncr*(attackSpeedLv - 1);
        this.labAttackSpeedNeed.string = speedNeed+"";
        this.labAttackSpeedVal.string = "["+(heroCfg.initAttackSpeed + (heroCfg.initAttackSpeed * heroCfg.attackSpeedRadix/100)*attackSpeedLv).toFixed(2)+"]";
        if( ! this.currHeroIsGot || mCoin < speedNeed ) {
            this.btnAttackSpeed.interactable = false;
            this.btnAttackSpeed.node.children[1].getComponent(cc.LabelOutline).color = new cc.color(104,94,94,255);
        }

        //未解锁时，获取方式
        if(this.currHeroIsGot) {
            // this.labBtnDeal.string = "出战";
            this.sprBtnCzDeal.node.opacity = 255;//显示出战
            this.sprBtnFxDeal.node.opacity = 0;//隐藏分享
            this.sprBtnGzDeal.node.opacity = 0;//隐藏关注
            this.sprBtnDailySign.node.opacity = 0;//隐藏签到
        }
        else {
            let str = "";
            switch(heroCfg.access) {
                case 1://购买
                str = heroCfg.accessParam+"购买";
                //this.btnDeal.getComponent(cc.LabelOutline).color = new cc.color(104,94,94,255);
                
                let _this = this;
                platformUtils.requestGameInfo(function(res) {
                    if(res.coin < heroCfg.accessParam) {
                        _this.btnDeal.interactable = false;
                    }
                });
                this.sprBtnCzDeal.node.opacity = 0;//隐藏出战
                this.sprBtnFxDeal.node.opacity = 0;//隐藏分享
                this.sprBtnGzDeal.node.opacity = 0;//隐藏关注
                this.sprBtnDailySign.node.opacity = 0;
                break;
                case 2://分享解锁
                this.sprBtnCzDeal.node.opacity = 0;//隐藏出战
                this.sprBtnFxDeal.node.opacity = 255;//显示分享
                this.sprBtnGzDeal.node.opacity = 0;//隐藏关注
                this.sprBtnDailySign.node.opacity = 0;
                break;
                case 3://关注解锁
                this.sprBtnCzDeal.node.opacity = 0;//隐藏出战
                this.sprBtnFxDeal.node.opacity = 0;//隐藏分享
                this.sprBtnGzDeal.node.opacity = 255;//显示关注
                this.sprBtnDailySign.node.opacity = 0;
                break;
                case 4://签到分享解锁
                this.sprBtnCzDeal.node.opacity = 0;//隐藏出战
                this.sprBtnFxDeal.node.opacity = 0;//隐藏分享
                this.sprBtnGzDeal.node.opacity = 0;//显示关注
                this.sprBtnDailySign.node.opacity = 255;
                break;
            }
            this.labBtnDeal.string = str;
        }
        console.log('add page item====' + heroCfg.name);
    },

    onDeal: function() {
        this.onBtnSound();
        if(this.currHeroIsGot) {
            //出战

            let _this = this;
            let callback = function(){
                platformUtils.requestUpdateFightStatus(_this.currHeroKind, function(res) {
               
                });
                cc.audioEngine.stop(D.commonState.hallAudioID);
                D.commonState.hallAudioID = 0;
                Notification.off('upgradeCoin', _this.pageMain.onListenCoinChange);
                platformUtils.hideWxLayer();//牵制关闭游戏圈
                // 转场
                // sceneManager.loadScene('Tmp');
                let cname = !sceneManager.isLoadedGame ? 'Tmp' : 'Game'
                sceneManager.loadScene(cname);
            }
            
            cc.loader.loadRes("prefabs/beginFight", function(err,prefab){
                let layer = common.showPopUpLayer(prefab);
                let script = layer.getComponent("beginFight");
                if(script){
                    script.setCallBack(callback,_this.currHeroKind,_this.currHeroKind);
                }
            });
            
        }
        else {

            switch(this.currHeroCfg.access) {
                case 1:
                //消耗星星解锁
                let _this = this;
                platformUtils.requestNewHeroUseCoin(this.currHeroKind, function(res) {
                    if(res.hero) {
                        let hero = res.hero;
                        _this.currHeroId = hero.id;
                        _this.currHeroIdx = hero.subSeq;
                        _this.currHeroIsGot = true;
                        _this.currHeroKind = hero.kind;
                        _this.currHeroLv = hero.level;
                        let herosCfg = common.getJsonCfgs('hero');
                        herosCfg.forEach(element => {
                            if(hero.kind == element.kind && hero.id == element.id) {
                                _this.currHeroCfg = element;
                            }
                        });
                        _this.labBtnDeal.string = "";
                        _this.sprBtnCzDeal.node.opacity = 255;//显示出战
                        _this.sprBtnFxDeal.node.opacity = 0;//隐藏分享
                        _this.btnDeal.interactable = true;
                        _this.btnPower.interactable = true;
                        _this.btnBlood.interactable = true;
                        _this.btnAttackSpeed.interactable = true;
                        _this.btnPower.node.children[1].getComponent(cc.LabelOutline).color = new cc.color(189,106,21,255);
                        _this.btnBlood.node.children[1].getComponent(cc.LabelOutline).color = new cc.color(189,106,21,255);
                        _this.btnAttackSpeed.node.children[1].getComponent(cc.LabelOutline).color = new cc.color(189,106,21,255);
                        _this.onAwardPlaneSound();
                    }
                });
                break;
                case 2:
                //分享解锁
                let cfg = common.getShareCfgByType(D.ShareTypeFriend);
                let title = cfg.title;
                let imageUrl = cfg.imageUrl;
                // let fromKey = platformUtils.getUserSkey();                
                let fromUserId = platformUtils.getUserId();
                platformUtils.shareAppMessage(title, imageUrl, "type=shareUnlock&fromUserId="+fromUserId);
                this.btnPower.interactable = true;
                this.btnBlood.interactable = true;
                this.btnAttackSpeed.interactable = true;
                this.btnPower.node.children[1].getComponent(cc.LabelOutline).color = new cc.color(189,106,21,255);
                this.btnBlood.node.children[1].getComponent(cc.LabelOutline).color = new cc.color(189,106,21,255);
                this.btnAttackSpeed.node.children[1].getComponent(cc.LabelOutline).color = new cc.color(189,106,21,255);
                this.onAwardPlaneSound();
                break;
                case 3://关注解锁
                common.showPopUpLayer(this.prefabFollowAward);
                this.btnPower.interactable = true;
                this.btnBlood.interactable = true;
                this.btnAttackSpeed.interactable = true;
                this.btnPower.node.children[1].getComponent(cc.LabelOutline).color = new cc.color(189,106,21,255);
                this.btnBlood.node.children[1].getComponent(cc.LabelOutline).color = new cc.color(189,106,21,255);
                this.btnAttackSpeed.node.children[1].getComponent(cc.LabelOutline).color = new cc.color(189,106,21,255);
                this.onAwardPlaneSound();
                break;
                case 4://签到/新手礼包解锁
                common.showPopUpLayer(this.prefabDailySing);
                this.btnPower.interactable = true;
                this.btnBlood.interactable = true;
                this.btnAttackSpeed.interactable = true;
                this.btnPower.node.children[1].getComponent(cc.LabelOutline).color = new cc.color(189,106,21,255);
                this.btnBlood.node.children[1].getComponent(cc.LabelOutline).color = new cc.color(189,106,21,255);
                this.btnAttackSpeed.node.children[1].getComponent(cc.LabelOutline).color = new cc.color(189,106,21,255);
                this.onAwardPlaneSound();
                break;
            }
        }
    },

    setHeroImgInfo: function(heroCfgParam,heroInfoParam) {
        //next level hero id?
        if(heroCfgParam.status == 2){
            D.currHero = heroCfgParam;
        }
        let nextIdOfKind = this.currHeroId;
        let nextLvOfKind = this.currHeroLv;
        let nextHeroCfg = null;
        let currHeroCfg = null;
        let herosCfg = common.getJsonCfgs('hero');
        let minKindOfAll = 100000000;
        let maxKindOfAll = 0;
        herosCfg.forEach(heroCfg => {
            if(this.currHeroId == heroCfg.id) {
                currHeroCfg = heroCfg;
            }
            if(heroCfg.kind == this.currHeroKind && heroCfg.id > nextIdOfKind && nextIdOfKind <= this.currHeroId) {
                nextIdOfKind = heroCfg.id;
                nextLvOfKind = heroCfg.level;
                nextHeroCfg = heroCfg;
            }
            if(heroCfg.kind < minKindOfAll) {
                minKindOfAll = heroCfg.kind;
            }
            if(heroCfg.kind > maxKindOfAll) {
                maxKindOfAll = heroCfg.kind;
            }
        });
        this.currHeroIdx = currHeroCfg.subSeq;
        let isUltimate = this.currHeroId == nextIdOfKind || currHeroCfg.kind == 4; //最高级别 (签到小飞机默认最高形态)
        this.layAirplaneUpgradeUltimate.node.active = isUltimate;
        this.layAirplaneUpgrade1.node.active = ! isUltimate;

        //飞机移动动画
        let attackSpeedLevel =  heroCfgParam.initAttackSpeed + (heroCfgParam.attackSpeedRadix/100)*((heroInfoParam ? heroInfoParam.attackSpeedLevel : 1)-1);
        let sprPlane1Y = this.sprAirplane1.node.y;
        let sprPlane2Y = this.sprAirplane2.node.y;
        let sprPlaneMaxY = this.sprAirplaneUltimate.node.y;
        let moveUp1 = cc.moveTo(2, cc.v2(this.sprAirplane1.node.x, sprPlane1Y+10));
        let moveDown1 = cc.moveTo(2, cc.v2(this.sprAirplane1.node.x, sprPlane1Y-10));

        let moveUp2 = cc.moveTo(2, cc.v2(this.sprAirplane2.node.x, sprPlane2Y+10));
        let moveDown2 = cc.moveTo(2, cc.v2(this.sprAirplane2.node.x, sprPlane2Y-10));
        
        let moveUpMax = cc.moveTo(2, cc.v2(this.sprAirplaneUltimate.node.x, sprPlaneMaxY+10));
        let moveDownMax = cc.moveTo(2, cc.v2(this.sprAirplaneUltimate.node.x, sprPlaneMaxY-10));

        let movePlane1 = cc.repeatForever(cc.sequence(moveUp1,moveDown1));
        let movePlane2 = cc.repeatForever(cc.sequence(moveUp2,moveDown2));
        let movePlaneMax = cc.repeatForever(cc.sequence(moveUpMax,moveDownMax));

        //重置动作
        this.sprAirplaneUltimate.node.stopAllActions();
        this.sprAirplane1.node.stopAllActions();
        this.sprAirplane2.node.stopAllActions();

        if(isUltimate) {
            this.layAirplaneUpgradeUltimate.node.opacity = 255;
            var _this = this;
            let url = "plane/plane_"+this.currHeroKind+ "_" + this.currHeroIdx;
            console.log(isUltimate + "," + url);

            //签到小飞机
            if(currHeroCfg.kind == 4){
                this.labName.node.getComponent(cc.Widget).left = 290;
                this.labUpgradeInfoLevel.string = '';

                this.layAirplaneUpgradeUltimate.node.getChildByName("lab_desc2").active = false;
                this.layAirplaneUpgradeUltimate.node.getChildByName("spr_high_level").active = false;
                this.sprAirplaneUltimate.node.x = 0;
                this.sprPlaneBullet.node.x = 0;
                this.labName.node.getComponent(cc.Widget).left = 290;
                this.labUpgradeInfoLevel.string = '';
                moveUpMax = cc.moveTo(2, cc.v2(this.sprAirplaneUltimate.node.x, sprPlaneMaxY+10));
                moveDownMax = cc.moveTo(2, cc.v2(this.sprAirplaneUltimate.node.x, sprPlaneMaxY-10));
                movePlaneMax = cc.repeatForever(cc.sequence(moveUpMax,moveDownMax));

                this.onPlaneBullet(this.currHeroKind,this.currHeroIdx,attackSpeedLevel,0,-10,this.sprPlaneBullet,this.planeBulletPrefab1);
                
                // if(this.currHeroIsGot){
                //     this.lab_signplane_descs.node.active = false;
                // }else{
                //     this.layAirplaneUpgradeUltimate.node.getChildByName("spr_high_level").active = false;
                //     this.layAirplaneUpgradeUltimate.node.getChildByName("lab_desc2").active = false;
                // }
            }else{
                // this.lab_signplane_descs.node.active = false;
                this.onPlaneBullet(this.currHeroKind,this.currHeroIdx,attackSpeedLevel,125,-10,this.sprPlaneBullet,this.planeBulletPrefab1);
            }

            // this.onPlaneBullet(this.currHeroKind,this.currHeroIdx,attackSpeedLevel,125,-10,this.sprPlaneBullet,this.planeBulletPrefab1);
            cc.loader.loadRes(url, cc.SpriteFrame, function(err, spriteFrame) {
                _this.sprAirplaneUltimate.spriteFrame = spriteFrame;
                _this.sprAirplaneUltimate.node.runAction(movePlaneMax);
            });
        }
        else {
            //飞机1子弹
            this.onPlaneBullet(this.currHeroKind,this.currHeroIdx,attackSpeedLevel,132,30,this.sprPlaneBullet1,this.planeBulletPrefab1);
            //飞机2子弹
            this.onPlaneBullet(nextHeroCfg.kind,nextHeroCfg.subSeq,attackSpeedLevel,-90,0,this.sprPlaneBullet2,this.planeBulletPrefab2);

            var _this = this;
            let url = "plane/plane_"+this.currHeroKind+ "_" + this.currHeroIdx;
            console.log(url);
            cc.loader.loadRes(url, cc.SpriteFrame, function(err, spriteFrame) {
                _this.sprAirplane1.spriteFrame = spriteFrame;
                _this.sprAirplane1.node.runAction(movePlane1);
            });
            url = "plane/plane_"+this.currHeroKind+ "_" + (this.currHeroIdx+1);
            cc.loader.loadRes(url, cc.SpriteFrame, function(err, spriteFrame) {
                _this.sprAirplane2.spriteFrame = spriteFrame;
                _this.sprAirplane2.node.runAction(movePlane2);
            });
            this.nextHeroLv = nextLvOfKind;
            this.labUpgradeInfoLevel.string = '( 进阶需全属性等级达到: Lv' + nextLvOfKind + ' )';

            // this.labPowerBaseVal1.string = currHeroCfg.powerRadix;
            // this.labBloodBaseval1.string = currHeroCfg.bloodRadix;
            // this.labAttackSpeedBaseVal1.string = String(currHeroCfg.attackSpeedRadix+'%');
            // this.labPowerBaseVal2.string = nextHeroCfg.powerRadix;
            // this.labBloodBaseval2.string = nextHeroCfg.bloodRadix;
            // this.labAttackSpeedBaseVal2.string = String(nextHeroCfg.attackSpeedRadix+'%');
        }

        //切页箭头设置
        this.sprGotoLeft.node.active = true;
        this.sprGotoRigth.node.active = true;
        if(minKindOfAll == this.currHeroKind) {
            this.sprGotoLeft.node.active = false;
            this.sprGotoRigth.node.active = true;
        } 
        else if(maxKindOfAll == this.currHeroKind) {
            this.sprGotoLeft.node.active = true;
            this.sprGotoRigth.node.active = false;
        }

    },
    onUpgradePower: function() {
        this.onBtnSound();
        //TODO 请求升级攻击力
        
        // let nextHeroLv = this.nextHeroLv;
        // if(this.labPowerLv.string == nextHeroLv && this.labBloodLv.string < nextHeroLv || 
        //     this.labPowerLv.string == nextHeroLv && this.labAttackSpeedLv.string < nextHeroLv){
        //     common.sysMessage("先进阶战机后升级");
        //     return ;
        // }
        var _this = this;
        platformUtils.requestHeroUpgrade(this.currHeroKind, 1, function(res) {
            if(res == 2010){
                common.showPopUpLayer(_this.upgradeFail);
                return;
            }
            let hero = res.hero;
            
            let powerLv = hero.powerLevel;
            let newHeroId = hero.id;
            let newHeroLv = hero.level;
            let newUpgradeAdd = 1;
            let newMyCoin = res.myCoin;
            let heroCfg = _this.currHeroCfg;
            if(_this.currHeroId != newHeroId) {
                let herosCfg = common.getJsonCfgs('hero');
                herosCfg.forEach(element => {
                    if(hero.kind == element.kind && hero.id == element.id) {
                        heroCfg = element;
                    }
                });
                
                _this.currHeroId = newHeroId;
                _this.currHeroLv = newHeroLv;
                _this.setHeroImgInfo(heroCfg,_this.pageMain.herosData[heroCfg.kind]);
            }

            //update power info
            _this.labPowerLv.string = "Lv"+powerLv;
            _this.labPowerNeed.string = (heroCfg.powerNeed + heroCfg.powerNeed*(powerLv - 1))+"";
            _this.labPowerval.string = "["+parseInt(heroCfg.initPower + heroCfg.powerRadix*(powerLv-1))+"]";
            //_this.labBtnPower.string = String(newUpgradeAdd);
    
            //update my coin
            Notification.emit('upgradeCoin', newMyCoin);

            common.sysMessage("升级成功", null,cc.v2(0,100))
        });
    },

    onUpgradeBlood: function() {
        this.onBtnSound();
        //TODO 请求升级血量

        // let nextHeroLv = this.nextHeroLv;
        // if(this.labBloodLv.string == nextHeroLv && this.labPowerLv.string < nextHeroLv || 
        //     this.labBloodLv.string == nextHeroLv && this.labAttackSpeedLv.string < nextHeroLv){
        //     common.sysMessage("先进阶战机后升级");
        //     return ;
        // }
        var _this = this;
        platformUtils.requestHeroUpgrade(this.currHeroKind, 2, function(res) {
            if(res == 2010){
                // common.showPopUpLayer(_this.upgradeFail);
                common.sysMessage("金币不足", null,cc.v2(0, 100))
                return;
            }
            let hero = res.hero;

            let bloodLv = hero.bloodLevel;
            let newHeroId = hero.id;
            let newHeroLv = hero.level;
            let newUpgradeAdd = 1;
            let newMyCoin = res.myCoin;
            let heroCfg = _this.currHeroCfg;
            //update hero
            if(_this.currHeroId != newHeroId) {
                let herosCfg = common.getJsonCfgs('hero');
                herosCfg.forEach(element => {
                    if(hero.kind == element.kind && hero.id == element.id) {
                        heroCfg = element;
                    }
                });

                _this.currHeroId = newHeroId;
                _this.currHeroLv = newHeroLv;
                _this.setHeroImgInfo(heroCfg,_this.pageMain.herosData[heroCfg.kind]);
            }
    
            //update blood info
            _this.labBloodLv.string = "Lv"+bloodLv;
            _this.labBloodNeed.string = (heroCfg.bloodNeed + heroCfg.bloodNeed*(bloodLv - 1))+"";
            _this.labBloodVal.string = "["+parseInt(heroCfg.initBlood+heroCfg.bloodRadix*(bloodLv-1))+"]";
            //_this.labBtnBlood.string = String(newUpgradeAdd);
        
            //update my coin
            Notification.emit('upgradeCoin', newMyCoin);



            common.sysMessage("升级成功", null,cc.v2(0, 100))
            
        });       
    },

    onUpgradeAttackSpeed: function() {
        this.onBtnSound();
        //TODO 请求升级射速

        // let nextHeroLv = this.nextHeroLv;
        // if(this.labAttackSpeedLv.string == nextHeroLv && this.labPowerLv.string < nextHeroLv || 
        //     this.labAttackSpeedLv.string == nextHeroLv && this.labBloodLv.string < nextHeroLv){
        //     common.sysMessage("先进阶战机后升级");
        //     return ;
        // }
        var _this = this;
        platformUtils.requestHeroUpgrade(this.currHeroKind, 3, function(res) {
            if(res == 2010){
                common.showPopUpLayer(_this.upgradeFail);
                return;
            }
            let hero = res.hero;

            let attackSpeedLv = hero.attackSpeedLevel;
            let newHeroId = hero.id;
            let newHeroLv = hero.level;
            let newUpgradeAdd = 1;
            let newMyCoin = res.myCoin;
            let heroCfg = _this.currHeroCfg;
            //update hero
            if(_this.currHeroId != newHeroId) {
                let herosCfg = common.getJsonCfgs('hero');
                herosCfg.forEach(element => {
                    if(hero.kind == element.kind && hero.id == element.id) {
                        heroCfg = element;
                    }
                });

                _this.currHeroId = newHeroId;
                _this.currHeroLv = newHeroLv;
                _this.setHeroImgInfo(heroCfg,_this.pageMain.herosData[heroCfg.kind]);
            }

            //update attack speed info
            _this.labAttackSpeedLv.string = "Lv"+attackSpeedLv;
            _this.labAttackSpeedNeed.string = (heroCfg.attackSpeedNeed + heroCfg.attackSpeedNeed * (attackSpeedLv -1)) +"";
            _this.labAttackSpeedVal.string = "["+(heroCfg.initAttackSpeed + (heroCfg.initAttackSpeed * heroCfg.attackSpeedRadix/100)*attackSpeedLv).toFixed(2)+"]";
            //_this.labBtnAttackSpeed.string = String(newUpgradeAdd);

            //update my coin
            Notification.emit('upgradeCoin', newMyCoin);
            
            common.sysMessage("升级成功",null, cc.v2(0, 100))
        });   
    },

    gotoLeft: function() {
        this.onBtnSound();
        this.pageMain.gotoPageByIndex(this.currPageIdx - 1);
    },
    gotoRight: function() {
        this.onBtnSound();
        this.pageMain.gotoPageByIndex(this.currPageIdx + 1);
    },
    onRewardedVideoAd: function() {
        this.onBtnSound();

        let count = storageUtils.upgradeVideoCount()
        if( ! platformUtils.isTodayWxVideoBeyond() || count <= 0) {
            common.sysMessage('次数已用完，明天再来！');
            return;
        }
        let _this = this;
        platformUtils.createRewardedVideoAd('shengji', function(res) {
            console.log('createRewardedVideoAd', res);
            // if(res == -1){
            //     common.sysMessage("当前没有可观看的视频");
            //     return ;
            // }
            //视频回调获得奖励
            platformUtils.requestAddCoin(D.AwardCoinVideo, D.ReasonAddCoinVideo, function(res) {
                //update my coin
                Notification.emit('upgradeCoin', res.currCoin);
            });
            common.sysMessage('恭喜获得 '+D.AwardCoinVideo+" 星星！");
            platformUtils.setTodayWxVideo();
            platformUtils.setItemByLocalStorage("UpgradeVideoCount",platformUtils.getItemByLocalStorage("UpgradeVideoCount",0)+1);
            platformUtils.setItemByLocalStorage('TodayUpgradeVideoDate',new Date());
            _this.initVideoState();
        });
    },
    onBackMain: function() {
        this.onBtnSound();
        this.pageMain.onBackMain();
    },
    gotoShareAward: function() {
        this.onBtnSound();
        this.pageMain.gotoShareAward();
    },
    /**
     * 发射飞机弹道
     * skinKind：kind
     * skinLevel:lvIdx
     * offsetX: x偏移量
     * offsetY: y偏移量
     * attackSpeedLevel:攻速
     * sprPlaneBullet: 飞机子弹sprite
     * planeBulletPrefab: 子弹prefab
     */
    onPlaneBullet:function(skinKind,skinLevel,attackSpeedLevel,offsetX,offsetY,sprPlaneBullet,planeBulletPrefab){
        /* let planeBulPre = cc.instantiate(planeBulletPrefab.data);
        let url = 'bullet/bullet_' + skinKind + "_" + skinLevel;
        this.startShoot = function () {
            let pos = cc.v2(sprPlaneBullet.node.x+offsetX, sprPlaneBullet.node.y+offsetY);
            // let newNode = cc.instantiate(planeBulletPrefab.data);
            let newNode = cc.instantiate(planeBulPre);
            sprPlaneBullet.node.addChild(newNode);
            newNode.setPosition(pos);
        }
        if (attackSpeedLevel > 20) {
            attackSpeedLevel = 20;
        }

        let delayAction = cc.delayTime(1 / attackSpeedLevel);
        let callFunc = cc.callFunc(this.startShoot, this);
        let repeat = cc.repeatForever(cc.sequence(delayAction, callFunc));
        let _this = this;
        cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
            // planeBulletPrefab.data.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            planeBulPre.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            sprPlaneBullet.node.runAction(repeat);
        }); */
        
        if (skinKind >= 2) {
            if (skinKind == 2) {
                attackSpeedLevel = 8
            }
            else if (skinKind == 3){
                attackSpeedLevel = 1.3
            } else if (skinKind == 4) {
                attackSpeedLevel = 5
            }
            // let attackSpeedLevel = 5
            this.startShoot = function () {
                this.onPlaneBullet2(skinKind, skinLevel, attackSpeedLevel, offsetX, offsetY, sprPlaneBullet, planeBulletPrefab)
            }

           
            let delayAction = cc.delayTime(1 / attackSpeedLevel);
            let callFunc = cc.callFunc(this.startShoot, this);
            let repeat = cc.repeatForever(cc.sequence(delayAction, callFunc));
            sprPlaneBullet.node.stopAllActions();
            sprPlaneBullet.node.runAction(repeat);
        } else {
            this.onPlaneBullet1(skinKind, skinLevel, attackSpeedLevel, offsetX, offsetY, sprPlaneBullet, planeBulletPrefab)
        }
    },

    onPlaneBullet1: function (skinKind, skinLevel, attackSpeedLevel, offsetX, offsetY, sprPlaneBullet, planeBulletPrefab) {
        let planeBulPre = cc.instantiate(planeBulletPrefab.data);
        let url = 'bullet/bullet_' + skinKind + "_" + skinLevel;
        this.startShoot = function () {
            let pos = cc.v2(sprPlaneBullet.node.x + offsetX, sprPlaneBullet.node.y + offsetY);
            // let newNode = cc.instantiate(planeBulletPrefab.data);
            let newNode = cc.instantiate(planeBulPre);
            sprPlaneBullet.node.addChild(newNode);
            newNode.setPosition(pos);
            newNode.setScale(0.8,0.8)
            newNode.moveRotation = 0
        }
        if (attackSpeedLevel > 20) {
            attackSpeedLevel = 20;
        }
        attackSpeedLevel = 2
        let delayAction = cc.delayTime(1 / attackSpeedLevel);
        let callFunc = cc.callFunc(this.startShoot, this);
        let repeat = cc.repeatForever(cc.sequence(delayAction, callFunc));
        let _this = this;
        cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
            // planeBulletPrefab.data.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            planeBulPre.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            sprPlaneBullet.node.runAction(repeat);
        });
    },
    onPlaneBullet2: function (skinKind, skinLevel, attackSpeedLevel, offsetX, offsetY, sprPlaneBullet, planeBulletPrefab) {
        if (skinKind == 3) {
            this.startShoot_3(skinKind, skinLevel, attackSpeedLevel, offsetX, offsetY, sprPlaneBullet, planeBulletPrefab)
        }
        else if (skinKind == 4) {
            this.startShoot_4(skinKind, skinLevel, attackSpeedLevel, offsetX, offsetY, sprPlaneBullet, planeBulletPrefab)
        }
        else{
            this.startShoot_2(skinKind, skinLevel, attackSpeedLevel, offsetX, offsetY, sprPlaneBullet, planeBulletPrefab)
        }
    },
    //////////////////////////////////////////////////
    startShoot_2: function (skinKind, skinLevel, attackSpeedLevel, offsetX, offsetY, sprPlaneBullet, planeBulletPrefab) {
        if (!sprPlaneBullet.shootCount) {
            sprPlaneBullet.shootCount = 0
        }

        if (skinLevel == 5) {
            if (sprPlaneBullet.shootCount % 2 == 0) {
                this.makeNewBullet(1, -15, -30, -50, "bullet/bullet_new_2_1", offsetX, offsetY,  sprPlaneBullet, planeBulletPrefab);
                this.makeNewBullet(1, 0, -15, -50, "bullet/bullet_new_2_1", offsetX, offsetY,  sprPlaneBullet, planeBulletPrefab);
                this.makeNewBullet(1, 0, 15, -50, "bullet/bullet_new_2_1", offsetX, offsetY,  sprPlaneBullet, planeBulletPrefab);
                this.makeNewBullet(1, 15, 30, -50, "bullet/bullet_new_2_1", offsetX, offsetY,  sprPlaneBullet, planeBulletPrefab);
            } else {
                this.makeNewBullet(1, 0, -15, -50, "bullet/bullet_new_2_2", offsetX, offsetY,  sprPlaneBullet, planeBulletPrefab);
                this.makeNewBullet(1, 0, 15, -50, "bullet/bullet_new_2_2", offsetX, offsetY,  sprPlaneBullet, planeBulletPrefab);
            }
            this.makeNewBullet(2, 0, 0, -50, "bullet/bullet_new_2_4", offsetX, offsetY,  sprPlaneBullet, planeBulletPrefab);

        } else if (skinLevel == 1) {
            this.makeNewBullet(1, -5, 0, -50, "bullet/bullet_new_2_1", offsetX, offsetY,  sprPlaneBullet, planeBulletPrefab);
            this.makeNewBullet(1, 5, 0, -50, "bullet/bullet_new_2_1", offsetX, offsetY,  sprPlaneBullet, planeBulletPrefab);

        } else if (skinLevel == 2) {
            if (sprPlaneBullet.shootCount % 2 == 0) {
                this.makeNewBullet(1, -10, -30, -50, "bullet/bullet_new_2_1", offsetX, offsetY,  sprPlaneBullet, planeBulletPrefab);
                this.makeNewBullet(1, 0, 0, -50, "bullet/bullet_new_2_1", offsetX, offsetY,  sprPlaneBullet, planeBulletPrefab);
                this.makeNewBullet(1, 10, 30, -50, "bullet/bullet_new_2_1", offsetX, offsetY,  sprPlaneBullet, planeBulletPrefab);
            } else {
                this.makeNewBullet(1, 0, 0, -50, "bullet/bullet_new_2_2", offsetX, offsetY,  sprPlaneBullet, planeBulletPrefab);
            }

        } else if (skinLevel == 3) {
            if (sprPlaneBullet.shootCount % 2 == 0) {
                this.makeNewBullet(1, -15, -30, -50, "bullet/bullet_new_2_1", offsetX, offsetY,  sprPlaneBullet, planeBulletPrefab);
                this.makeNewBullet(1, 0, -15, -50, "bullet/bullet_new_2_1", offsetX, offsetY,  sprPlaneBullet, planeBulletPrefab);
                this.makeNewBullet(1, 0, 15, -50, "bullet/bullet_new_2_1", offsetX, offsetY,  sprPlaneBullet, planeBulletPrefab);
                this.makeNewBullet(1, 15, 30, -50, "bullet/bullet_new_2_1", offsetX, offsetY,  sprPlaneBullet, planeBulletPrefab);
            } else {
                this.makeNewBullet(1, 0, -15, -50, "bullet/bullet_new_2_2", offsetX, offsetY,  sprPlaneBullet, planeBulletPrefab);
                this.makeNewBullet(1, 0, 15, -50, "bullet/bullet_new_2_2", offsetX, offsetY,  sprPlaneBullet, planeBulletPrefab);
            }

        } else if (skinLevel == 4) {
            if (sprPlaneBullet.shootCount % 2 == 0) {
                this.makeNewBullet(1, -15, -30, -50, "bullet/bullet_new_2_1", offsetX, offsetY,  sprPlaneBullet, planeBulletPrefab);
                this.makeNewBullet(1, 0, -15, -50, "bullet/bullet_new_2_1", offsetX, offsetY,  sprPlaneBullet, planeBulletPrefab);
                this.makeNewBullet(1, 0, 15, -50, "bullet/bullet_new_2_1", offsetX, offsetY,  sprPlaneBullet, planeBulletPrefab);
                this.makeNewBullet(1, 15, 30, -50, "bullet/bullet_new_2_1", offsetX, offsetY,  sprPlaneBullet, planeBulletPrefab);
            } else {
                this.makeNewBullet(1, 0, -15, -50, "bullet/bullet_new_2_2", offsetX, offsetY,  sprPlaneBullet, planeBulletPrefab);
                this.makeNewBullet(1, 0, 15, -50, "bullet/bullet_new_2_2", offsetX, offsetY,  sprPlaneBullet, planeBulletPrefab);
            }
            this.makeNewBullet(1, 0, 0, -50, "bullet/bullet_new_2_3", offsetX, offsetY,  sprPlaneBullet, planeBulletPrefab);
        }

        sprPlaneBullet.shootCount++
    },

    startShoot_3: function (skinKind, skinLevel, attackSpeedLevel, offsetX, offsetY, sprPlaneBullet, planeBulletPrefab) {

        if (!sprPlaneBullet.shootCount) {
            sprPlaneBullet.shootCount = 0
        }

        let self = this
        let sendCirBullet = function (offX = 0, offY = 0, rotation = 0) {
            offX = offX / 2
            offY = (offY-50) / 2
            
            let num = 10
            let perNum = 360 / num
            let R = 30
            for (var i = 0; i < num; i++) {
                var hd = (Math.PI / 180) * perNum * i;
                let targetX = R * Math.cos(hd)
                let targetY = R * Math.sin(hd)
                if (hd % Math.PI == 0) {
                    targetY = 0
                }

                self.makeNewBullet(1, rotation, targetX + offX, targetY + offY, "bullet/bullet_new_3_1", offsetX, offsetY, sprPlaneBullet, planeBulletPrefab, 800);
            }
        }

        let sendDaoBullet = function (offX = 0, offY = 0, rotation = 0, tt = 0.5) {

            offX = offX /2
            offY = (offY - 50) / 2

            let bullet = self.makeNewBullet(1, rotation, 0, -30, "bullet/bullet_new_3_2", offsetX, offsetY, sprPlaneBullet, planeBulletPrefab, 800);
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

        sprPlaneBullet.shootCount++
    },

    startShoot_4: function (skinKind, skinLevel, attackSpeedLevel, offsetX, offsetY, sprPlaneBullet, planeBulletPrefab) {

        if (!sprPlaneBullet.shootCount) {
            sprPlaneBullet.shootCount = 0
        }

        if (!sprPlaneBullet.ddddd) {
            sprPlaneBullet.ddddd = 1
            sprPlaneBullet.shootCount = 0
        }

        sprPlaneBullet.shootCount += sprPlaneBullet.ddddd
        if (sprPlaneBullet.shootCount >= 10) {
            sprPlaneBullet.ddddd = -1
            sprPlaneBullet.shootCount = 10
        } else if (sprPlaneBullet.shootCount < 0) {
            sprPlaneBullet.ddddd = 1
            sprPlaneBullet.shootCount = 0
        }

        let d = sprPlaneBullet.shootCount
        let dis = 3 * d
        this.makeNewBullet(1, 0, -25 - 1 * dis, -50, "bullet/bullet_new_4_1", offsetX, offsetY, sprPlaneBullet, planeBulletPrefab, 800);
        this.makeNewBullet(1, 0, -1 * dis, -50, "bullet/bullet_new_4_2", offsetX, offsetY, sprPlaneBullet, planeBulletPrefab, 800);
        this.makeNewBullet(1, 0, 25 + dis, -50, "bullet/bullet_new_4_1", offsetX, offsetY, sprPlaneBullet, planeBulletPrefab, 800);
        this.makeNewBullet(1, 0, dis, -50, "bullet/bullet_new_4_2", offsetX, offsetY, sprPlaneBullet, planeBulletPrefab, 800);
    },
    // 生成子弹
    makeNewBullet: function (attackTimesNum = 1, rotation = 0, offX = 0, offY = 0, url = null, offsetX = 0, offsetY = 0, sprPlaneBullet, planeBulletPrefab, moveSpeed = 1500) {
        // let pos = cc.v2(this.sprPlane.node.x, this.sprPlane.node.y - 40);
        let pos = cc.v2(sprPlaneBullet.node.x + offsetX, sprPlaneBullet.node.y + offsetY);
        pos.y = pos.y + 50
        // let poolName = planeBulPrefab.data.name + 'Pool';
        let bullet = this.creatreBullet(pos, url, sprPlaneBullet, planeBulletPrefab)
        bullet.x += offX;
        bullet.y += offY;
        bullet.moveSpeed = moveSpeed;

        bullet.moveRotation = rotation
        return bullet
    },

    creatreBullet: function (pos, url, sprPlaneBullet, planeBulletPrefab) {
        // let newNode = poolClass.borrowNewNode(this[poolName], this.planeBulPrefab.data, this.planeBulSpr.node);
        // newNode.setPosition(pos);

        let planeBulPre = cc.instantiate(planeBulletPrefab.data);
        let newNode = cc.instantiate(planeBulPre);
        sprPlaneBullet.node.addChild(newNode);
        newNode.setPosition(pos);
        newNode.setScale(0.5)
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
    update: function(dt){
        let speed = 120;

        let rmAry = new Array()
        //弹道1
        this.sprPlaneBullet1.node.children.forEach(element =>{
            if(element.name == 'planeBullet'){
                let totalBulletY = this.sprAirplane1.node.y + 150;
                if(element.y > totalBulletY){
                    // this.sprPlaneBullet1.node.removeChild(element);
                    rmAry.push(element)
                }else{
                    // element.y +=  speed * dt;

                    let R = dt * speed;
                    let ly = R * Math.cos(Math.PI / 180 * element.moveRotation)
                    let lx = R * Math.sin(Math.PI / 180 * element.moveRotation)

                    element.rotation = element.moveRotation;
                    element.x += lx;
                    element.y += ly;
                }
            }
        })
        //弹道2
        this.sprPlaneBullet2.node.children.forEach(element =>{
            if(element.name == 'planeBullet'){
                let totalBulletY = this.sprAirplane2.node.y + 150;
                if(element.y > totalBulletY){
                    // this.sprPlaneBullet2.node.removeChild(element);
                    rmAry.push(element)
                }else{
                    // element.y +=  speed * dt;
                    let R = dt * speed;
                    let ly = R * Math.cos(Math.PI / 180 * element.moveRotation)
                    let lx = R * Math.sin(Math.PI / 180 * element.moveRotation)

                    element.rotation = element.moveRotation;
                    element.x += lx;
                    element.y += ly;
                }
            }
        })
        //顶级弹道
        this.sprPlaneBullet.node.children.forEach(element =>{
            if(element.name == 'planeBullet'){
                let totalBulletY = this.sprAirplane2.node.y + 200;
                if(element.y > totalBulletY){
                    // this.sprPlaneBullet.node.removeChild(element);
                    rmAry.push(element)
                }else{
                    // element.y +=  speed * dt;
                    let R = dt * speed;
                    let ly = R * Math.cos(Math.PI / 180 * element.moveRotation)
                    let lx = R * Math.sin(Math.PI / 180 * element.moveRotation)

                    element.rotation = element.moveRotation;
                    element.x += lx;
                    element.y += ly;

                }
            }
        })

        for (let index = 0; index < rmAry.length; index++) {
            const element = rmAry[index];
            element.removeFromParent()
            // this.planeBulSpr.node.removeChild(element);
        }
    },
    //按钮声音
    onBtnSound: function(){
        if( ! D.isVoideClose){
            cc.audioEngine.play(this.btnSound);
        }
    },
    onAwardPlaneSound: function(){
        if( ! D.isVoideClose){
            cc.audioEngine.play(this.awardPlaneSound);
        }
    },

    onShare: function() {
        let cfg = common.getShareCfgByType(D.ShareTypeFriend);
        let title = cfg.title;
        let imageUrl = cfg.imageUrl;
        let _this = this;
        platformUtils.shareAppMessageCallback(title, imageUrl, "", function(res) {
            if( ! platformUtils.isTodayWxAwardShareBeyond()) {
                common.sysMessage('次数已用完，明天再来！');
                return;
            }
            if(res == true) {
                //奖励金币
                platformUtils.requestAddCoin(D.AwardCoinShare, D.ReasonAddCoinShare, function(res) {
                    //update my coin
                    Notification.emit('upgradeCoin', res.currCoin);
                });
                common.sysMessage('分享获得 '+D.AwardCoinShare+" 星星！");
                platformUtils.requestBill(100007, 10, 200, 1);
                platformUtils.setTodayWxAwardShare();

                platformUtils.setItemByLocalStorage("UpgradeShareCount",platformUtils.getItemByLocalStorage("UpgradeShareCount",0)+1);
                platformUtils.setItemByLocalStorage('TodayUpgradeShareDate',new Date());
                _this.initVideoState();
            }
            else {
                platformUtils.requestBill(100007, 10, 200, 0);
            }
        });
    },
});
