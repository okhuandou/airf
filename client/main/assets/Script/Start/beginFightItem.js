
var common = require('common');
var platformUtils = require('PlatformUtils');

cc.Class({
    extends: cc.Component,

    properties: {
        bg_normal: cc.Sprite,
        bg_choose: cc.Sprite,
        img_icon: cc.Sprite,
        img_star: cc.Sprite,
        img_selected: cc.Sprite,
        txt_name: cc.Label,
        txt_desc: cc.Label,
        txt_cost: cc.Label,

        btn_charge: cc.Sprite,
        btn_share: cc.Sprite,
        upgradFialPrefab: cc.Prefab,

        choose: false,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.bg_normal.node.active = true;
        this.bg_choose.node.active = false;
        this.img_selected.node.active = false;

        this.txt_name.string = "";
        this.txt_desc.string = "";
        this.txt_cost.string = "";

    },

    start () {

    },

    initData: function(data){
        console.log("---------------beginFightItem data : " );
        console.log(data);

        this.cfgData = data;

        this.txt_name.string = String(data.name);
        this.txt_desc.string = String(data.desc);

        if(data.chargeType == 1){ //1:星星购买，2:分享获得
            this.txt_cost.string = String(data.cost);
            this.btn_charge.node.active = true;
            this.btn_share.node.active = false;
        }else if(data.chargeType == 2){
            this.btn_charge.node.active = false;
            this.btn_share.node.active = true;
            this.img_star.node.active = false;
        }

        let _this = this;
        let url = "items/item_" + data.id
        cc.loader.loadRes(url, cc.SpriteFrame, function(err, spriteFrame){
            _this.img_icon.spriteFrame = spriteFrame;
        });
    },

    handleSelected: function(){
        if(this.cfgData.chargeType == 1){ //1:星星购买，2:分享获得
            this.chargeByStar();
        }else if(this.cfgData.chargeType == 2){
            this.chargeByShare();
        }
    },

    chargeByStar: function(){

        let _this = this;
        let onChoose = function(){
            _this.mainScript.onCharge(_this.cfgData.id, _this.cfgData.cost);
            _this.choose = true;
            _this.bg_normal.node.active = false;
            _this.bg_choose.node.active = true;
            _this.img_selected.node.active = true;

            _this.btn_charge.node.active = false;
            _this.img_star.node.active = false;
        }

        if(!this.choose){
            if (this.mainScript.myStarNum - this.mainScript.costStarNum >= this.cfgData.cost){
                onChoose();
            }else{
                //星星不足，跳分享
                // if(this.mainScript.isCanShare){
                //     this.shareCoin(onChoose);
                // }else{
                    // common.sysMessage("您的星星数量不足");
                // }
                let layer = common.showPopUpLayer(this.upgradFialPrefab);
                let script = layer.getComponent("upgradeFail")
                if(script){
                    script.useLabDesc();
                }
            }
        }else{
            this.mainScript.onRemoveCharge(this.cfgData.id, this.cfgData.cost);
            this.bg_normal.node.active = true;
            this.bg_choose.node.active = false;
            this.img_selected.node.active = false;
            this.choose = false;

            this.btn_charge.node.active = true;
            this.img_star.node.active = true;
        }

    },

    chargeByShare: function(){

        let _this = this;
        let onSuccess = function(){
            _this.mainScript.onCharge(_this.cfgData.id, 0);
            _this.bg_normal.node.active = false;
            _this.bg_choose.node.active = true;
            _this.img_selected.node.active = true;
            _this.choose = true;

            _this.btn_share.node.active = false;
        }

        if(!this.choose){
            //分享，视频获得
            this.shareItem(onSuccess);
        }else{
            this.mainScript.onRemoveCharge(this.cfgData.id, 0);
            this.bg_normal.node.active = true;
            this.bg_choose.node.active = false;
            this.img_selected.node.active = false;
            this.choose = false;

            this.btn_share.node.active = true;
        }
    },

    shareCoin: function(callback) {
        let _this = this;
        let cfg = common.getShareCfgByType(D.ShareTypeFriend);
        let title = cfg.title;
        let imageUrl = cfg.imageUrl;
        platformUtils.shareAppMessageCallback(title, imageUrl, "", function(res) {
            if( ! platformUtils.isTodayWxAwardShareBeyond()) {
                common.sysMessage('次数已用完，明天再来！');
                return;
            }
            if(res == true) {
                //奖励金币
                platformUtils.requestAddCoin(D.AwardCoinShare, D.ReasonAddCoinShare, function(res) {
                    //update my coin
                    // Notification.emit('upgradeCoin', res.currCoin);
                    _this.mainScript.myStarNum = _this.mainScript.myStarNum + res.currCoin;
                });
                common.sysMessage('分享获得 '+D.AwardCoinShare+" 星星！");

                if(callback){
                    callback();
                }
                platformUtils.requestBill(100007, 11, 200, 1);
                platformUtils.setTodayWxAwardShare();
            }else {
                platformUtils.requestBill(100007, 11, 200, 0);
            }
        });
    },

    shareItem: function(callback) {
        let _this = this;
        let shareBack = function(res){
            let delay = 0.01;
            _this.scheduleOnce(function(){
                let curTime = Date.now()/1000;
                if(curTime - _this.shareTime < 2.5){
                    common.sysMessage('请分享到不同的群内');
                    return;
                }
                if(res == true) {
                    if(callback){
                        callback();
                    }
                    common.sysMessage('分享获得 '+ _this.cfgData.name);
                }else{
                    common.sysMessage('分享失败');
                }
            },delay);
        }

        let cfg = common.getShareCfgByType(D.ShareTypeFriend);
        let title = cfg.title;
        let imageUrl = cfg.imageUrl;
        
        this.shareTime = Date.now()/1000;
        platformUtils.shareAppMessageCallback(title, imageUrl, "", function(res) {
            shareBack(res);
        });
    },


    // update (dt) {},
});
