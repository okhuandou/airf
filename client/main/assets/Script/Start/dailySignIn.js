var common = require('common');
var sceneManager = require('sceneManager');
var platformUtils = require('PlatformUtils');
var storageUtils = require('StorageUtils');

cc.Class({
    extends: cc.Component,

    properties: {
        sprSignIn: cc.Sprite,
        btnSound: {
            default: null,
            type: cc.AudioClip
        },
        awardCoinSound: {
            default: null,
            type: cc.AudioClip
        },
        sprShareDouble: cc.Sprite,
        btnShareDouble: cc.Button,
        sprShareBottom: cc.Sprite,
        btn_close: cc.Button,

        isSignedDay3: false,
        isSignedDay7: false,
    },

    onLoad (){
        // console.log("D.commonState.userGameInfo.signNum="+D.commonState.userGameInfo.signNum)
        let _this = this;
        //初始化隐藏
        this.sprSignIn.node.active = false;
        platformUtils.requestSignList(function(res){
            D.commonState.signCfg = res;
            D.commonState.userGameInfo.signNum = res.signNum;
            D.commonState.userGameInfo.todayCanSign = res.todayCanSign;

            _this.loadSign(res);
        });
        
        this.setDoubleVisible(false);
        platformUtils.requestShareCfg('signDouble', function(res) {
            let isVideoed = storageUtils.dailySignIsVideoed();
            if(res == 'v' && platformUtils.isTodayWxVideoBeyond() && !isVideoed) {
                _this.setDoubleVisible(true);
                _this.sprShareDouble.node.stopAllActions();
                _this.sprShareDouble.node.runAction(cc.repeat(cc.sequence(cc.scaleTo(0.5, 0.7), cc.delayTime(0.5), cc.scaleTo(0.5, 0.6)), 100));
            }
        });

        platformUtils.requestItemList(function(res){
            if(res){
                res.forEach(val => {
                    if(val.id == ItemConst.SignHeroGas){ //尾气
                        _this.isSignedDay3 = true;
                    }
                });
            }
        });

        if(D.commonState.heroList) {
            for(let i=0; i<D.commonState.heroList.length; i++) {
                let element = D.commonState.heroList[i];
                if(element.kind == 4) {
                    this.isSignedDay7 = true;
                    break;
                }
            }
        }

        // this.isSignedDay3 = true;
        // this.isSignedDay7 = true;

        if(!this.isSignedDay7){
            cc.loader.loadRes("game/qiandao_day7_plane_1", cc.SpriteFrame, function(err,spriteFrame){
                let icon = _this.sprSignIn.node.children[6].children[0];
                if(icon){
                    icon.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                }
            });
        }

        
    },

    start: function(){
        //广告
        let closeWidget = this.btn_close.node.getComponent(cc.Widget);
        // if(closeWidget){
        //     let offset = Device.needOffsetPixel() ? 200 : 100;
        //     closeWidget.bottom -= offset;
        //     this.btn_close.node.runAction(cc.sequence(cc.delayTime(1),cc.callFunc(function(){
        //         platformUtils.createBannerAd(true); 
        //         closeWidget.bottom += offset;
        //     },this)));
        // }

        platformUtils.createBannerAd(true); 
    },

    // state, 1:未可签, 2:已签， 3：可签
    signNormal: function(element, state, starNum){
        if(state == 1){    //未可签
            element.children[1].active = false//黄色 side
            element.children[2].active = true//蓝色 side
            element.children[3].active = false// light
            element.children[4].active = false//已领取
            element.children[5].color = new cc.Color(18,52,103,255);
            element.children[5].getComponent(cc.LabelOutline).color = new cc.Color(18,52,103,255);
            element.children[6].color = new cc.Color(18,52,103,255);
            element.children[6].getComponent(cc.LabelOutline).color = new cc.Color(18,52,103,255);
            element.children[7].color = new cc.Color(18,52,103,255);
            element.children[7].getComponent(cc.LabelOutline).color = new cc.Color(18,52,103,255);
            element.children[8]._components[0].string = starNum;
        }else if(state == 2){  //2:已签
            element.children[1].active = false//黄色 side
            element.children[2].active = true//蓝色 side
            element.children[3].active = false// light
            element.children[4].active = true//已领取
            element.children[5].color = new cc.Color(18,52,103,255);
            element.children[5].getComponent(cc.LabelOutline).color = new cc.Color(18,52,103,255);
            element.children[6].color = new cc.Color(18,52,103,255);
            element.children[6].getComponent(cc.LabelOutline).color = new cc.Color(18,52,103,255);
            element.children[7].color = new cc.Color(18,52,103,255);
            element.children[7].getComponent(cc.LabelOutline).color = new cc.Color(18,52,103,255);
            element.children[8].active = false

        }else if(state == 3){ //可签到
            element.children[1].active = true//黄色 side
            element.children[2].active = false//蓝色 side
            element.children[3].active = true// light
            element.children[4].active = false//已领取
            element.children[5].color = new cc.Color(116,48,24,255);
            element.children[5].getComponent(cc.LabelOutline).color = new cc.Color(116,48,24,255);
            element.children[6].color = new cc.Color(116,48,24,255);
            element.children[6].getComponent(cc.LabelOutline).color = new cc.Color(116,48,24,255);
            element.children[7].color = new cc.Color(116,48,24,255);
            element.children[7].getComponent(cc.LabelOutline).color = new cc.Color(116,48,24,255);
            element.children[8]._components[0].string = starNum;
        }
        element.state = state;
    },

    // state, 1:未可签, 2:已签， 3：可签
    signDay3: function(element, state, starNum){
        starNum = starNum != null ? starNum : "";
        if(this.isSignedDay3){

            element.children[4].active = false
            element.children[9]._components[0].string = starNum;
            element.children[10].active = true
        }else{
            element.children[4].active = true
            element.children[9]._components[0].string = "特殊尾气"
            element.children[10].active = false
        }
        
        if(state == 1){    //未可签
            element.children[1].active = false
            element.children[2].active = true
            element.children[3].active = false
            element.children[5].active = false
            element.children[6].color = new cc.Color(18,52,103,255);
            element.children[6].getComponent(cc.LabelOutline).color = new cc.Color(18,52,103,255);
            element.children[7].color = new cc.Color(18,52,103,255);
            element.children[7].getComponent(cc.LabelOutline).color = new cc.Color(18,52,103,255);
            element.children[8].color = new cc.Color(18,52,103,255);
            element.children[8].getComponent(cc.LabelOutline).color = new cc.Color(18,52,103,255);
            element.children[9].active = true
        }else if(state == 2){  //2:已签
            element.children[1].active = false
            element.children[2].active = true
            element.children[3].active = false
            element.children[5].active = true
            element.children[6].color = new cc.Color(18,52,103,255);
            element.children[6].getComponent(cc.LabelOutline).color = new cc.Color(18,52,103,255);
            element.children[7].color = new cc.Color(18,52,103,255);
            element.children[7].getComponent(cc.LabelOutline).color = new cc.Color(18,52,103,255);
            element.children[8].color = new cc.Color(18,52,103,255);
            element.children[8].getComponent(cc.LabelOutline).color = new cc.Color(18,52,103,255);
            element.children[9].active = false
        }else if(state == 3){ //可签到
            element.children[1].active = true
            element.children[2].active = false
            element.children[3].active = true
            element.children[5].active = false
            element.children[6].color = new cc.Color(116,48,24,255);
            element.children[6].getComponent(cc.LabelOutline).color = new cc.Color(116,48,24,255);
            element.children[7].color = new cc.Color(116,48,24,255);
            element.children[7].getComponent(cc.LabelOutline).color = new cc.Color(116,48,24,255);
            element.children[8].color = new cc.Color(116,48,24,255);
            element.children[8].getComponent(cc.LabelOutline).color = new cc.Color(116,48,24,255);
            element.children[9].active = true

            if(!this.isSignedDay3){
                this.setDoubleVisible(false);
            }
        }

        element.state = state;
    },

    // state, 1:未可签, 2:已签， 3：可签
    signDay7: function(element, state){
        if(state == 1 || state == 2){  //2:已签
            element.children[1].active = false
            element.children[2].active = true
            element.children[3].active = false
            element.children[4].color = new cc.Color(18,52,103,255);
            element.children[4].getComponent(cc.LabelOutline).color = new cc.Color(18,52,103,255);
            element.children[5].color = new cc.Color(18,52,103,255);
            element.children[5].getComponent(cc.LabelOutline).color = new cc.Color(18,52,103,255);
            element.children[6].color = new cc.Color(18,52,103,255);
            element.children[6].getComponent(cc.LabelOutline).color = new cc.Color(18,52,103,255);

            // element.children[0].getComponent(cc.Sprite).setState(1);
            element.stopAllActions();
            element.scale = 1;
        }else if(state == 3){ //可签到
            element.children[1].active = true
            element.children[2].active = false
            element.children[3].active = true
            element.children[4].color = new cc.Color(116,48,24,255);
            element.children[4].getComponent(cc.LabelOutline).color = new cc.Color(116,48,24,255);
            element.children[5].color = new cc.Color(116,48,24,255);
            element.children[5].getComponent(cc.LabelOutline).color = new cc.Color(116,48,24,255);
            element.children[6].color = new cc.Color(116,48,24,255);
            element.children[6].getComponent(cc.LabelOutline).color = new cc.Color(116,48,24,255);

            // let url = this.isSignedDay7 ? "game/qiandao_day7_2" : "game/qiandao_day7_plane_2";
            // cc.loader.loadRes(url, cc.SpriteFrame, function(err,spriteFrame){
            //     element.children[0].getComponent(cc.Sprite).spriteFrame = spriteFrame;
            // });

            if(!this.isSignedDay7){
                this.setDoubleVisible(false);
            }

            element.stopAllActions();
            element.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.5,1.05),cc.scaleTo(0.5,1))));
        }

        element.state = state;
    },

    loadSign: function(res){
        //今日可领取高亮
        
        let flag = true;
        let _this = this;
        this.sprSignIn.node.children.forEach((element,idx) => {
            if(res.sign[idx] == undefined){
                return false; //跳过当前项
            }
            //1:未可签, 2:已签， 3：可签
            let state = 1;
            if(res.sign[idx].sign){
                state = 2;
            }else if(res.todayCanSign && flag){
                state = 3;
                flag = false;
                platformUtils.setItemByLocalStorage('signCoin',res.sign[idx].signCfg.itemNum);
            }else{
                state = 1;
            }

            if(idx == 2){
                _this.signDay3(element,state,res.sign[idx].signCfg.itemNum);
            }else if(idx == 6){
                _this.signDay7(element,state);
            }else{
                _this.signNormal(element,state, res.sign[idx].signCfg.itemNum);
            }
        });
        this.sprSignIn.node.active = true;
    },
    // 签到
    onSignIn: function(event){
        // if(true){ //test
        //     this.reward(null,0);
        //     return;
        // }

        this.onBtnSound();
        let _this = this;
        if(event.target.state == 1 || event.target.state == 3){  

            if(D.commonState.userGameInfo.todayCanSign){
                let signnum = D.commonState.userGameInfo.signNum+1;
                console.log("==== ===D.commonState.userGameInfo.signNum="+D.commonState.userGameInfo.signNum);
                platformUtils.requestSignIn(signnum,function(res){
                    _this.reward(res,res.coin);
                    D.commonState.userGameInfo.todayCanSign = false;
                });
            }else{
                common.sysMessage('今日已签到,请明日再来!');
            }
        }else{
            common.sysMessage('不能重复签到领取!');
        }
    },
    onClose: function(){
        this.closeLayer();
    },

    onBtnSound: function(){
        if( ! D.isVoideClose){
            cc.audioEngine.play(this.btnSound);
        }
    },
    onAwardCoinSound: function(){
        if( ! D.isVoideClose){
            cc.audioEngine.play(this.awardCoinSound);
        }
    },

    setDoubleVisible: function(visible){
        if(visible){
            this.btnShareDouble.node.active = true;
            this.sprShareDouble.node.active = true;
            this.sprShareBottom.node.active = true;
        }else{
            this.btnShareDouble.node.active = false;
            this.sprShareDouble.node.active = false;
            this.sprShareBottom.node.active = false;
        }
    },

    onShare: function(){
        // if(true){ //test
        //     this.reward(null,0);
        //     return;
        // }

        if(storageUtils.dailySignIsVideoed()){
            common.sysMessage('不能多次领取!');
            return;
        }

        let awardCoin = platformUtils.getItemByLocalStorage('signCoin');
        if(awardCoin == undefined){
            platformUtils.requestSignList(function(res){
                let index = D.commonState.userGameInfo.signNum > 0 ? D.commonState.userGameInfo.signNum - 1 : 0;
                awardCoin = res.sign[index].signCfg.itemNum
            });
        }

        if(D.commonState.userGameInfo.todayCanSign){
            awardCoin = awardCoin * 2;
        }
        console.log("======= awardCoin="+awardCoin);

        platformUtils.requestBill(100008, 6, 200, 0);
        this.onBtnSound(); 
        let _this = this;
        let setState = function(){
            platformUtils.requestAddCoin(awardCoin,D.ReasonAddCoinShare,function(){});
            platformUtils.requestBill(100008, 6, 200, 1);
            //红点
            cc.director.getScene().getChildByName('Canvas').getChildByName('btn_sign').getChildByName('spr_red_point').active = false;
            _this.closeLayer();
        }

        platformUtils.createRewardedVideoAd('dailysign', function() {
            platformUtils.setItemByLocalStorage('TodaySignVideoDate', new Date());
            platformUtils.setItemByLocalStorage("SignVideoSigned",true);

            if(!D.commonState.userGameInfo.todayCanSign){
                common.sysMessage('恭喜获得, '+awardCoin+'星星!');
                setState();
            }else{
                D.commonState.userGameInfo.todayCanSign = false;
                //签到
                platformUtils.requestSignIn(D.commonState.userGameInfo.signNum+1,function(res){   
                    _this.reward(res, awardCoin);
                    setState();
                });
            }

            _this.btnShareDouble.node.stopAllActions();
            _this.setDoubleVisible(false);

        });

    },

    reward: function(res, awardCoin){
        try{
            let idx = D.commonState.userGameInfo.signNum;
            let element = this.sprSignIn.node.children[idx];
            if(element){
                if(idx == 2){
                    this.signDay3(element,2);
                }else if(idx == 6){
                    this.signDay7(element,2);
                }else{
                    this.signNormal(element,2)
                }
            }
        }catch(e){

        }

        D.commonState.userGameInfo.signNum = D.commonState.userGameInfo.signNum + 1;
        this.onAwardCoinSound();

        console.log("sign get award ....")
        console.log(res);
        if(!this.isSignedDay3 && res.items && res.items.length > 0){
            if(res.items[0].id == ItemConst.SignHeroGas){
                common.sysMessage('恭喜您获得飞机拖尾！');
            }else if(res.items[0].id == ItemConst.SignNewPlane){
                common.sysMessage('恭喜您获得小飞机！');
                D.commonState.heroList = null;
                platformUtils.requestHeroList(function(res){});
            }
            
            platformUtils.requestItemList(function(res){

            }, true);
        }else{
            D.commonState.userGameInfo.coin += awardCoin;
            common.sysMessage('恭喜获得, '+awardCoin+'星星!');
        }
    },

    // start () {},

    // update (dt) {},

    setCallback: function(callback){
        this.callback = callback;
    },

    closeLayer: function(){
        common.removePopUpLayer(this);
        if(this.callback){
            this.callback();
        }
    },
});
