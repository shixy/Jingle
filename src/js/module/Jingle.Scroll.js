Jingle.Scroll = (function(){

    function init(selector){
        var el = $(selector);
        el.css({overflow:'auto'});
        var scrollStartPos=0;
        el.on('touchstart',function(e){
            scrollStartPos=this.scrollTop+event.touches[0].pageY;
            e.preventDefault();
        })
        el.on('touchmove',function(e){
            this.scrollTop=scrollStartPos-event.touches[0].pageY;
            e.preventDefault();
        })

    }

    return {
        init : init
    }
})();