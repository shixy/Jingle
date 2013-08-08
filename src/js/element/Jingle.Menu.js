Jingle.Menu = (function(J){
    var SELECTOR = {
        ASIDE_CONTAINER : '#aside_container>aside',
        SECTION_CONTAINER : '#section_container'
    }
    var $asideContainer,$sectionContainer;

    var init = function(selector){
        $asideContainer = $(SELECTOR.ASIDE_CONTAINER);
        $sectionContainer = $(SELECTOR.SECTION_CONTAINER);

        var $el = selector?$(selector):$asideContainer;
        $el.each(function(i,aside){
            var position = $(aside).data('position');//left  right
            var showClose = $(aside).data('show-close');
            if(showClose){
                $(aside).append('<div class="aside-close icon close"></div>');
            }
            if(position == 'right'){
                $(aside).on('swipeRight',hideMenu);
            }else{
                $(aside).on('swipeLeft',hideMenu);
            }
            $('.aside-close').on('tap',hideMenu);
        })
    }
    var showMenu = function(selector){
        var $aside = $(selector).addClass('active');
        var transition = $aside.data('transition');// push overlay  reveal
        var position = $aside.data('position') || 'left';
        var width = $aside.width();
        var translateX = position == 'left'?width+'px':'-'+width+'px';

        if(transition == 'overlay'){
            J.anim($aside,{translateX : '0%'});
        }else if(transition == 'reveal'){
            J.anim($sectionContainer,{translateX : translateX});
        }else{//默认为push
            J.anim($aside,{translateX : '0%'});
            J.anim($sectionContainer,{translateX : translateX});
        }
        J.isMenuOpen = true;
    }
    var hideMenu = function(){

        var $aside = $('#aside_container aside.active');
        var transition = $aside.data('transition');// push overlay  reveal
        var position = $aside.data('position') || 'left';
        var translateX = position == 'left'?'-100%':'100%';
        var finishTransition = function(){
            $aside.removeClass('active');
            J.isMenuOpen = false;
        }
        if(transition == 'overlay'){
            J.anim($aside,{translateX : translateX},finishTransition);
        }else if(transition == 'reveal'){
            J.anim($sectionContainer,{translateX : '0'},finishTransition);
        }else{//默认为push
            J.anim($aside,{translateX : translateX});
            J.anim($sectionContainer,{translateX : '0'},finishTransition);
        }
    }
    return {
        init : init,
        show : showMenu,
        hide : hideMenu
    }
})(Jingle);