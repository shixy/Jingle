Jingle.Menu = (function(J){
    var SELECTOR = {
        MENU : 'body>aside',
        SECTION_CONTAINER : '.section-container'
    }
    var showMenu = function(){
        $(SELECTOR.MENU).animate({
            translateX : '0%'
        }, J.settings.transitionTime,'linear',function(){
            J.menuShow = true;
        });
        $(SELECTOR.SECTION_CONTAINER).animate({
            translateX : '264px'
        },J.settings.transitionTime);
    }
    var hideMenu = function(){
        $(SELECTOR.MENU).animate({
            translateX : '-100%'
        },J.settings.transitionTime,'linear',function(){
            J.menuShow = false;
        });
        $(SELECTOR.SECTION_CONTAINER).animate({
            translateX : 0
        },J.settings.transitionTime);
    }
    return {
        show : showMenu,
        hide : hideMenu
    }
})(Jingle)