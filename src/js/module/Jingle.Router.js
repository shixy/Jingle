/**
 * controller 控制页面的流转
 */
Jingle.Router = (function(J,$){
    var TARGET_SELECTOR = 'a[data-target]:not([data-target="link"])',//含有data-target标签，但是data-target != link的a
        PREV_TARGET_SELECTOR = 'a:not([data-target="link"])',//data-target != link 的a ，包含没有data-target标签的a，只有data-targe=link的元素不会阻止其默认行为
        _history = [];

    /**
     * 初始化events、state
     */
    var init = function(){
        $(window).on('popstate', _popstateHandler);
        var tapEvent = J.hasTouch?'tap':'click';
        //阻止data-target != 'link'的a元素的默认行为
        $(document).on(tapEvent,PREV_TARGET_SELECTOR,function(e){
            e.preventDefault()
        });
        //添加命名空间，防止冲突
        $(document).on('tap.target',TARGET_SELECTOR,_targetHandler);
        _initIndex();
    }

    var _initIndex = function(){
        var initSectionId = $('#section_container section.active').trigger('pageinit').trigger('pageshow').data('init',true).attr('id');
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
        var _this = $(this),
            target = _this.attr('data-target'),
            href = _this.attr('href');

        switch(target){
            case 'section' :
                _showSection(href);
                break;
            case 'article' :
                _showArticle(href,_this);
                break;
            case 'menu' :
                _toggleMenu(href);
                break;
            case 'back' :
                back();
                break;
        }
    }

    var _showSection  = function(hash){
        if(J.isMenuOpen){
            J.Menu.hide(1,function(){
                _showSection(hash);
            });
            return;
        }
        if(_history[0] === hash)return;
        var currentPage = $(_history[0]);
        add2History(hash);
        if($(hash).length === 0){
            //同步加载模板
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
    var _showArticle = function(href,el){
        var article = $(href);
        if(article.hasClass('active'))return;
        el.addClass('active').siblings('.active').removeClass('active');
        var activeArticle = article.addClass('active').siblings('.active').removeClass('active');
        J.anim(article,'bigScaleIn',300,function(){
            article.trigger('articleshow');
            activeArticle.trigger('articlehide');

        });
    }

    var _toggleMenu = function(hash){
        J.isMenuOpen?J.Menu.hide():J.Menu.show(hash);
    }

    return {
        init : init,
        turnTo : _showSection,
        back : back
    }

})(Jingle,Zepto);