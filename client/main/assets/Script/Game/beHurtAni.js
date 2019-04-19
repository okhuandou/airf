cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        this.node.setScale(1,cc.winSize.height/1280)
    },

  
    //碰撞检测
    onCollisionEnter: function(other, self){
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {

    },
});
