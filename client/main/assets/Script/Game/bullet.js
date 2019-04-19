cc.Class({
    extends: cc.Component,

    properties: {
        speed: cc.Integer,
        rationNum:0,
        owner:1,  //1表示玩家飞机发射， 2表示敌方发射的子弹
        attackNum:0,
        moveRotation :0,
        isJiGuamg:false,
        isLiaojiDaoDan:false , //是否导弹，   导弹需要跟着敌人目标走
        jiguangSound: {
            default: null,
            type: cc.AudioClip
        },
        stopMove:false,
        needPlaySound:true
    },

    setIsPlayer: function (val){
        if (val){
            this.owner = 1;
        }
        else{
            this.owner = 2;
        }
    },

    checkJiGuangSound:function (params) {
        if (this.isJiGuamg) { //激光 
            this.soundID = cc.audioEngine.play(this.jiguangSound, true);
        }
    },

    isPlayerBullet:function(){
        return this.owner == 1;
    },

    // use this for initialization
    onLoad: function () {

        
    },

    //碰撞检测
    onCollisionEnter: function(other, self){
        if (this.isJiGuamg) { //激光 
            return
        }


        if (other.node.group === 'jiguang' ) {
            this.bulletGroup.destroyBullet(self.node);
            this.bulletGroup.beattackedHandler(this.node.x, this.node.y+30);
        }

        if (other.node.group === 'hero') {
            if (this.owner == 2){
                this.bulletGroup.destroyBullet(self.node);
            } 
        } else if (other.node.group === 'enemy') {
            if (this.owner == 1) {
                this.bulletGroup.destroyBullet(self.node);

                let scale = 1;
                let offset = 30;
                if (other.node.enemyType == 2 ){
                    scale = 0.6;
                }else if (other.node.enemyType == 1 ){
                    scale = 0.3;
                }
                this.bulletGroup.beattackedHandler(this.node.x, this.node.y+offset*scale, scale);
            }
        }
    },

    forceRemove:function(){
        this.bulletGroup.destroyBullet(this.node);

        cc.audioEngine.stop(this.soundID)
    },

    setMoveRotation:function(rNum){
        this.moveRotation = rNum
        this.node.rotation = this.moveRotation;
    },
   
    daodanMove:function(){

        var thisPoint = this.node.getPosition();
        if (this.targetObj) {
            let enemy = this.targetObj.getComponent("enemy")
            if (enemy) {
                if (!enemy.isLife() || !enemy.isInWinsize()) {
                    this.targetObj = null
               } 
            }
        }

       if (!this.targetObj) {
           this.targetObj = this.bulletGroup.getNearEnemyByPos(thisPoint)
        }

        if (!this.targetObj) {
            this.normolMove(this.speed)
            return
        }

        var targetPoint = this.targetObj.node.getPosition()
        var delta = targetPoint.subSelf(thisPoint);
        var distance = delta.mag();
        var x2 = thisPoint.x + this.speed * delta.x / distance;
        var y2 = thisPoint.y + this.speed * delta.y / distance;

        let angle = JsUnit.getVectorRadians(this.node.x, this.node.y, x2, y2)
        this.node.rotation = angle;

        this.node.setPosition(cc.v2(x2, y2));
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (D.gameStatuePause) {
            return
        }

        if (this.isJiGuamg) { //激光 

            if (this.owner == 1 && this.hero) {
                this.node.x = this.hero.getComponent('hero').node.x
                this.node.y = this.hero.getComponent('hero').node.y
            }
            return
        }

        if (this.owner == 1){

            if (this.isLiaojiDaoDan) {
                this.daodanMove()
                return
            }

            // this.node.y += dt * this.speed;
            // this.checkRemove()

           
            let R = dt * this.speed*this.bulletGroup.mainScript.gameSpeed;
            this.normolMove(R)

            return
        }
        let R = dt * this.speed*this.bulletGroup.mainScript.gameSpeed;
        this.normolMove(R)
    },


    normolMove: function (R){
        if (this.stopMove) {
            return
        }
        
        let ly = R * Math.cos(Math.PI / 180 * this.moveRotation)
        let lx = R * Math.sin(Math.PI / 180 * this.moveRotation)

        this.node.rotation = this.moveRotation;

        this.node.x += lx;
        this.node.y += ly;
        this.checkRemove()
    },

    checkRemove:function(){
        if (this.node.y <= -cc.winSize.height / 2
            || this.node.y >= cc.winSize.height / 2
            || this.node.x >= cc.winSize.width / 2
            || this.node.x <= -cc.winSize.width / 2
        ) {
            this.forceRemove();
        }
    },
});
