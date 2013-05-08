var Jingle = J = {
    settings : {
        transitionType : 'slide',
        transitionTime : 300,
        transitionTimingFunc : 'ease-out',
        sectionPath : 'html/section/'
    },
    mode : window.innerWidth < 800 ? "phone" : "tablet",
    hasTouch : 'ontouchstart' in window,
    hasLaunched : false,
    launchCompleted : false,
    isMenuOpen : false,
    launch : function(opts){
        $.extend(this.settings,opts);
        this.Router.init();
        this.Markup.init();
    }
}