var platformUtils = require('PlatformUtils');
var common = require('common');
var timeUtils = require('TimeUtils');
var sceneManager = require('sceneManager');

cc.Class({
    extends: cc.Component,

    properties: {

        btnSound: {
            default: null,
            type: cc.AudioClip
        },
        node_result: cc.Node,
        spr_result_eff: cc.Sprite,
        lab_result_score: cc.Label,
        lab_score_ower: cc.Label,
        
        node_challenger: cc.Node,
        spr_plane_clg: cc.Sprite,
        spr_head_clg: cc.Sprite,
        lab_name_clg: cc.Label,
        lab_score_clg: cc.Label,
        spr_score_clg: cc.Sprite,

        node_sender: cc.Node,
        spr_plane: cc.Sprite,
        spr_head_snd: cc.Sprite,
        lab_name: cc.Label,
        lab_score: cc.Label,
        lab_star_desc: cc.Label,
        lab_star: cc.Label,

        lab_time: cc.Label,
        lab_no_battler: cc.Label,

        btn_battle: cc.Button,
        lab_battle: cc.Label,

        scrollview: cc.ScrollView,
        pfb_battle_item: cc.Prefab,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node_result.active = false;
        this.lab_no_battler.node.active = false;
        this.spr_plane_clg.node.active = false;
        this.spr_plane.node.active = false;
        this.lab_score_clg.string = "";
        this.lab_score.string = "";
        this.lab_star.string = "x0";
    },

    // start () {},

    // update (dt) {},

    // onDestroy: function(){},

    requestData: function(fromUserId, isResult){
        this.battleFromUserId = fromUserId;
        this.isResult = isResult;

        let _this = this;
        platformUtils.requestBattleList(fromUserId, function(res){
            if(res){
                _this.initData(res);
                _this.initView(res);
            }
        });
    },

    initData: function(res){
        let mUserId = platformUtils.getUserId();
        this.ower = null;
        this.sender = null;
        this.isSender = res.userId == mUserId;
        if(!res.items || res.items.length == 0) return;

        let isWin = res.master == mUserId;
        for (let index = 0; index < res.items.length; index++) {
            let element = res.items[index];
            if(element.userId == res.userId){
                this.sender = element;
            }
            if(this.isResult && isWin){
                if((this.ower == null || this.ower.score < element.score) && element.userId != mUserId){
                    this.ower = element;
                }
            }else{
                if(this.ower == null || this.ower.score < element.score){
                    this.ower = element;
                }
            }
            
            if(!this.isSender && this.isResult && mUserId == element.userId && D.commonState.gameScore == element.score){
                common.sysMessage("恭喜您获得" + element.award + "金币");
            }
        }
    },

    initView: function(data){
        console.log("------------ battleLayer initView, data=",data);
        let hasRecord = data.items && data.items.length > 0;
        if(hasRecord){
            this.initRecordList(data.items);
            this.lab_no_battler.node.active = false;
        }else{
            this.lab_no_battler.node.active = true;
        }

         //倒计时
         this.countTime = data.remainSec ? data.remainSec : 0;
         if(this.countTime > 0){
             let act1 = cc.delayTime(1.0);
             let act2 = cc.callFunc(this.countDown,this);
             this.lab_time.node.stopAllActions();
             this.lab_time.node.runAction(cc.repeatForever(cc.sequence(act1,act2)));
             this.lab_time.string = "有效挑战时间剩余："+timeUtils.secondsToHMS(this.countTime);
         }

        if(this.isSender){
            if(hasRecord && this.countTime > 0){
                this.lab_battle.string = "发起挑战";
                this.battleType = 1;
            }else{
                if(this.sender.awardGot == 0){
                    this.lab_battle.string = "领取奖励";
                    this.battleType = 3;
                }else{
                    this.lab_battle.string = "开始游戏";
                    this.battleType = 2;
                }
            }
        }else{
            let txt = this.isResult ? "再次挑战" : "立即挑战";
            this.lab_battle.string = txt;
            this.battleType = 2;
        }

        let _this = this;
        //擂主
        if(this.isResult){ //结算，屏蔽擂主信息
            this.node_result.active = true;
            this.node_challenger.active = false;
            this.lab_result_score.string = D.commonState.gameScore;
            this.lab_score_ower.string = this.ower && this.ower.score ? this.ower.score : "";
            this.spr_result_eff.node.stopAllActions();
            this.spr_result_eff.node.runAction(cc.repeatForever(cc.rotateBy(3,360)));
        }else{
            this.node_result.active = false;
            this.node_challenger.active = true;

            if(hasRecord){
                let avatarUrl = this.ower.headimg;
                if(avatarUrl && avatarUrl.length != ""){
                    cc.loader.load({url: avatarUrl, type: 'png'}, function(error, tex){
                        _this.spr_head_clg.spriteFrame = new cc.SpriteFrame(tex);
                    });
                }
                
                this.lab_name_clg.string = this.ower.name ? this.ower.name : "";
                this.lab_score_clg.string = this.ower.score ? this.ower.score : "";
                let hKind = this.ower.heroKind ? this.ower.heroKind : 1; 
                let hSeq = this.ower.heroSeq ? this.ower.heroSeq : 1; 
                let p_url = "plane/plane_"+ hKind +"_" + hSeq
                cc.loader.loadRes(p_url, cc.SpriteFrame, function(err,spriteFrame){
                    _this.spr_plane_clg.node.active = true;
                    _this.spr_plane_clg.spriteFrame = spriteFrame;
                });
            }else{
                this.lab_name_clg.node.active = false;
                this.lab_score_clg.node.active = false;
                this.spr_head_clg.node.active = false;
                this.spr_score_clg.node.active = false;
                this.spr_plane_clg.node.active = false;
            }
        }
        //发起人
        if(this.sender){
            //挑战者
            let heroKind = this.sender.heroKind ? this.sender.heroKind : 1; 
            let heroSeq = this.sender.heroSeq ? this.sender.heroSeq : 1; 
            let plane_url = "plane/plane_"+ heroKind +"_" + heroSeq
            cc.loader.loadRes(plane_url, cc.SpriteFrame, function(err,spriteFrame){
                _this.spr_plane.node.active = true;
                _this.spr_plane.spriteFrame = spriteFrame;
            });
            let avatarUrl = this.sender.headimg;
            if(avatarUrl && avatarUrl != ""){
                cc.loader.load({url: avatarUrl, type: 'png'}, function(error, tex){
                    _this.spr_head_snd.spriteFrame = new cc.SpriteFrame(tex);
                });
            }
            
            this.lab_name.string = this.sender.name ? this.sender.name : "";
            this.lab_score.string = this.sender.score ? this.sender.score : "";
            let award = this.sender.award ? this.sender.award : 0;
            this.lab_star.string = "x" + award;
        }else{
            this.spr_plane.node.active = false;
            this.lab_name.string = "";
            this.lab_score.string = "暂无分数.";
            this.lab_star.string = "x0";
        }
    },

    countDown: function(){
        this.countTime -= 1;
        this.lab_time.string = "有效挑战时间剩余："+timeUtils.secondsToHMS(this.countTime);
        if(this.countTime <= 0){
            this.lab_time.node.stopAllActions();
            this.lab_time.string = "有效挑战时间剩余：00:00:00"
            if(this.isSender){
                this.lab_battle.string = "领取奖励";
                this.battleType = 3;
            }else{
                this.btn_battle.interactable = false;
            }
            common.sysMessage("挑战已过期");
        }
    },

    initRecordList: function(list){
        let content = this.scrollview.content;
        for (let i = 0; i < list.length; i++) {
            let data = list[i];
            if(data.userId != this.sender.userId){
                let layer = cc.instantiate(this.pfb_battle_item);
                let script = layer.getComponent("battleItem");
                if(script){
                    script.initWithData(data);
                }
                content.addChild(layer);
            }
        }
    },

    onBtnSound: function(){
        if( ! D.isVoideClose){
            cc.audioEngine.play(this.btnSound);
        }
    },

    onBtnBackMain: function(){
        this.onBtnSound();
        if(sceneManager.curSceneName == "Game"){
            sceneManager.loadScene('Start');
            D.commonState.isBattle = false;
            D.commonState.battleFromUserId = 0;
        }else{
            common.removePopUpLayer(this);
        }
    },

    onBtnBattle: function(){
        this.onBtnSound();

        if(this.isResult && this.countTime > 0 & !this.isSender){
            this.battleAgain();
            return;
        }

        //1:发起挑战  2：立即挑战  3:领取奖励
        if(this.battleType == 1){
            this.gotoShare();
        }else if(this.battleType == 2){
            this.gotoBattle();
        }else if(this.battleType == 3){
            this.gotoReceive();
        }
    },

    gotoReceive: function(){
        let _this = this;
        platformUtils.requestBattleRecv(function(res){
            common.receiveAward(res);
            _this.lab_battle.string = "开始游戏";
            _this.battleType = 2;
        });
    },

    gotoBattle: function(){
        let _this = this;
        let callback = function(){
            platformUtils.requestBill(100002, 2, 200);
            if (!D.isVoideClose) {
                cc.audioEngine.stop(D.commonState.hallAudioID);
                D.commonState.hallAudioID = 0;
            }
            let cname = !sceneManager.isLoadedGame ? 'Tmp' : 'Game'
            sceneManager.loadScene(cname);
            D.commonState.isBattle = true;
            D.commonState.battleFromUserId = _this.battleFromUserId;
        }

        cc.loader.loadRes("prefabs/beginFight", function(err,prefab){
            let layer = common.showPopUpLayer(prefab);
            let script = layer.getComponent("beginFight");
            if(script){
                script.setCallBack(callback,D.currHero.kind);
            }
        });
    },

    battleAgain: function(){
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
            platformUtils.requestBill(100006, 4, 200);
            sceneManager.loadScene('Tmp');
            D.commonState.isBattle = true;
            D.commonState.battleFromUserId = _this.battleFromUserId;
        }

        cc.loader.loadRes("prefabs/beginFight", function(err,prefab){
            let layer = common.showPopUpLayer(prefab);
            let script = layer.getComponent("beginFight");
            if(script){
                script.setCallBack(callback,D.currHero.kind);
            }
        });
    },

    gotoShare: function(){
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
    },

});
