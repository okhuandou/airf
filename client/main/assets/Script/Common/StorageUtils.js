var common = require('common');
var platformUtils = require('PlatformUtils');

var storageUtils = {
 
    lotteryFreeDelay: 3600*4,
    lotteryVideoDelay: 30,

    upgradeVideo: 3,//每日升级视频次数
    upgradeShare: 2,//每日升级分享次数

    //红包视频/分享次数
    redpacketVideo: 6,
    redpacketShare: 10,

    ////////////////// 幸运转盘 ////////////////////////
    //免费次数倒计时
    lotteryFreeTime: function(){
        let freeCount = D.lotteryFreeDrawCount - this.lotteryFreeCount();
        //当天次数用完
        if(freeCount == 0){
            let timeStamp = new Date(new Date().setHours(0, 0, 0, 0)) / 1000;
            // 第二天凌晨时间戳
            let nextDay = timeStamp + 86400;

            return nextDay - Math.floor(Date.now()/1000);
        }

        //跨天
        let todayFreeVal = platformUtils.getItemByLocalStorage('TodayLetteryFreeDate');
        if(todayFreeVal){
            let todayDate = new Date(todayFreeVal);
            if(!common.isSameDay(todayDate)) {
                platformUtils.setItemByLocalStorage("TodayLetteryFreeCountDown",0);
            }
        }
        let time = platformUtils.getItemByLocalStorage("TodayLetteryFreeCountDown",0);
        if(time > 0){
            time = Math.floor(Date.now()/1000) - time;
            time = time >= this.lotteryFreeDelay ? 0 : this.lotteryFreeDelay - time;
        }
        
        return time;
    },

    lotteryFreeCount: function(){
        //跨天
        let todayDrawVal = platformUtils.getItemByLocalStorage('TodayLetteryFreeDraw');
        if(todayDrawVal){
            let todayDate = new Date(todayDrawVal);
            if(!common.isSameDay(todayDate)) {
                platformUtils.setItemByLocalStorage("LetteryFreeCount",0);
            }
        }
        let freeCount = platformUtils.getItemByLocalStorage("LetteryFreeCount",0);
        return freeCount;
    },

    //是否好友助力，下次网络请求时判读是否被助力
    checkFriendHelp: function(){
        
        //3秒间隔
        let preCheckTime = this.preHelpCheckTime ? this.preHelpCheckTime : 0;
        if (Date.now()/1000 - preCheckTime < 3) return;
        this.preHelpCheckTime = Date.now()/1000;

        let preCheckVal = D.commonState.friendHelpNum ? D.commonState.friendHelpNum : platformUtils.getItemByLocalStorage("curFriendHelpNum",-1);
        console.log("preCheckVal=",preCheckVal);
        if (preCheckVal < 0) return;

        platformUtils.requestShareAwardList(function(data) {
            let num = 0;
            let name = "";
            data.forEach((element,idx) => {
                if(element.isRecv == 0 && element.name != undefined && element.name != null){
                    num+=1;
                    name = element.name;
                }
            });
            
            if(preCheckVal >= 0 && num > preCheckVal){
                common.sysMessage(name + "进入了游戏")
                platformUtils.setItemByLocalStorage("curFriendHelpNum",-1);
            }else if(num < preCheckVal){
                platformUtils.setItemByLocalStorage("curFriendHelpNum",-1);
                D.commonState.friendHelpNum = 0;
            }
        });
    },
    
    upgradeVideoCount: function(){
        //跨天
        let todayUpgradeVal = platformUtils.getItemByLocalStorage('TodayUpgradeVideoDate');
        if(todayUpgradeVal){
            let todayDate = new Date(todayUpgradeVal);
            if(!common.isSameDay(todayDate)) {
                platformUtils.setItemByLocalStorage("UpgradeVideoCount",0);
            }
        }
        let upgradeCount = this.upgradeVideo - platformUtils.getItemByLocalStorage("UpgradeVideoCount",0);
        return upgradeCount;
    },

    upgradeShareCount: function(){
        //跨天
        let todayUpgradeVal = platformUtils.getItemByLocalStorage('TodayUpgradeShareDate');
        if(todayUpgradeVal){
            let todayDate = new Date(todayUpgradeVal);
            if(!common.isSameDay(todayDate)) {
                platformUtils.setItemByLocalStorage("UpgradeShareCount",0);
            }
        }
        let upgradeCount = this.upgradeShare - platformUtils.getItemByLocalStorage("UpgradeShareCount",0);
        return upgradeCount;
    },
    
    dailySignIsVideoed: function(){
        let todaySignVideoVal = platformUtils.getItemByLocalStorage('TodaySignVideoDate');
        if(todaySignVideoVal){
            let todayDate = new Date(todaySignVideoVal);
            if(!common.isSameDay(todayDate)) {
                platformUtils.setItemByLocalStorage("SignVideoSigned",false);
            }
        }

        return platformUtils.getItemByLocalStorage("SignVideoSigned",false);
    },

    //红包视频次数
    redpacketVideoCount: function(){
        let todayRedpacketVal = platformUtils.getItemByLocalStorage('TodayRedpacketVideoDate');
        if(todayRedpacketVal){
            let todayDate = new Date(todayRedpacketVal);
            if(!common.isSameDay(todayDate)) {
                platformUtils.setItemByLocalStorage("RedpacketVideoCount",0);
            }
        }
        let videoCount = this.redpacketVideo - platformUtils.getItemByLocalStorage("RedpacketVideoCount",0);
        return videoCount;
    },

    //红包分享次数
    redpacketShareCount: function(){
        let todayRedpacketVal = platformUtils.getItemByLocalStorage('TodayRedpacketShareDate');
        if(todayRedpacketVal){
            let todayDate = new Date(todayRedpacketVal);
            if(!common.isSameDay(todayDate)) {
                platformUtils.setItemByLocalStorage("RedpacketShareCount",0);
            }
        }
        let shareCount = this.redpacketShare - platformUtils.getItemByLocalStorage("RedpacketShareCount",0);
        return shareCount;
    },

};
module.exports = storageUtils;