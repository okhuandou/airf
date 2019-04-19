var common = require('common');
var sceneManager = require('sceneManager');
var platformUtils = require('PlatformUtils');

cc.Class({
    extends: cc.Component,

    properties: {
        scrollView: {
            type: cc.ScrollView,
            default: null,
        },
        labExtAwardCoin: cc.Label,
        shareAwardItemPrefab: cc.Prefab,
        btnSound: {
            default: null,
            type: cc.AudioClip
        },
        awardCoinSound: {
            default: null,
            type: cc.AudioClip
        },
    },

    onLoad: function() {
        let content = this.scrollView.content;
        var _this = this;
        //累计今日已邀请几位好友
        D.commonState.shareFriendNum = 0;
        platformUtils.requestShareAwardList(function(data) {
            data.forEach((element,idx) => {
                var item = cc.instantiate(_this.shareAwardItemPrefab);
                let itemScript = item.getComponent('shareAwardItem');
                itemScript.target = _this;
                itemScript.loadData(element,idx);
                content.addChild(item);
            });
            if(D.commonState.shareFriendNum >= 6){
                //分享礼包红点
                // cc.director.getScene().getChildByName('Canvas').getChildByName('NewLayout').getChildByName('btn_share').getChildByName('spr_share_red_point').active = false;
                cc.director.getScene().getChildByName('Canvas').getChildByName('btn_invite').getChildByName('spr_share_red_point').active = false;
            }
            _this.scrollView.scrollToTop(0.1);
        });
        
    },
    onShare: function() {
        //分享
        this.onBtnSound(); 
        let cfg = common.getShareCfgByType(D.ShareTypeZhuli);
        let title = cfg.title;
        let imageUrl = cfg.imageUrl;
        // let fromKey = platformUtils.getUserSkey();
        let fromUserId = platformUtils.getUserId();
        platformUtils.shareAppMessage(title, imageUrl, "type=shareAward&fromUserId="+fromUserId, function(res) {
            if(res) {
                common.sysMessage('分享成功！');
                platformUtils.requestBill(100007, 5, 200, 1);
            }
            else {
                platformUtils.requestBill(100007, 5, 200, 0);
            }
        });
    },
    onGetExtAward: function() {
        //领取
        let _this = this;
        this.onBtnSound(); 
        platformUtils.requestShareAward(0, function(res) {
            if(res == 2020){
                let message = "助力分享没达标!";
                common.sysMessage(message);
                return;
            }else if(res == 2021){
                let message = "已经领取过,不能重复领取!";
                common.sysMessage(message);
                return;
            }
            //获得金币后，我的金币
            let addCoin = res.addCoin;
            let message = "恭喜获得, "+addCoin+"星星!";
            D.commonState.userGameInfo.coin += addCoin;
            common.sysMessage(message);
            _this.onAwardCoinSound();       
            
        });
    },
    onBackMain: function() {
        this.onBtnSound(); 
        common.removePopUpLayer(this);
    },
    onBtnSound: function(){
        if( ! D.isVoideClose){
            cc.audioEngine.play(this.btnSound);
        }
    },
    onAwardCoinSound: function(){
        if( ! D.isVoideClose){
            cc.audioEngine.play(this.awardCoinSound);
        }
    },
    // update (dt) {},
});
