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
                _toggleMenu(href);
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

})();