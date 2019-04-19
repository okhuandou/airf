var platformUtils = require('PlatformUtils');

cc.Class({
    extends: cc.Component,

    properties: {
        spr_bg: cc.Sprite,
        spr_plane: cc.Sprite,
        spr_head: cc.Sprite,
        lab_name: cc.Label,
        lab_score: cc.Label,
        lab_state: cc.Label,
        lab_star: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    initWithData: function(data){
        let _this = this;
        let heroKind = data.heroKind ? data.heroKind : 1; 
        let heroSeq = data.heroSeq ? data.heroSeq : 1; 
        let plane_url = "plane/plane_"+ heroKind +"_" + heroSeq;
        cc.loader.loadRes(plane_url, cc.SpriteFrame, function(err,spriteFrame){
            _this.spr_plane.spriteFrame = spriteFrame;
        });
        // let avatarUrl = "http://wx.qlogo.cn/mmopen/WE3rWE7N8IodhsMlAMWx3bMc9fgTwTGV7fiaVQcd0WtzfQRxbgrxfX9BMfXpZ6KlWImnOtBxg4FHBKCqFYdY4WMPVibKwibLHc5/0";
        let avatarUrl = data.headimg;
        if(avatarUrl && avatarUrl != ""){
            cc.loader.load({url: avatarUrl, type: 'png'}, function(error, tex){
                _this.spr_head.spriteFrame = new cc.SpriteFrame(tex);
            });
        }
        
        this.lab_name.string = data.name ? data.name : "";
        this.lab_score.string = data.score ? data.score : "";
        this.lab_star.string = "x" + data.award;

        let isSuccess = data.success == 1;
        this.lab_state.string = isSuccess ? "挑战成功" : "挑战失败";
        
        let color = data.success == 1 ? cc.color("#81f761") : cc.color("#f24747");
        this.lab_state.node.color = color;

        if(data.userId == platformUtils.getUserId()){
            cc.loader.loadRes("battle/battle", cc.SpriteAtlas, function(err,atlas){
                let frame = atlas.getSpriteFrame("battle_item_clicked");
                if(frame){
                    _this.spr_bg.spriteFrame = frame;
                }
            });
        }
    },


});
