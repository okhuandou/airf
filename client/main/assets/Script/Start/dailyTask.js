
var common = require('common');
var taskUtils = require('taskUtils');
var platformUtils = require('PlatformUtils');

cc.Class({
    extends: cc.Component,

    properties: {
        scroll_task: cc.ScrollView,
        itemPrefab: cc.Prefab,
        btn_close: cc.Button,
        btnSound: {
            default: null,
            type: cc.AudioClip
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.scroll_task.bounceDuration = 0.5;
        this.initList();
    },

    start () {
        //广告
        let closeWidget = this.btn_close.node.getComponent(cc.Widget);
        // if(closeWidget){
        //     let offset = Device.needOffsetPixel() ? 200 : 100;
        //     closeWidget.bottom -= offset;
        //     this.btn_close.node.runAction(cc.sequence(cc.delayTime(1),cc.callFunc(function(){
        //         platformUtils.createBannerAd(true); 
        //         closeWidget.bottom += offset;
        //     },this)));
        // }

        platformUtils.createBannerAd(true); 
    },

    // update (dt) {},

    setCallback: function(callback, closeCallback){
        this.callbackToGo = callback;
        this.closeCallback = closeCallback;
    },

    initList: function(){
        let itemHeight = 110;
        let offset = 14;
        let curY = -itemHeight/2;
        let _this = this;
        taskUtils.requestTaskList(function(res){
            let content = _this.scroll_task.content;
            res.forEach((element,idx) => {
                
                let node = cc.instantiate(_this.itemPrefab);
                content.addChild(node);
                let script = node.getComponent("dailyTaskItem");
                if(script){
                    script.initWithData(element,idx);
                    script.mainScript = _this;
                }

                node.y = curY;
                curY -= offset;
                curY -= node.height;
            });

            content.height = res.length*itemHeight + (res.length-1)*offset;
        });
        
    },

    onBtnClose: function(){
        if( ! D.isVoideClose){
            cc.audioEngine.play(this.btnSound);
        }

        if(this.closeCallback){
            this.closeCallback();
        }

        common.removePopUpLayer(this);
    },

    handlerBtnGo: function(type){
        if(this.callbackToGo){
            this.callbackToGo(type);
        }
    },

});
