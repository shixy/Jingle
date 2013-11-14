/*
 * Jingle v0.1 Copyright (c) 2013 shixy, http://shixy.github.io/Jingle/
 * Released under MIT license
 * walker.shixy@gmail.com
 */
;(function(window){
    var Jingle = {
        version : '0.1',
        settings : {
            transitionType : 'slide',//page默认动画效果
            transitionTime : 200,//自定义动画时的默认动画时间(非page转场动画时间)
            transitionTimingFunc : 'linear',//自定义动画时的默认动画函数(非page转场动画函数)
            showWelcome : true,//是否显示欢迎界面
            showPageLoading : false,//加载page时，是否显示遮罩
            basePagePath : 'html/',//page默认的相对位置，主要用于开发hybrid应用，实现page的自动装载
            remotePage:{}//page的远程路径
        },
        mode : window.innerWidth < 800 ? "phone" : "tablet",
        hasTouch : 'ontouchstart' in window,
        hasLaunched : false,
        launchCompleted : false,
        hasMenuOpen : false,//是否有打开的侧边菜单
        hasPopupOpen : false,//是否有打开的弹出框
        isWebApp : location.protocol == 'http:',
        launch : function(opts){
            $.extend(this.settings,opts);
            var hasShowWelcome = window.localStorage.getItem('hasShowWelcome');
            if(!hasShowWelcome){
                this.showWelcome();
            }
            this.Router.init();
            this.Element.init();
            this.Menu.init();
            this.Selected.init();
        },
        /***************************** alias func ***********************************************************/
        /**
         * 完善zepto的动画函数
         */
        anim : function(el,animName,duration,ease,callback){
            var d, e,c;
            var len = arguments.length;
            for(var i = 2;i<len;i++){
                var a = arguments[i];
                var t = $.type(a);
                t == 'number'?(d=a):(t=='string'?(e=a):(t=='function')?(c=a):null);
            }
            $(el).animate(animName,d|| J.settings.transitionTime,e||J.settings.transitionTimingFunc,c);
        },
        /**
         * 显示loading框
         * @param text
         */
        showMask : function(text){
            J.Popup.loading(text);
        },
        /**
         * 关闭loading框
         */
        hideMask : function(){
            J.Popup.close(true);
        },
        /**
         *  显示消息
         * @param text
         * @param type toast|success|error|info
         * @param duration 持续时间，为0则不自动关闭
         */
        showToast : function(text,type,duration){
            type = type || 'toast';
            J.Toast.show(type,text,duration);
        },
        /**
         * 关闭消息提示
         */
        hideToast : function(){
            J.Toast.hide();
        },
        alert : function(title,content){
            J.Popup.alert(title,content);

        },
        confirm : function(title,content,okCall,cancelCall){
            J.Popup.confirm(title,content,okCall,cancelCall);
        },
        popup : function(options){
            J.Popup.show(options);
        },
        closePopup : function(){
            J.Popup.close();
        },
        popover : function(html,pos,arrowDirection,onShow){
            J.Popup.popover(html,pos,arrowDirection,onShow);
        },
        tmpl : function(containerSelector,templateId,data,type){
            J.Template.render(containerSelector,templateId,data,type);
        },
        showWelcome : function(){
            if(!J.settings.showWelcome)return;
            $.ajax({
                url : J.settings.sectionPath+'welcome.html',
                timeout : 5000,
                async : false,
                success : function(html){
                    //添加到dom树中
                    $('body').append(html);
                    new J.Slider('#jingle_welcome');
                }
            })
        },
        hideWelcome : function(){
            J.anim('#jingle_welcome','slideLeftOut',function(){
                $(this).remove();
                window.localStorage.setItem('hasShowWelcome',true);
            })
        }
    };
    window.Jingle = window.J = Jingle;
})(window);