var UPDATE_APP_PATH = 'http://172.20.1.200:2000/download/version.js';
document.addEventListener('deviceready', onDeviceReady, false);
function onDeviceReady(){
    navigator.splashscreen.hide();
    //注册后退按钮
    document.addEventListener("backbutton", function (e) {
        if(J.isMenuOpen){
            J.Menu.hide();
        }else if(J.hasPopupOpen){
            J.closePopup();
        }else{
            var sectionId = $('section.active').attr('id');
            if(sectionId == 'login_section' || sectionId == 'index_section'){
                J.confirm('提示','是否退出程序？',function(){
                    navigator.app.exitApp();
                });
            }else{
                J.Router.back();
            }
        }
    }, false);
    App.run();
    window.plugins.updateApp.checkAndUpdate(UPDATE_APP_PATH);
}
var App = (function(){
    var exports ={};
    var pages = {},userCache = {};
    exports.run = function(){
        $.each(pages,function(k,v){
            var sectionId = '#'+k+'_section';
            $('body').delegate(sectionId,'pageinit',function(){
                if(v.hasOwnProperty('init')){
                    v.init.call(v);
                }
            });
            $('body').delegate(sectionId,'pageshow',function(e,isBack){
                //页面加载的时候都会执行
                if(v.hasOwnProperty('show')){
                    v.show.call(v);
                }
                //后退时不执行
                if(!isBack && v.hasOwnProperty('load')){
                    v.load.call(v);
                }
            });
        });
        _initDefaultSettings();
        Jingle.launch();
        AHelper.registerTemplateHelper();
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

    var _initDefaultSettings = function(){
        localStorage.getItem('auto-login') === null && localStorage.setItem("auto-login",1);
        localStorage.getItem('auto-cache-data') === null && localStorage.setItem("auto-cache-data",1);
        localStorage.getItem('auto-offline-mode') === null && localStorage.setItem("auto-offline-mode",1);
    }

    exports.checkNetwork = function(){
        if(!navigator.connection)return true;
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
                J.offline = true;
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
    return exports;
}());
if(J.isWebApp){
    $(function () {
        App.run();
    })
}

