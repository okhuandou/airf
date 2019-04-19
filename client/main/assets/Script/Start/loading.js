var common = require('common');

cc.Class({
    extends: cc.Component,

    properties: {
        imgLoading: cc.Sprite,
    },

    onLoad () {
    },

    start () {
        this.loadingAnim();
    },

    loadingAnim: function(times){
        if (!times) times = 10;

        var _this = this;
        let r =  360 * times/2;
        let act1 = new cc.rotateBy(times, r);
        let act2 = new cc.callFunc(function(){
            common.hideLoading();
        }, _this);

        var node = _this.imgLoading.node;
        node.runAction(cc.sequence(act1, act2));
    },

    update (dt) {

    },
});
