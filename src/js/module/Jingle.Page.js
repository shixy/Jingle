/**
 * section 页面远程加载
 */
J.Page = (function($){
    var _formatHash = function(hash){
        return hash.indexOf('#') == 0 ? hash.substr(1) : hash;
    }
    /**
     * 加载section模板
     * @param {string} hash信息
     * @param {string} url参数
     */
    var loadSectionTpl = function(hash,callback){
        var param = {},query,replaceSection = false;
        if($.type(hash) == 'object'){
            param = hash.param;
            query = hash.query;
            hash = hash.tag;
        }
        var q = $(hash).data('query');
        //已经存在则直接跳转到对应的页面
        if($(hash).length == 1){
            if(q == query){
                callback();
                return;
            }else{
                replaceSection = true;
            }
        }
        var id = _formatHash(hash);
        //当前dom中不存在，需要从服务端加载
        var url = J.settings.remotePage[hash];
        //检查remotePage中是否有配置,没有则自动从basePagePath中装载模板
        url || (url = J.settings.basePagePath+id+J.settings.basePageSuffix);
        J.settings.showPageLoading && J.showMask();
        loadContent(url,param,function(html){
            J.settings.showPageLoading && J.hideMask();
            //添加到dom树中
            $(hash).remove();
            var $h = $(html);
            $('#section_container').append($h);
            if(replaceSection){
                $h.addClass('active');
            }
            //触发pageload事件
            $h.trigger('pageload').data('query',query);
            //构造组件
            J.Element.init(hash);
            callback();
            $h = null;
        });
    }
    var loadSectionRemote = function(url,section){
        var param = J.Util.parseHash(window.location.hash).param;
        loadContent(url,param,function(html){
            $(section).html(html);
            J.Element.init(section);
        });
    }
    /**
     * 加载文档片段
     * @param url
     */
    var loadContent = function(url,param,callback){
        return $.ajax({
                url : url,
                timeout : 20000,
                data : param,
                success : function(html){
                    callback && callback(html);
                }
            });
    }
    return {
        load : loadSectionTpl,
        loadSection : loadSectionRemote,
        loadContent : loadContent
    }
})(J.$);