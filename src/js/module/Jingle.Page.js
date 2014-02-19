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
    var loadSectionTpl = function(hash){
        var param = {};
        if($.type(hash) == 'object'){
            hash = hash.tag;
            param = hash.param;
        }
        var id = _formatHash(hash);
        //根据id自动从basePagePath中装载模板
        var url = J.settings.basePagePath+id+'.html'
        if(!url){
            console.error(404,'页面不存在！');
            return;
        }
        if(J.settings.showPageLoading){
            J.showMask();
        }
        var html = loadContent(url,param);
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
    var loadSectionRemote = function(url,section){
        var param = J.Util.parseHash(window.location.hash).param;
        var html = loadContent(url,param);
        $(section).html(html);
        J.Element.init(section);

    }
    /**
     * 同步加载文档片段
     * @param url
     */
    var loadContent = function(url,param){
        return $.ajax({
                url : url,
                timeout : 10000,
                data : param,
                async : false
            }).responseText;
    }
    return {
        load : loadSectionTpl,
        loadSection : loadSectionRemote,
        loadContent : loadContent
    }
})(J.$);