

cc.Class({
    extends: cc.Component,

    properties: {
        txtTips: cc.RichText,
    },

    // onLoad () {},

    // start () {},

    onTips: function onTips(layer, msg, color, offPos) {

        if (null == color) {
            color = "#ffffff";
        }

        var _this = this;

        _this.txtTips.string = "<color=" + color + "><b>" + msg + "</b></color>";

        cc.director.getScene().addChild(layer);
        layer.zIndex = 8888;
        let pos = cc.v2(360, cc.winSize.height*0.6);
        if (offPos) {
            pos.x += offPos.x
            pos.y += offPos.y
        }
        layer.position = pos

        var toPos = cc.v2(0, 60);

        var act1 = cc.fadeIn(0.2);
        var act2 = cc.delayTime(1);
        // var act3 = cc.moveTo(0.8, toPos);
        var act3 = cc.moveBy(0.8, toPos);
        var act4 = cc.fadeOut(1);
        layer.runAction(cc.sequence(act1, act2, act3, act4));

        var callBack = function callBack() {
            if (layer.parent) {
                layer.parent.removeChild(layer);
            }
        };
        this.node.runAction(cc.sequence(cc.delayTime(3), cc.callFunc(callBack)));
    }

    // update (dt) {},
});

