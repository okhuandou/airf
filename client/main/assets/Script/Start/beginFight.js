
var common = require('common');
var sceneManager = require('sceneManager');
var platformUtils = require('PlatformUtils');

cc.Class({
    extends: cc.Component,

    properties: {
        txtStar: cc.Label,
        btn_close: cc.Button,
        
        btn_start: cc.Button,
        scroll_view:{
            type:cc.ScrollView,
            default:null,
        },

        spr_plane: cc.Sprite,
        btn_left: cc.Button,
        btn_right: cc.Button,
        spr_eff: cc.Sprite,

        myStarNum: 0,
        costStarNum: 0,
        isCanShare: false,

        chargedItems: [],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
        this.scroll_view.bounceDuration = 0.5;

        let _this = this;
        platformUtils.requestGameInfo(function(res) {
           _this.myStarNum = res.coin; 
           _this.txtStar.string = String(res.coin);
        });

        platformUtils.requestShareCfg('beginFightShare', function(res) {
            if(res == 's') {
                //隐藏
                _this.isCanShare = true;
            }
        });

        if(D.commonState.heroList.length < 2){
            this.btn_left.node.active = false;
            this.btn_right.node.active = false;
        }

        this.spr_eff.node.runAction(cc.repeatForever(cc.rotateBy(2,360)));

        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        Notification.on('upgradeCoin', this.onCoinChange, this);

        // this.chargedItems.push(14);
         
    },

    start () {
        this.createItems();
    },

    createItems: function(){
        let config = common.getJsonCfgs("beginFight");

        let _this = this;
        let content = this.scroll_view.content;
        let addItem = function(prefab){
            if(config == null) return;

            let cntHeight = 0;
            for (var i = 0; i < config.length; i++) {

                let info = config[i];
                let canShare = (info.chargeType == 2 && _this.isCanShare);
                if(info.chargeType == 1 || canShare){
                    let itemLayer = cc.instantiate(prefab);
                    content.addChild(itemLayer);

                    cntHeight += 17;
                    itemLayer.position = cc.v2(0,-cntHeight);
                    cntHeight += itemLayer.height;

                    let script = itemLayer.getComponent("beginFightItem");
                    if(script && config[i]){
                       script.mainScript = _this; 
                       script.initData(info)
                    }
                }
            }

            content.height = cntHeight > content.height ? cntHeight : content.height;
        }

        cc.loader.loadRes("prefabs/beginFightItem", function(err, prefab){
            addItem(prefab);
        });
    },


    onCharge: function(id,cost){
        this.costStarNum += cost;
        this.txtStar.string = String(this.myStarNum - this.costStarNum);

        var isHave = this.chargedItems.some(function(value) {
            return value == id;
        }); 
        if (!isHave){
            this.chargedItems.push(id);
        }
    },

    onRemoveCharge: function(id,cost){
        this.costStarNum -= cost;
        this.txtStar.string = String(this.myStarNum - this.costStarNum);

        var newArr = this.chargedItems.filter(function(value, index) {
            return value != id;
        }); 
        this.chargedItems = newArr;
    },

    handleBtnClose: function(prefab){
        common.removePopUpLayer(this);
    },

    handleBtnStart: function(){

        if(this.costStarNum > 0){
            platformUtils.requestAddCoin(-this.costStarNum, D.ReasonCostCoinFight, function(res) {
                //update my coin
                // Notification.emit('upgradeCoin', res.currCoin);
            });
        }

        D.beginFightBuffs = this.chargedItems;

        if(this.callback){
            let curHero = D.commonState.heroList[this.currSHowHeroIdx];
            if(curHero){
                D.currHero = curHero;
            }
            this.callback();
        }
        common.removePopUpLayer(this);
    },

    // update (dt) {},

    onDestroy: function(){
        this.callback = null;
        Notification.off('upgradeCoin', this.onCoinChange);
    },

    setCallBack: function(callback,curHeroKind,curHeroIdx){
        this.callback = callback;

        let _this = this;
        if (D.commonState.heroList) {
            for (let i = 0; i < D.commonState.heroList.length; i++) {
                let element = D.commonState.heroList[i];
                if (element.kind == curHeroKind) {
                    this.currSHowHeroIdx = i;
                    break;
                }
            }
        }
        this.checkShowHero();
    },

    onBtnLeft: function(){
        this.currSHowHeroIdx++;
        this.checkShowHero()
    },

    onBtnRight: function(){
        this.currSHowHeroIdx--;
        this.checkShowHero()
    },

    onTouchEnd: function(event){
        let touchDelta = event.touch.getDelta()

        let startPos = event.touch._startPoint
        let endPos = event.touch._point
        let disX = endPos.x - startPos.x
        if (disX > 0 && Math.abs(disX) > 100) {
            ///向左
            this.currSHowHeroIdx --
        } else if (disX < 0 && Math.abs(disX) > 100) {
            ///向右
            this.currSHowHeroIdx ++
        }
        else{
            return
        }

        this.checkShowHero()
    },

    checkShowHero: function(){
        if(this.currSHowHeroIdx > D.commonState.heroList.length - 1){
            this.currSHowHeroIdx = 0;
        }else if(this.currSHowHeroIdx < 0){
            this.currSHowHeroIdx = D.commonState.heroList.length - 1;
        }

        let currSHowHero = D.commonState.heroList[this.currSHowHeroIdx];
        ////////////////
        let url = "plane/plane_"+currSHowHero.kind+ "_" + currSHowHero.subSeq;
        let _this = this;
        cc.loader.loadRes(url, cc.SpriteFrame, function(err, spriteFrame) {
            _this.spr_plane.spriteFrame = spriteFrame;
        });
    },

    onCoinChange: function(){
        let _this = this;
        platformUtils.requestGameInfo(function(res) {
            _this.myStarNum = res.coin; 
            _this.txtStar.string = String(_this.myStarNum - _this.costStarNum);
         });
    },

});
