Jingle.Refresh = (function(){
    var scroller,refreshEl,iconEl,labelEl,topOffset,isPullDown;
    var _init = function(opts){
        scroller = $('#'+opts.containerId).children()[0];
        var refreshTpl = '<div class="refresh-container"><span class="refresh-icon icon '+opts.onPullIcon+'"></span><span class="refresh-label">'+opts.onPull+'</span></div>';
        if(isPullDown){
            refreshEl = $(refreshTpl).prependTo(scroller);
        }else{
            refreshEl = $(refreshTpl).appendTo(scroller);
        }
        topOffset = refreshEl.height();
        iconEl = refreshEl.find('.refresh-icon');
        labelEl = refreshEl.find('.refresh-label');
    }
    var _pullDown = function(opts){
        isPullDown = true;
        var options = {
            containerId : null,
            onPull: "下拉刷新...",
            onRelease: "松开立即刷新...",
            onRefresh: "刷新中...",
            onPullIcon : 'arrow-down-2',
            onReleaseIcon  : 'arrow-up-3',
            onRefreshIcon : 'spinner',
            callback: undefined
        }
        $.extend(options,opts);
        _init(options);
        _excuteScroll(options);

    }
    var _pullUp = function(opts){
        isPullDown = false;
        var options = {
            containerId : null,
            onPull: "上拉加载更多...",
            onRelease: "松开开立即加载...",
            onRefresh: "加载中...",
            onPullIcon : 'arrow-up-3',
            onReleaseIcon  : 'arrow-down-2',
            onRefreshIcon : 'spinner',
            callback: undefined
        }
        $.extend(options,opts);
        _init(options);
        _excuteScroll(options);
    }

    var _excuteScroll = function(opts){
        J.Scroll(opts.containerId,{
            topOffset:isPullDown?topOffset:0,
            bounce : true,
            onScrollMove : function(){
                if (this.y > 5 && isPullDown && !iconEl.hasClass(opts.onReleaseIcon)) {
                    iconEl.removeClass(opts.onPullIcon).addClass(opts.onReleaseIcon);
                    labelEl.html(opts.onRelease);
                    this.minScrollY = 0;
                } else if (this.y < 5 && isPullDown && !iconEl.hasClass(opts.onPullIcon)) {
                    iconEl.removeClass(opts.onReleaseIcon).addClass(opts.onPullIcon);
                    labelEl.html(opts.onPull);
                    this.minScrollY = -topOffset;
                }else if (this.y < (this.maxScrollY - 5) && !iconEl.hasClass(opts.onReleaseIcon)) {
                    iconEl.removeClass(opts.onPullIcon).addClass(opts.onReleaseIcon);
                    labelEl.html(opts.onRelease);
                    this.maxScrollY = this.maxScrollY;
                } else if (this.y > (this.maxScrollY + 5) && !iconEl.hasClass(opts.onPullIcon)) {
                    iconEl.removeClass(opts.onReleaseIcon).addClass(opts.onPullIcon);
                    labelEl.html(opts.onPull);
                    this.maxScrollY = topOffset;
                }
            },
            onScrollEnd : function(){
                if(iconEl.hasClass(opts.onReleaseIcon)){
                    iconEl.removeClass(opts.onReleaseIcon).addClass(opts.onRefreshIcon);
                    labelEl.html(opts.onRefresh);
                    opts.callback.call(this);
                }
            },
            onRefresh: function () {
                iconEl.removeClass(opts.onRefreshIcon).addClass(opts.onPullIcon);
                labelEl.html(opts.onPull);
            }
        });
    }

    return {
        pullDown : _pullDown,
        pullUp : _pullUp
    }
}());