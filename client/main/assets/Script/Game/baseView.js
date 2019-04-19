cc.Class({
    extends: cc.Component,

    properties: {
        far_bg: [cc.Node],
        mapMovSpeed: 0.5,
        mapHeigeht:1280,
        mapInitX:0,
        rewardBg1: cc.Node,
        rewardBg2: cc.Node,
        needOffsetPixel:false,

    },

    onLoad: function () {
        this.mapMovSpeed = 2;

        var bg1BoundingBox = this.far_bg[0].getBoundingBox();
        this.mapHeigeht = cc.winSize.height;
        this.mapInitHeight = bg1BoundingBox.height;
        this.mapInitX = -bg1BoundingBox.width * 1;
        this.far_bg[2].active = false
        if (Device.needOffsetPixel()) { //iphone x适配
            this.needOffsetPixel = true
            this.far_bg[2].active = true
        }

        this.fixBgPos(this.far_bg[0], this.far_bg[1], this.far_bg[2]);

        Notification.on('level_over_event', this.levelOverHandler, this);
        Notification.on('level_begin_event', this.levelBeginHandler, this);

        // this.rewardBg.node.active = false
        // this.fixBgPos(this.rewardBg1, this.rewardBg2)
    },

    levelOverHandler:function(){
        this.mapMovSpeed = 5;
    },

    levelBeginHandler:function(){
        this.mapMovSpeed = 2;
    },

    fixBgPos: function (bg1, bg2, bg3) {
        //利用前一张图片的边框大小设置下一张图片的位置
        bg1.setPosition(this.mapInitX, -this.mapHeigeht * 1)
        bg2.setPosition(bg1.x, bg1.y + this.mapInitHeight)
        bg3.setPosition(bg2.x, bg2.y + this.mapInitHeight)
    },

    moveHandler:function(){

        

    },

    
    update: function (dt) {
        if (D.gameStatuePause) {
            return
        }

        this.bgMove(this.far_bg, this.mapMovSpeed);
    },

    bgMove: function (bgList, speed) {
        var needTopIdx = -1;
        var len = 2
        if (this.needOffsetPixel ) {
            len = 3
        }
        for (var index = 0; index < len; index++) {
            var element = bgList[index];
           
            element.y -= speed;

            //检查是否要重置位置
            if (element.y <= (-this.mapHeigeht * 0 - this.mapInitHeight) ){
                needTopIdx = index;
            }
        }

        //避免移动位置的 像素不准 出现线条的问题
        if (needTopIdx >= 0 ) {
            var nTopBG = bgList[needTopIdx]
            // var tar1BG = null; 
            var tar2BG = null; 

            /* 
            if (needTopIdx == 0){
                tar1BG = bgList[1]
                tar2BG = bgList[2]
            }
            else if (needTopIdx == 1) {
                tar1BG = bgList[2]
                tar2BG = bgList[0]
            }
            else {
                tar1BG = bgList[0]
                tar2BG = bgList[1]
            } */

            var idx = (needTopIdx + len-1) % len
            tar2BG = bgList[idx]

            nTopBG.setPosition(tar2BG.x, tar2BG.y + this.mapInitHeight)
        }
    },

    gameOver:function(){
        Notification.off('level_over_event', this.levelOverHandler);
        Notification.off('level_begin_event', this.levelBeginHandler);
    }
});