var wxCommon = require('WxCommon');

cc.Class({
    extends: cc.Component,

    properties: {
        
        itemPrefab:{  //项的资源预制体
            type:cc.Prefab,
            default:null,
        },
        scrollView:{ //获取scrollview组件
            type:cc.ScrollView,
            default:null,
        },
        content: cc.Node,

        myRankInfoPrefab: cc.Prefab,
        layMyRankInfo: cc.Layout,
        
        gameOverNearFriendPrefab: cc.Prefab,
        layNearFriend: cc.Layout,

        gameSettleRankPrefab: cc.Prefab,
        layGameSettleRank: cc.Layout,

        layNearInGame: cc.Layout,
        nearInGamePrefab: cc.Prefab,
        nearInGameDist: cc.Float,
    },

    onLoad:function () {     
        //this.scrollView.node.on("scroll-ended",this.onScrollEnded.bind(this),this);//监听scrollview事件
        //this.scrollView.scrollToTop(2);
    },
    start() {

        this.removeChild();
        console.log('rank main start');
        let _this = this;
        wx.onMessage(data=> {
            console.log('receive from main region:'+ JSON.stringify(data));
            switch(data.type) {
                case 'submitUserData':
                _this.submitUserData(data);
                break;
                case 'friendsRank':
                _this.fetchFriendsRank(data);
                break;
                case 'friendsRank2':
                _this.fetchFriendsRank2(data);
                break;
                case 'groupRank':
                _this.fetchGroupRank(data);
                break;
                case 'worldRank':
                _this.fetchWorldRank(data);
                break;
                case 'gameOverRank':
                _this.getNearFriend(data);
                break;
                case 'gameSettleRank':
                _this.getRankTop(data);
                break;
                case 'cleanRank':
                _this.removeRankChild(data);
                break;
                case 'clean':
                _this.removeChild(0);
                break;
                case 'nearInGame':
                _this.nearFriendInGame(data);
                break;
            }
        });
    },
    removeRankChild:function(data) {
        if(this.scrollView && this.scrollView.node) {
            this.scrollView.node.active = false;   
        }
        if(this.content) {
            this.content.active = false;
            this.content.removeAllChildren();
        }
        if(this.layMyRankInfo && this.layMyRankInfo.node) {
            this.layMyRankInfo.node.active = false;
            this.layMyRankInfo.node.removeAllChildren();
        }
        this.layGameSettleRank.node.active = false;
        if(data && data.isShowRankTop3) {
            this.layGameSettleRank.node.active = true;
        }
    },
    removeNearIngameChild:function() {        
        if(this.layNearInGame && this.layNearInGame.node) {
            this.layNearInGame.node.active = false;
            this.layNearInGame.node.removeAllChildren();
        }
    },
    removeChild: function(doNotRemoveNearIngame) {
        this.removeRankChild(null);     
        if(this.layNearFriend && this.layNearFriend.node) {
            this.layNearFriend.node.active = false;
            this.layNearFriend.node.removeAllChildren();
        }
        if(this.layGameSettleRank && this.layGameSettleRank.node) {
            this.layGameSettleRank.node.active = false;
            //layGameSettleRank 不能removeAllChildren，因为结算界面有排行榜覆盖的问题
        }
        if( ! doNotRemoveNearIngame) {
            this.removeNearIngameChild();
        }
    },
    //提交数据
    submitUserData: function(data) {
        let highestScore = data.highestScore;
        let score = data.score;
        let dist = data.dist;
        let _this = this;
        /*if(highestScore > 0 && score > highestScore) {
            console.log('score > highestScore ' + score + "," + highestScore);
            this.doSubmitUserData(data);
        }*/        
        wx.getUserCloudStorage({
            keyList: ["classic", 'score', 'dist'],
            success: function(rs) {
                let flagScore = false;
                let flagClassicScore = false;
                let flagDist = false;
                rs.KVDataList.forEach(KVData => {
                    if(KVData.key == 'score') {
                        if(parseInt(KVData.value) < parseInt(score)) {
                            console.log('KVData.value < score ' + KVData.value + "," + score);
                            flagScore = false;
                        }
                        else flagScore = true;
                    }
                    else if(KVData.key == 'classic') {
                        let classicVal = JSON.parse(KVData.value);
                        let kvscore = classicVal.wxgame.score;
                        if(parseInt(kvscore) < parseInt(score)) {
                            console.log('KVData.wxgame.score < score ' + kvscore + "," + score);
                            flagClassicScore = false;
                        }
                        else flagClassicScore = true;
                    }
                    else if(KVData.key == 'dist') {
                        if(parseFloat(KVData.value) < parseFloat(dist)) {
                            console.log('KVData.value < score ' + KVData.value + "," + score);
                            flagDist = false;
                        }
                        else flagDist = true;
                    }
                });
                if( ! flagScore) _this.doSubmitUserScoreData(data);
                if( ! flagDist && flagScore) _this.doSubmitUserDistData(data);
                if( ! flagClassicScore) _this.doSubmitUserData(data);
            },
            fail: function(rs) {
                console.log("getUserCloudStorage fail" + rs);
            },
            complete: function(rs) {
                console.log("getUserCloudStorage complete");
            }
        });
    },
    doSubmitUserScoreData: function(data) {
        console.log("doSubmitUserScoreData " + JSON.stringify(data));
        let score = data.score;
        let hero = data.hero;
        wx.setUserCloudStorage({
            KVDataList:[
                {key:"score", value: score+""},
                {key:"dist", value: dist+""},
                {key:"hero", value: hero.tag+""}
            ],
            success: function (rs) {
                console.log('setUserCloudStorage success');
            },
            fail: function (rs) {
                console.log('setUserCloudStorage fail' + rs);
            },
            complete: function (rs) {
                console.log('setUserCloudStorage ok');
            }
        });
    },
    //执行提交数据
    doSubmitUserData: function(data) {
        console.log("doSubmitUserData " + JSON.stringify(data));
        let score = data.score;
        let hero = data.hero;
        let dist = data.dist;
        let val = {"wxgame":{"score":score,"update_time":new Date().getTime()},"hero":hero.tag};
        wx.setUserCloudStorage({
            KVDataList:[
                {key:"classic", value: JSON.stringify(val)},
            ],
            success: function (rs) {
                console.log('setUserCloudStorage success');
            },
            fail: function (rs) {
                console.log('setUserCloudStorage fail' + rs);
            },
            complete: function (rs) {
                console.log('setUserCloudStorage ok');
            }
        });
    },
    doSubmitUserDistData: function(data) {
        let dist = data.dist;
        wx.setUserCloudStorage({
            KVDataList:[
                {key:"dist", value: dist+""},],
            success: function (rs) {
                console.log('setUserCloudStorage doSubmitUserDistData success', rs);
            },
            fail: function (rs) {
                console.log('setUserCloudStorage doSubmitUserDistData fail' + rs);
            },
            complete: function (rs) {
                console.log('setUserCloudStorage doSubmitUserDistData ok');
            }
        });
    },
    //群排行
    fetchGroupRank: function(data) {
        this.removeChild();
        let selfAvatarUrl = data.selfAvatarUrl;
        let selfNickname = data.selfNickname;
        let selfScore = data.selfScore;
        let shareTicket = data.shareTicket;
        let _this = this;
        _this.scrollView.node.active = true;
        _this.content.active = true;
        wx.getGroupCloudStorage({
            shareTicket: shareTicket,
            keyList: ["classic"],//['score', 'hero'],
            success: res => {
                console.log("wx.getGroupCloudStorage success", res);
                let data = res.data;
                let rsData = [];
                for(let i=0; i<data.length; i++) {
                    var friend = data[i];                    
                    let info = {};
                    info.avatarUrl = friend.avatarUrl;
                    info.nickname = friend.nickname;
                    info.score = 0;
                    info.hero = {};
                    if(friend.KVDataList.length > 0) {
                        friend.KVDataList.forEach(KVData => {
                            if(KVData.key == 'classic') {
                                let classicVal = JSON.parse(KVData.value);
                                info.score = parseInt(classicVal.wxgame.score);
                                info.hero = classicVal.hero ? classicVal.hero : "1_1";
                            }
                            // if(KVData.key == 'score') {
                            //     info.score = KVData.value;
                            // }
                            // else if(KVData.key == 'hero') {
                            //     info.hero = JSON.parse(KVData.value);
                            // }
                        });
                    }
                    rsData.push(info);
                }
                //排序
                rsData.sort((a, b) => {
                    return b.score - a.score;
                });
                for(let i=0; i<rsData.length; i++) {
                    let info = rsData[i];
                    console.log((i+1) + " initData " + JSON.stringify(info));
                    let item = cc.instantiate(_this.itemPrefab);
                    item.getComponent('RankItem').initData(i+1, info);
                    _this.content.addChild(item);
                    //自己的排行信息
                    if(info.avatarUrl == selfAvatarUrl) {
                        _this.layMyRankInfo.node.active = true;
                        let myRankItem = cc.instantiate(_this.myRankInfoPrefab);
                        myRankItem.getComponent('MyRankInfo').initData(i+1, info);
                        _this.layMyRankInfo.node.addChild(myRankItem);
                    }
                }
                _this.scrollView.scrollToTop(0.1);
            },
            fail: res => {
                console.log("wx.getGroupCloudStorage fail", res);
            },
        });
    },
    //好友排行
    fetchFriendsRank2: function(data) {
        this.removeChild();
        let selfOpenId = data.selfOpenId;
        let selfAvatarUrl = data.selfAvatarUrl;
        let selfNickname = data.selfNickname;
        let selfScore = data.selfScore;
        let _this = this;
        let selfInTop = false;
        let selfHero = data.hero;
        _this.scrollView.node.active = true;
        _this.content.active = true;
        wx.getFriendCloudStorage({
            keyList: ['score', 'hero'],
            success: res => {
                //_this.scrollView.node.active = true;
                //console.log(JSON.stringify(res));
                let data = res.data;
                let rsData = [];
                for(let i=0; i<data.length; i++) {
                    var friend = data[i];
                    let info = {};
                    info.avatarUrl = friend.avatarUrl;
                    info.nickname = friend.nickname;
                    info.score = 0;
                    info.hero = "1_1";
                    if(friend.KVDataList.length > 0) {
                        friend.KVDataList.forEach(KVData => {
                            if(KVData.key == 'score') {
                                info.score = KVData.value;
                            }
                            else if(KVData.key == 'hero') {
                                try {
                                    let heroObj = JSON.parse(KVData.value);
                                    info.hero = heroObj.tag;
                                }catch(e) {}
                            }
                        });
                    }
                    rsData.push(info);
                }
                //排序
                rsData.sort((a, b) => {
                    return b.score - a.score;
                });
                for(let i=0; i<rsData.length; i++) {
                    let info = rsData[i];
                    var item = cc.instantiate(_this.itemPrefab);                    
                    console.log((i+1) + " initData " + JSON.stringify(info));
                    _this.content.addChild(item);
                    item.getComponent('RankItem').initData(i+1, info);
                    //自己的排行信息
                    if(info.avatarUrl == selfAvatarUrl) {
                        _this.layMyRankInfo.node.active = true;
                        let myRankItem = cc.instantiate(_this.myRankInfoPrefab);
                        _this.layMyRankInfo.node.addChild(myRankItem);
                        myRankItem.getComponent('MyRankInfo').initData(i+1, info);
                        selfInTop = true;
                    }
                }
                _this.scrollView.scrollToTop(0.1);
            },
        });
        if(selfInTop == false) {
            this.layMyRankInfo.node.active = true;
            let myRankItem = cc.instantiate(_this.myRankInfoPrefab);
            _this.layMyRankInfo.node.addChild(myRankItem);
            myRankItem.getComponent('MyRankInfo').initData(-1, {avatarUrl:selfAvatarUrl,nickname:selfNickname,score:selfScore,hero:selfHero.tag});
        }
        /*for(let i=0; i<20; i++) {
            var item = cc.instantiate(_this.itemPrefab);
            item.getComponent('RankItem').initData(1, {hero:{"id":1,"kind":1,"subSeq":1,"level":1,"tag":"3_5"},avatarUrl:'https://wx.qlogo.cn/mmopen/vi_32/2wtemib46MuZyFZozI7cL3W3vvicKTyH97Uj1nsl22WWVuccvxlB3LG3oNmibEJfEr1GoBMXAzDLicbN3qibdzeJXjg/132',nickname:'peter.lin',score:888666});
            _this.content.addChild(item);
        }*/
    },
    //好友排行
    fetchFriendsRank: function(data) {
        this.removeChild();
        let selfOpenId = data.selfOpenId;
        let selfAvatarUrl = data.selfAvatarUrl;
        let selfNickname = data.selfNickname;
        let selfScore = data.selfScore;
        let _this = this;
        let selfInTop = false;
        let selfHero = data.hero;
        _this.scrollView.node.active = true;
        _this.content.active = true;
        wx.getFriendCloudStorage({
            keyList: ["classic"],//['score', 'hero'],
            success: res => {
                //_this.scrollView.node.active = true;
                //console.log(JSON.stringify(res));
                let data = res.data;
                let rsData = [];
                for(let i=0; i<data.length; i++) {
                    var friend = data[i];
                    let info = {};
                    info.avatarUrl = friend.avatarUrl;
                    info.nickname = friend.nickname;
                    info.score = 0;
                    info.hero = {};
                    if(friend.KVDataList.length > 0) {
                        friend.KVDataList.forEach(KVData => {
                            if(KVData.key == 'classic') {
                                let classicVal = JSON.parse(KVData.value);
                                info.score = parseInt(classicVal.wxgame.score);
                                info.hero = classicVal.hero ? classicVal.hero : "1_1";
                            }
                            // if(KVData.key == 'score') {
                            //     info.score = KVData.value;
                            // }
                            // else if(KVData.key == 'hero') {
                            //     info.hero = JSON.parse(KVData.value);
                            // }
                        });
                    }
                    rsData.push(info);
                }
                //排序
                rsData.sort((a, b) => {
                    return b.score - a.score;
                });
                for(let i=0; i<rsData.length; i++) {
                    let info = rsData[i];
                    var item = cc.instantiate(_this.itemPrefab);                    
                    console.log((i+1) + " initData " + JSON.stringify(info));
                    _this.content.addChild(item);
                    item.getComponent('RankItem').initData(i+1, info);
                    //自己的排行信息
                    if(info.avatarUrl == selfAvatarUrl) {
                        _this.layMyRankInfo.node.active = true;
                        let myRankItem = cc.instantiate(_this.myRankInfoPrefab);
                        _this.layMyRankInfo.node.addChild(myRankItem);
                        myRankItem.getComponent('MyRankInfo').initData(i+1, info);
                        selfInTop = true;
                    }
                }
                _this.scrollView.scrollToTop(0.1);
            },
        });
        if(selfInTop == false) {
            this.layMyRankInfo.node.active = true;
            let myRankItem = cc.instantiate(_this.myRankInfoPrefab);
            _this.layMyRankInfo.node.addChild(myRankItem);
            myRankItem.getComponent('MyRankInfo').initData(-1, {avatarUrl:selfAvatarUrl,nickname:selfNickname,score:selfScore,hero:selfHero.tag});
        }
        /*for(let i=0; i<20; i++) {
            var item = cc.instantiate(_this.itemPrefab);
            item.getComponent('RankItem').initData(1, {hero:{"id":1,"kind":1,"subSeq":1,"level":1,"tag":"3_5"},avatarUrl:'https://wx.qlogo.cn/mmopen/vi_32/2wtemib46MuZyFZozI7cL3W3vvicKTyH97Uj1nsl22WWVuccvxlB3LG3oNmibEJfEr1GoBMXAzDLicbN3qibdzeJXjg/132',nickname:'peter.lin',score:888666});
            _this.content.addChild(item);
        }*/
    },
    
    getNearFriend: function(data) {
        this.removeChild();
        let selfOpenId = data.selfOpenId;
        let selfAvatarUrl = data.selfAvatarUrl;
        let selfScore = data.score;
        let _this = this;
        wx.getFriendCloudStorage({
            keyList: ["classic"],//['score', 'hero'],
            success: rs => {
                let rsData = rs.data;
                let nearScore = 0;
                let nearFriend = null;
                for(let i=0; i<rsData.length; i++) {
                    var info = rsData[i];
                    if(info.avatarUrl == selfAvatarUrl) {
                        continue;
                    }
                    info.score = 0;
                    if(info.KVDataList.length > 0) {
                        info.KVDataList.forEach(KVData => {
                            if(KVData.key == 'classic') {
                                let classicVal = JSON.parse(KVData.value);
                                info.score = parseInt(classicVal.wxgame.score);
                                info.hero = classicVal.hero ? classicVal.hero : "1_1";
                            }
                            // if(KVData.key == 'score') {
                            //     info.score = KVData.value;
                            // }
                        });
                    }
                    if((nearScore == 0 || info.score < nearScore) && info.score > selfScore) {
                        nearScore = info.score;
                        nearFriend = info;
                    }
                }
                if(nearScore > 0 && nearFriend) {
                    console.log("nearFriend ", JSON.stringify(nearFriend));
                    let item = cc.instantiate(_this.gameOverNearFriendPrefab);
                    _this.layNearFriend.node.addChild(item);
                    item.getComponent('GameOverNearFriend').initData(nearFriend);
                    _this.layNearFriend.node.active = true;
                }
                else {                    
                    _this.layNearFriend.node.active = false;
                    console.log("nearFriend is null");
                }
            },
        });
    },
    
    getRankTop: function(data) {
        this.removeChild();
        this.layGameSettleRank.node.removeAllChildren();
        let top = 3;
        let _this = this;
        wx.getFriendCloudStorage({
            keyList: ["classic"],//['score', 'hero'],
            success: res => {
                let data = res.data;
                let rsData = [];
                for(let i=0; i<data.length; i++) {
                    var friend = data[i];
                    let info = {};
                    info.avatarUrl = friend.avatarUrl;
                    info.nickname = friend.nickname;
                    info.score = 0;
                    info.hero = {};
                    if(friend.KVDataList.length > 0) {
                        friend.KVDataList.forEach(KVData => {
                            if(KVData.key == 'classic') {
                                let classicVal = JSON.parse(KVData.value);
                                info.score = parseInt(classicVal.wxgame.score);
                                info.hero = classicVal.hero ? classicVal.hero : "1_1";
                            }
                            // if(KVData.key == 'score') {
                            //     info.score = KVData.value;
                            // }
                            // else if(KVData.key == 'hero') {
                            //     info.hero = JSON.parse(KVData.value);
                            // }
                        });
                    }
                    rsData.push(info);
                }
                //排序
                rsData.sort((a, b) => {
                    return b.score - a.score;
                });
                top = rsData.length > top ? top : rsData.length;
                _this.layGameSettleRank.node.active = true;
                let topRankItem = cc.instantiate(_this.gameSettleRankPrefab);
                _this.layGameSettleRank.node.addChild(topRankItem);
                let topRankScript = topRankItem.getComponent('GameSettleRank');
                for(let i=0; i<top; i++) {
                    let info = rsData[i];
                    console.log("getRankTop", i, info);
                    topRankScript.initData(i+1, info);
                }
            },
        });
    },
    fetchWorldRank: function(data) {
        this.removeChild();
        let selfOpenId = data.selfOpenId;
        let selfAvatarUrl = data.selfAvatarUrl;
        let selfNickname = data.selfNickname;
        let selfScore = data.selfScore;
        let _this = this;
        let selfInTop = false;
        let selfHero = data.hero;
        _this.scrollView.node.active = true;
        _this.content.active = true;

        let rsData = data.rank;
        for(let i=0; i<rsData.length; i++) {
            let info = rsData[i];
            if( ! info.avatarUrl || info.avatarUrl == 'null') {
                continue;
            }
            var item = cc.instantiate(_this.itemPrefab);                    
            console.log((i+1) + " initData " + JSON.stringify(info));
            _this.content.addChild(item);
            item.getComponent('RankItem').initData(i+1, info);
            //自己的排行信息
            if(info.avatarUrl == selfAvatarUrl) {
                _this.layMyRankInfo.node.active = true;
                let myRankItem = cc.instantiate(_this.myRankInfoPrefab);
                _this.layMyRankInfo.node.addChild(myRankItem);
                myRankItem.getComponent('MyRankInfo').initData(i+1, info);
                selfInTop = true;
            }
        }
        _this.scrollView.scrollToTop(0.1);
        if(selfInTop == false) {
            this.layMyRankInfo.node.active = true;
            let myRankItem = cc.instantiate(_this.myRankInfoPrefab);
            _this.layMyRankInfo.node.addChild(myRankItem);
            myRankItem.getComponent('MyRankInfo').initData(-1, {avatarUrl:selfAvatarUrl,nickname:selfNickname,score:selfScore,hero:selfHero});
        }
    },

    nearFriendInGame: function(data) {
        this.removeChild(1);
        let selfAvatarUrl = data.selfAvatarUrl;
        let selfDist = parseFloat(data.dist);
        let nearNum = parseInt(data.near);
        let _this = this;
        
        let nodeInGame = _this.layNearInGame.node.getChildByName("inGame");
        if(nodeInGame) {
            if(selfDist >= _this.nearInGameDist) {
                _this.nearInGameDist = 0;
                _this.removeNearIngameChild();
            }
            else {
                let script = nodeInGame.getComponent('NearFriendInGame');
                script.resetScore(selfDist);
                return;
            }
        }

        wx.getFriendCloudStorage({
            keyList: ["dist"],//['score', 'hero'],
            success: rs => {
                let rsData = rs.data;
                let nearDist = 0;
                let nearFriend = null;
                for(let i=0; i<rsData.length; i++) {
                    var info = rsData[i];
                    if(info.avatarUrl == selfAvatarUrl) {
                        continue;
                    }
                    info.dist = 0;
                    if(info.KVDataList.length > 0) {
                        info.KVDataList.forEach(KVData => {
                            if(KVData.key == 'dist') {
                                info.dist = KVData.value;
                            }
                        });
                    }
                    info.dist = parseFloat(info.dist);
                    if((nearDist == 0 || info.dist < nearDist) && (info.dist > selfDist) && (nearNum == 0 || (nearNum > 0 && info.dist - selfDist <= nearNum))) {
                        nearDist = info.dist;
                        nearFriend = info;
                    }
                }
                if(nearDist > 0 && nearFriend) {
                    _this.removeNearIngameChild();
                    _this.nearInGameDist = nearDist;
                    console.log("nearFriend InGame", JSON.stringify(nearFriend));
                    let item = cc.instantiate(_this.nearInGamePrefab);
                    _this.layNearInGame.node.addChild(item, 1, "inGame");
                    item.getComponent('NearFriendInGame').initData(nearFriend, selfDist);
                    _this.layNearInGame.node.active = true;
                    console.log("nearFriend getScale=", _this.layNearInGame.node.getScale());
                    if(_this.layNearInGame.node.getScale() <= 1) {
                        _this.layNearInGame.node.setScale(12);
                    }
                    // _this.layNearInGame.node.setScale(12);
                }
                else {
                    console.log("nearFriend is null... nearInGameDist", _this.nearInGameDist);
                }
            },
        });
    },
});
