/*
 * Jingle v0.1 Copyright (c) 2013 shixy, http://shixy.github.io/Jingle/
 * Released under MIT license
 */
;(function(window){
    var Jingle = {
        settings : {
            transitionType : 'slide',
            transitionTime : 200,
            transitionTimingFunc : 'linear',
            sectionPath : 'html/',
            showWelcome : true
        },
        mode : window.innerWidth < 800 ? "phone" : "tablet",
        hasTouch : 'ontouchstart' in window,
        hasLaunched : false,
        launchCompleted : false,
        isMenuOpen : false,
        hasPopupOpen : false,
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
        showMask : function(text){
            J.Popup.loading(text);
        },
        hideMask : function(){
            J.Popup.close();
        },
        showToast : function(text,type,duration){
            type = type || 'toast';
            J.Toast.show(type,text,duration);
        },
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