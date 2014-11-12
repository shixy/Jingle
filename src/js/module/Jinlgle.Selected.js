/**
 * 高亮组件
 * 在zepto的tap事件里注入了一个延时器，来实现点击态
 */
J.Selected = (function($){
    var DELAY = 100,SELECTOR='[data-selected]';
    var _trigger = $.fn.trigger;
    $.fn.trigger = function (event) {
        var $this = $(this), args = arguments, classname;
        if (event === 'tap' || event.type === 'tap') {
            var match = $this.closest(SELECTOR).get(0);
            if(match){
                match = $(match);
                classname = match.data('selected');
                match.addClass(classname);
                setTimeout(function () {
                    match.removeClass(classname);
                    _trigger.apply($this, args);
                    $this = match = null;
                }, DELAY);
                return this;
            }
        }
        _trigger.apply($this, args);
        return this;
    }
})(J.$);