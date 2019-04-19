
var wxCommon = require('WxCommon');
cc.Class({
    extends: cc.Component,

    properties: {        
        sprFriendHeadimg: cc.Sprite,
        labFriendName: cc.Label,
        labFriendScore: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    initData: function(data) {
        let avatarUrl = data.avatarUrl;
        let name = data.nickname;
        let score = data.score;

        this.labFriendName.string = String(name);
        this.labFriendScore.string = String(score);
        wxCommon.createImage(avatarUrl, this.sprFriendHeadimg);
    },

    // update (dt) {},
});
