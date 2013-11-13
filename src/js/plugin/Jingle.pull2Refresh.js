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
                minPullHeight : 10,
                pullText: "下拉刷新...",
                releaseText: "松开立即刷新...",
                refreshText: "刷新中...",
                refreshTip : false,
                onPullIcon : 'arrow-down-2',
                onReleaseIcon  : 'icon-reverse',
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
                    pullText: "上拉加载更多...",
                    releaseText: "松开开立即加载...",
                    refreshText: "加载中...",
                    onPullIcon : 'arrow-up-3'
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
            var refreshTpl = '<div class="refresh-container"><span class="refresh-icon icon '+opts.onPullIcon
                +'"></span><span class="refresh-label">'
                +opts.pullText+'</span>'
                +(opts.refreshTip?'<div class="refresh-tip">'+opts.refreshTip+'</div>':'')+'</div>';
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
                        if (this.y > opts.minPullHeight && isPullDown && !iconEl.hasClass(opts.onReleaseIcon)) {
                            iconEl.addClass(opts.onReleaseIcon);
                            labelEl.html(opts.releaseText);
                            this.minScrollY = 0;
                        } else if (this.y < opts.minPullHeight && isPullDown && iconEl.hasClass(opts.onReleaseIcon)) {
                            iconEl.removeClass(opts.onReleaseIcon);
                            labelEl.html(opts.pullText);
                            this.minScrollY = -topOffset;
                        }else if (this.y < (this.maxScrollY - opts.minPullHeight) && !isPullDown && !iconEl.hasClass(opts.onReleaseIcon)) {
                            iconEl.addClass(opts.onReleaseIcon);
                            labelEl.html(opts.releaseText);
                            this.maxScrollY = this.maxScrollY;
                        } else if (this.y > (this.maxScrollY + opts.minPullHeight) && !isPullDown && iconEl.hasClass(opts.onReleaseIcon)) {
                            iconEl.removeClass(opts.onReleaseIcon);
                            labelEl.html(opts.pullText);
                            this.maxScrollY = topOffset;
                        }
                    },
                    onScrollEnd : function(){
                        if(iconEl.hasClass(opts.onReleaseIcon)){
                            iconEl.removeClass(opts.onReleaseIcon).removeClass(opts.onPullIcon).addClass(opts.onRefreshIcon);
                            labelEl.html(opts.refreshText);
                            var _this = this;
                            setTimeout(function(){//解决在chrome下onRefresh的时候文本无法更改的问题。奇怪的问题！
                                opts.callback.call(_this);
                            },1);

                        }
                    },
                    onRefresh: function () {
                        iconEl.removeClass(opts.onRefreshIcon).addClass(opts.onPullIcon);
                        labelEl.html(opts.pullText);
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