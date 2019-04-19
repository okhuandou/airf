var wxCommon = require('WxCommon');

cc.Class({
    extends: cc.Component,

    properties: {
        sprHeadimg: cc.Sprite,
        labNearName: cc.Label,
        labNearScore: cc.Label,
        distInit: cc.Float,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    initData: function(data, selfDist) {
        let avatarUrl = data.avatarUrl;
        let name = data.nickname;
        let dist = data.dist;

        this.labNearName.string = String(name);
        wxCommon.createImage(avatarUrl, this.sprHeadimg);

        this.distInit = parseFloat(dist).toFixed(2);
        this.resetScore(selfDist);
    },

    resetScore: function(dist) {
        this.labNearScore.string = (parseFloat(this.distInit) - parseFloat(dist)).toFixed(2) + "km";
    }
    // update (dt) {},
});
