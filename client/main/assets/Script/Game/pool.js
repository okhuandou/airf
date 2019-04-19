//对象池
var pool = {

    onLoad: function () {
    },
    
    initPoolBatch: function (that, objArray) {
        for(let i=0; i< objArray.length; i++) {
            let objInfo = objArray[i];
            this.initPool(that, objInfo);
        }
    },
    initPool: function (that, objInfo) {
        let name = objInfo.name;
        let poolName = name + 'Pool';
        that[poolName] = new cc.NodePool();
        // 在poolObjs中备份，方便clear
        if (!D.poolObjs[poolName]) {
            D.poolObjs[poolName] = that[poolName];
        }
        // 创建对象，并放入池中
        if (that[poolName].length < objInfo.size ) {
            for (let i = 0; i < objInfo.size ; i++) {
                let newNode = cc.instantiate(objInfo.prefab);
                that[poolName].put(newNode);
            }
        }
    },

    //从pool借用
    borrowNewNode: function (pool, prefab, nodeParent) {
        let newNode = null;
        if (pool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            newNode = pool.get();
            newNode.active = true;
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            newNode = cc.instantiate(prefab);
        }
        nodeParent.addChild(newNode);
        return newNode;
    },
   
    //换回对象给pool
    returnNode: function (that, node) {
        let poolName = node.name + "Pool";
        that[poolName].put(node);

        node.active = false;
    },
    
    //清空pool
    clearAllPool: function () {
       /*  D.poolObjs.forEach(function (pool) {
            pool.clear();
        }) */

        for (var i in D.poolObjs) {
            D.poolObjs[i].clear();
        }

        // _.forEach(D.poolObjs, function (pool) {
        //     pool.clear();
        // })
    }
};

module.exports = pool;