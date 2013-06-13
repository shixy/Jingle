document.addEventListener('deviceready', onDeviceReady, false);
function onDeviceReady(){
    navigator.splashscreen.hide();
    //注册后退按钮
    document.addEventListener("backbutton", function (e) {
        if(J.isMenuOpen){
            J.Menu.hide();
        }else{//TODO 处理popup事件
            var sectionId = $('section.active').attr('id');
            if(sectionId == 'login_section' || sectionId == 'index_section'){
                if(confirm('是否退出程序？')){
                    navigator.app.exitApp();
                }else{
                    return;
                }
            }else{
                J.Router.back();
            }
        }
    }, false);
}
var App = (function(){
    var exports ={};
    var pages = {},userCache = {};
    exports.offline=false;
    exports.run = function(){
        _subscribeAsideEvents();
        $.each(pages,function(k,v){
            var sectionId = '#'+k+'_section';
            $('body').delegate(sectionId,'show',function(e){
                //只在页面第一次初始化的时候执行
                if(!v.init_flag && v.hasOwnProperty('init')){
                    v.init.call(v);
                    v.init_flag = true;
                }
                //页面每次显示的时候都会执行
                if(v.hasOwnProperty('load')){
                    v.load.call(v);
                }
            });
        });
        Jingle.launch();
        AHelper.registerTemplateHelper();
    };
    exports.cacheUserInfo = function(userInfo){
        userCache['UID'] = userInfo.cloudUserInfo.id;
        userCache['UNAME'] = userInfo.cloudUserInfo.name;
        userCache['UTYPE'] = userInfo.cloudUserInfo.type;
        if(userInfo.cloudUserInfo.datacenter){
            userCache['DCID'] = userInfo.cloudUserInfo.datacenter.id;
        }
    };
    exports.getUId = function(){
        return userCache['UID'];
    };
    exports.getUName = function(){
        return userCache['UNAME'];
    };
    exports.getUType = function(){
        return userCache['UTYPE'];
    };
    exports.getDcId = function(){
        return userCache['DCID'];
    };
    var _initArguments = function(){
        if(!localStorage.getItem("network-2g")){
            localStorage.setItem('network-2g',1);
            localStorage.setItem('auto-login',0);
            localStorage.setItem('auto-update',1);
            localStorage.setItem('auto-save',0);
        };
    };
    exports.page = function(id,factory){
        return ((id && factory)?_addPage:_getPage).call(this,id,factory);
    }
    var _addPage = function(id,factory){
        pages[id] = new factory();
    };
    var _getPage = function(id){
        return pages[id];
    }

    exports.checkNetwork = function(){
        var networkState = navigator.connection.type;
        if(networkState == Connection.CELL_2G){
            var network2g = localStorage.getItem("network-2g");
            if(network2g == 0){
                return true;
            }else{
                return confirm('您当前使用的是2G网络，是否继续？');
            }
        }else if(networkState == Connection.NONE){
            if(confirm('当前没有网络连接,是否使用离线方式访问？')){
                App.offline = true;
                $('#btn_offline').val(1);
                return true;
            }
            return false;
        }
        return true;
    }
    exports.updateApp = function(path){
        window.plugins.updateApp.checkAndUpdate(path);
    }
    var _subscribeAsideEvents = function(){
        $('#btn_change_user').tap(function(){
            J.Router.turnTo('#login_section');
        });
        $('#btn_exit_app').tap(function(){
            navigator.app.exitApp();
        });
    }
    return exports;
}())
