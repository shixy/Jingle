/**
 * Rest接口
 * User: walker
 * Date: 13-4-2
 * Time: 上午9:42
 */
;(function(){
    var api = "http://172.20.1.195:6888/ws";
//    var api = "http://localhost:6888/ws";
//    var appKey = '751507d364d69b40';
    var appKey = '000001';
    var sessionId;

    function _ajax(type,url,param,callback,noCache){
        if(!sessionId)sessionId = localStorage.getItem('sessionId');
        var scretParam = {
            appKey : appKey,
            sessionId : sessionId
        }
        var requestUrl;
        //判断当前是手机端(phonegap)还是浏览器端，手机端通过phonegap的白名单进行跨域，浏览器端采用nodejs进行跨域转发
        if(location.protocol == 'http:'){
            if(type == 'get'){
                $.extend(param,scretParam)
                requestUrl = '/proxy?url='+api+url+'?'+ $.param(param);
                param = {};
            }else{
                requestUrl = '/proxy?url='+api+url+'?'+ $.param(scretParam);
            }
        }else{
            if(type == 'get'){
                $.extend(param,scretParam);
                requestUrl = api+url;
            }else{
                requestUrl = api+url+'?'+ $.param(scretParam);
            }
        }
        var options = {
            url : requestUrl,
            type : type,
            data : param,
            success : callback,
            error : function(xhr){
                var data = JSON.parse(xhr.responseText);
                if(data.code && data.message){
                    J.showToast(data.message,'error');
                }else{
                    J.showToast('连接服务器失败！','error');
                }

            },
            dataType : 'json'
        }

        if(type == 'post'){
            options.data = JSON.stringify(param);
            options.contentType ='application/json';
        }

        if(noCache){
            $.ajax(options);
        }else{
            Jingle.Service.ajax(options);
        }

    };
    function _get(url,param,callback,noCache){
        _ajax('get',url,param,callback,noCache);
    }
    function _post(url,param,callback,noCache){
        _ajax('post',url,param,callback,noCache);
    };

    window.RsAPI = {
        'auth':{
            login:function(username,pwd,callback){
                var param = {
                    userName : username,
                    password : pwd
                };
                if(J.offline){
                    var sessionId = window.localStorage.getItem('sessionId');
                    if(!sessionId){
                        J.showToast('对不起，您是第一次访问本系统，无法使用离线功能','error');
                        return;
                    }
                    var userInfo = window.localStorage.getItem('userInfo');
                    callback(JSON.parse(userInfo));
                    J.showToast('您正在使用离线模式');
                }else{
                    _get('/auth/login',param,function(data){
                        if(!data.error){
                            localStorage.setItem('sessionId',data.sessionId);
                        }
                        callback(data);
                    },true);
                }
            },
            logout:function(callback){
                _get('/auth/logout',{},callback,true);
            },
            reLogin:function(callback){
                if(J.offline){
                    callback({});
                }else{
                    _get('/auth/reLogin',{},callback,true);
                }

            }
        },
        res : {
            summary : function(serverType,callback){
                var param = serverType?{serverType:serverType}:{};
                _get('/res/summary',param,callback);
            },
            getHealth : function(callback){
                _get('/res/healthList',{},callback);
            },
            getBizResUsage : function(beginDate,endDate,serverType,callback){
                serverType = serverType || 'pc_server';
                _get('/res//biz/resUsage',{beginDate:date,endDate:endDate,serverType:serverType},callback);
            }
        },
        biz : {
            getInfo : function(bizId,callback){
                _get('/biz/info',{bizId:bizId},callback);
            },
            getAlarms : function(bizId,callback){
                _get('/biz/alarms',{bizId:bizId},callback);
            },
            getVms : function(bizId,callback){
                _get('/biz/vms',{bizId:bizId},callback);
            },
            getVmCpuTop10 : function(bizId,period,serverType,callback){
                _get('/biz/vm/cpuTop10',{bizId:bizId,period:period,serverType:serverType},callback);
            },
            getVmMemoryTop10 : function(bizId,period,serverType,callback){
                _get('/biz/vm/memoryTop10',{bizId:bizId,period:period,serverType:serverType},callback);
            },
            getAvailability : function(bizId,serverType,callback){
                _get('/biz/availability',{bizId:bizId,serverType:serverType},callback);
            }
        },
        vm : {
            get : function(vmId,callback){
                _get('/vm/info',{vmId:vmId},callback);
            },
            query : function(queryObject,callback){
                _get('/vm/query',queryObject,callback);
            },
            start : function(vmId,callback){
                _get('/vm/start',{vmId:vmId},callback);
            },
            restart : function(vmId,callback){
                _get('/vm/restart',{vmId:vmId},callback);
            },
            stop : function(vmId,callback){
                _get('/vm/stop',{vmId:vmId},callback);
            }
        },
        vmApply : {
            getUnderwayCount : function(callback){
                _get('/apply/admin/underway/count',{},callback);
            },
            getUnderwayList : function(callback){
                _get('/apply/admin/underway',{},callback);
            },
            getFinishedList : function(pageNo,callback){
                _get('/apply/admin/finished',{page:pageNo},callback);
            },
            getApply : function(applicationId,callback){
                _get('/apply/info',{applicationId:applicationId},callback);
            },
            agree : function(param,callback){
              _post('/apply/agree',param,callback);
            },
            refuse : function(param,callback){
              _post('/apply/refuse',param,callback);
            },
            confirm : function(param,callback){
              _post('/apply/confirm',param,callback);
            },
            saveRevert : function(param,callback){
              _post('/apply/saveRevert',param,callback);
            }
        },
        user : {
            findAll : function(callback){
               _get('/user/findAll',{},callback);
            },
            findByName : function(username,callback){
                _get('/user/findByName',{username:username},callback)
            },
            resetPassword : function(username,password,callback){
                _post('/user/resetPassword',{username:username,password:password},callback);
            }
        }
    }
    })();

