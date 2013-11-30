/**
 * 上拉/下拉组件
 */
;(function(J,$){
    var refreshCache = {},index = 1;
    function Refresh(selector,type,callback){
        var iscroll, scroller,refreshEl,iconEl,labelEl,topOffset,isPullDown,
            options = {
                selector : undefined,
                type : 'pullDown',//pullDown|pullUp 默认为pullDown
                minPullHeight : 10,//拉动的像素相对值，超过才会翻转
                pullText: "下拉刷新...",
                releaseText: "松开立即刷新...",
                refreshText: "刷新中...",
                refreshTip : false,//下拉时显示的文本，比如：最后更新时间:2013-....
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
        return iscroll;

    }

    /**
     * 刷新组件
     * @param selector selector
     * @param type 类型 pullDown(下拉) pullUp(上拉)
     * @param callback 回调函数
     */
    J.Refresh = function(selector,type,callback){
        var el,jRefreshId;
        if(selector.selector){
            el = $(selector.selector)
        }else{
            el = $(selector);
        }
        jRefreshId = el.data('_jrefresh_');
        //因上拉下拉可能会使用的比较频繁，故缓存起来节省开销,亦可防止重复绑定
        if(jRefreshId && refreshCache[jRefreshId]){
            return refreshCache[jRefreshId];
        }else{
            jRefreshId = '_jrefresh_'+index++;
            el.data('_jrefresh_',jRefreshId);
            var refresh = new Refresh(selector,type,callback);
            return refreshCache[jRefreshId] = {
                scroller : refresh.scroller,
                destroy : function(){
                    delete refreshCache[jRefreshId];
                    refresh.destroy();
                    $('.refresh-container',selector).remove();
                }
            };
        }
    }
})(Jingle,Zepto);