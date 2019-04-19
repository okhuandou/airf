
cc.Class({
    extends: cc.Component,

    properties: {
       labTop: cc.Label,
       sprHeadimg: cc.Sprite,
       labName: cc.Label,
       labScore: cc.Label,
       
    },

    loadData: function(data) {
        let top = data.top;
        let name = data.name;
        let score = data.score;

        this.labTop.string = top;
        this.labName.string = name;
        this.labScore.string = score;

        var _this = this;
        let url = 'subpack/bonus/headstart';//
        cc.loader.loadRes(url, cc.SpriteFrame, function(err, spriteFrame) {
            _this.sprHeadimg.spriteFrame = spriteFrame;
        });
    }
});
