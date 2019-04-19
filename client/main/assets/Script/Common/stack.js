
var stack = {
    vals: [],
    index: 0,

    push: function(val) {
        this.vals[this.index++] = val;
    },

    pop: function() {
        return this.vals[--this.index];
    },

    clear: function() {
        delete this.vals;
        this.vals = [];
        this.index = 0;
    },

    isEmpty: function() {
        return this.index == 0;
    }
};
module.exports = stack;