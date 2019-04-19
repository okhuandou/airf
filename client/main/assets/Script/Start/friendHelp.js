var common = require('common');
var platformUtils = require('PlatformUtils');
var storageUtils = require('StorageUtils');

cc.Class({
    extends: cc.Component,

    properties: {
        scrollView: cc.ScrollView,
        btnSound: {
            default: null,
            type: cc.AudioClip
        },
        helpItemPrefab: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        let _this = this;
        if(D.commonState.friendHelpNum){
            storageUtils.checkFriendHelp();
        }
        platformUtils.requestHelpList(function(res){
            _this.initList(res);
        });
        
    },

    // update (dt) {},

    initList: function(list){
        let content = this.scrollView.content;

        // let beginY = 
        let _this = this;
        let helpedNum = 0;
        list.forEach((element,idx) => {
            let item = cc.instantiate(_this.helpItemPrefab);
            content.addChild(item);
            let script = item.getComponent("friendHelpItem");
            if(script){
                script.initWithData(element)
            }

            if(element.isRecv == 0 && element.name != undefined && element.name != null){
                helpedNum+=1;
            }   
        });
        D.commonState.friendHelpNum = helpedNum;
    },

    onBtnBackMain: function(){
        if( ! D.isVoideClose){
            cc.audioEngine.play(this.btnSound);
        }
        common.removePopUpLayer(this);
    },



});
