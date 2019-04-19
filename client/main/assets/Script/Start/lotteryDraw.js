
var common = require('common');
var platformUtils = require('PlatformUtils');
var timeUtils = require('TimeUtils');
var storageUtils = require('StorageUtils');

cc.Class({
    extends: cc.Component,

    properties: {
        nodeReward: cc.Node,
        btnSound: {
            default: null,
            type: cc.AudioClip
        },
        sprFree: cc.Sprite,
        sprVideo: cc.Sprite,
        txt_timedesc: cc.Label,
        txt_timenum: cc.Label,
        nodeTime: cc.Node,
        btn_close: cc.Button,

        curIdx: 6,
        perRotation: 60,
        curCountDown: 0,
        countDownType: 1, //1:免费  2：视频
        //延时
        freeDelayTime: 0,
        videoDelayTime: 0,

        awardItemPos: { //奖励项位置,与奖品id映射
            default: []
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // platformUtils.setItemByLocalStorage("LetteryFreeCount",0);
        // platformUtils.setItemByLocalStorage("TodayLetteryFreeCountDown",0);
        // platformUtils.setItemByLocalStorage("TodayLetteryFreeDate",0);
        // platformUtils.setItemByLocalStorage('TodayLotteryVideoCnt',3);
        // platformUtils.setItemByLocalStorage('TodayWxVideoCnt', 0);

        common.iphonexAdapter(this.node);
        
        this.curIdx = 6;
        this.awardItemPos = [1,2,3,4,6,5];//逆时针1~6位置存放的奖品ID
        this.freeDelayTime = 3600*4;
        this.videoDelayTime = 30;

        this.initBtnState();
    },

    start () {
        for (var i = 1; i <= 6; i++) {
            let awardId = this.awardItemPos[i-1];
            this.initItem(i,awardId);
        }

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

    onDestroy: function(){
    },

    initBtnState: function(){
        this.countDownType = 0;
        this.curCountDown = 0;
        let isCountdown = false;

        let _this = this;
        let countDown = function(){
            isCountdown = true;
            _this.txt_timenum.node.stopAllActions();
            let act1 = cc.delayTime(1.0);
            let act2 = cc.callFunc(function(){
                _this.curCountDown -= 1;
                _this.txt_timenum.string = timeUtils.secondsToHMS(_this.curCountDown);
                if(_this.curCountDown < 0){
                    _this.txt_timenum.node.stopAllActions();
                    _this.initBtnState();
                }
            });
            _this.txt_timenum.string = timeUtils.secondsToHMS(_this.curCountDown);
            _this.txt_timenum.node.runAction(cc.repeatForever(cc.sequence(act1,act2)));
        }

        let freeCount = D.lotteryFreeDrawCount - storageUtils.lotteryFreeCount();
        let freeTime = storageUtils.lotteryFreeTime();
        let freeVisible = freeCount > 0 && freeTime == 0;
        this.sprFree.node.active = freeVisible;
        this.sprFree.canClick = freeVisible;
        
        let videoNum = platformUtils.lotteryVideoCount();
        let videoTime = Math.floor(Date.now()/1000) - platformUtils.getItemByLocalStorage('LotteryVideoPreTime',0);
        videoTime = videoTime > this.videoDelayTime ? 0 : this.videoDelayTime - videoTime;
        let videoVisible = videoNum > 0 && videoTime == 0;
        this.sprVideo.node.active = videoVisible;
        this.sprVideo.canClick = videoVisible;

        //倒计时
        if( freeTime > 0 && videoTime > 0){
            if(freeTime < videoTime || videoNum == 0){
                this.countDownType = 1;
                this.curCountDown = freeTime;
                this.txt_timedesc.string = "下次免费时间:";
                countDown();
            }else{
                this.countDownType = 2;
                this.curCountDown = videoTime;
                this.txt_timedesc.string = "下次视频时间:";
                countDown();
            }
        }else if(freeTime > 0 && videoTime <= 0){
            this.countDownType = 1;
            this.curCountDown = freeTime;
            this.txt_timedesc.string = "下次免费时间:";
            countDown();
        }else if(videoTime > 0 && freeTime <= 0){
            if(videoNum > 0){
                this.countDownType = 2;
                this.curCountDown = videoTime;
                this.txt_timedesc.string = "下次视频时间:";
                countDown();
            }
        }

        this.nodeTime.active = isCountdown;

        //不可点也要显示
        if(!this.sprFree.node.active && !this.sprVideo.node.active){
            if(this.countDownType == 1){
                this.sprFree.node.active = true;
            }else if(this.countDownType == 2){
                this.sprVideo.node.active = true;
            }
        }

        //是否置灰
        if(this.sprFree.node.active){
            let freeState = this.sprFree.canClick ? 0 : 1;
            this.sprFree.node.getComponent(cc.Sprite).setState(freeState);
        }
        if(this.sprVideo.node.active){
            let videoState = this.sprVideo.canClick ? 0 : 1;
            this.sprVideo.node.getComponent(cc.Sprite).setState(videoState);
        }

    },

    initItem: function(posId, awardId){
        let config = common.getJsonCfgByID('lottery_draw',awardId);
        if(!config) return;

        // let spritem = this.node.getChildByName("item_"+posId);
        let txtname = this.node.getChildByName("nodeReward").getChildByName("txt_"+posId);
        if(txtname){
            txtname.getComponent(cc.Label).string = config.name;
        }
    },

    // update (dt) {},

    onBtnDraw: function(){
        if(this.sprFree.canClick){
            platformUtils.setItemByLocalStorage("TodayLetteryFreeCountDown",Math.floor(Date.now()/1000));
            platformUtils.setItemByLocalStorage("TodayLetteryFreeDate",new Date());
            this.handleFreeDraw();
            return;
        }

        if(this.sprVideo.canClick){
            this.handleVideoDraw();
        }

    },

    handleFreeDraw: function(){
        if(this.drawing){
            console.log(" drawing now...")
            return;
        }
        this.onBtnSound();

        let freeCount = storageUtils.lotteryFreeCount();
        if(freeCount < D.lotteryFreeDrawCount){
            platformUtils.setItemByLocalStorage("LetteryFreeCount",freeCount+1);
            platformUtils.setItemByLocalStorage('TodayLetteryFreeDraw', new Date());
            this.requestDraw();
        }
    },

    handleVideoDraw: function(){
        if(this.drawing){
            console.log(" drawing now...")
            return;
        }

        if(platformUtils.lotteryVideoCount() <= 0){
            common.sysMessage("您今日视频奖励次数已达上限，请明天再来！");
            return;
        }

        platformUtils.requestBill(100008, 5, 200, 0);
        this.onBtnSound(); 

        let _this = this;
        platformUtils.createRewardedVideoAd('lottery', function() {
            platformUtils.requestBill(100008, 5, 200, 1);
            platformUtils.setTodayWxVideo();
            platformUtils.setItemByLocalStorage('TodayLotteryVideoCnt', platformUtils.getItemByLocalStorage('TodayLotteryVideoCnt', 0) + 1);
            platformUtils.setItemByLocalStorage('TodayLotteryVideoTime', new Date());

            platformUtils.setItemByLocalStorage('LotteryVideoPreTime', Math.floor(Date.now()/1000));
            _this.requestDraw();

            Notification.emit("remove_all_poplayer");
        });
    },

    onBtnClose: function(){
        this.onBtnSound();
        common.removePopUpLayer(this);

        console.log("------------- lotteryDraw onDestroy 111111 ")
        if(D.curSceneName == "Game"){
            console.log("------------- lotteryDraw onDestroy 2222222222 ")
            platformUtils.hideWxLayer();
        }

        if(this.drawing){
            this.reward(this.curIdx);
        }
    },

    requestDraw: function(){
        this.drawing = true;
        this.initBtnState();

        let configs = common.getJsonCfgs("lottery_draw");
        let radom = Math.floor(Math.random()*100) + 1;
        let curPrecent = 0;
        for (var i = 0; i < configs.length; i++) {
            let cfg = configs[i];
            curPrecent += cfg.precent;
            if(curPrecent >= radom){
                this.draw(cfg.id);
                return;
            }
        }
    },

    draw: function(awardId){
        let idx = 1;
        for (var i = 0; i < this.awardItemPos.length; i++) {
            let curId = this.awardItemPos[i];
            if(curId == awardId){
                idx = i + 1;
                break;
            }
        }
        
        console.log("======== draw===  awardId="+awardId+",---- idx="+idx);

        let count =  idx - this.curIdx;
        let totolRotation = this.perRotation * count + 360 * 4;

        let beginTime = 0.2;
        let actArr = [];
        let delay = 0;
        while (totolRotation > 0){
            if(totolRotation > 540){
                if( beginTime > 0.04){
                    beginTime -= 0.04;
                }
            }else{
                beginTime += 0.008;
            }

            let act1 = cc.rotateBy(beginTime,20);
            actArr.push(act1);

            delay += beginTime;
            totolRotation -= 20;
        }

        let _this = this;
        let finish = function(){
            _this.drawing = false;
            _this.reward(idx);
        }
        actArr.push(cc.callFunc(finish,this));

        this.nodeReward.stopAllActions();
        this.nodeReward.runAction(cc.sequence(actArr));
        this.curIdx = idx;
    },

    reward: function(idx){
        let awardId = this.awardItemPos[idx-1];
        let config = common.getJsonCfgByID('lottery_draw',awardId);
        common.sysMessage("恭喜您获得" + config.num + "星星")

        //奖励
        platformUtils.requestAddCoin(config.num, D.ReasonLotteryDraw, function(res) {
            //
        });
        platformUtils.requestBill(100007, 13, 200, 1);
    },

    onBtnSound: function(){
        if( ! D.isVoideClose){
            cc.audioEngine.play(this.btnSound);
        }
    },

});
