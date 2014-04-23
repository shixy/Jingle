/**
 * 高亮组件
 * 最开始是通过css3伪类 :active来实现触摸高亮，但当手指滑动时会出高亮的地方与手指触摸的地方脱节,故通过js来实现
 * data-selected="selected" 值为高亮的样式
 */
J.Selected = (function($){
    var SELECTOR = '[data-selected]',
        activeEl,timer;
    var init = function(){
        $(document).on('touchstart.selected',SELECTOR,function(){
            var $el = $(this);
            //在滑动的时候有闪烁，添加一个延时器,防止误操作
            timer = setTimeout(function(){
                activeEl = $el.addClass($el.data('selected'));
            },0);

        });
        $(document).on('touchmove.selected touchend.selected touchcancel.selected',function(){
            timer && clearTimeout(timer);
            if(activeEl){
                activeEl.removeClass(activeEl.data('selected'));
                activeEl = null;
            }
        });
    }
    return {
        init : init
    }
})(J.$)