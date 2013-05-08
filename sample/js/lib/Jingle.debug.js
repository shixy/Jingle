var Jingle = J = {
    settings : {
        transitionType : 'slide',
        transitionTime : 300,
        transitionTimingFunc : 'ease-out',
        sectionPath : 'html/section/'
    },
    mode : window.innerWidth < 800 ? "phone" : "tablet",
    hasTouch : 'ontouchstart' in window,
    hasLaunched : false,
    launchCompleted : false,
    isMenuOpen : false,
    launch : function(opts){
        $.extend(this.settings,opts);
        this.Router.init();
        this.Markup.init();
    }
}
Jingle.Constants = (function(J){
    return {
        Events : {
            startEvent :J.hasTouch ? 'touchstart':'mousedown',
            moveEvent :J.hasTouch ? 'touchmove':'mousemove',
            endEvent :J.hasTouch ? 'touchend':'mouseup',
            tap :J.hasTouch ? 'tap':'click'
        }
    }
})(J)
Jingle.Element = (function(J){
    var SELECTOR = {
        'nav' : '.bar-tab',
        'SEGMENTED' : '.segmented-controller li'
    }
    var init = function(){
    }
    return {
        init : init
    }
})(Jingle)
Jingle.Markup = (function(){
    var attr = {
        icon : '<i class="icon {value}"></i>'
    }
    var init = function(selector){
        var el = $(selector || 'body');
        if(el.length == 0)return;
        for(var k in attr){
            el.find('[data-'+k+']').each(function(i,children){
                var value = $(children).data(k);
                $(children).prepend(attr[k].replace('{value}',value));
            })
        }
    }
    return {
        init : init
    }
})()
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
    /**
     * 使用JSON数据来渲染模板
     * @param data  JSON数据
     * @param tmplUrl 模板地址
     * @param callback 渲染后生成的html
     */
    var _processTmpl = function(data,tmplUrl,callback){
        $.get(J.templateFoler+tmplUrl,function(html){
            var content = $.tmpl(html,data);
            callback(content);
        })
    }
    /**
     * 远程加载数据并渲染模板，然后显示页面
     * @param pageId 页面ID
     * @param dataUrl JSON数据获取路径
     * @param tmplUrl 模板地址
     */
    var loadPageByTmpl = function(pageId,dataUrl,tmplUrl){
        if($('#'+pageId).length>0){
            go(pageId);
            return;
        }
        $.get(dataUrl,function(data){
            _processTmpl(data,tmplUrl,function(html){
                $('body').append(html);
                go(pageId);
            })

        })
    }
    /**
     * 加载html片段
     * @param url
     */
    var loadContent = function(url){
        //TODO
    }
    return {
        load : loadPage,
        loadPageByTmpl : loadPageByTmpl
    }
})(Jingle)
/**
 * 框架的运作机制
 */
Jingle.Router = (function(){
    var TARGET_SELECTOR = 'a[data-target]';
    var _history = [];

    /**
     * 初始化events、state
     */
    var init = function(){
        $(window).on('popstate', _popstateHandler);
        $(document).on('tap','a',function(e){e.preventDefault()});
        $(document).on('click','a',function(e){e.preventDefault()});
        $(document).on('tap',TARGET_SELECTOR,_targetHandler);
        add2History('#index_section');
    }
    var _initHistory = function(){

    }

    /**
     * 处理浏览器的后退事件
     * 前进事件不做处理
     * @private
     */
    var _popstateHandler = function(e){
        if(e.state && e.state.hash){
            var hash = e.state.hash;
            if(hash === _history[1]){//存在历史记录，证明是后退事件
                back();
            }else{//其他认为是非法后退或者前进
                return;
            }
        }else{
            return;
        }

    }
    var _targetHandler = function(e){
        e.preventDefault();
        var target = $(this).attr('data-target');
        var href = $(this).attr('href');
        switch(target){
            case 'section' :
                if($.contains($('aside')[0], e.target)){
                    J.Menu.hide();
                }
                _showSection(href);
                break;
            case 'article' :
                _showArticle(href);
                break;
            case 'menu' :
                _toggleMenu();
                break;
            case 'back' :
                back();
                break;
        }
    }

    var _showSection  = function(hash){
        var currentPage = $(_history[0]);
        add2History(hash);
        if($(hash).length === 0){
            J.Page.load(hash);
        }
        _changePage(currentPage,hash);
    }
    var back = function(){
        _changePage(_history.shift(),_history[0],true);
        window.history.replaceState({hash:_history[0]},'',_history[0]);
    }
    var _changePage = function(current,target,isBack){
        J.Transition.run(current,target,isBack);
    }
    /**
     * 缓存访问记录
     */
    var add2History = function(hash){
        _history.unshift(hash);
        window.history.pushState({hash:hash},'',hash);
    }
    var _showArticle = function(href){
        var article = $(href);
        var activeArticle = article.siblings('.active');
        activeArticle.animate('bounceOutUp',1000,'linear',function(){
            $(this).removeClass('active');
            article.addClass('active');
            article.animate('bounceInDown',1000,'linear',function(){

            })
        })
    }

    var _toggleMenu = function(){
        J.isMenuOpen?J.Menu.hide():J.Menu.show();
    }

    return {
        init : init,
        turnTo : _showSection,
        back : back
    }

})()
Jingle.Transition = (function(J){

    var TRANSITION = {
        slide : [['slideRightOut','slideRightIn'],['slideLeftOut','slideLeftIn']]
    }

    var _doTransition = function(current, target, transitionName){
        var duration = J.settings.transitionTime;
        var easing = J.settings.transitionTimingFunc;
        target.addClass('active');
        current.animate(transitionName[0],duration,easing,function(){
            _finishTransition(current, target);
        });
        target.animate(transitionName[1],duration,easing);
    }

    var _finishTransition = function(current, target) {
        current.removeClass('active');
        current.trigger('pagehide');
        target.trigger('pageshow');
    }

    var run = function(current,target,isBack){
        current = $(current);
        target = $(target);
        var type = current.attr('data-transition')|| J.settings.transitionType;
        var transitionName  = isBack ? TRANSITION[type][0] : TRANSITION[type][1];
        _doTransition(current,target,transitionName);
    }
    return {
        run : run
    }

})(Jingle)
Jingle.Menu = (function(J){
    var SELECTOR = {
        MENU : 'body>aside',
        SECTION_CONTAINER : '#section-container'
    }
    var showMenu = function(){
        $(SELECTOR.MENU).animate({
            translateX : '0%'
        }, J.settings.transitionTime,'linear',function(){
            J.isMenuOpen = true;
        });
        $(SELECTOR.SECTION_CONTAINER).animate({
            translateX : '264px'
        },J.settings.transitionTime);
    }
    var hideMenu = function(){
        $(SELECTOR.MENU).animate({
            translateX : '-100%'
        },J.settings.transitionTime,'linear',function(){
            J.isMenuOpen = false;
        });
        $(SELECTOR.SECTION_CONTAINER).animate({
            translateX : 0
        },J.settings.transitionTime);
    }
    return {
        show : showMenu,
        hide : hideMenu
    }
})(Jingle)
;(function(){
    function slider(selector,noDots){
        var gestureStarted = false,
            index = 0,
            speed = 300,
            wrapper = $(selector),
            dots,
            container,
            slides,
            slideNum,
            slideWidth,
            deltaX;

        /**
         * 初始化容器大小
         */
        var _init = function() {
            container = wrapper.children().first();
            slides = container.children();
            slideNum = slides.length;
            slideWidth = container.offset().width;
            container.css('width',slideNum * slideWidth);

            slides.css({
                    'width':slideWidth,
                    'display':'table-cell',
                    'verticalAlign' : 'top'
            })
            if(!noDots)_initDots();
            _slide(0, 0);
        };

        var _initDots = function(){
            dots = wrapper.find('.dots');
            if(dots.length>0){
                dots.show();
            }else{
                var dotsWidth = slideNum*30+20+2;
                var html = '<div class="dots"><ul>';
                for(var i=0;i<slideNum;i++){
                    html +='<li index="'+i+'"><a href="#"></a></li>'
                }
                html += '</ul></div>';
                wrapper.append(html);
                dots = wrapper.find('.dots');
                dots.children().css('width',dotsWidth+'px');
                dots.find('li').on('tap',function(){
                    var index = $(this).attr('index');
                    _slide(parseInt(index), speed);
                })
            }
        }

        /**
         * 滑动到指定卡片
         * @param i
         * @param duration
         * @private
         */
        var _slide = function(i, duration) {
            duration = duration || speed;
            container.animate({
                translateX : -(i * slideWidth)+'px'
            },duration)
            index = i;
            if(dots) $(dots.find('li').get(index)).addClass('active').siblings().removeClass('active');
        };

        /**
         * 绑定滑动事件
         */
        var _bindEvents = function() {
            container.on('touchstart',_touchStart,false);
            container.on('touchmove',_touchMove,false);
            container.on('touchend',_touchEnd,false);
            //屏幕旋转时重新计算大小
            $(window).on('resize',_init);
        };

        var  _touchStart = function(event) {
            var e = event.touches[0];
            start = {
                pageX: e.pageX,
                pageY: e.pageY,
                time: Number(new Date())
            };
            isScrolling = undefined;
            deltaX = 0;
            container[0].style.webkitTransitionDuration = 0;
            gestureStarted = true;
            //阻止事件冒泡
            event.stopPropagation();
        };

        var _touchMove = function(event) {
            if(!gestureStarted)return;
            var e = event.touches[0];
            deltaX = e.pageX - start.pageX;
            if ( typeof isScrolling == 'undefined') {
                //根据X、Y轴的偏移量判断用户的意图是左右滑动还是上下滑动
                isScrolling = !!( isScrolling || Math.abs(deltaX) < Math.abs(e.pageY - start.pageY) );
            }
            if (!isScrolling) {
                event.preventDefault();
                var factor = ((!index && deltaX > 0 || index == slideNum - 1 && deltaX < 0) ?(Math.abs(deltaX)/slideWidth + 1):1);
                deltaX = deltaX / factor;
                var pos = (deltaX - index * slideWidth);
                container[0].style.webkitTransform = 'translateX('+pos+'px)';
                event.stopPropagation();
            }
        };

        var _touchEnd = function(e) {
            //判定是否跳转到下一个卡片
            //滑动时间小于250ms或者滑动X轴的距离大于屏幕宽度的1/3
            var isValidSlide = Number(new Date()) - start.time < 250 && Math.abs(deltaX) > 20 || Math.abs(deltaX) > slideWidth/3;
            //判定是否达到了边界即第一个右滑、最后一个左滑
            var isPastBounds = !index && deltaX > 0 || index == slideNum - 1 && deltaX < 0;
            if (!isScrolling) {
                _slide( index + ( isValidSlide && !isPastBounds ? (deltaX < 0 ? 1 : -1) : 0 ), speed );
            }
            gestureStarted = false;
            e.stopPropagation();
        };

        _init();
        _bindEvents();

        this.prev = function() {
            if (index) _slide(index-1, speed);
        };

        this.next = function() {
            if(index < slideNum-1){
                _slide(index+1, speed);
            }
        };
        this.index = function(i) {
            _slide(i);
        };
    }
    J.Slider = slider;
}())