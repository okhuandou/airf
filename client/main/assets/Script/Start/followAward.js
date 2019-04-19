var common = require('common');
var sceneManager = require('sceneManager');
var platformUtils = require('PlatformUtils');

cc.Class({
    extends: cc.Component,

    properties: {
        btnSound: {
            default: null,
            type: cc.AudioClip
        },
        btnAwardPlane: cc.Button,
        labAwardStatus: cc.Label,
    },

    onLoad () {
        let _this = this;
        this.btnAwardPlane.interactable = false;
        // cc.sys.localStorage.removeItem('followAwardPlaneGot');
        // let followAwardPlaneGotFlag = platformUtils.getItemByLocalStorage('followAwardPlaneGot', 0);
        // if(followAwardPlaneGotFlag == 0) {
        //     platformUtils.requestHeroList(function(res){
        //         res.forEach(element => {
        //             if(element.kind == 2) {
        //                 _this.btnAwardPlane.interactable = true;
        //             }
        //         });
        //     });
        // }
        // else {
        //     this.labAwardStatus.string = '已领取';
        // }
        platformUtils.requestHeroList(function(res){
            res.forEach(element => {
                if(element.kind == 2) {
                    if(element.status == 3) {
                        _this.btnAwardPlane.interactable = true;
                    }
                    else if(element.status == 1 || element.status == 2) {
                        _this.labAwardStatus.string = '已领取';
                    }
                }
            });
        });
        this.onMoveAction();
    },

    onMoveAction: function(){
        let sprRight = this.node.getChildByName("spr_right");
        let posX = sprRight.position.x;
        let posY = sprRight.position.y;
        let moveLeft = cc.moveTo(1.5,new cc.Vec2(posX-30 ,posY));
        let moveRight = cc.moveTo(1.5,new cc.Vec2(posX+30 ,posY));
        let action = cc.repeatForever(cc.sequence(moveLeft,moveRight));
        sprRight.runAction(action);
    },
    onBackMain: function() {
        this.onBtnSound(); 
        // this.node.parent.removeChild(this.node);
        common.removePopUpLayer(this);
    },
    //领取
    onGetAward:function(){
        this.onBtnSound();
        let _this = this;
        // let followAwardPlaneGotFlag = platformUtils.getItemByLocalStorage('followAwardPlaneGot', 0);
        // if(followAwardPlaneGotFlag == 1) {
        //     common.sysMessage('已领取！');
        //     return;
        // }
        // else {            
        // }
        platformUtils.requestHeroList(function(res){
            let flag = false;
            res.forEach(element => {
                if(element.kind == 2) {
                    if(element.status == 3) {
                        common.sysMessage('领取成功！');
                        _this.labAwardStatus.string = '已领取';
                        _this.btnAwardPlane.interactable = false;
                        platformUtils.requestUpdateHeroStatus(element.kind, element.status, 1, function(res){});
                    }
                    else if(element.status == 1 || element.status == 2) {
                    }
                    else if(element.status == 0) {
                        common.sysMessage('请先进行关注！');
                    }
                }
            });
        });
    },
    onBtnSound: function(){
        if( ! D.isVoideClose){
            cc.audioEngine.play(this.btnSound);
        }
    },
});
