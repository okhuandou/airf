var platformUtils = require('PlatformUtils');
var common = require('common');

cc.Class({
    extends: cc.Component,

    properties: {
        scrollview:{
            type:cc.ScrollView,
            default:null,
        },
        nodeGraphics: cc.Node,

        nodeItem: cc.Node,

        // gamesNameArr: {
        //     default:[],
        //     type:String
        // },

        isInitedView: false,

        
        
        
        // 浪漫农场：wx25a6ac1d3557e156
        // 牛仔跑酷：wxd4abb0f4db18da79
        // 欢乐幸运骰：wx557f39afcfcb06d6
        // 全民游戏榜: wxef53e9c1ce95e30d
        // 全民有文画: wxd6c5337aed6300ec
        
        

        // 阿波罗游戏精选：wx5079dbb42e9672b7
        // 欢乐坦克世界：wxf6658e9f64a5c09c
        // 星球大冒险：wxe50049290a9887d1
        // 欢乐捕鲲：wx71743e2c3394dc9e
        // 悦步宝：wx5ced162faa4eb1f3 --
        // 欢乐猫猫消：wx79fc05b190c49fde
        // 步数换换乐: wxd8de2f6276406b2a
        // 欧巴欧巴: wxe0e3ef455414d91d
        // 奔跑吧彩球: wxe003c14add4d3974
        // 指色玩: wx3df1cf2a43a6b16d
        // 步数赚钱宝: wx5d49b5fa52580889 --
        // 秒台车: wxf48553c6ca9bc829
        // 非常抽奖: wx7745ae49b819ab1b

        
        //换前
        //["欢乐坦克世界","星球大冒险","欢乐捕鲲","步数赚钱宝","秒台车","步数换换乐","欧巴欧巴","奔跑吧彩球","指色玩"]
        //["wxf6658e9f64a5c09c","wxe50049290a9887d1","wx71743e2c3394dc9e","wx5d49b5fa52580889","wxf48553c6ca9bc829","wxd8de2f6276406b2a","wxe0e3ef455414d91d","wxe003c14add4d3974","wx3df1cf2a43a6b16d"]
        
        //换后 --navName , navOther2
        //["欢乐坦克世界","星球大冒险","欢乐捕鲲","非常抽奖","秒台车","步数换换乐","欧巴欧巴","奔跑吧彩球","指色玩"]
        //["wxf6658e9f64a5c09c","wxe50049290a9887d1","wx71743e2c3394dc9e","wx7745ae49b819ab1b","wxf48553c6ca9bc829","wxd8de2f6276406b2a","wxe0e3ef455414d91d","wxe003c14add4d3974","wx3df1cf2a43a6b16d"]

        //换后 --navName , navOther2
        //["欢乐坦克世界","星球大冒险","欢乐捕鲲","非常抽奖","指色玩"]
        //["wxf6658e9f64a5c09c","wxe50049290a9887d1","wx71743e2c3394dc9e","wx7745ae49b819ab1b","wx3df1cf2a43a6b16d"]
    
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.scrollview.bounceDuration = 0.5;
        this.nodeItem.active = false;

        let graphics = this.nodeGraphics.addComponent(cc.Graphics);
        graphics.fillColor = new cc.Color(0, 0, 0, 120);
        graphics.fillRect(-this.nodeGraphics.width/2, -this.nodeGraphics.height/2, this.nodeGraphics.width, this.nodeGraphics.height);
        this.nodeGraphics.addComponent(cc.BlockInputEvents);

        this.nodeGraphics.active = false;
        // this.gamesNameArr = ["阿波罗游戏精选","牛仔跑酷","欢乐坦克世界","浪漫农场","星球大冒险","欢乐捕鲲"];
    },

    start () {
        // this.initView();
    },

    // update (dt) {},

    onDestroy: function(){

    },

    initView: function(){
        if(!D.SvrCfgs.nav2 || D.SvrCfgs.nav2.length == 0) return;

        let content = this.scrollview.content;

        let offsetX = 20;
        let offsetY = 20;
        let w = this.nodeItem.width*1.2;
        let h = this.nodeItem.height*1.2;
        let beginX = -w - offsetX;
        let beginY = -h/2 - offsetY + 10;

        for (var i = 1; i <= D.SvrCfgs.nav2.length; i++) {
            let node = cc.instantiate(this.nodeItem);
            node.active = true;
            content.addChild(node);
            node.position = cc.v2(beginX,beginY);
            node.idx = i;

            beginX += w + offsetX;
            if(i%3==0){
                beginX = -w - offsetX;
                beginY = beginY - h - offsetY + 10;
            }

            this.initItem(node);
        }

        content.height = -beginY + this.nodeItem.height/2;
    },

    initItem: function(node){
        let _this = this;
        let spr_icon = node.getChildByName("Mask").getChildByName("spr_icon");
        if(spr_icon){
            spr_icon.active = false;
        }

        // let url = "moregame/moregame_icon_"+node.idx;
        // cc.loader.loadRes(url, cc.SpriteFrame, function(err, spriteFrame){
        //     if(spr_icon){
        //         spr_icon.active = true;
        //         spr_icon.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        //     }
        // });

        let appId = D.SvrCfgs.nav2[node.idx-1];
        let iconIdx = common.getMoreGameIcon(appId);
        let url = D.moreGameBaseUrl + "iconNew/icon"+iconIdx+".png";
        console.log(url);
        cc.loader.load(url, function(err, texture){
            if(spr_icon){
                spr_icon.active = true;
                spr_icon.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
            }
        });

        let txt_name = node.getChildByName("txt_name");
        if(txt_name){
            txt_name.getComponent(cc.Label).string = D.SvrCfgs.navName[node.idx-1];
        }

        node.on(cc.Node.EventType.TOUCH_END, this.onClickItem, this);
    },

    onClickItem: function(event){
        console.log("========== onClickItem---idx="+event.target.idx)

        if(CC_WECHATGAME) {
            wx.offHide();//需要取消关闭小程序的事件，否则跳转小程序会被全部关掉
            platformUtils.requestCfg(function() {
                let appId = D.SvrCfgs.nav2[event.target.idx-1];
                let path = common.getMoreGamePath(appId);
                console.log("============= onMoreGame2, appId=,path=",appId,path);
                wx.navigateToMiniProgram({
                    appId: appId,
                    path: path,
                    success: function(res) {
                        platformUtils.requestBill(100002, 8, 200, appId);
                        console.log('navigateToMiniProgram, success', res);
                    },
                    fail: function(res) {
                        console.log('navigateToMiniProgram, fail', res);
                    },
                    complete: function(res) {
                        console.log('navigateToMiniProgram, complete', res);
                    },
                });
            });            
        }

    },

    setGraphicsVisible: function(visible){

        this.nodeGraphics.active = visible;

        if(visible && !this.isInitedView){
            this.initView();
            this.isInitedView = true;
        }
    },

});
