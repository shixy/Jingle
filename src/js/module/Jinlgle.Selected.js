/**
 * 高亮组件
 * 最开始是通过css3伪类 :active来实现触摸高亮，但当手指滑动时会出高亮的地方与手指触摸的地方脱节,故通过js来实现
 * data-selected="selected" 值为高亮的样式
 */
J.Selected = (function($){
    var SELECTOR = '[data-selected]',activeEl,classname;
    var init = function(){
        $(document).on('touchstart.selected',SELECTOR,function(){
            classname = $(this).data('selected');
            activeEl = $(this).addClass(classname);

        });
        $(document).on('touchmove.selected touchend.selected touchcancel.selected',function(){
            if(activeEl){
                activeEl.removeClass(classname);
                activeEl = null;
            }
        });
    }
    return {
        init : init
    }
})(J.$)