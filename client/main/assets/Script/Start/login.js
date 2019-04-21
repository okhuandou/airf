var common = require('common');
var sceneManager = require('sceneManager');
var platformUtils = require('PlatformUtils');
var taskUtils = require('taskUtils');

cc.Class({
    extends: cc.Component,

    properties: {
        btnLogin: {
            default:null,
            type:cc.Button
        },
        btnSound: {
            default: null,
            type: cc.AudioClip
        },
        txt_desc: cc.Label,
        txt_load: cc.Label,
    },

    onLoad:function() {
        D.curSceneName = "Login"
        platformUtils.init(
            function() {
                //关闭按钮账单，PS：根据不同游戏的定义进行上报不同的key
                platformUtils.requestBill(100001, 2, 200)
            }
        );

        this.node.getChildByName('background').setScale(1,cc.winSize.height/1280);
        // cc.game.setDisplayStats(false);
        this.btnLogin.node.active = false;
        this.loadingScene("Start");
        this.node.loadIdx = 1;

        common.loadJsonAllCfgs();

        //test
        // let _this = this;
        // cc.loader.loadRes("newgifts/newgifts", cc.SpriteAtlas, function(err,atlas){
        //     let frame = atlas.getSpriteFrame("newgifts_gift2");
        //     let node = new cc.Node();
        //     let spr = node.addComponent(cc.Sprite);
        //     spr.spriteFrame = frame;
        //     _this.node.addChild(node);
        // });

        // cc.LoadingItems.create(cc.loader,)

        /*
        ,
  "navigateToMiniProgramAppIdList": [
    "wx5079dbb42e9672b7",
    "wxf6658e9f64a5c09c",
    "wxe50049290a9887d1",
    "wx71743e2c3394dc9e",
    "wxd8de2f6276406b2a",
    "wxe0e3ef455414d91d",
    "wxe003c14add4d3974",
    "wx3df1cf2a43a6b16d",
    "wx7745ae49b819ab1b",
    "wxf48553c6ca9bc829"
  ]
  */

    },

    loadingScene:function(name){
        let _this = this;
        cc.director.preloadScene(name,
            function (completedCount, totalCount, item) {

                _this.txt_desc.string = "正在解压资源,解压不消耗流量"

                let precent = 100*completedCount/totalCount;
                precent = Math.floor(precent);

                _this.txt_load.string = precent + "%";
            }
            ,function () {

                // if(_this.node.loadIdx == 1){
                //    _this.loadingScene('Game');
                //    _this.node.loadIdx += 1;
                // }else{
                    _this.loadFinsh();
                // }
        });
    },

    loadFinsh:function(){

        
        this.txt_desc.node.active = false;
        this.txt_load.node.active = false;

        let _this = this;

        let sdkVersion = null;
        if(CC_WECHATGAME) {
            this.btnLogin.node.active = true;
            let sysInfo = wx.getSystemInfoSync();
            sdkVersion = sysInfo.SDKVersion;
            if (sdkVersion >= "2.0.1") {
                this.btnLogin.node.active = false;
            }
            D.wxLaunchOption = window.wx.getLaunchOptionsSync();
            let referrerInfo = D.wxLaunchOption.referrerInfo;
            if(referrerInfo && referrerInfo.appId) {
                D.wxFromAppID = referrerInfo.appId;
            }
            console.log("getLaunchOptionsSync launchOption="+JSON.stringify(D.wxLaunchOption));
        }
        platformUtils.getUserInfo(function(res) {
            if (CC_WECHATGAME && sdkVersion >= "2.0.1") {
                _this.gotoLogin();
            }
        });

        let skey = platformUtils.getUserSkey();
        console.log('getUserSkey=', skey);
        //预先拉英雄，前提：已经登录过
        if(skey && skey != undefined && skey != 'undefined') {
            platformUtils.requestHeroList(function(res){
                
            });
        }
        platformUtils.requestShareCfg('giftInMain', function(res) {
            
        });

        //道具列表
        platformUtils.requestItemList(function(res){
            
        });

        //任务列表
        taskUtils.requestTaskList();

        let physicsManager = cc.director.getPhysicsManager()
        physicsManager.enabled = true;
        physicsManager.update(0.2);
        physicsManager.enabled = false;

      
        if (!CC_WECHATGAME) {
                _this.gotoLogin();
         }
    },

    

    start: function(){
        platformUtils.requestBill(100001, 1, 100);
    },

    gotoLogin: function() {
        cc.audioEngine.play(this.btnSound);
        platformUtils.requestBill(100001, 1, 200);
        platformUtils.login(function(success, data) {
            if(success) {
                sceneManager.loadScene('Start');
            }
        });
    },


});
