cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        
    },

    playEff:function(){
        let anim = this.getComponent(cc.Animation);
        let animName = 'beAttacked';
        anim.play(animName);
        anim.on('finished', this.removeBullet, this);
    },

    //碰撞检测
    onCollisionEnter: function(other, self){
    },

    removeBullet:function(){
        this.bulletGroup.destroyBullet(this.node);
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {

    },
});
