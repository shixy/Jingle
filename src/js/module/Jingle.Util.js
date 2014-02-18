/**
 * 常用工具类
 */
J.Util = (function($){
    var parseHash = function(hash){
        var tag,query,param;
        var arr = hash.split('?');
        tag = arr[0];
        if(arr.length>1){
            var seg,s;
            query = arr[1];
            seg = query.split('&');
            for(var i=0;i<seg.lenth;i++){
                if(!seg[i])continue;
                s = seg[i].split('=');
                param[s[0]] = s[1];
            }
        }
        return {
            hash : hash,
            tag : tag,
            param : query,
            param : param
        }
    }

    /**
     * 格式化date
     * @param date
     * @param format
     */
    var formatDate = function(date,format){
        var o =
        {
            "M+" : date.getMonth()+1, //month
            "d+" : date.getDate(),    //day
            "h+" : date.getHours(),   //hour
            "m+" : date.getMinutes(), //minute
            "s+" : date.getSeconds(), //second
            "q+" : Math.floor((date.getMonth()+3)/3),  //quarter
            "S" : date.getMilliseconds() //millisecond
        }
        if(/(y+)/.test(format))
            format=format.replace(RegExp.$1,(date.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)
            if(new RegExp("("+ k +")").test(format))
                format = format.replace(RegExp.$1,RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
        return format;
    }

    return {
        parseHash : parseHash,
        formatDate : formatDate
    }

})(J.$);