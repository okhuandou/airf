var common = require('common');
var platformUtils = require('PlatformUtils');


var gameUtils = {

    //是否弹窗新手说明
    isNewExplain: function(){
        //跨天
        let todayTipsVal = platformUtils.getItemByLocalStorage('TodayExplainDate');
        if(todayTipsVal){
            let todayDate = new Date(todayTipsVal);
            if(!common.isSameDay(todayDate)) {
                platformUtils.setItemByLocalStorage("NewExplainCount",0);
            }
        }

        let count = platformUtils.getItemByLocalStorage("NewExplainCount", 0);
        let isNew = platformUtils.getItemByLocalStorage("NewExplainNewPlayer", true);
        let maxCount = isNew ? 2 : 1;

        if(count < maxCount){
            platformUtils.setItemByLocalStorage("NewExplainCount", count + 1);
            platformUtils.setItemByLocalStorage('TodayExplainDate', new Date());
            return true;
        }

        platformUtils.setItemByLocalStorage("NewExplainNewPlayer", false);

        //test
        // platformUtils.setItemByLocalStorage('TodayExplainDate',new Date(0));
        // platformUtils.setItemByLocalStorage("NewExplainNewPlayer", true);

        return false;
    },

    //助力加成值
    getFriendHelpAdd: function(callback){
        platformUtils.requestHelpList(function(data) {
            let addNum = 0;
            data.forEach((element,idx) => {
                if(element.remainSec && element.remainSec > 0){
                    addNum += 5;
                    if(element.isNew){
                        addNum += 5;
                    }
                }
            });
            if(callback){
                callback(addNum);
            }
        });

    },

    //红包掉落策略
    redPacketIsDrop: function(gameLevel,levelIdx){
        //1.飞机控制产出总奖池，最高产出红包小于18元，允许上下浮动0.8元
        //2.每关进入时有40%（配置）概率产出红包，未通关关卡随机（1,2）个红包，已通关过的关卡最大限制掉落1个。
	    //  特殊：判断用户是否有刷用户红包行为：
	    //  连续≥2次刷第一关时，则概率变为20%，连续≥3次则概率变成1%，通关第二关后概率提升10%，通关第三关则重置条件。
        //  连续≥2次刷二关时，则概率变为20%，若连续≥3次则概率变为5%，通关第三关后概率提升10%，通关第四关则重置条件。
        //3.三日登录用户前三关产出红包概率减少10%，七日登录用户前三关产出红包概率减少一半。

        //
        let curMoney = D.commonState.userGameInfo.money;
        let loginDay = D.commonState.userGameInfo.createdDays;
        let dropRateCfg = 0.4;

        let _this = this;
        let maxMoney = function(){
            if(_this.redPacketMaxMoney) return _this.redPacketMaxMoney;
            let saveMax = platformUtils.getItemByLocalStorage("RedPacketMaxMoney", 0);
            if(saveMax == 0){
                let rd = Math.random()*16;
                saveMax = Math.floor(rd)/10 + 17.2;
                platformUtils.setItemByLocalStorage("RedPacketMaxMoney", saveMax);
                _this.redPacketMaxMoney = saveMax;
                console.log("====== create saveMax = ",saveMax);
            }
            _this.redPacketMaxMoney = saveMax;
            // console.log("====== maxMoney = ",saveMax);
            return _this.redPacketMaxMoney;
        }

        let canDropNum = function(){
            if( _this.gameLevel != gameLevel ){
                _this.gameLevel = gameLevel;
                _this.curLevelDropNum = 0;
                _this.dropNumMax = -1;
                _this.curLevelIdx = null;
            }
            let maxLevel = platformUtils.getItemByLocalStorage("PassedMaxLevel", 0);
            if(_this.dropNumMax < 0){
                // console.log("====== curLevel dropNumMax = 1");
            }
            
            if(gameLevel <= maxLevel) return 1;
            
            if(_this.dropNumMax < 0){
                let dropNumMax = Math.ceil(Math.random()*2);
                // console.log("====== curLevel dropNumMax = ",dropNumMax);
                _this.dropNumMax = dropNumMax;
            }
            return _this.dropNumMax;
        }

        let dropRate = function(){
            if(gameLevel <= 3){
                if(loginDay >= 3 && loginDay < 7){
                    dropRateCfg -= 0.1;
                }else if(loginDay >= 7){
                    dropRateCfg *= 0.5;
                }
            }

            //防刷
            let endLevel = platformUtils.getItemByLocalStorage("preEedGameLevel", 0);
            let endCount = platformUtils.getItemByLocalStorage("preEedGameLevelCount", 0);
            let passMax = platformUtils.getItemByLocalStorage("PassedMaxLevel", 0);
            if(endLevel == 1 && gameLevel == 1 && passMax < 1){
                if(endCount == 1){
                    dropRateCfg *=0.5;
                }else if(endCount > 1){
                    dropRateCfg = 0.01;
                }
            }

            if(endLevel == 2 && gameLevel == 2 && passMax < 2){
                if(endCount == 1){
                    dropRateCfg *=0.5;
                }else if(endCount > 1){
                    dropRateCfg = 0.05;
                }
            }
            // console.log("====== dropRate, endLevel,endCount,passMax = ",endLevel,endCount,passMax);
            // console.log("====== dropRate, dropRateCfg = ",dropRateCfg);
            return dropRateCfg;
        }


        //策略判定
        if(curMoney >= maxMoney() ){
            // console.log("====== maxMoney ********");
            return false;
        }

        if(canDropNum() <= this.curLevelDropNum){
            // console.log("====== maxDrop ******** this.curLevelDropNum=",this.curLevelDropNum);
            return false;
        }

        if(this.curLevelIdx && levelIdx - this.curLevelIdx < 5){
            // console.log("====== curLevelIdx less 5 ******** this.curLevelIdx=",this.curLevelIdx);
            return;
        }

        let rate = dropRate();
        if(Math.random() > rate){
            // console.log("====== dropRate ********,rate=",rate);
            return false;
        }

        // this.curLevelDropNum++;
        this.curLevelIdx = levelIdx;
        if(gameLevel <= 3){
            let tag = "redpacketAwardLevel"+gameLevel;
            if(!platformUtils.getItemByLocalStorage(tag, false)){
                this.redpacketReason = 3001;
            }
        }
        return true;
    },

    redpacketInitState: function(){
        this.curLevelIdx = null;
        this.curLevelDropNum = 0;
        this.dropNumMax = -1;
        this.redpacketReason = 3000;
    },
    
};
module.exports = gameUtils;
