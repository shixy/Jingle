var Jingle = J = {
    settings : {
        transitionType : 'slide',
        transitionTime : 300,
        transitionTimingFunc : 'linear',
        sectionPath : 'html/'
    },
    mode : window.innerWidth < 800 ? "phone" : "tablet",
    hasTouch : 'ontouchstart' in window,
    hasLaunched : false,
    launchCompleted : false,
    isMenuOpen : false,
    hasPopupOpen : false,
    isWebApp : location.protocol == 'http:',
    launch : function(opts){
        $.extend(this.settings,opts);
        this.Router.init();
        this.Element.init();
        $('body').delegate('article','show',function(){
            if($(this).data('scroll')){
                J.Scroll(this.id);
            }
        });
    },
    anim : function(el,animName,duration,ease,callback){
        var d, e,c;
        var len = arguments.length;
        for(var i = 2;i<len;i++){
            var a = arguments[i];
            var t = $.type(a);
            t == 'number'?(d=a):(t=='string'?(e=a):(t=='function')?(c=a):null);
        }
        $(el).animate(animName,d|| J.settings.transitionTime,e||J.settings.transitionTimingFunc,c);
    },
    showMask : function(text,cancelCallback){
        if($.type(text) == 'function'){
            cancelCallback = text;
            text = null;
        }
        text = text || 'Loading...';
        this.Toast.show('loading',text,cancelCallback);
    },
    hideMask : function(){
        this.Toast.hide();
    },
    showToast : function(text,type){
        type = type || 'toast';
        this.Toast.show(type,text);
    },
    hideToast : function(){
        this.Toast.hide();
    },
    alert : function(title,content){
        this.Popup.alert(title,content);

    },
    confirm : function(title,content,okCall,cancelCall){
        this.Popup.confirm(title,content,okCall,cancelCall);
    },
    popup : function(html,pos,closeable){
        this.Popup.show(html,pos,closeable);
    },
    closePopup : function(){
        this.Popup.close();
    },
    popover : function(html,pos,arrow_direction){
        this.Popup.popover(html,pos,arrow_direction);
    },
    tmpl : function(containerSelector,templateId,data){
        this.Template.render(containerSelector,templateId,data);
    }
};
Jingle.Element = (function(){
    var SELECTOR  = {
        'icon' : '[data-icon]',
        'scroll' : '[data-scroll="true"]',
        'toggle' : '.toggle',
        'range' : '[data-rangeinput]',
        'progress' : '[data-progress]',
        'count' : '[data-count]'
    }

    var init = function(selector){
        var el = $(selector || 'body');
        if(el.length == 0)return;
        $.map($(SELECTOR.icon,el),_init_icon);
        $.map($(SELECTOR.toggle,el),_init_toggle);
        $.map($(SELECTOR.range,el),_init_range);
        $.map($(SELECTOR.progress,el),_init_progress);
        $.map($(SELECTOR.count,el),_init_count);
        $.map($(SELECTOR.scroll,el),_init_scroll);
    }
    var _init_icon = function(el){
        $(el).prepend('<i class="icon '+$(el).data('icon')+'"></i>');
    }
    var _init_scroll = function(el){
        var id = $(el).attr('id');
        if(id){
            J.Scroll(id);
        }else{
            console.error('Jingle.Scroll need a id');
        }
    }

    var _init_toggle = function(el){
        var $el = $(el);
        var name = $el.attr('name');
        //添加隐藏域，方便获取值
        if(name){
            $el.append('<input style="display: none;" name="'+name+'" value="'+$el.hasClass('active')+'"/>');
        }
        var $input = $el.find('input');
        $el.tap(function(){
            var value;
            if($el.hasClass('active')){
                $el.removeClass('active');
                value = false;
            }else{
                $el.addClass('active');
                value = true;
            }
            $input.val(value);
            $el.trigger('toggle');
        })
    }

    var _init_range = function(el){
        var $input;
        var $el = $(el);
        var $range = $('input[type="range"]',el);
        var align = $el.data('rangeinput');
        var input = $('<input type="text" name="test" value="'+$range.val()+'"/>');
        if(align == 'left'){
            $input = input.prependTo($el);
        }else{
            $input = input.appendTo($el);
        }
        var max = parseInt($range.attr('max'),10);
        var min = parseInt($range.attr('min'),10);
        $range.change(function(){
            $input.val($range.val());
        });
        $input.on('input',function(){
            var value = parseInt($input.val(),10);
            value = value>max?max:(value<min?min:value);
            $range.val(value);
            $input.val(value);
        })
    }

    var _init_progress = function(el){
        var $el = $(el);
        var progress = parseFloat($el.data('progress'));
        var title = $el.data('title') || '';
        var $bar = $('<div class="bar"></div>');
        progress = progress+'%';
        $bar.appendTo($el).width(progress).text(title+progress);
        if(progress == '100%'){
            $bar.css('border-radius','10px');
        }
    }
    var _init_count = function(el){
        var $el = $(el);
        var count = parseInt($el.data('count'));
        var orient = $el.data('orient');
        var className = (orient == 'left')?'left':'';
        var markup = '<span class="count '+className+'">'+count+'</span>'
        $el.append(markup);
        if(count == 0){
            $('.count',el).hide();
        }
    }

    return {
        init : init
    }
})();
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
})(Jingle);
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
        //取消所有锚点的tap click的默认事件，由框架来控制
        $(document).on('tap','a',function(e){e.preventDefault()});
        $(document).on('click','a',function(e){e.preventDefault()});
        $(document).on('tap',TARGET_SELECTOR,_targetHandler);

        var initSectionId = $('#section-container section.active').trigger('in').attr('id');
        add2History('#'+initSectionId);
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
        var _this = $(this);
        var target = _this.attr('data-target');
        var href = _this.attr('href');
        switch(target){
            case 'section' :
                _showSection(href);
                break;
            case 'article' :
                _showArticle(href,_this);
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
        if(J.isMenuOpen){
            J.Menu.hide();
        }
        if(_history[0] === hash)return;
        var currentPage = $(_history[0]);
        add2History(hash);
        if($(hash).length === 0){
            J.Page.load(hash);
            J.Element.init(hash);
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
    var _showArticle = function(href,el){
        var article = $(href);
        if(article.hasClass('active'))return;
        el.addClass('active').siblings('.active').removeClass('active');
        var activeArticle = article.addClass('active').siblings('.active').removeClass('active');
        J.anim(article,'scaleIn',300,function(){
            article.trigger('show');
            activeArticle.trigger('hide');

        });
    }

    var _toggleMenu = function(){
        J.isMenuOpen?J.Menu.hide():J.Menu.show();
    }

    return {
        init : init,
        turnTo : _showSection,
        back : back
    }

})();
//TODO  改造iscroll为插件形式
;(function(){
    var scrollCache = {};
    J.Scroll = function(id,options){
        var scroll;
        if(scrollCache[id]){
            scroll = scrollCache[id];
            scroll.refresh();
        }else{
           scroll = new IScroll('#'+id,options);
            scrollCache[id] = scroll;
        }
        return scroll;
    }
})();


/**
 * 对zeptojs的ajax进行封装，实现离线访问
 * 推荐纯数据的ajax请求调用本方法，其他的依旧使用zeptojs自己的ajax
 */
Jingle.Service = (function(){
    var UNPOST_KEY = 'JINGLE_POST_DATA';

    var ajax = function(options){
        if(options.type == 'post'){
            _doPost(options);
        }else{
            _doGet(options);
        }
    }

    var _doPost = function(options){
        if(J.offline){//离线模式，将数据存到本地，连线时进行提交
            _setUnPostData(options.url,options.data);
            options.success('数据已存至本地');
        }else{//在线模式，直接提交
            $.ajax(options);
        }

    }
    var _doGet = function(options){
        var key = options.url +JSON.stringify(options.data);
        if(J.offline){//离线模式，直接从本地读取
            var result = _getCache(key);
            if(result){
                options.success(result.data,result.createdTime);
            }else{
                options.success(result);
            }

        }else{//在线模式，将数据保存到本地
            var callback = options.success;
            options.success = function(result){
                _saveData2local(key,result);
                callback(result);
            }
            $.ajax(options);
        }
    }

    /**
     * 获取本地已缓存的数据
     * @private
     */
    var _getCache = function(key){
         return JSON.parse(localStorage.getItem(key));
    }
    /**
     * 缓存数据到本地
     * @private
     */
    var _saveData2local = function(key,result){
        var data = {
            data : result,
            createdTime : new Date()
        }
        localStorage.setItem(key,JSON.stringify(data));
    }

    /**
     * 将post的数据保存至本地
     * @param url
     * @param result
     * @private
     */
    var _setUnPostData = function(url,result){
        var data = getUnPostData();
        if(!data)data = {};
        data[url] = {
            data : result,
            createdTime : new Date()
        }
        localStorage.setItem(UNPOST_KEY,JSON.stringify(data));
    }
    /**
     *  获取尚未同步的post数据
     * @param url  没有就返回所有未同步的数据
     */
    var getUnPostData = function(url){
        var data = JSON.parse(localStorage.getItem(UNPOST_KEY));
        if(url){
            return data[url];
        }else{
            return data;
        }
    }
    /**
     * 移除未同步的数据
     * @param url 没有就移除所有未同步的数据
     */
    var removeUnPostData = function(url){
        if(url){
            var data = getUnPostData();
            delete data[url];
            localStorage.setItem(UNPOST_KEY,JSON.stringify(data));
        }else{
            localStorage.removeItem(UNPOST_KEY);
        }
    }

    /**
     * 同步本地缓存的post数据
     * @param url
     */
    var syncPostData = function(url,success,error){
        var unPostData = getUnPostData(url).data;
        $.ajax({
            url : url,
            data : unPostData,
            type : 'post',
            success : function(){
                success(url);
            },
            error : function(){
                error(url);
            }
        })
    }
    /**
     * 同步所有的数据
     * @param callback
     */
    var syncAllPostData = function(success,error){
        var unPostData = getUnPostData();
        for(var url in unPostData){
            syncPostData(url,success,error);
        }
    }

    //copy from zepto
    function parseArguments(url, data, success, dataType) {
        var hasData = !$.isFunction(data)
        return {
            url:      url,
            data:     hasData  ? data : undefined,
            success:  !hasData ? data : $.isFunction(success) ? success : undefined,
            dataType: hasData  ? dataType || success : success
        }
    }

    var get = function(url, data, success, dataType){
        return ajax(parseArguments.apply(null, arguments))
    }

    var post = function(url, data, success, dataType){
        var options = parseArguments.apply(null, arguments)
        options.type = 'POST'
        return ajax(options)
    }

    var getJSON = function(url, data, success){
        var options = parseArguments.apply(null, arguments)
        options.dataType = 'json'
        return ajax(options)
    }
    var clear = function(){
        window.localStorage.clear();
    }
    return {
        ajax : ajax,
        get : get,
        post : post,
        getJSON : getJSON,
        getUnPostData : getUnPostData,
        removeUnPostData : removeUnPostData,
        syncPostData : syncPostData,
        syncAllPostData : syncAllPostData,
        clear : clear
    }
})();
Jingle.Template = (function(){
    var background = function(el,title,icon){
        var markup = '<div class="back-mask"><div class="icon '+icon+'"></div><div>'+title+'</div></div>';
        $(el).html(markup);
    }
    var no_result = function(el){
        background(el,'没有找到相关数据','drawer');
    }
    var loading = function(el){
        background(el,'加载中...','cloud-download');
    }
    var render = function(containerSelector,templateId,data){
        var el =  $(containerSelector);
        if($.type(data) == 'array' && data.length == 0 ){
            no_result(el);
        }else{
            el.html(template(templateId,data));
            J.Element.init(el);
        }
    }
    return {
        render : render,
        background : background,
        loading : loading,
        no_result : no_result
    }
})();
Jingle.Toast = (function(){
    var TEMPLATE = {
        toast : '<a href="#">{value}</a>',
        success : '<i class="icon checkmark-circle"></i>{value}',
        error : '<i class="icon cancel-circle"></i>{value}',
        info : '<i class="icon info-2"></i>{value}',
        loading : '<i class="icon spinner"></i><p>{value}</p><div id="tag_close_toast" class="icon cancel-circle"></div>'
    }
    var toast_type = 'toast';
    var _toast,_mask;
    var timer;
    var _closeToastCallback = function(){};
    var _init = function(){
        $('body').append('<div id="jingle_toast"></div><div id="jingle_toast_mask"></div>');
        _mask = $('#jingle_toast_mask');
        _toast = $('#jingle_toast');
        _subscribeCloseTag();
    }
    var hide = function(){
        if(toast_type == 'loading'){
            _toast.hide();
            _mask.hide();
        }else if(toast_type =='toast'){
            J.anim(_toast,'scaleOut',function(){
                _toast.hide();
            });
        }else{
            J.anim(_toast,'slideUpOut',function(){
                _toast.hide();
            });
        }
    }
    var show = function(type,text,closeCallback){
        _mask.hide();
        if(timer) clearTimeout(timer);
        toast_type = type;
        _toast.attr('class',type).html(TEMPLATE[type].replace('{value}',text)).show();
        if(type == 'loading'){
            _mask.show();
            if(closeCallback)_closeToastCallback=closeCallback;
        }else if(type =='toast'){
            J.anim(_toast,'scaleIn');
            timer = setTimeout(hide,3000);
        }else{
            J.anim(_toast,'slideDownIn');
            timer = setTimeout(hide,3000);
        }
    }
    var _subscribeCloseTag = function(){
        _toast.on('tap','#tag_close_toast',function(){
            hide();
            _closeToastCallback();
        })
    }

    _init();

    return {
        show : show,
        hide : hide
    }
})();
Jingle.Transition = (function(J){

    var isBack = false;

    var TRANSITION = {
        //[back,in]
        slide : [['slideRightOut','slideRightIn'],['slideLeftOut','slideLeftIn']],
        scale : [['scaleOut','none'],['none','scaleIn']]
    }

    var _doTransition = function(current, target, transitionName){
        if(transitionName[0] == 'none'){
            current.removeClass('active').addClass('activing');
            target.addClass('active');
            J.anim(target,transitionName[1],function(){_finishTransition(current, target)});
        }else if(transitionName[1] == 'none'){
            target.addClass('activing');
            J.anim(current,transitionName[0],function(){_finishTransition(current, target)});
        }else{
            current.removeClass('active').addClass('activing');
            target.addClass('active');
            J.anim(current,transitionName[0]);
            J.anim(target,transitionName[1],function(){_finishTransition(current, target)});
        }

    }

    var _finishTransition = function(current, target) {
        current.removeClass('activing active');
        target.removeClass('activing').addClass('active');
        current.trigger('out',[isBack]);
        target.trigger('in',[isBack]);
        current.find('article.active').trigger('hide');
        target.find('article.active').trigger('show');
    }

    var run = function(current,target,back){
        isBack = back;
        current = $(current);
        target = $(target);
        var type = isBack?current.attr('data-transition'):target.attr('data-transition');
        type = type|| J.settings.transitionType;
        var transitionName  = isBack ? TRANSITION[type][0] : TRANSITION[type][1];
        _doTransition(current,target,transitionName);
    }
    return {
        run : run
    }

})(Jingle);
Jingle.Popup = (function(){
    var POSITION = {
        'top':{
            top:0,
            left:0,
            right:0
        },
        'top-second':{
            top:'44px',
            left:0,
            right:0
        },
        'center':{
            top:'50%',
            left:'10%',
            right:'10%',
            'border-radius' : '3px'
        },
        'bottom' : {
            bottom:0,
            left:0,
            right:0
        },
        'bottom-second':{
            bottom : '51px',
            left:0,
            right:0
        }
    };
    var ANIM = {
        top : ['slideDownIn','slideUpOut'],
        bottom : ['slideUpIn','slideDownOut'],
        defaultAnim : ['scaleIn','scaleOut']
    };
    var _popup,_mask;
    var transition;
    var _init = function(){
        $('body').append('<div id="jingle_popup"></div><div id="jingle_popup_mask"></div>');
        _mask = $('#jingle_popup_mask');
        _popup = $('#jingle_popup');
        _subscribeEvents();
    }
    var show = function(html,pos,closeable,arrow_direction){
        var pos_type = $.type(pos);
        _mask.show();
        //rest position and class
        _popup.attr({'style':'','class':''});
        if(pos_type == 'object'){
            _popup.css(pos);
            transition = ANIM['defaultAnim'];
        }else if(pos_type == 'string'){
            _popup.css(POSITION[pos])
            var trans_key = pos.indexOf('top')>-1?'top':(pos.indexOf('bottom')>-1?'bottom':'defaultAnim');
            transition = ANIM[trans_key];
        }else{
            console.error('错误的参数！');
            return;
        }
        if(arrow_direction){
            _popup.addClass('arrow '+arrow_direction);
            _popup.css('padding','8px');
            if(arrow_direction=='top'||arrow_direction=='bottom'){
                transition = ANIM[arrow_direction];
            }
        }
        if(closeable){
            _popup.append('<div id="tag_close_popup" data-target="closePopup" class="icon cancel-circle"></div>');
        }
        _popup.html(html).show();;
        J.Element.init(_popup);
        J.anim(_popup,transition[0]);
        _popup.trigger('open');
        J.hasPopupOpen = true;
    }
    var hide = function(callback){
        _mask.hide();
        J.anim(_popup,transition[1],function(){
            _popup.hide();
            J.hasPopupOpen = false;
            _popup.trigger('close');
            if(callback)callback();
        });
    }
    var _subscribeEvents = function(){
        _mask.on('tap',hide);
        _popup.on('tap','[data-target="closePopup"]',function(){
            hide();
        });
    }
    _init();

    var alert = function(title,content){
        var markup = '<div class="popup-title">'+title+'</div><div class="popup-content">'+content+'</div><div id="popup_btn_container"><a data-target="closePopup" data-icon="checkmark">OK</a></div>'
        show(markup,'center',false);
    }
    var confirm = function(title,content,okCall,cancelCall){
        var markup = '<div class="popup-title">'+title+'</div><div class="popup-content">'+content+'</div><div id="popup_btn_container"><a data-icon="checkmark">确定</a><a class="cancel" data-icon="close">取消</a></div>'
        show(markup,'center',true);
        $('#popup_btn_container [data-icon="checkmark"]').tap(function(){
            hide(okCall);
        });
        $('#popup_btn_container [data-icon="close"]').tap(function(){
            hide(cancelCall);
        });
    }

    var popover = function(html,pos,arrow_direction){
        show(html,pos,false,arrow_direction)
    }

    return {
    show : show,
    close : hide,
    alert : alert,
    confirm : confirm,
    popover : popover
}
})();
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
})(Jingle);
;(function(){
    function slider(selector,noDots){
        var gestureStarted = false,
            index = 0,
            speed = 300,
            wrapper,
            dots,
            container,
            slides,
            slideNum,
            slideWidth,
            deltaX;
        var afterSlide = function(){};
        var beforeSlide = function(){return true};

        if($.isPlainObject(selector)){
            wrapper = $(selector.selector);
            noDots = selector.noDots;
            beforeSlide = selector.onBeforeSlide || beforeSlide;
            afterSlide = selector.onAfterSlide || afterSlide;
        }else{
            wrapper = $(selector);
        }


        /**
         * 初始化容器大小
         */
        var _init = function() {
            wrapper.css('overflow','hidden');
            container = wrapper.children().first();
            slides = container.children();
            slideNum = slides.length;
            slideWidth = wrapper.offset().width;
            container.css('width',slideNum * slideWidth);

            slides.css({
                    'width':slideWidth,
                    'float':'left'
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
            afterSlide(index);
        };

        /**
         * 绑定滑动事件
         */
        var _bindEvents = function() {
            container.on('touchstart',_touchStart,false);
            container.on('touchmove',_touchMove,false);
            container.on('touchend',_touchEnd,false);
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
                //判定是否达到了边界即第一个右滑、最后一个左滑
                var isPastBounds = !index && deltaX > 0 || index == slideNum - 1 && deltaX < 0;
                if(isPastBounds)return;
                var pos = (deltaX - index * slideWidth);
                container[0].style.webkitTransform = 'translateX('+pos+'px)';
            }
        };

        var _touchEnd = function(e) {
            //判定是否跳转到下一个卡片
            //滑动时间小于250ms或者滑动X轴的距离大于屏幕宽度的1/3
            var isValidSlide = Number(new Date()) - start.time < 250 && Math.abs(deltaX) > 20 || Math.abs(deltaX) > slideWidth/3;
                //判定是否达到了边界即第一个右滑、最后一个左滑
            var isPastBounds = !index && deltaX > 0 || index == slideNum - 1 && deltaX < 0;
            if (!isScrolling) {
                if(beforeSlide(index,deltaX)){
                    _slide( index + ( isValidSlide && !isPastBounds ? (deltaX < 0 ? 1 : -1) : 0 ), speed );
                }else{
                    _slide(index);
                }
            }
            gestureStarted = false;
        };


        _init();
        _bindEvents();

        this.refresh = function(){
            container.attr('style','');
            _init();
        };

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
}());