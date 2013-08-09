/**
 * 高亮组件？(不太好命名)
 */
Jingle.Selected = (function(J,$){
    var SELECTOR = '[data-selected]',
        activeEl,timer;
    var init = function(){
        //添加命名空间，防止冲突
        $(document).on('touchstart.selected',SELECTOR,function(){
            var $el = $(this);
            //在滑动的时候有闪烁，添加一个延时器,防止误操作
            timer = setTimeout(function(){
                activeEl = $el.addClass($el.data('selected'));
            },100);

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
})(Jingle,Zepto)