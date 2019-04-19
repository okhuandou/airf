var common = require('common');
var platformUtils = require('PlatformUtils');
// var taskUtils = require('taskUtils');

cc.Class({
    extends: cc.Component,

    properties: {
        btnSound: {
            default: null,
            type: cc.AudioClip
        },
        btn_receive: cc.Button,
        node_invite: cc.Node,
        lab_gem: cc.Label,
        btn_close: cc.Button,
        
        isSignNewPlane: false,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        common.iphonexAdapter(this.node);
        
        this.node_invite.active = false;
        this.initInvite();

        if(D.commonState.heroList) {
            for(let i=0; i<D.commonState.heroList.length; i++) {
                let element = D.commonState.heroList[i];
                if(element.kind == 4) {
                    this.isSignNewPlane = true;
                    break;
                }
            }
        } 
    },

    start () {
        let _this = this;
        platformUtils.requestInviteNewList(function(res){
            _this.btn_receive.interactable = res.isRecv == 1;
            _this.lab_gem.string = "钻石x" + res.award.qzb;
            _this.setItemData(res);
        });

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

    // update (dt) {},

    initInvite: function(){
        let offsetX = 40;
        let beginX = this.node_invite.x;
        let beginY = this.node_invite.y;
        for (var i = 1; i <= 3; i++) {
            let node = cc.instantiate(this.node_invite);
            node.active = true;
            node.idx = i;
            node.name = "itemTag"+i;
            node.position = cc.v2(beginX + (i-1)*(node.width + offsetX), beginY);
            this.node.addChild(node);
            node.on(cc.Node.EventType.TOUCH_END, this.onInvite, this);
        }
    },

    setItemData: function(data){
        if(!data) return;

        let invited = function(node, url){
            url = url != null ? url : "";
            let node_icon = node.getChildByName("Mask").getChildByName("spr_icon");
            if (node_icon){
                cc.loader.load({url: url, type: 'png'}, function(error, tex){
                    node_icon.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex);
                });
            }
        }

        if(!data.list || data.list.length <= 0) return;

        for (var i = 1; i <= data.list.length; i++) {
            let nodeItem = this.node.getChildByName("itemTag"+i);
            if(nodeItem){
                invited(nodeItem,data.list[i-1].headimg);
                // invited(nodeItem,"http://wx.qlogo.cn/mmopen/WE3rWE7N8IodhsMlAMWx3bMc9fgTwTGV7fiaVQcd0WtzfQRxbgrxfX9BMfXpZ6KlWImnOtBxg4FHBKCqFYdY4WMPVibKwibLHc5/0");
            }
        }
    },

    onInvite: function(){

        this.onBtnSound(); 
        let cfg = common.getShareCfgByType(D.ShareTypeZhuli);
        let title = cfg.title;
        let imageUrl = cfg.imageUrl;
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

    onBtnReceive: function(){
        this.onBtnSound();
        let _this = this;
        platformUtils.requestNewgiftsReceive(function(res){
            if(!res) return;
            
            _this.btn_receive.interactable = false;
            console.log(res)
            let tips = "恭喜您获得"
            if(res.coin && res.coin > 0){
                D.commonState.userGameInfo.coin += res.coin;
                tips = tips + "星星x" + res.coin
            }
            if(res.qzb && res.qzb > 0){
                D.commonState.userGameInfo.qzb += res.qzb;
                tips = tips + ",钻石x" + res.qzb
            }

            if(!_this.isSignNewPlane){
                if(res.hero != null){
                    D.commonState.heroList = null;
                    platformUtils.requestHeroList(function(res){});
                    tips = tips + ",小飞机x1"
                }
            }

            if(res.items && res.items.length > 0){
                platformUtils.requestItemList(function(res){}, true);
            }
            // res.items.forEach(val => {
            //     console.log("receive newgifts ==== id:"+val.id + ",====num:"+val.num);
            // });
            console.log(tips)
            common.sysMessage(tips);
            D.commonState.newgiftsList = null;
        });
  
    },

    onBtnClose: function(){
        common.removePopUpLayer(this);
    },

    onBtnSound: function(){
        if( ! D.isVoideClose){
            cc.audioEngine.play(this.btnSound);
        }
    },

});
