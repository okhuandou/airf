var wxCommon = require('WxCommon');

cc.Class({
    extends: cc.Component,

    properties: {
        labMyTop: cc.Label,
        sprMyHeadimg: cc.Sprite,
        labMyName: cc.Label,
        labMyScore: cc.Label,
        sprPlane: cc.Sprite,
        sprMyTop: cc.Sprite,
        labNoInTop: cc.Label,
    },

    initData: function(top, data) {
        let avatarUrl = data.avatarUrl;
        let name = data.nickname;
        let score = data.score;

        if(top <= 0) {
            this.labMyTop.node.active = false;
            this.sprMyTop.node.active = false;
            this.labNoInTop.node.active = true;
        }
        else if(top <= 3 && top > 0) {
            this.labMyTop.node.active = false;
            this.labNoInTop.node.active = false;
            let _this = this;
            cc.loader.loadRes("game/ranking_0"+top, cc.SpriteFrame, function(err, spriteFrame) {
                _this.sprMyTop.spriteFrame = spriteFrame;
            });
        }
        else {
            this.sprMyTop.node.active = false;
            this.labNoInTop.node.active = false;
            this.labMyTop.string = String(top);
        }
        this.labMyName.string = String(name);
        this.labMyScore.string = String(score);
        wxCommon.createImage(avatarUrl, this.sprMyHeadimg);

        // let hero = data.hero;
        // let tag = hero.tag ? hero.tag: hero;
        let tag = data.hero;
        wxCommon.createImage('plane/plane_'+tag, this.sprPlane);
    },
});
