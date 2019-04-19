
var stack = require('stack');

//场景管理，方便进行场景回退切换等
var sceneManager = {

    curSceneName: "",
    preSceneName: "",
    isLoadedGame: false,

    init: function() {
        if( ! D.commonState.sceneStack || D.commonState.sceneStack == undefined) {
            D.commonState.sceneStack = stack;
        }
    },
    
    /**
     * load场景，并记录场景名称
     */
    loadScene: function(name) {
        this.init();
        D.commonState.sceneStack.push(name);
        cc.director.loadScene(name);
        // let common = require('common');
        // common.loading();
        
        this.preSceneName = this.curSceneName;
        this.curSceneName = name;
    },
    /**
     * 回退场景，如果没有记录前一个场景名，则回退到默认场景defaultName
     */
    gobackLast: function(defaultName) {
        this.init();
        let last = D.commonState.sceneStack.pop();
        if(last) {
            cc.director.loadScene(last);
        }
        else if(defaultName) {
            this.loadScene(defaultName);
        }
    },
    /**
     * 清楚标记，在主界面的时候调用
     */
    resetMark: function() {
        this.init();
        D.commonState.sceneStack.clear();
    },

};
module.exports = sceneManager;