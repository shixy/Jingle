/**
 * 提供一些简单的模板，及artTemplate的渲染
 */
Jingle.Template = (function(J,$){
    var background = function(el,title,icon){
        var markup = '<div class="back-mask"><div class="icon '+icon+'"></div><div>'+title+'</div></div>';
        $(el).html(markup);
    }
    var no_result = function(el){
        background(el,'没有找到相关数据','drawer');
    }
    var loading = function(el){
        background(el,'加载中...','cloud-download');
    }
    var render = function(containerSelector,templateId,data,type){
        var el =  $(containerSelector),
            type = type || 'replace';//replace  add
        if($.type(data) == 'array' && data.length == 0 ){
            no_result(el);
        }else{
            var html = $(template(templateId,data));
            if(type == 'replace'){
                el.html(html);
            }else{
                el.append(html);
            }
            J.Element.init(html);
        }
    }
    return {
        render : render,
        background : background,
        loading : loading,
        no_result : no_result
    }
})(Jingle,Zepto);