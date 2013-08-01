/**
 * 页面跳转相关
 */
Jingle.Page = (function(J){

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
            timeout : 5000,
            async : false,
            success : function(html){
                //添加到dom树中
                $('#section-container').append(html);
                //触发pageload事件
                $('#'+id).trigger('page.load');
            }
        })
    }
    return {
        load : loadPage
    }
})(Jingle);