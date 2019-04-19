var wxCommon = require('WxCommon');

cc.Class({
    extends: cc.Component,

    properties: {
       labTop: cc.Label,
       sprTop: cc.Sprite,
       sprHeadimg: cc.Sprite,
       labName: cc.Label,
       labScore: cc.Label,
       sprPlane: cc.Sprite,
    },

    initData: function(top, data) {
        let avatarUrl = data.avatarUrl;
        let nickname = data.nickname;
        let score = data.score;

        if(top <= 3 && top > 0) {
            this.labTop.node.active = false;
            let _this = this;
            cc.loader.loadRes("game/ranking_0"+top, cc.SpriteFrame, function(err, spriteFrame) {
                _this.sprTop.spriteFrame = spriteFrame;
            });
        }
        else {
            this.sprTop.node.active = false;
            this.labTop.string = String(top);
        }
        this.labName.string = String(nickname);
        this.labScore.string = String(score);

        wxCommon.createImage(avatarUrl, this.sprHeadimg);

        // let hero = data.hero;
        // let tag = hero.tag ? hero.tag: hero;
        let tag = data.hero;
        wxCommon.createImage('plane/plane_'+tag, this.sprPlane);
    }
});
