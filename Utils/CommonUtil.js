NameSpace.register("st.CommonUtil");

//这个不会clone prototype
st.CommonUtil.clone = function(obj) {
    if (typeof(obj) !== 'object') {
        return obj;
    }
    if (obj === null) {
        return obj;
    }

    var ret = null;
    if (st.CommonUtil.isArray(obj)) {
        ret = [];
    } else {
        ret = {};
    }

    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            ret[i] = st.CommonUtil.clone(obj[i]);
        }
    }

    return ret;
};

//判断是否是数组
st.CommonUtil.isArray = function(value) {
    return Object.prototype.toString.apply(value) === '[object Array]';
};

/*
 将秒转换成 00:00:00的格式
 */
st.CommonUtil.convertSecondToTime = function(second) {
    var hour = parseInt(second / 3600);
    if(hour > 0){
        hour = hour >= 10 ? hour : '0' + hour;
    }else{
        hour = "";
    }
    
    var min = parseInt(second / 60) % 60;
    min = min >= 10 ? min : '0' + min;
    var sec = second % 60;
    sec = sec >= 10 ? sec : '0' + sec;

    if(hour !== ""){
        return hour + ':' + min + ':' + sec;
    }else{
        return min + ':' + sec;
    }
};

//获取平台
st.CommonUtil.getPlatform = function(){
    return cc.Application.getInstance().getTargetPlatform();
}

//获取某一文件的所在文件夹路径
st.CommonUtil.convertPath = function(filePath){
    var endIndex = filePath.lastIndexOf("/");
    return filePath.substr(0, endIndex+1);
}

//根据路径获取文件名 @filePath 文件路径 @noSuffix 返回不包含后缀
st.CommonUtil.getFileName = function(filePath, noSuffix){
    var startIdx = filePath.lastIndexOf("/");
    if(noSuffix){
        //返回无后缀
        var endIdx = filePath.lastIndexOf(".");
        return filePath.substring(startIdx + 1, endIdx);
    }else{
        return filePath.substring(startIdx + 1, filePath.length-1);
    }
},

//检查数组中是否包含某一元素
st.CommonUtil.isInArray = function(array, item){
    for(var i=0; i<array.length; i++){
        if(array[i] == item){
            return true;
        }
    }

    return false;
}

//字符串排序
st.CommonUtil.stringCompare = function(str_a, str_b){
    return str_a.localeCompare(str_b);
    //return str_a[0] > str_b[0];
}

//检查是否是ip地址
st.CommonUtil.isIpAddr = function(ip)   
{   
    var re =  /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;   
    return re.test(ip);   
} 

//休眠
st.CommonUtil.sleep = function(numberMillis) { 
    var now = new Date(); 
    var exitTime = now.getTime() + numberMillis; 
    while (true) { 
        now = new Date(); 
        if (now.getTime() > exitTime) 
        return; 
    } 
}



