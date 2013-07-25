var Jingle = J = {
    settings : {
        transitionType : 'slide',
        transitionTime : 300,
        transitionTimingFunc : 'linear',
        sectionPath : 'html/'
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
        this.Router.init();
        this.Element.init();
        $('body').delegate('article','show',function(){
            if($(this).data('scroll')){
                J.Scroll(this.id);
            }
        });
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
    }
};