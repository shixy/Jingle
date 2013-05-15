var Jingle = J = {
    settings : {
        transitionType : 'slide',
        transitionTime : 300,
        transitionTimingFunc : 'linear',
        sectionPath : 'html/section/'
    },
    mode : window.innerWidth < 800 ? "phone" : "tablet",
    hasTouch : 'ontouchstart' in window,
    hasLaunched : false,
    launchCompleted : false,
    isMenuOpen : false,
    launch : function(opts){
        $.extend(this.settings,opts);
        this.Router.init('#login_section');
        this.Markup.init();
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
    }
}