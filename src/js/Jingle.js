/*
 * Jingle v0.1 Copyright (c) 2013 shixy, http://shixy.github.io/Jingle/
 * Released under MIT license
 */
;(function(window){
    var Jingle = {
        settings : {
            transitionType : 'slide',
            transitionTime : 400,
            transitionTimingFunc : 'ease',
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
        showMask : function(text,cancelCallback){
            if($.type(text) == 'function'){
                cancelCallback = text;
                text = null;
            }
            text = text || 'Loading...';
            this.Toast.show('loading',text,cancelCallback);
        },
        hideMask : function(){
            this.Toast.hide();
        },
        showToast : function(text,type){
            type = type || 'toast';
            this.Toast.show(type,text);
        },
        hideToast : function(){
            this.Toast.hide();
        },
        alert : function(title,content){
            this.Popup.alert(title,content);

        },
        confirm : function(title,content,okCall,cancelCall){
            this.Popup.confirm(title,content,okCall,cancelCall);
        },
        popup : function(html,pos,closeable){
            this.Popup.show(html,pos,closeable);
        },
        closePopup : function(){
            this.Popup.close();
        },
        popover : function(html,pos,arrow_direction){
            this.Popup.popover(html,pos,arrow_direction);
        },
        tmpl : function(containerSelector,templateId,data){
            this.Template.render(containerSelector,templateId,data);
        },
        showWelcome : function(){
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
            this.anim('#jingle_welcome','slideLeftOut',function(){
                $(this).remove();
                window.localStorage.setItem('hasShowWelcome',true);
            })
        }
    };
    window.Jingle = window.J = Jingle;
})(window);