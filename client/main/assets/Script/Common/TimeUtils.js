

var timeUtils = {
 
    /*
     * 转换格式 HH:MM:SS
     * time:秒
     */
    secondsToHMS: function (time) {
        if (!time) return "";

        let h = Math.floor(time / 3600);
        let m = Math.floor((time%3600) / 60);
        let s = time%60;

        h = h < 10 ? "0"+h : h;
        m = m < 10 ? "0"+m : m;
        s = s < 10 ? "0"+s : s;

        return h + ":" + m + ":" + s;
    },
};
module.exports = timeUtils;