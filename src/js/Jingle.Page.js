/**
 * 页面跳转相关
 */
Jingle.Page = (function(J){
    var formatHash = function(hash){
        return hash.indexOf('#') == 0 ? hash : '#'+hash;
    }
    /**
     * 根据hash值跳转页面
     * @param hash
     */
    var go = function(hash){
        var hash = formatHash(hash);
        window.location.hash = hash;
    }
    /**
     * ajax远程加载页面
     * @param pageId  远程页面ID
     * @url  远程页面地址
     */
    var loadPage = function(pageId,url){
        if($('#'+pageId).length>0){
            go(pageId);
            return;
        }
        $.get(J.pageFolder+url,function(html){
            $('body').append($(html));
            go(pageId);
        })
    }
    /**
     * 使用JSON数据来渲染模板
     * @param data  JSON数据
     * @param tmplUrl 模板地址
     * @param callback 渲染后生成的html
     */
    var _processTmpl = function(data,tmplUrl,callback){
        $.get(J.templateFoler+tmplUrl,function(html){
            var content = $.tmpl(html,data);
            callback(content);
        })
    }
    /**
     * 远程加载数据并渲染模板，然后显示页面
     * @param pageId 页面ID
     * @param dataUrl JSON数据获取路径
     * @param tmplUrl 模板地址
     */
    var loadPageByTmpl = function(pageId,dataUrl,tmplUrl){
        if($('#'+pageId).length>0){
            go(pageId);
            return;
        }
        $.get(dataUrl,function(data){
            _processTmpl(data,tmplUrl,function(html){
                $('body').append(html);
                go(pageId);
            })

        })
    }
    /**
     * 加载html片段
     * @param url
     */
    var loadContent = function(url){
        //TODO
    }
    return {
        go : go,
        loadPage : loadPage,
        loadPageByTmpl : loadPageByTmpl
    }
})(Jingle)