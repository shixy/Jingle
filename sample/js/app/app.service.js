App.Service = (function(lng){
    var get = function(url,success,error){
        if(App.offline){
            _getCacheData(url,success);
        }else{
            $$.ajax({
                url : url,
                dataType:'json',
                success: function(result){
                    _saveServiceInCache(url,result);
                    success.call(success,result);
                },
                error:function(){
                    if(error)error();
                }
            });
        }

    }
    var post = function(url,postData,callback,dataType,needCache){
        postData = JSON.stringify(postData);
        var url_key = url + postData;
        if(App.offline){
            if(!needCache){
                lng.Notification.hide();
                setTimeout(function(){lng.Notification.error('提示','该功能不支持离线查看！')},500) ;
            }else{
                _getCacheData(url_key,callback);
            }
        }else{
            $$.ajax({
                url: url,
                type : 'POST',
                contentType : 'application/json',
                data : postData,
                dataType : dataType || 'json',
                //项目特殊情况造成post查询
                success : function(result){
                    if(needCache){
                        _saveServiceInCache(url_key,result);
                    }
                    callback.call(callback,result);
                }
            });
        }

    }
    var _saveServiceInCache = function(url, result) {
        var cacheData = {
            data : result,
            latestUpdate : new Date()
        }
        lng.Data.Storage.persistent(url, cacheData);
    };

    var _getCacheData = function(url_key,callback){
        var value = lng.Data.Storage.persistent(url_key);
        if(value){
            callback.call(callback, value.data,value.latestUpdate);
        }else{
            lng.Notification.hide();
            setTimeout(function(){lng.Notification.error('对不起','本地数据源中无相关数据！')},500) ;
        }
    }
    return {
        get : get,
        post : post
    }

}(Lungo))