var common = {

    baseZorder: 1000,
    popLayerNum: 0,
    isLoading: cc.Boolean,

    PopUpBg : {
        None : 0, //无背景
        Gray : 1, //灰色背景 默认选项
    },

    PopUpAction : {
        None : 0, //立即显示，无动画 默认选项
        Scale : 1, //缩放
    },


    writeObj:function (obj){ 
        var description = ""; 
        for(var i in obj){ 
            var property=obj[i]; 
            description+=i+" = "+property+"\n"; 
        } 
        console.log(description);   
    },

    /**
     * 异步加载配置文件
     */
    loadJsonCfg: function(name) {
        if( ! D.commonConfigs[name]) {
            let url = D.configsDir+name;//cc.url.raw(D.configsDir+name+".json");
            cc.loader.loadRes(url, function(err, res){
                D.commonConfigs[name] = res.json;
                cc.log( 'load...load['+ name +'], err['+err+'] result: ' + JSON.stringify(res.json));
            });
        }
    },
    /**
     * 异步加载配置文件目录下的所有文件
     */
    loadJsonAllCfgs: function() {
        let url = D.configsDir;
        cc.loader.loadResDir(url, function(err, res) {
            res.forEach(function(val){
                let name = val._name;
                let json = val.json;
                D.commonConfigs[name] = json;
                cc.log( 'loadAlll...load['+ name +'], result: ' + JSON.stringify(json));
            });
        });
    },

    /**
     * 指定name配置的列表
     */
    getJsonCfgs:function(name) {
        return D.commonConfigs[name];
    },

    /**
     * 指定name,id的一个配置
     */
    getJsonCfgByID:function(name, id) {
        let cfgs = this.getJsonCfgs(name);
        let ret = null;
        if(cfgs) {
            for(let idx in cfgs) {
                if(cfgs[idx].id == id) {
                    ret = cfgs[idx];
                    break;
                }
            }
        }
        return ret;
    },

    /**
     * 指定name,Key的一个配置
     */
    getJsonCfgByKey:function(name, key, val) {
        let cfgs = this.getJsonCfgs(name);
        let ret = null;
        if(cfgs) {
            for(let idx in cfgs) {
                let cfg = cfgs[idx];
                if(cfg[''+key+''] == val) {
                    ret = cfg;
                    break;
                }
            }
        }
        return ret;
    },

    getGameHeroCfg:function(){
        let kind = D.currHero.kind
        let level = D.currHero.level
        let heroCfgs = common.getJsonCfgs("hero")
        //属性配置
        for (var index = 0; index < heroCfgs.length; index++) {
            var element = heroCfgs[index];
            if (element.kind == kind && element.level == level) {
                return element
            }
        }

        return null
    },
    /**
     * 弹出一层layer(prefab)
     * position 默认值放在正中央
     */
    popUpLayer: function(parent, prefab, position) {
        let layer = this.createPopUpLayer(parent, prefab, position);
        parent.addChild(layer);
        return layer;
    },
    /**
     * 当前层弹出一层layer(prefab)
     * position 默认值放在正中央
     */
    popUpLayerCurrent: function(prefab, position) {
        return this.popUpLayer(cc.director.getScene(), prefab, position);
    },
    /**
     * 根据prefab创建layer，但不加入parent
     */
    createPopUpLayer: function(parent, prefab, position) {
        let layer = cc.instantiate(prefab.data);
        let pos = position;
        if( ! pos) {
            pos = parent.convertToWorldSpace(new cc.v2(layer.width/2, layer.height/2));
        }
        layer.position = pos;
        return layer;
    },
    /**
     * 当前层根据prefab创建layer，但不加入parent
     */
    createPopUpLayerCurrent: function(prefab, position) {
        return this.createPopUpLayer(cc.director.getScene(), prefab, position);
    },

    /**
     * 弹窗layer
     * prefab 
     * bg : 背景
     * action: 动画
     * color: 颜色， rgba
     */
    showPopUpLayer: function(prefab, popBg, popAction, color, removedCallback){
        let layer = this.createPopUpLayerCurrent(prefab);
        this.popLayerNum += 1;
        let zorder = this.baseZorder + this.popLayerNum*10;

        if (popBg == null) {
            popBg = this.PopUpBg.Gray;
        }
        if (popBg == this.PopUpBg.Gray){

            let blockUI = cc.director.getScene().getChildByName("GameBlockUITag");
            if (!blockUI)
            {
                if( color == null){
                    color = new cc.Color(0, 0, 0, 200);
                }

                blockUI = new cc.Node();
                blockUI.position = layer.position;
                blockUI.addComponent(cc.Graphics);

                let graphics = blockUI.getComponent(cc.Graphics);
                graphics.fillColor = color;

                let maxWidth = Math.max(cc.winSize.width, layer.width);
                let maxHeight = Math.max(cc.winSize.height, layer.height);
                graphics.fillRect(0, 0, maxWidth, maxHeight);

                blockUI.position = cc.v2(0, 0); 
                cc.director.getScene().addChild(blockUI, zorder-1, "GameBlockUITag");

            }else{
                blockUI.zIndex = zorder-1;
            }

            layer.addComponent(cc.BlockInputEvents);
        }

        cc.director.getScene().addChild(layer, zorder);

        if (popAction == null) {
            popAction = this.PopUpAction.Scale;
        }

        if (popAction == this.PopUpAction.Scale){
            let delayCallback = function(){
                layer.scale = 0.8;
                layer.opacity = 255;
            }

            let _this = this;
            let act1 = cc.delayTime(0.01);
            let act2 = cc.callFunc(delayCallback, _this);
            let act3 = cc.scaleTo(0.15,1);
            layer.runAction(cc.sequence( act1, act2, act3));
            layer.opacity = 1;
        }
        if( ! D.removePopUpLayerCallback) {
            D.removePopUpLayerCallback = removedCallback;
        }
        return layer;
    },

    /**
     * 关闭layer
     */
    removePopUpLayer: function(prefab){
        prefab.node.parent.removeChild(prefab.node);
        this.removeBlock();
    },

    removeBlock: function(){
        this.popLayerNum -= 1;

        let blockUI = cc.director.getScene().getChildByName("GameBlockUITag");
        if (blockUI){
            if (this.popLayerNum > 0){
                blockUI.zIndex = this.baseZorder + this.popLayerNum*10 - 1;
            }else{
                blockUI.parent.removeChild(blockUI);
                let callback = D.removePopUpLayerCallback;
                console.log("---------------clearPopLayer scene name="+D.curSceneName);
                if(callback && D.curSceneName == "Start") {
                    callback();
                    D.removePopUpLayerCallback = null;
                }
            }
        }

        if(this.popLayerNum == 0){
            Notification.emit("remove_all_poplayer");
        }
    },

    clearPopLayer: function(){
        this.popLayerNum = 0;
        let blockUI = cc.director.getScene().getChildByName("GameBlockUITag");
        if(blockUI){
            blockUI.parent.removeChild(blockUI);
        }
    },

    loading: function(times){
        if (this.isLoading) return;
        let _this = this;
        this.isLoading = true;
        cc.loader.loadRes("prefabs/loading", function(err,prefab){
            if (_this.isLoading){
                let layer = _this.showPopUpLayer(prefab, _this.PopUpBg.Gray, _this.PopUpAction.None);
                layer.zIndex = 9998;
                layer.name = "loadingLayer";
            }
        });
    },

    hideLoading: function(){
        this.isLoading = false;
        let loading = cc.director.getScene().getChildByName("loadingLayer");
        if (loading){
            loading.parent.removeChild(loading);
            this.removeBlock();
        }
    },

    /**
     * 系统飘字
     * msg : 描述
     * color: 颜色，默认白色(#ffffff)
     */
    sysMessage: function(msg,color,offPos){
        cc.loader.loadRes("prefabs/sysMessage", function(err,prefab){
            let layer = cc.instantiate(prefab.data);
            let sysScript = layer.getComponent('sysMessage');
            if (sysScript){
                sysScript.onTips(layer, msg, color, offPos)
            }
        });
    },

    getShareCfgByType: function(type) {
        let cfgs = this.getJsonCfgs('Share');
        if(cfgs) {
            let res = [];
            for(let idx in cfgs) {
                if(cfgs[idx].type == type) res.push(cfgs[idx]);
            }
            return res[Math.floor(Math.random() * res.length)];
        }
        return {title:"我刚刚突破了最高分啦,你要来挑战一下吗？", imageUrl:'https://aircraft-1255396242.cos.ap-guangzhou.myqcloud.com/share/share6.png'};
    },
    guid: function() {
        function S4() {
           return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        }
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    },
    //播放按钮声音
    onPlayBtnSound: function(){
        if( ! D.isVoideClose){
            cc.loader.loadRes("subpack/sound/button",cc.AudioClip, function(err,btnSound){
                cc.audioEngine.play(btnSound);
            });
        }
    },
    //弹窗声音
    onPlayPopupSound: function(){
        if( ! D.isVoideClose){
            cc.loader.loadRes("subpack/sound/popup",cc.AudioClip, function(err,popupSound){
                cc.audioEngine.play(popupSound);
            });
        }
    },
    //返回按钮声音
    onPlayBtnReturnSound: function(){
        if( ! D.isVoideClose){
            cc.loader.loadRes("subpack/sound/button_return",cc.AudioClip, function(err,returnSound){
                cc.audioEngine.play(returnSound);
            });
        }
    },
    //获得飞机声音
    onPlayAwardPlaneSound: function(){
        if( ! D.isVoideClose){
            cc.loader.loadRes("subpack/sound/award_plane",cc.AudioClip, function(err,awardPlane){
                cc.audioEngine.play(awardPlane);
            });
        }
    },
    //获得金币声音
    onPlayAwardCoinSound: function(){
        if( ! D.isVoideClose){
            cc.loader.loadRes("subpack/sound/award_coin",cc.AudioClip, function(err,awardCoin){
                cc.audioEngine.play(awardCoin);
            });
        }
    },
    //计算分数转动声音
    onPlayScoreChangeSound: function(){
        if( ! D.isVoideClose){
            cc.loader.loadRes("subpack/sound/score_change",cc.AudioClip, function(err,scoreChange){
                cc.audioEngine.play(scoreChange);
            });
        }
    },
    //破纪录声音
    onPlayScoreChangeSound: function(){
        if( ! D.isVoideClose){
            cc.loader.loadRes("subpack/sound/record_breaking",cc.AudioClip, function(err,recordBreaking){
                cc.audioEngine.play(recordBreaking);
            });
        }
    },
    //是否同一天
    isSameDay: function(signTime){
        let nowTime = new Date();

        let signDate = signTime.getDate();//日
        let signMonth = signTime.getMonth();//月
        let signYear = signTime.getFullYear();//年
       
        let nowDate = nowTime.getDate();
        let nowMonth = nowTime.getMonth();
        let nowYear = nowTime.getFullYear();
        console.log("checkDateTime", signYear, signMonth, signDate);
        console.log("nowDateTime", nowYear, nowMonth, nowDate);
        return signYear == nowYear &&  signMonth == nowMonth && signDate == nowDate?true:false;
    },
    stringStartWith: function(str, sub) {
        if (str.substr(0, sub.length) == sub) {
            return true;
        }
        return false;
    },
    createImage(avatarUrl, sprHeadimg) {
        if(this.stringStartWith(avatarUrl, 'http')) {
            if (CC_WECHATGAME) {
                try {
                    let image = wx.createImage();
                    image.onload = () => {
                        try {
                            let texture = new cc.Texture2D();
                            texture.initWithElement(image);
                            texture.handleLoadedTexture();
                            sprHeadimg.spriteFrame = new cc.SpriteFrame(texture);
                        } catch (e) {
                            cc.log(e);
                            sprHeadimg.node.active = false;
                        }
                    };
                    image.src = avatarUrl;
                }catch (e) {
                    cc.log(avatarUrl+"="+e);
                    sprHeadimg.node.active = false;
                }
            }
            // else {
            //     console.log("start..stringStartWith http .." + avatarUrl);
            //     cc.loader.load({url: avatarUrl, type: 'jpg'}, (err, texture)=>{
            //         sprHeadimg.spriteFrame = new cc.SpriteFrame(texture);
            //     }); 
            // }
        }
        else {
            cc.loader.loadRes(avatarUrl, cc.SpriteFrame, function(err, spriteFrame) {
                sprHeadimg.spriteFrame = spriteFrame;
            });
        }
    },

    iphonexAdapter: function(node){
        if(!node) return;
        if(!Device.needOffsetPixel()) return;

        let widget = node.getComponent(cc.Widget);
        if(widget){
            widget.top += 100;
        }else{
            node.y += 100;
        }
    },

    //领奖
    receiveAward: function(award){
        if(award == undefined || award == null) return;

        let tips = "恭喜您获得"
        if(award.coin && award.coin > 0){
            D.commonState.userGameInfo.coin = award.mycoin;
            tips = tips + "星星x" + award.coin
        }
        if(award.qzb && award.qzb > 0){
            D.commonState.userGameInfo.qzb = award.myqzb;
            tips = tips + ",钻石x" + award.qzb
        }

        if(award.hero != null){
            D.commonState.heroList.push(award.hero);
            tips = tips + ",小飞机x1"
        }

        if(award.items && award.items.length > 0){
            platformUtils.requestItemList(function(res){}, true);
            award.items.forEach((element,idx) => {
                if(element.id == ItemConst.SignHeroGas){
                    tips = tips + ",签到拖尾x1"
                }
            });
        }
        console.log(tips)
        this.sysMessage(tips);
    },

    getMoreGamePath: function(appid){
        let path = null;
        if(appid && D.wxMoreGamePath[appid]){
            path = D.wxMoreGamePath[appid];
        }
        return path;
    },

    getMoreGameIcon: function(appid){
        let picIndexs = ['wx5079dbb42e9672b7','wxd4abb0f4db18da79','wxf6658e9f64a5c09c',
                        'wx25a6ac1d3557e156','wxe50049290a9887d1','wx71743e2c3394dc9e',
                        'wx557f39afcfcb06d6','wxd6c5337aed6300ec','wx52966cd958bcd65b',
                        'wxa43c45d6986bcafd','wx5ced162faa4eb1f3','wx79fc05b190c49fde',
                        'wxd8de2f6276406b2a','wxe0e3ef455414d91d','wxe003c14add4d3974',
                        'wx3df1cf2a43a6b16d','wx5d49b5fa52580889','wxf48553c6ca9bc829',
                        'wx7745ae49b819ab1b'
                    ];

                        // 步数换换乐: wxd8de2f6276406b2a
        // 欧巴欧巴: wxe0e3ef455414d91d
        // 奔跑吧彩球: wxe003c14add4d3974
        // 指色玩: wx3df1cf2a43a6b16d

        for (let i = 1; i <= picIndexs.length; i++) {
            if(appid == picIndexs[i-1]){
                console.log("------- getMoreGameIcon, idx=",i)
                return i;
            }
        }
        console.log("------- getMoreGameIcon, idx=",picIndexs.length + 1)
        return picIndexs.length + 1;
    }
};
module.exports = common;


