var Jingle = J = {
    settings : {
        transitionType : 'slide',
        transitionTime : 300,
        transitionTimingFunc : 'ease-in-out',
        sectionPath : 'html/section/'
    },
    mode : window.innerWidth < 800 ? "phone" : "tablet",
    hasTouch : 'ontouchstart' in window,
    hasLaunched : false,
    launchCompleted : false,
    isMenuOpen : false,
    hasPopupOpen : false,
    launch : function(opts){
        $.extend(this.settings,opts);
        this.Router.init('#login_section');
        this.Markup.init();
        setTimeout(function(){ window.scrollTo(0, 1); }, 100);
        $('#login_section').trigger('pageshow');
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
    alert : function(title){
        this.Popup.alert(title);
    },
    confirm : function(title,okCall,cancelCall){
        this.Popup.confirm(title,okCall,cancelCall);
    },
    popup : function(html,pos,closeable){
        this.Popup.show(html,pos,closeable);
    },
    hidePopup : function(){
        this.Popup.hide();
    }

}