
var wxCommon = require('WxCommon');

cc.Class({
    extends: cc.Component,

    properties: {
        
        sprTop1: cc.Sprite,
        sprTop1Headimg: cc.Sprite,
        labTop1Name: cc.Label,
        labTop1Score: cc.Label,
        
        sprTop2: cc.Sprite,
        sprTop2Headimg: cc.Sprite,
        labTop2Name: cc.Label,
        labTop2Score: cc.Label,
        
        sprTop3: cc.Sprite,
        sprTop3Headimg: cc.Sprite,
        labTop3Name: cc.Label,
        labTop3Score: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        console.log('rank top3 onload.........');
        this.sprTop1.node.active = false;
        this.sprTop2.node.active = false;
        this.sprTop3.node.active = false;
    },

    start () {
        console.log('rank top3 start.........');
    },

    initData: function(top, data) {
        console.log('rank top3 initData.........'+top);
        let avatarUrl = data.avatarUrl;
        let name = data.nickname;
        let score = data.score;

        switch(top) {
            case 1:
            this.sprTop1.node.active = true;
            wxCommon.createImage(avatarUrl, this.sprTop1Headimg);
            this.labTop1Name.string = name;
            this.labTop1Score.string = String(score);
            break;
            case 2:
            this.sprTop2.node.active = true;
            wxCommon.createImage(avatarUrl, this.sprTop2Headimg);
            this.labTop2Name.string = name;
            this.labTop2Score.string = String(score);
            break;
            case 3:
            this.sprTop3.node.active = true;
            wxCommon.createImage(avatarUrl, this.sprTop3Headimg);
            this.labTop3Name.string = name;
            this.labTop3Score.string = String(score);
            break;
        }
    },
    
    // update (dt) {},
});
