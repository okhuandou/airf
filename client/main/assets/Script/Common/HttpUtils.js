

var httpUtils = {
 
    get: function (url, headers, callback) {
        let _this = this;
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if(xhr.status >= 200 && xhr.status < 300) {
                    var response = xhr.responseText;
                    callback(JSON.parse(response));
                }
                else {
                    callback(-1);
                }
                _this.nextRequest();
            }
        };
        xhr.open("GET", url, true);
        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
        }
        xhr.setRequestHeader("Accept", "application/json");
        if(headers) {
            for(var header in headers) {
                xhr.setRequestHeader(header, headers[header]);
            }
        }
 
        // note: In Internet Explorer, the timeout property may be set only after calling the open()
        // method and before calling the send() method.
        xhr.timeout = 5000;// 5 seconds for timeout
 
        xhr.send();
    },
 
    post: function (url, headers, params, callback) {
        let _this = this;
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if(xhr.status >= 200 && xhr.status < 300) {
                    var response = xhr.responseText;
                    callback(JSON.parse(response));
                } else {
                    cc.log('xhr.readyState='+xhr.readyState+'  xhr.status='+xhr.status);
                    callback(-1);
                }   
                _this.nextRequest();
            }
        };
        xhr.open("POST", url, true);
        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
        }
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Accept", "application/json");
        if(headers) {
            for(var header in headers) {
                xhr.setRequestHeader(header, headers[header]);
            }
        }
 
        // note: In Internet Explorer, the timeout property may be set only after calling the open()
        // method and before calling the send() method.
        xhr.timeout = 5000;// 5 seconds for timeout
 
        xhr.send(JSON.stringify(params));
    },

    nextRequest: function(){
        let storageUtils = require('StorageUtils');
        storageUtils.checkFriendHelp();
    },
};
module.exports = httpUtils;