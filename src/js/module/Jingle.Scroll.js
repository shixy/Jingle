//TODO  改造iscroll为插件形式
;(function(){
    var scrollCache = {};
    J.Scroll = function(id,options){
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

