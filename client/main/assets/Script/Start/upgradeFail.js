var common = require('common');
var platformUtils = require('PlatformUtils');
var storageUtils = require('StorageUtils');

cc.Class({
    extends: cc.Component,

    properties: {
        btnVideo: cc.Button,
        btnShare: cc.Button,
        labVideoAward: cc.Label,
        labShareAward: cc.Label,
        btnSound: {
            default: null,
            type: cc.AudioClip
        },
        spr_label: cc.Sprite,
        lab_desc: cc.Label,
    },

    onLoad: function() {
        let _this = this;
        this.btnVideo.node.active = false;
        this.btnShare.node.active = false;
        this.labVideoAward.string = String(D.AwardCoinVideo);
        this.labShareAward.string = String(D.AwardCoinShare);
        platformUtils.requestShareCfg('upgradeVideo', function(res) {
            if( ! res) return;
            // if(res.upgradeShare == 's' && res.upgradeVideo == 'v') {
            //     _this.btnVideo.node.active = true;
            //     _this.btnShare.node.active = true;
            // }
            // else if(res.upgradeShare == 's' && res.upgradeVideo != 'v') {
            //     _this.btnVideo.node.active = false;
            //     _this.btnShare.node.active = true;
            //     _this.btnShare.node.x = 0;
            // }
            // else if(res.upgradeShare != 's' && res.upgradeVideo == 'v') {
            //     _this.btnVideo.node.active = true;
            //     _this.btnShare.node.active = false;
            //     _this.btnVideo.node.x = 0;
            // }
            // else if(res.upgradeShare != 's' && res.upgradeVideo != 'v') {
            // }

            if(res){
                _this.btnVideo.node.active = true;
                _this.initVideoState();
            }
        });

        this.spr_label.node.active = true;
        this.lab_desc.node.active = false;
    },

    initVideoState: function(){
        let videCount = storageUtils.upgradeVideoCount();
        if( ! platformUtils.isTodayWxVideoBeyond() || videCount <= 0) {
            //分享
            let _this = this;
            platformUtils.requestShareCfg('upgradeShare', function(res) {
                if(res){
                    _this.btnVideo.node.active = false;
                    let shareCount = storageUtils.upgradeShareCount();
                    if( !platformUtils.isTodayWxAwardShareBeyond() || shareCount <= 0 ){
                        _this.btnShare.node.active = true;
                        _this.btnShare.interactable = false;
                    }else{
                        _this.btnShare.node.active = true;
                    }
                }else{
                    _this.btnVideo.interactable = false;
                }
            });
        }
    },

    useLabDesc: function(){
        this.spr_label.node.active = false;
        this.lab_desc.node.active = true;
    },

    //关闭窗口
    onClose: function(){
        this.onBtnSound();
        // cc.director.getScene().removeChild(this.node);
        common.removePopUpLayer(this);
    },

     //看视频
    onVideo: function(event) {
        this.onBtnSound();
        if( ! platformUtils.isTodayWxVideoBeyond()) {
            common.sysMessage('次数已用完，明天再来！');
            return;
        }
        let _this = this;
        platformUtils.requestBill(100008, 1, 200, 0);
        platformUtils.createRewardedVideoAd('shengji', function() {
            //奖励金币
            platformUtils.requestAddCoin(D.AwardCoinVideo, D.ReasonAddCoinVideo, function(res) {
                //update my coin
                Notification.emit('upgradeCoin', res.currCoin);
            });
            common.sysMessage('恭喜获得 '+D.AwardCoinVideo+" 星星！");
            platformUtils.requestBill(100008, 1, 200, 1);
            platformUtils.setTodayWxVideo();

            platformUtils.setItemByLocalStorage("UpgradeVideoCount",platformUtils.getItemByLocalStorage("UpgradeVideoCount",0)+1);
            platformUtils.setItemByLocalStorage('TodayUpgradeVideoDate',new Date());
            _this.initVideoState();
        });
    },
    onShare: function() {
        let cfg = common.getShareCfgByType(D.ShareTypeFriend);
        let title = cfg.title;
        let imageUrl = cfg.imageUrl;
        let _this = this;
        platformUtils.shareAppMessageCallback(title, imageUrl, "", function(res) {
            if( ! platformUtils.isTodayWxAwardShareBeyond()) {
                common.sysMessage('次数已用完，明天再来！');
                return;
            }
            if(res == true) {
                //奖励金币
                platformUtils.requestAddCoin(D.AwardCoinShare, D.ReasonAddCoinShare, function(res) {
                    //update my coin
                    Notification.emit('upgradeCoin', res.currCoin);
                });
                common.sysMessage('分享获得 '+D.AwardCoinShare+" 星星！");
                platformUtils.requestBill(100007, 10, 200, 1);
                platformUtils.setTodayWxAwardShare();

                platformUtils.setItemByLocalStorage("UpgradeShareCount",platformUtils.getItemByLocalStorage("UpgradeShareCount",0)+1);
                platformUtils.setItemByLocalStorage('TodayUpgradeShareDate',new Date());
                _this.initVideoState();
            }
            else {
                platformUtils.requestBill(100007, 10, 200, 0);
            }
        });
    },
     //按钮声音
     onBtnSound: function(){
        if( ! D.isVoideClose){
            cc.audioEngine.play(this.btnSound);
        }
    },
    // onLoad () {},

    // start () {},

    // update (dt) {},
});
