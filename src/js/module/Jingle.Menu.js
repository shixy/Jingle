/**
 * 侧边菜单
 */
Jingle.Menu = (function(J,$){
    var $asideContainer,$sectionContainer;
    var init = function(selector){
        $asideContainer = $('#aside_container>aside');
        $sectionContainer = $('#section_container');
        var $el = selector?$(selector):$asideContainer;
        $el.each(function(i,aside){//给菜单添加关闭按钮，划动事件
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
        var $aside = $(selector).addClass('active'),
            transition = $aside.data('transition'),// push overlay  reveal
            position = $aside.data('position') || 'left',
            width = $aside.width(),
            translateX = position == 'left'?width+'px':'-'+width+'px';

        //aside中可能需要scroll组件
        J.Element.initScroll($aside);

        if(transition == 'overlay'){
            J.anim($aside,{translateX : '0%'});
        }else if(transition == 'reveal'){
            J.anim($sectionContainer,{translateX : translateX});
        }else{//默认为push
            J.anim($aside,{translateX : '0%'});
            J.anim($sectionContainer,{translateX : translateX});
        }
        J.hasMenuOpen = true;
    }
    var hideMenu = function(duration,callback){
        var $aside = $('#aside_container aside.active'),
            transition = $aside.data('transition'),// push overlay  reveal
            position = $aside.data('position') || 'left',
            translateX = position == 'left'?'-100%':'100%';

        var _finishTransition = function(){
            $aside.removeClass('active');
            J.hasMenuOpen = false;
            callback && callback.call(this);
        };

        if(transition == 'overlay'){
            J.anim($aside,{translateX : translateX},duration,_finishTransition);
        }else if(transition == 'reveal'){
            J.anim($sectionContainer,{translateX : '0'},duration,_finishTransition);
        }else{//默认为push
            J.anim($aside,{translateX : translateX},duration);
            J.anim($sectionContainer,{translateX : '0'},duration,_finishTransition);
        }
    }
    return {
        init : init,
        show : showMenu,
        hide : hideMenu
    }
})(Jingle,Zepto);