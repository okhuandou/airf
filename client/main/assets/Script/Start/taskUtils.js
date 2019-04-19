var common = require('common');
var platformUtils = require('PlatformUtils');
var httpUtils = require('HttpUtils');

var taskUtils = {

    TaskType: {
        COIN : 1,       //累计金币
        FLY_KM : 3,     //飞行距离
        // INVITE : 4,     //邀请次数
        INVITE_SUC : 5, //邀请成功次数
        UPGRADE_COST : 6,//升级花费
        BATTLE_NUM : 7, //出战次数
    },

    data: [],

    //任务列表
    requestTaskList: function(callback){
        let _this = this;
        httpUtils.post(D.UrlDomain+'/task/list',{Authorization: platformUtils.getUserSkey(), Version:D.Versioin},{},function(res){
            if(res !== -1 && res.code == 0){
                console.log(res.data);
                // res.data = [{taskId:100, isComplete:1, isReceive:0, currNum:500}];//test
                let list = _this.setTaskList(res.data);
                console.log("list:",list);

                if(callback){
                    callback(list);
                }
            }
        });
    },

    //任务领奖
    requestTaskReceive: function(id,callback){
        httpUtils.post(D.UrlDomain+'/task/recv?taskId='+id,{Authorization: platformUtils.getUserSkey(), Version:D.Versioin},{},function(res){
            if(res !== -1 && res.code == 0){
                console.log(res.data);
                if(callback){
                    callback(res.data);
                }
            }
        });

        // callback({taskId:100,next:{taskId:101, isComplete:0, isReceive:0, currNum:500}});
    },

    //完成任务条件
    requestTaskDo: function(id,num){
        let _this = this;
        httpUtils.get(D.UrlDomain+'/task/do-it?taskId='+id+"&num="+num, {Authorization: platformUtils.getUserSkey(), Version:D.Versioin}, function(res) {
            if(res !== -1 && res.code == 0){
                console.log(res.data);
                _this.updateTaskList(res.data.taskId, res.data);
            }
        });
    },

    //////////////////////////////////////////
    setTaskList: function(res){
        // let configs = common.getJsonCfgs("task");
        // if(!configs) return [];

        // let _this = this;
        // let isHaveId = function(list,taskId){
        //     for (var i = 0; i < list.length; i++) {
        //         if(list[i] && list[i].taskId == taskId){
        //             return list[i];
        //         }
        //     }
        //     return null;
        // }

        // let isHaveKind = function(list,kind){
        //     for (var i = 0; i < list.length; i++) {
        //         let cfg = common.getJsonCfgByID("task",list[i].taskId);
        //         if(cfg && cfg.kind == kind){
        //             return cfg;
        //         }
        //     }
        //     return null;
        // }

        // this.data = [];
        // configs.forEach((element,idx) => {
        //     let resIdVal = isHaveId(res, element.id);
        //     if(resIdVal){
        //         this.data.push(resIdVal);
        //     }else{
        //         let dataKindVal = isHaveKind(_this.data, element.kind);
        //         if(dataKindVal == null){
        //             this.data.push({taskId:element.id, isComplete:0, isReceive:0, currNum:0});
        //         }
        //     }
        // });

        this.data = res ? res : [];

        return this.data;
    },

    updateTaskList: function(cId, newInfo){
        for (var i = 0; i < this.data.length; i++) {
            let element = this.data[i];
            if(element.taskId = cId){
                element = newInfo != null ? newInfo : element;
                this.data[i] = element;
                Notification.emit("task_update_state", {info:element,oldId:cId});
                break;
            }
        }
    },

    //上报
    taskReport: function(type,val){
        let _this = this;
        let getElem = function(){
            if(!_this.data || _this.data.length == 0) return null;

            for (var i = 0; i < _this.data.length; i++) {
                let element = _this.data[i];
                let config = common.getJsonCfgByID("task",element.taskId);
                if(config && config.kind == type){
                    return config
                }
            }
            return null;
        }

        if(type == this.TaskType.FLY_KM){
            let cfg = getElem();
            if(cfg && val >= cfg.need){
                this.requestTaskDo(cfg.id, val);
            }
        }
        // else if(type == this.TaskType.INVITE){
        //     let cfg = getElem();
        //     this.requestTaskDo(cfg.id, 1);
        // }
    },

    isRed: function(){
        if(!this.data || this.data.length == 0){
            return false;
        }

        for (var i = 0; i < this.data.length; i++) {
            if(this.data[i].isComplete == 1 && this.data[i].isReceive != 1){
                return true;
            }
        }

        return false;
    },
    
};
module.exports = taskUtils;
