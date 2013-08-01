/**
 * 上拉/下拉刷新、加载更多
 */
Jingle.Refresh = function(opts){
    this.options = {
        containerId : null,
        onPull: "下拉刷新...",
        onRelease: "放开即可刷新...",
        onRefresh: "加载中...",
        callback: undefined
    }
    $.extend(this.options,opts);
    $('<div class="pullDown"> <span class="pullDownIcon"></span><span class="pullDownLabel">Pull down to refresh...</span></div>').prependTo('#'+this.options.containerId);

    J.Scroll(this.options.containerId,{
        topOffset:100,
        onScrollMove : function(){

        },
        onScrollEnd : function(){

        }
    });
}
