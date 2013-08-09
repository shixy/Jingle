/**
 * 上拉/下拉组件
 */
;(function(J,$){
    var refreshCache = {},index = 1;
    function Refresh(selector,type,callback){
        var iscroll, scroller,refreshEl,iconEl,labelEl,topOffset,isPullDown,
            options = {
                selector : undefined,
                type : 'pullDown',//pullDown pullUp
                onPull: "下拉刷新...",
                onRelease: "松开立即刷新...",
                onRefresh: "刷新中...",
                onPullIcon : 'arrow-down-2',
                onReleaseIcon  : 'arrow-up-3',
                onRefreshIcon : 'spinner',
                callback : undefined
            };
        //装载配置
        if(typeof selector === 'object'){
            $.extend(options,selector);
        }else{
            options.selector = selector;
            options.type = type;
            options.callback = callback;
            if(type === 'pullUp'){
                $.extend(options,{
                    onPull: "上拉加载更多...",
                    onRelease: "松开开立即加载...",
                    onRefresh: "加载中...",
                    onPullIcon : 'arrow-up-3',
                    onReleaseIcon  : 'arrow-down-2'
                })
            }
        }
        isPullDown = options.type === 'pullDown' ? true : false;

        /**
         * 初始化dom节点
         * @param opts
         * @private
         */
        var _init = function(opts){
            scroller = $(opts.selector).children()[0];
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

        /**
         * 构造iscroll组件，并绑定滑动事件
         * @param opts
         * @private
         */
        var _excuteScroll = function(opts){
            return J.Scroll(opts.selector,{
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
                        }else if (this.y < (this.maxScrollY - 5) && !isPullDown && !iconEl.hasClass(opts.onReleaseIcon)) {
                            iconEl.removeClass(opts.onPullIcon).addClass(opts.onReleaseIcon);
                            labelEl.html(opts.onRelease);
                            this.maxScrollY = this.maxScrollY;
                        } else if (this.y > (this.maxScrollY + 5) && !isPullDown && !iconEl.hasClass(opts.onPullIcon)) {
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

        //run
        _init(options);
        iscroll = _excuteScroll(options);
        this.iscroll = iscroll;
    }

    J.Refresh = function(selector,type,callback){
        var el,jRefreshId;
        if(typeof selector === 'object'){
            el = $(selector.selector)
        }else{
            el = $(selector);
        }
        jRefreshId = el.data('_jrefresh_');
        if(jRefreshId && refreshCache[jRefreshId]){
            return refreshCache[jRefreshId];
        }else{
            jRefreshId = '_jrefresh_'+index++;
            el.data('_jrefresh_',jRefreshId);
            return refreshCache[jRefreshId] = new Refresh(selector,type,callback);
        }
    }
})(Jingle,Zepto);