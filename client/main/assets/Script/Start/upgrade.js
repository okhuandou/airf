var common = require('common');
var platformUtils = require('PlatformUtils');

cc.Class({
    extends: cc.Component,

    properties: {
        curNum: 1,
        curTotal: 1,
        pageItem: cc.Prefab,
        target: cc.PageView,
        labMyCoin: cc.Label,
        herosData: [],
        shareAwardPrefab: cc.Prefab,
        sprStar: cc.Node,
        hallSound: {
            default: null,
            type: cc.AudioClip,
        },
    },

    _createPage(index, heroCfg, heroInfo) {
        var page = cc.instantiate(this.pageItem);
        let pageItemScript = page.getComponent('upgradePage');
        pageItemScript.load(index, heroCfg, heroInfo);
        pageItemScript.pageMain = this;
        page.position = new cc.v2(0, 0);
        return page;
    },

    onLoad:function () {
        if(Device.needOffsetPixel()){ //iphone x适配
            let btn_node =  this.node.getChildByName('spr_node').getComponent(cc.Widget);
            if (btn_node){
                btn_node.top =  btn_node.top + 70;
            }
        }
        if( ! D.isVoideClose && D.curSceneName == "Start"){
            if(D.commonState.hallAudioID == 0){
                D.commonState.hallAudioID = cc.audioEngine.play(this.hallSound, true,0.3);
            }
        }

        //注册监听星星的变化
        Notification.on('upgradeCoin', this.onListenCoinChange, this);

        this.prepareData();
    },

    prepareData:function(){
        let _this = this;
        platformUtils.requestHeroList(function(res){
            res.forEach(element => {
                if(element.status == 2) {
                    //出战
                    console.log(element);
                }
                _this.herosData[element.kind] = element;
            });
            
            _this.node.runAction(cc.sequence(cc.delayTime(0.2),cc.callFunc(function(){
                _this.onShowHeros();
            },_this)));
            
        });
        platformUtils.requestGameInfo(function(res) {
           _this.labMyCoin.string = res.coin + ""; 
        });
    },

    onShowHeros: function() {
        let herosCfg = common.getJsonCfgs('hero');
        let showedHeroKinds = [];
        let cnt = 0;
        let _this = this;
        let maxLvKind = 0;
        let maxLv = 0;
        herosCfg.forEach((heroCfg,idx) => {
            if(showedHeroKinds[heroCfg.kind] !== 1) {
                let heroInfo = _this.herosData[heroCfg.kind];
                if( ! heroInfo || (heroInfo && heroInfo.kind == heroCfg.kind && heroInfo.id == heroCfg.id)) {
                    showedHeroKinds[heroCfg.kind] = 1;
                    this.target.addPage(this._createPage(cnt++, heroCfg, heroInfo));
                    if(heroCfg.kind == 1){	//首页隐藏左按钮
                        this.node.getChildByName('btn_goto_left').active = false;
                    }
                }
                if(heroInfo && heroInfo.level > maxLv) {
                    maxLvKind = heroInfo.kind;
                }
            }
        });
        console.log('maxLvKind', maxLvKind-1);
        // this.target.setCurrentPageIndex(maxLvKind - 1 < 0 ? 0: maxLvKind - 1);
        if(this.curPageIndex){
            this.target.setCurrentPageIndex(this.curPageIndex);
        }
    },

    setCurPageIndex: function(idx){
        this.curPageIndex = idx;
    },

    onPageEvent(sender, eventType) {
        if(sender._curPageIdx == 0){    //首页隐藏左按钮
            this.node.getChildByName('btn_goto_left').active = false;
        }else if(sender._curPageIdx == (sender._pages.length-1)){//最后一页,隐藏右按钮
            this.node.getChildByName('btn_goto_right').active = false;
        }else{
            this.node.getChildByName('btn_goto_left').active = true;
            this.node.getChildByName('btn_goto_right').active = true;
        }
        
        if(eventType !== cc.PageView.EventType.PAGE_TURNING) {
            return;
        }
    },

    onListenCoinChange: function(params) {
       
        this.labMyCoin.string = String(params);
    },

    onBackMain: function() {
        Notification.off('upgradeCoin', this.onListenCoinChange);
        common.removePopUpLayer(this);
    },

    gotoPageByIndex(index) {
        if(index < 0) return;
        this.target.setCurrentPageIndex(index);
    },

    gotoShareAward: function() {
        common.showPopUpLayer(this.shareAwardPrefab);
    },

    gotoShare: function() {
        let cfg = common.getShareCfgByType(D.ShareTypeFriend);
        let title = cfg.title;
        let imageUrl = cfg.imageUrl;
        platformUtils.shareAppMessage(title, imageUrl, "", function(res) {
            if(res) {
                common.sysMessage('分享成功！');
                platformUtils.requestBill(100007, 9, 200, 1);
            }
            else {
                platformUtils.requestBill(100007, 9, 200, 0);
            }
        });
    },

    onCloseVoide() {
        if( ! D.isVoideClose) {
            cc.audioEngine.pauseAll();
            cc.audioEngine.pauseMusic();
            D.isVoideClose = true;
        }
        else {
            cc.audioEngine.resumeAll();
            cc.audioEngine.resumeMusic();
            D.isVoideClose = false;
        }
    },
    gotoLeft: function() {
        this.gotoPageByIndex(this.target._curPageIdx - 1);
    },
    gotoRight: function() {
        this.gotoPageByIndex(this.target._curPageIdx + 1);
    },
});
