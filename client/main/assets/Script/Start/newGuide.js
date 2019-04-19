var common = require('common');
var sceneManager = require('sceneManager');
var platformUtils = require('PlatformUtils');

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad (){
        this.node.on(cc.Node.EventType.TOUCH_START,this.gotoBackGame,this);
    },
    gotoBackGame: function(target) {
        this.node.off(cc.Node.EventType.TOUCH_START,this.gotoBackGame,this);
        common.removePopUpLayer(this);
        // sceneManager.loadScene('Tmp');
        let cname = !sceneManager.isLoadedGame ? 'Tmp' : 'Game'
        sceneManager.loadScene(cname);
    },

    // onLoad () {},

    start () {},

    // update (dt) {},
});
