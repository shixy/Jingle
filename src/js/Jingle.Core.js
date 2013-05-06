(function(){
    var Jingle = function(){
        this.dom = {
        };
        this.hasLaunched = false;
        this.launchCompleted = false;

        this.settings = {
            transitionType : 'slide',
            transitionTime : 250,
            transitionTimingFunc : 'ease-out'
        };
        this.launch = function(opts){
            $.extend(this.settings,opts);
            this.Router.init();
           // this.Events.init();
        }
        this.hasTouch = 'ontouchstart' in window;
        this.isPhone = $(window).width()<768;
    }
    window.J = window.Jingle = new Jingle();
})();
