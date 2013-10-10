/**
 * section 页面远程加载
 */
Jingle.Page = (function(J,$){

    var _formatHash = function(hash){
        return hash.indexOf('#') == 0 ? hash.substr(1) : hash;
    }

    /**
     * ajax远程加载页面
     */
    var loadPage = function(hash){
        var id = _formatHash(hash);
        $.ajax({
            url : J.settings.sectionPath+id+'.html',
            timeout : 10000,
            async : false,
            success : function(html){
                //添加到dom树中
                $('#section_container').append(html);
                //触发pageload事件
                $('#'+id).trigger('pageload');
                //构造组件
                J.Element.init(hash);
            }
        })
    }
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
})(Jingle,Zepto);