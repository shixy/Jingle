/**
 * section 页面远程加载
 */
J.Page = (function($){
    var _formatHash = function(hash){
        return hash.indexOf('#') == 0 ? hash.substr(1) : hash;
    }
    /**
     * ajax远程加载页面
     * @param {string} sectionId或者#sectionId
     * @param {string} url参数
     */
    var loadPage = function(hash){
        var param = {};
        if($.type(hash) == 'object'){
            hash = hash.tag;
            param = hash.param;
        }
        var id = _formatHash(hash);
        //优先从remotePage中寻找是否有对应的url,没有则根据id自动从basePagePath中装载
        var url = J.settings.remotePage[id]||J.settings.basePagePath+id+'.html'
        if(!url){
            console.error(404,'页面不存在！');
            return;
        }
        if(J.settings.showPageLoading){
            J.showMask('正在加载...');
        }
        $.ajax({
            url : url,
            timeout : 10000,
            async : false,
            data : param,
            success : function(html){
                if(J.settings.showPageLoading){
                    J.hideMask();
                }
                //添加到dom树中
                $('#section_container').append(html);
                //触发pageload事件
                $('#'+id).trigger('pageload');
                //构造组件
                J.Element.init(hash);
            }
        })
    }
    /**
     * 同步加载文档片段
     * @param url
     */
    var loadContent = function(url){
        return $.ajax({
                url : url,
                timeout : 10000,
                async : false
            }).responseText;
    }
    return {
        load : loadPage,
        loadContent : loadContent
    }
})(J.$);