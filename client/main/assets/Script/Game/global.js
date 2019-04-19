//全局变量D
window.D = {
    //全局单例公用
    Versioin: "1.1.19",
    poolObjs: {},//public pool
    commonState: {}, //public final var
    commonConfigs:{},//public config
    configsDir: "config/",
    SceneManagerValues: {}, //public final var
    UrlDomain: "https://www.gameairf.xyz/airf-api/",
    // UrlDomain: "http://ls.otctop.com/toujiao-websocket/",
    // UrlDomain: "http://192.168.1.110:8080/",//"http://192.168.1.55:8080/",
    // UrlDomain: "http://192.168.1.55:8080/",
    wxVideoAdUnitId: {'shengji':'adunit-e845eda53d6ecc10', 'fuhuo': 'adunit-3d11a8a5972b3cff', 'zanting':'adunit-cfe2c267872621cb', 
        'game':'adunit-1a45661202ddb189', 'dating':'adunit-407b0a251c863cef', 'lottery': 'adunit-6a51043a65d06a74', 'dailysign':'adunit-cd46873bbbe4489a',
        'redpacket':'adunit-0d21ee748ae77b19', 'doublestar':'adunit-c6737fee6ed72378'},//wechat视频广告ID
    wxAdUnitId: 'adunit-7c969c10b6eb1bed',//wechat广告ID
    wxLaunchOption:null,
    wxShareTicket: null,
    wxMoreGameUrls:["https://aircraft-1255396242.cos.ap-guangzhou.myqcloud.com/moregame/nzpk.jpg","https://aircraft-1255396242.cos.ap-guangzhou.myqcloud.com/moregame/mg2.jpg",
        "https://aircraft-1255396242.cos.ap-guangzhou.myqcloud.com/moregame/mg3.jpg","https://aircraft-1255396242.cos.ap-guangzhou.myqcloud.com/moregame/mg4.png",
        "https://aircraft-1255396242.cos.ap-guangzhou.myqcloud.com/moregame/mg5.jpg","https://aircraft-1255396242.cos.ap-guangzhou.myqcloud.com/moregame/mg6.jpg"],
    moreGameBaseUrl: "https://qcloud-cdn.budding-tech.com/moregame/",
    wxGameClubBtn: null,
    wxVideoMaxNum: 7,//微信视频最多次数
    wxAwardShareMaxNum: 10,//微信获得奖励分享最多次数
    wxFromAppID: '',
    removePopUpLayerCallback: null,
    ShareTypeZhuli:1,//助力
    ShareTypeFriend:2,//好友
    ShareTypeInvite:3,//邀请
    ShareTypeGroup:4,//群
    ShareTypeSettle:5,//结算
    ShareTypeBattle:6,//好友挑战
    ReasonAddCoinAward: 1000,
    ReasonAddCoinUpgrade: 1001,
    ReasonAddCoinVideo: 1002,
    ReasonAddCoinFight: 1003,
    ReasonAddCoinShare: 1005,
    ReasonCostCoinFight: 1006,//出战购买道具
    ReasonLotteryDraw: 1007,//幸运转盘
    AwardCoinVideo:400,
    AwardCoinShare:300,
    currHero:{},//当前出战飞机,id,kind,level,power,powerLevel,attachSpeed,attachSpeedLevel,blood,bloodLevel
    isKillBossTimeStatus:false,
    isKillBossRemainTime:0,//击杀BOSS剩余多少秒内有加成
    magnetStatus:false,//获得磁铁，所有星星 道具主动飞向玩家的飞机
    gameHeroPx:0, //自己的坐标记录下来
    gameHeroPy: 0, //自己的坐标记录下来
    gameBossAttacking : false, //是否正在攻击boss

    SvrCfgs:{},//分享配置
    SvrCfgsReturn: false,
    isVoideClose: cc.Boolean = false,//声音
    gameStatuePause:false, //游戏是否暂停
    recoverHpCost:2, //助力币复活所需数量
    beginFightBuffs:[],//出战前购买的道具
    curSceneName:"",
    lotteryFreeDrawCount: 2,//幸运抽奖每天免费次数
    lotteryVideoDrawCount: 3,//幸运抽奖每天视频次数
    isAutoPopedDailySign: false, //是否已强弹签到

    wxMoreGamePath: {'wx71743e2c3394dc9e': '?krq_qmbk=015&ald_media_id=2677&ald_link_key=56b08fa11a4c2483&ald_position_id=0',
        'wxd6c5337aed6300ec':'pages/index/index?shareType=helplock&ad_channel=6g&uid=162025&sid=10&ald_media_id=6590&ald_link_key=a20a68239e929800',
        'wx52966cd958bcd65b':'pages/index/index?Ads=woying&AdsPos=feiji',
        'wxa43c45d6986bcafd':'pages/index/index?channel=xiaoyouxi',
        'wx5ced162faa4eb1f3':'pages/index/index?share_id=100019&ald_media_id=7753&ald_link_key=8bd4eda525a330a0',
        'wx79fc05b190c49fde':'?ald_media_id=4400&ald_link_key=c7cd0c6aca3bb6bf&ald_position_id=0',
        'wx3df1cf2a43a6b16d':'pages/index/index',
        'wxe0e3ef455414d91d':'?ald_media_id=4560&ald_link_key=af65a1ccfb0475bd&ald_position_id=0',
        'wxd8de2f6276406b2a':'pages/blank/blank?ald_media_id=8305&ald_link_key=b4e2b47d97b246f7',
        'wx5d49b5fa52580889':'pages/index/index?ald_media_id=8138&ald_link_key=b68d0eadada2fb03',
        'wxf48553c6ca9bc829':'pages/shop/index',
        'wx7745ae49b819ab1b':'pages/index/index?source=&ald_media_id=10489&ald_link_key=dd8086b79675d327'
    },

};

window.ItemConst = {
    SignHeroGas:  1000,//签到拖尾
    SignNewPlane: 2000,//签到小飞机
};

// 全局通知
window.Notification = {
    _eventMap: [],

    on: function (type, callback, target) {
        if (this._eventMap[type] === undefined) {
            this._eventMap[type] = [];
        }
        this._eventMap[type].push({ callback: callback, target: target });
    },

    emit: function (type, parameter) {
        var array = this._eventMap[type];
        if (array === undefined) return;

        for (var i = 0; i < array.length; i++) {
            var element = array[i];
            if (element) element.callback.call(element.target, parameter);
        }
    },

    off: function (type, callback) {
        var array = this._eventMap[type];
        if (array === undefined) return;

        for (var i = 0; i < array.length; i++) {
            var element = array[i];
            if (element && element.callback === callback) {
                array[i] = undefined;
                break;
            }
        }
    },

    offType: function (type) {
        this._eventMap[type] = undefined;
    },
};

window.JsUnit = {
    getVectorRadians: function (x1, y1, x2, y2) {
        let len_y = y2 - y1;
        let len_x = x2 - x1;

        let tan_yx = tan_yx = Math.abs(len_y) / Math.abs(len_x);
        let angle = 0;
        if (len_y >= 0 && len_x < 0) {
            angle = Math.atan(tan_yx) * 180 / Math.PI - 90;
        } else if (len_y >= 0 && len_x > 0) {
            angle = 90 - Math.atan(tan_yx) * 180 / Math.PI;
        } else if (len_y < 0 && len_x <= 0) {
            angle = -Math.atan(tan_yx) * 180 / Math.PI - 90;
        } else if (len_y < 0 && len_x >= 0) {
            angle = Math.atan(tan_yx) * 180 / Math.PI + 90;
        } 
        return angle;
    },
};

//设备适配
window.Device = {
    //刘海屏处理偏移 iphonex:2436 x 1125
    needOffsetPixel: function(){
        let num = cc.winSize.width / cc.winSize.height;
        if(num < 0.49) {
            return true;
        }

        return false;
    },
};