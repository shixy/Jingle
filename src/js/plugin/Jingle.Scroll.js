/**
 *  哥屋恩动组件(iscroll)
 */
;(function($){
    var scrollCache = {},index = 1;
    J.Scroll = function(selector,opts){
        var scroll,scrollId,$el = $(selector),
            options = {
               hScroll : false,
               bounce : false,
               lockDirection : true,
               useTransform: true,
               useTransition: false,
               checkDOMChanges: false,
               onBeforeScrollStart: function (e) {
                    var target = e.target;
                    while (target.nodeType != 1) target = target.parentNode;
                    if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA')
                        e.preventDefault();
                }
            };
        scrollId = $el.data('_jscroll_');
        //滚动组件使用频繁，缓存起来节省开销
        if(scrollId && scrollCache[scrollId]){
            scroll = scrollCache[scrollId];
            $.extend(scroll.scroller.options,opts)
            scroll.scroller.refresh();
            return scroll;
        }else{
            scrollId = '_jscroll_'+index++;
            $el.data('_jscroll_',scrollId);
            $.extend(options,opts);
            scroller = new iScroll($el[0],options);
            return scrollCache[scrollId] = {
                scroller : scroller,
                destroy : function(){
                    scroller.destroy();
                    delete scrollCache[scrollId];
                }
            };
        };
    }
})(J.$);

