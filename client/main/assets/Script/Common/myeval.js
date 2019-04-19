
var myeval={

    isOperator: function (value) {
        var operatorString = '+-*/()×÷';
        return operatorString.indexOf(value) > -1;
    },
    
    getPrioraty: function(value) {
        if(value == '-' || value == '+') {
            return 1;
        } else if(value == '*' || value == '/' || value == '×' || value == '÷' ) {
            return 2;
        } else{
            return 0;
        }
    },
    
    prioraty: function(v1, v2) {
        return this.getPrioraty(v1) <= this.getPrioraty(v2);
    },
    
    output: function(exp) {
        var inputStack = [];
        var outputStack = [];
        var outputQueue = [];
        var firstIsOperator = false;
        exp.replace(/\s/g,'');
        if(this.isOperator(exp[0])){
            exp = exp.substring(1);
            firstIsOperator = true;
        }
        for(var i = 0, max = exp.length; i < max; i++) {
            if( ! this.isOperator(exp[i]) && ! this.isOperator(exp[i-1]) && (i != 0)) {
                inputStack[inputStack.length-1] = inputStack[inputStack.length-1] + exp[i] + '';
            } else {
                inputStack.push(exp[i]);
            }
        }
        if(firstIsOperator) {
            inputStack[0] = -inputStack[0] 
        }
        while(inputStack.length > 0) {
            var cur = inputStack.shift();
            if(this.isOperator(cur)) {
                if (cur == '(') {
                    outputStack.push(cur);
                } else if (cur == ')') {
                    var po = outputStack.pop();
                    while(po != '(' && outputStack.length > 0) {
                        outputQueue.push(po);
                        po = outputStack.pop();
                    }
                } else {
                    while(this.prioraty(cur,outputStack[outputStack.length - 1]) && outputStack.length > 0) {
                        outputQueue.push(outputStack.pop());
                    }
                    outputStack.push(cur)
                }
            } else {
                outputQueue.push(Number(cur));
            }
        }
        if(outputStack.length > 0){
            while (outputStack.length > 0) {
                outputQueue.push(outputStack.pop());
            }
        }
        return outputQueue;
    },
    
    calExp:function(rpnArr) {
        var stack = [];
        for(var i = 0, max = rpnArr.length; i < max; i++) {
            if( ! this.isOperator(rpnArr[i])) {
                stack.push(rpnArr[i]);
            } else {
                var num1 = stack.pop();
                var num2 = stack.pop();
                if(rpnArr[i] == '-') {
                    var num = num2 - num1;
                } else if(rpnArr[i] == '+') {
                    var num = num2 + num1;
                } else if(rpnArr[i] == '*' || rpnArr[i] == '×') {
                    var num = num2 * num1;
                } else if(rpnArr[i] == '/' || rpnArr[i] == '÷') {
                    var num = num2/num1;
                }
                stack.push(num);
            }
        }
        return stack[0];
    },
    cal: function(exp) {
        return this.calExp(this.output(exp));
    }
};

//已经添加完export，在外面直接调用
module.exports = myeval;