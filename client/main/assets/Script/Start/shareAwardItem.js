var common = require('common');
var platformUtils = require('PlatformUtils');
var timeUtils = require('TimeUtils');
// var taskUtils = require('taskUtils');

cc.Class({
    extends: cc.Component,

    properties: {
        sprFriendHeadimg: cc.Sprite,
        labFriendName: cc.RichText,
        labAwardCoin: cc.RichText,
        btnGetAward: cc.Button,
        btn_get_invite: cc.Button,
        btnBgGrey: cc.Sprite,
        awardId: cc.Integer,
        btnSound: {
            default: null,
            type: cc.AudioClip
        },
        awardCoinSound: {
            default: null,
            type: cc.AudioClip
        },
        node_normal: cc.Node,
    },

    // onLoad () {},

    loadData: function(friend,idx) {
        //TODO 助力好友信息
        this.awardId = friend.id;
        let friendHeadimg = friend.headimg;
        let friendName = friend.name;
        let awardCoin = friend.award;
        let isRecv = friend.isRecv;
        var _this = this;
        
        if(friendHeadimg != null){
            common.createImage(friendHeadimg, this.sprFriendHeadimg);
        }
        /*else{
            cc.loader.loadRes('game/jiesuan_head', cc.SpriteFrame, function(err, spriteFrame) {
                _this.sprFriendHeadimg.spriteFrame = spriteFrame;
            });
        }*/
        let isGetAward = 1;//是否可以领奖励
        if(friendName == undefined){
            friendName = "第"+(idx + 1)+"位好友";
            isGetAward  = 0;
        }else{
            //累计今日已邀请几位好友
            D.commonState.shareFriendNum += 1;
        }
        this.labFriendName.string = "<color=#ffe760>"+friendName+"</color>";
        this.labAwardCoin.string = "<color=#e6e5f8>"+awardCoin+"</color>";

        //1:已领取
        if(isRecv == 1) {
            this.btn_get_invite.node.active = false;
            this.btnGetAward.node.getChildByName("apr_bg_yellow").active = false;
        }else{
            if(isGetAward == 1){ //可领奖
                this.btn_get_invite.node.active = false;
                this.btnGetAward.node.getChildByName("spr_bg_grey").active = false;
            }else{ //未邀请
                this.btnGetAward.node.active = false;
            }
        }
    },

    onGetAward: function() {
        this.onBtnSound(); 
        //TODO 助力领取
        let _this = this;
       
        let greyBtn = this.btnBgGrey.node;
        platformUtils.requestShareAward(this.awardId, function(res) {            
            if(res == 2020){
                let message = "助力分享没达标!";
                common.sysMessage(message);
                return;
            }else if(res == 2021){
                let message = "已经领取过,不能重复领取!";
                common.sysMessage(message);
                return;
            }
            _this.btnGetAward.node.children[0].getComponent(cc.Sprite).spriteFrame = greyBtn.getComponent(cc.Sprite).spriteFrame; //置灰
            //获得金币后，我的金币
            let addCoin = res.addCoin;
            D.commonState.userGameInfo.coin += addCoin;
            common.sysMessage("恭喜获得 "+addCoin+" 星星!");
            _this.onAwardCoinSound();

        });
    },
    onInvite: function(){
        this.onBtnSound(); 
        //TODO 邀请好友
        let cfg = common.getShareCfgByType(D.ShareTypeZhuli);
        let title = cfg.title;
        let imageUrl = cfg.imageUrl;
        // let fromKey = platformUtils.getUserSkey();
        let fromUserId = platformUtils.getUserId();
        platformUtils.shareAppMessage(title, imageUrl, "type=shareAward&fromUserId="+fromUserId, function(res){
            if(res) {
                common.sysMessage('分享成功！');
                platformUtils.requestBill(100007, 6, 200, 1);
                // taskUtils.taskReport(taskUtils.TaskType.INVITE);
            }
            else {
                platformUtils.requestBill(100007, 6, 200, 0);
            }
        });

    },
    //按钮声音
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
