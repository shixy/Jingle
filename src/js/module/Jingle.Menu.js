/**
 * 侧边菜单
 */
J.Menu = (function($){
    var $asideContainer,$sectionContainer,$sectionMask;
    var init = function(){
        $asideContainer = $('#aside_container');
        $sectionContainer = $('#section_container');
        $sectionMask = $('<div id="section_container_mask"></div>').appendTo('#section_container');
        //添加各种关闭事件
        $sectionMask.on('tap',hideMenu);
        $asideContainer.on('swipeRight','aside',function(){
            if($(this).data('position') == 'right'){
                hideMenu();
            }
        });
        $asideContainer.on('swipeLeft','aside',function(){
            if($(this).data('position') != 'right'){
                hideMenu();
            }
        });
        $asideContainer.on('tap','.aside-close',hideMenu);
    }
    /**
     * 打开侧边菜单
     * @param selector css选择器或element实例
     */
    var showMenu = function(selector){
        var $aside = $(selector).addClass('active'),
            transition = $aside.data('transition'),// push overlay  reveal
            position = $aside.data('position') || 'left',
            showClose = $aside.data('show-close'),
            width = $aside.width(),
            translateX = position == 'left'?width+'px':'-'+width+'px';
        if(showClose && $aside.find('div.aside-close').length == 0){
            $aside.append('<div class="aside-close icon close"></div>');
        }

        //aside中可能需要scroll组件
        J.Element.scroll($aside);

        if(transition == 'overlay'){
            J.anim($aside,{translateX : '0%'});
        }else if(transition == 'reveal'){
            J.anim($sectionContainer,{translateX : translateX});
        }else{//默认为push
            J.anim($aside,{translateX : '0%'});
            J.anim($sectionContainer,{translateX : translateX});
        }
        $('#section_container_mask').show();
        J.hasMenuOpen = true;
    }
    /**
     * 关闭侧边菜单
     * @param duration {int} 动画持续时间
     * @param callback 动画完毕回调函数
     */
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

        $('#section_container_mask').hide();
    }
    return {
        init : init,
        show : showMenu,
        hide : hideMenu
    }
})(J.$);