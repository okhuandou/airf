

cc.Class({
    extends: cc.Component,

    properties: {
        spr_countdown: cc.Sprite,
        txt_num: cc.Label,

        curType: 1, //1:倒计时， 2：抵挡数量
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    start () {

    },

    addBuff: function(buff){
        let _this = this;
        let url = "items/buff_" + buff.name
        cc.loader.loadRes(url, cc.SpriteFrame, function(err,spriteFrame){
            _this.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });

        this.updateBuff(buff);
    },

    updateBuff: function(buff){
        if(buff.time){
            this.countDown(buff.time);
        }else if(buff.num){
            this.setCount(buff.num);
        }else{
            this.spr_countdown.node.active = false;
            this.txt_num.node.active = false;
        }
    },

    countDown: function(time){
        this.spr_countdown.node.active = true;
        this.txt_num.node.active = false;

        let _this = this;
        let timeOut = function(){
            _this.spr_countdown.node.stopAllActions();
            // _this.node.parent.removeChild(_this.node);
        }

        this.spr_countdown.node.stopAllActions();
        this.spr_countdown.node.scaleY = 0;
        this.spr_countdown.node.runAction(cc.sequence(cc.scaleTo(time, 1, 1), cc.delayTime(time), cc.callFunc(timeOut,this)));
    },

    setCount: function(num){
        this.spr_countdown.node.active = false;
        this.txt_num.node.active = true;

        this.txt_num.string = String(num);
    },

    // update (dt) {},
});
