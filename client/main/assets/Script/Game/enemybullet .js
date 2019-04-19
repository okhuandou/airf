cc.Class({
    extends: cc.Component,

    properties: {
        speed: cc.Integer,
        rationNum:0,
        owner:1,  //1表示玩家飞机发射， 2表示敌方发射的子弹
    },

    setIsPlayer: function (val){
        if (val){
            this.owner = 1;
        }
        else{
            this.owner = 2;
        }
    },
    // use this for initialization
    onLoad: function () {
    },

    //碰撞检测
    onCollisionEnter: function(other, self){
        this.bulletGroup.destroyBullet(self.node);
    },
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        this.node.y += dt * this.speed;
        if (this.node.y > this.node.parent.height){
            this.bulletGroup.destroyBullet(this.node);
        }
    },
});
