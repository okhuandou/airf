
// 抖动 动画
// cc.Class({
//     extends: cc.ActionInterval,
// properties: {
//         _initial_x : 0,
//         _initial_y : 0,
//         _strength_x : 0,
//         _strength_y : 0,
//     },

cc.Shake = cc.ActionInterval.extend({

    _initial_x : 0,
    _initial_y : 0,
    _strength_x : 0,
    _strength_y : 0,

    /**
     *  创建抖动动画
     */
    ctor: function(){
        cc.ActionInterval.prototype.constructor.call(this);
        // this.initWithDuration( duration,strength_x,strength_y);
    },
    /**
     *  创建抖动动画
     * @param {number} duration     动画持续时长
     * @param {number} strength_x   抖动幅度： x方向
     * @param {number} strength_y   抖动幅度： y方向
     * @returns {Shake}
     */
    initWithDuration: function(duration,strength_x,strength_y) {
        cc.ActionInterval.prototype.initWithDuration.call(this, duration)
        this._strength_x = strength_x;
        this._strength_y = strength_y;
        return true;
    },
    update(dt)
    {
        let randx = (Math.random() - 0.5)*2 * this._strength_x;
        let randy = (Math.random() - 0.5)*2 * this._strength_y;
        this.getTarget().setPosition(randx + this._initial_x,randy + this._initial_y);
    },
    startWithTarget: function(target)
    {
        cc.ActionInterval.prototype.startWithTarget.call(this, target);
        this._initial_x = target.x;
        this._initial_y = target.y;
    },
    stop()
    {
        this.getTarget().setPosition(new cc.Vec2(this._initial_x,this._initial_y));
        cc.ActionInterval.prototype.stop.call(this);
    },
});
cc.shake = function (duration,strength_x,strength_y) {
    let sk = new cc.Shake();
    sk.initWithDuration(duration,strength_x,strength_y)
    return sk;
};