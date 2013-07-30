//TODO  改造iscroll为插件形式
;(function(){
    var scrollCache = {};
    var generateScrollIndex = 1;
    J.Scroll = function(selector,options){
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
            scroll.refresh();
        }else{
           scroll = new IScroll('#'+id,options);
            scrollCache[id] = scroll;
        }
        return scroll;
    }
})();

