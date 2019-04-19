
var common = require('common');

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    start () {

    },

    // update (dt) {},

    setCallback: function(callback){
        this.callback = callback;
    },

    onBtnClose: function(){
        common.removePopUpLayer(this);
        if(this.callback){
            this.callback();
        }
    },

});
