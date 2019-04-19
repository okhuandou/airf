
var common = require('common');

cc.Class({
    extends: cc.Component,

    properties: {
        point: cc.Node,
        line1: cc.Node,
        line2: cc.Node,
        spCenter: cc.Node,
        finger: cc.Node,
        txt_desc: cc.Label,
        mask: cc.Node,
        maskBg: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    start () {

    },

    guide: function(node, target, callback) {
        // body...

        this.initView(node);

        let _this = this;
        let play = function(){
            _this.runAnim();
        }
        let finish = function(){
            if(target){
                node.stopAllActions()
                target.apply(callback);
            }
        }

        let act1 = cc.callFunc(play, this);
        let act2 = cc.delayTime(6.5);
        let act3 = cc.callFunc(finish, this);
        node.runAction(cc.sequence(act1,act2,act3));
    },

    initView: function(node){
        this.txt_desc.string = "全屏炸弹炸毁现有敌机和炮弹";

        let pos = node.parent.convertToWorldSpace(new cc.v2(node.x,node.y));

        let dirY = pos.y > 0 ? -1 : 1; // 1:下 , -1:上
        this.point.position = new cc.v2(pos.x , pos.y + dirY*node.height/2 + 10*dirY);

        this.line1.position = new cc.v2(this.point.x ,this.point.y - 2*dirY);
        let height1 = this.point.y*dirY - 10*dirY;
        this.line1.height = height1;
        let rotation1 = pos.y > 0 ? 180 : 0;
        this.line1.rotation = rotation1;

        let dirX = pos.x > 0 ? 1 : -1; //1:右 , -1:左
        this.line2.position = new cc.v2(this.line1.x, 0);
        this.line2.height = this.line2.x*dirX - this.spCenter.width/2 + 5;
        let rotation2 = pos.x > 0 ? 90 : 270;
        this.line2.rotation = rotation2;

        this.spCenter.position = new cc.v2(0, 0);
        this.finger.position = new cc.v2(pos.x + node.width/2, pos.y - node.height/2);

        this.mask.position = new cc.v2(pos.x + 15, pos.y);
        let bgGraphics = this.maskBg.addComponent(cc.Graphics);
        bgGraphics.fillColor = new cc.Color(0, 0, 0, 150);

        let beginx = this.mask.x*dirX - cc.winSize.width/2;
        let beginy = this.mask.y*dirY - cc.winSize.height/2;
        bgGraphics.fillRect(-100, -100, cc.winSize.width + 100, cc.winSize.height + 100);

        this.point.active = false;
        this.line1.active = false;
        this.line2.active = false;
        this.spCenter.active = false;
        this.finger.active = false;
    },

    runAnim: function(){
        let _this = this;
        let begin = function(){
            let delay = 0;
            _this.point.active = true;
            _this.point.scaleY = 0;
            _this.point.runAction(cc.scaleTo(0.4,1));
            delay += 0.4;

            _this.line1.active = true;
            _this.line1.scaleY  = 0;
            _this.line1.runAction(cc.sequence(cc.delayTime(delay), cc.scaleTo(0.4,1,1)) );
            delay += 0.4;

            _this.line2.active = true;
            _this.line2.scaleY  = 0;
            _this.line2.runAction(cc.sequence(cc.delayTime(delay), cc.scaleTo(0.4,1,1)) );
            delay += 0.4;

            _this.spCenter.active = true;
            _this.spCenter.opacity = 0;
            _this.spCenter.runAction(cc.sequence(cc.delayTime(delay), cc.fadeIn(0.2)) );
            delay += 0.2;
        }

        let end = function(){
            _this.point.active = false;
            _this.line1.active = false;
            _this.line2.active = false;
            _this.spCenter.active = false;
        }
        
        let fingerAnim =  function(){
            _this.finger.active = true;
            _this.finger.runAction( cc.repeatForever(cc.sequence(
                cc.moveTo(0.45, cc.v2(_this.finger.x + 10 ,_this.finger.y - 10) ),
                cc.delayTime(0.1), 
                cc.moveTo(0.45, cc.v2(_this.finger.x - 10 ,_this.finger.y + 10) )
            )));
        }

        let act1 = cc.callFunc(begin, this);
        let act2 = cc.delayTime(1.4);
        let act3 = cc.callFunc(fingerAnim, this);
        this.node.runAction(cc.sequence(act1,act2,act3));
    },

    close: function(){
        this.node.stopAllActions();
        common.removePopUpLayer(this);
    },

    // update (dt) {},
});
