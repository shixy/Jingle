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
        //TODO need loading block
        $.ajax({
            url : J.settings.sectionPath+_formatHash(hash)+'.html',
            timeout : 5000,
            async : false,
            success : function(html){
                $('#section-container').append(html);
            }
        })
    }
    return {
        load : loadPage
    }
})(Jingle);