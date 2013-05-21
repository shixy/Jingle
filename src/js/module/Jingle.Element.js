Jingle.Element = (function(){
    var _init_icon = function(selector){
        var el = $(selector || 'body');
        if(el.length == 0)return;
        el.find('[data-icon]').each(function(i){
            var value = $(this).data('icon');
            $(this).prepend('<i class="icon '+value+'"></i>');
        })
    }
    var _init_scroll = function(selector){
        var el = $(selector || 'body');
        if(el.length == 0)return;
        el.find('[data-scroll="true"]').each(function(i){
            var _this = this;
            $(this).wrapInner('<div></div>');
            $(this).on('show',function(){
                new iScroll(_this);
            })

        })
    }
    var init = function(selector){
        _init_icon(selector);
        _init_scroll(selector);
    }
    return {
        init : init
    }
})()