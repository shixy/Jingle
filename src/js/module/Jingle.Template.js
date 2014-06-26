/**
 * 提供一些简单的模板，及artTemplate的渲染
 */
J.Template = (function($){
    /**
     * 背景模板
     * @param el  selector
     * @param title  显示文本
     * @param icon   图标
     */
    var background = function(el,title,icon){
        var markup = '<div class="back-mask"><div class="icon '+icon+'"></div><div>'+title+'</div></div>';
        $(el).html(markup);
    }

    /**
     * 无记录背景模板
     * @param el
     */
    var no_result = function(el){
        background(el,'没有找到相关数据','drawer');
    }
    /**
     * 加载等待背景模板
     * @param el
     */
    var loading = function(el){
        background(el,'加载中...','cloud-download');
    }

    /**
     * 借助artTemplate模板来渲染页面
     * @param containerSelector 目标容器
     * @param templateId  artTemplate模板ID
     * @param data 模板数据
     * @param type replace|add 渲染好的文档片段是替换还是添加到目标容器中
     */
    var render = function(containerSelector,templateId,data,type){
        var el =  $(containerSelector),
            type = type || 'replace';//replace  add
        if($.type(data) == 'array' && data.length == 0 ){
            no_result(el);
        }else{
            var html = template(templateId,data);
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
})(J.$);
