//TODO  改造iscroll为插件形式
;(function(){
    var scrollCache = {};
    var generateScrollIndex = 1;
    J.Scroll = function(selector,opts){
        var options = {
           hScroll : false,
           bounce : false,
           lockDirection : true,
           useTransform: true,
           useTransition: false,
           checkDOMChanges: false
        }
        var id;
        if($.type(selector) == 'string'){
            id = selector;
        }else{
            id = $(selector).attr('id');
            if(!id){
                id = "scroll-"+generateScrollIndex++;
                $(selector).attr('id',id);
            }
        }
        var scroll;
        if(scrollCache[id]){
            scroll = scrollCache[id];
            $.extend(scroll.options,opts)
            scroll.refresh();
        }else{
            $.extend(options,opts);
            scroll = new iScroll(id,options);
            scrollCache[id] = scroll;
        }
        return scroll;
    }
})();

