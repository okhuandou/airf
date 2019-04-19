
var common = require('common');

cc.Class({
    extends: cc.Component,

    properties: {
        txt_desc: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // this.node.on(cc.Node.EventType.TOUCH_START,this.gotoBackGame,this);

        this.txt_desc.enableWrapText = true;
    },

    start () {
        // this.startAnim();
    },

    gotoBackGame: function(target) {
        if (this.callback) {
            this.callback.apply(this.callbackObj)
        }

        this.node.off(cc.Node.EventType.TOUCH_START,this.gotoBackGame,this);
        common.removePopUpLayer(this);
    },

    startAnim: function(callback, callbackObj){
        this.callback = callback;
        this.callbackObj = callbackObj;

        for (var i = 1; i <= 6; i++) {
            let node = this.node.getChildByName("guide_"+i);
            if (node){
                node.active = false;
            }
        }

        let spr_center = this.node.getChildByName("spr_center");
        if (spr_center){
            spr_center.opacity = 0;
        }

        this.node.idx = 1;
        this.next();
    },

    next: function(){
        let name = "guide_"+this.node.idx;
        let node = this.node.getChildByName(name);
        if (!node) {
            this.gotoBackGame();
            return;
        }

        node.active = true;

        let delay = 0;
        let point = node.getChildByName("point");
        if(point){
            point.scale = 0;
            point.runAction(cc.scaleTo(0.15,1));
            delay += 0.2;
        }

        let line1 = node.getChildByName("line1");
        let line2 = node.getChildByName("line2");
        if (line1){
            line1.scaleY  = 0;
            line1.runAction(cc.sequence(cc.delayTime(delay), cc.scaleTo(0.2,1,1)) );
            delay += 0.2;
        }
        if (line2){
            line2.scaleY  = 0;
            line2.runAction(cc.sequence(cc.delayTime(delay), cc.scaleTo(0.2,1,1)) );
            delay += 0.2;
        }

        let spr_center = this.node.getChildByName("spr_center");

        let _this = this;
        let end =  function(){
            node.active = false;
            spr_center.stopAllActions();
        }

        if (spr_center){
            let act1 = cc.delayTime(delay);
            let act2 = cc.fadeIn(0.15);
            let act3 = cc.delayTime(1.2);
            let act4 = cc.fadeOut(0.15);
            let act5 = cc.callFunc(end, this);
            let act6 = cc.callFunc(this.next, this);
            spr_center.runAction(cc.sequence(act1,act2,act3,act4,act5,act6));

            this.setTextDesc();
        }
        
        this.node.idx += 1;
    },

    setTextDesc: function(){
        let desc = "";
        if(this.node.idx == 1){
            desc = "暂停按钮可暂停当前游戏";
        }else if(this.node.idx == 2){
            desc = "游戏中所获取的星星数量";
        }else if(this.node.idx == 3){
            desc = "自己飞机剩余血量";
        }else if(this.node.idx == 4){
            desc = "全屏炸弹炸毁现有敌机和炮弹";
        }else if(this.node.idx == 5){
            desc = "飞机中心体被击中扣除生命值";
        }

        this.txt_desc.string = desc;

    },

    // update (dt) {},
});
