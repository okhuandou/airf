
var common = require('common');
var sceneManager = require('sceneManager');

cc.Class({
    extends: cc.Component,

    properties: {
        spr_bg: cc.Sprite,
        nod_mask: cc.Node,
        nod_loading: cc.Node,
        lab_process: cc.Label,
        lab_desc: cc.Label,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },

    start () {
        common.hideLoading();
        common.clearPopLayer();

        this.nod_mask.active = false;
        this.nod_loading.active = false;

        if(sceneManager.preSceneName != 'Game' && !sceneManager.isLoadedGame ){
            this.loading();
        }else{
            sceneManager.loadScene('Game');
        }
    },

    // update (dt) {},


    loading: function(){
        this.nod_mask.active = true;
        this.nod_loading.active = true;

        let graphics = this.nod_mask.addComponent(cc.Graphics);
        graphics.fillColor = new cc.Color(0, 0, 0, 200);

        let maxWidth = Math.max(cc.winSize.width, this.node.width);
        let maxHeight = Math.max(cc.winSize.height, this.node.height);
        graphics.fillRect(-maxWidth/2, -maxHeight/2, maxWidth, maxHeight);

        this.preLoad('Game');
    },


    preLoad: function(name){
        let _this = this;
        cc.director.preloadScene(name,
            function (completedCount, totalCount, item) {

                let precent = 100*completedCount/totalCount;
                precent = Math.floor(precent);

                _this.lab_process.string = precent + "%";
            }
            ,function () {
                sceneManager.loadScene('Game');
                sceneManager.isLoadedGame = true;
        });
    },

});
