cc.Class({
    extends: cc.Component,

    properties: {
        getUfoSound: {
            default: null,
            type: cc.AudioClip
        },
        isNomalMove : false,
        sprintDisNum : 0,
        sprintTime : 0,

        magnetSpeed:30,
        canMagnetSpeed:false,
    },

    initData:function(){
        this.isNomalMove = false
        this.magnetSpeed = 30;
        this.canMagnetSpeed = false;

    },
    // use this for initialization
    onLoad: function () {
        
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
    },
    //碰撞检测
    onCollisionEnter: function(other, self){
        if( ! D.isVoideClose){
            cc.audioEngine.play(this.getUfoSound);
        }
        
        this.removeUfo()
    },

    moveHandler:function(){
        // this.isNomalMove = true;
        this.canManger()

        var posX = this.node.x
        var posY = this.node.y
       
        var dTime = (this.node.y + cc.winSize.height/2) / this.speed
        var action1 = cc.moveTo(dTime, cc.v2(posX, -cc.winSize.height/2))

        this.node.setScale(1)
        var finish = cc.callFunc(this.removeUfo, this);
        this.node.runAction(cc.sequence(action1, finish))

    },

    throwHandler:function(){
        var posX = this.node.x
        var posY = this.node.y

        var tarX = posX + 50
        if (tarX > cc.winSize.width / 2)
        {
            tarX = posX - 50
        }

        var dTime =(this.node.y + cc.winSize.height/2) / 250
        
        var bezier = [cc.v2(posX, posY), cc.v2(posX, posY + 100), cc.v2(posX, posY+10)];
        var action1 = cc.bezierTo(0.3, bezier);
        var action2 = cc.moveTo(dTime, cc.v2(posX, -cc.winSize.height/2))

        this.node.setScale(1)
        var finish = cc.callFunc(this.removeUfo, this);
        this.node.runAction(cc.sequence(action1, action2,finish))


        ///
        let self = this
        let callFuncBack = function () {
            self.canManger()
        }
        this.node.runAction(cc.sequence(cc.scaleTo(0.2, -1, 1), cc.callFunc(callFuncBack)))
    },

    canManger:function (params) {
        this.canMagnetSpeed = true
    },
    removeUfo:function(){
        this.node.stopAllActions();
        this.ufoGroup.destroyUfo(this.node);
    },
    gamePause:function(){
        this.node.pauseAllActions()
    },
    gameResume:function(){
        this.node.resumeAllActions()
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (D.gameStatuePause) {
            return
        }

        if (D.magnetStatus && this.canMagnetSpeed) {
            this.node.stopAllActions()
            this.isNomalMove = true
            
/* 
            var targetPoint = this.targetObj.node.getPosition()
            var delta = targetPoint.subSelf(thisPoint);
            var distance = delta.mag();
            var x2 = thisPoint.x + this.speed * delta.x / distance;
            var y2 = thisPoint.y + this.speed * delta.y / distance;

            let angle = JsUnit.getVectorRadians(this.node.x, this.node.y, x2, y2)
            this.node.rotation = angle;
 */
            let thisPoint = this.node.getPosition()
            var targetPoint = this.hero.node.getPosition()
            var delta = targetPoint.subSelf(thisPoint);
            var distance = delta.mag();
            this.node.x = thisPoint.x + this.magnetSpeed * delta.x / distance;
            this.node.y = thisPoint.y + this.magnetSpeed * delta.y / distance;


            this.magnetSpeed = this.magnetSpeed + 0.3
            if (this.magnetSpeed > 35) {
                this.magnetSpeed = 35
            }
            /* 

            let disX = this.hero.node.x - this.node.x
            
            disX = disX * 0.15
            
            let moveDis = 20

            if (Math.abs(disX) > moveDis/2) {
                disX = disX > 0 ? moveDis/2 : -moveDis/2;
            }
            this.node.x += disX

            let disY = this.hero.node.y - this.node.y
            disY = disY *0.15
            if (Math.abs(disY) > moveDis) {
                disY = disY > 0 ? moveDis : -moveDis;
            }
            this.node.y += disY */

            return
        }


        if (this.isNomalMove && !D.gameStatuePause) {
            
            this.node.stopAllActions()
            this.node.y -= dt * this.speed;
            //出屏幕后
            if (this.node.y < -this.node.parent.height / 2) {
                this.removeUfo()
            } 
        }
    },
});
