/**
 * Rest接口
 * User: walker
 * Date: 13-4-2
 * Time: 上午9:42
 */
;(function($$){
    var _baseUrl = ACP_PORTAL_URL+'/rs';
    //判断当前是手机端(phonegap)还是浏览器端，手机端通过phonegap的白名单进行跨域，浏览器端采用nodejs进行跨域转发
    if(location.protocol == 'http:'){
        _baseUrl = "/proxy?url="+_baseUrl;
    }
    /**
     * @param url
     * @param queryData 可选，会自动在url后拼装查询参数 如 ?k=123
     * @param callback
     * @private
     */
    function _get(url,queryData,callback){
        url = _baseUrl+url;
        if(typeof queryData == 'function'){
            callback = queryData;
            queryData = null;
        };
        if(queryData){
            url += '?'+$$.serializeParameters(queryData);
        }
        App.Service.get(url, callback);
    };

    /**
     * @param url
     * @param postData
     * @param queryData 可选 ?k=123
     * @param callback
     * @private
     */
    function _post(url,postData,queryData,callback,dataType,needCache){
        url = _baseUrl+url;
        if(queryData){
            url = url + '?' + $$.serializeParameters(queryData);
        };
        if(typeof(dataType) == 'boolean'){
            needCache = dataType;
            dataType = 'json';
        }
        App.Service.post(url,postData,callback,dataType,needCache);
    };

    window.RsAPI = {
        'auth':{
            login:function(username,pwd,callback,errCallback){
                var queryData = {
                    name : username,
                    password : pwd,
                    forced : true
                };
                if(App.offline){
                    var auth = window.localStorage.getItem('auth');
                    if(auth){
                        auth = JSON.parse(auth);
                        if(username != auth.username || pwd != auth.password){
                            errCallback();
                            return;
                        }
                    }else{
                        Lungo.Notification.hide();
                        setTimeout(function(){Lungo.Notification.error('对不起','您是第一次访问本系统，无法使用离线功能！')},500) ;
                        return;
                    }
                    var userInfo = window.localStorage.getItem('userInfo');
                    callback(JSON.parse(userInfo));
                }else{
                    var loginUrl = _baseUrl+'/auth/users/login?'+$$.serializeParameters(queryData);
                    $$.ajax({
                        url : loginUrl,
                        type : 'get',
                        success:callback,
                        error : errCallback
                    })
                }
            },
            logout:function(callback){
                $$.get(_baseUrl+'/auth/users/logout',{},callback||function(){});
            }
        }
    }

    })(Quo);

