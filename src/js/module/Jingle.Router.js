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
        _initHistory();
    }
    var _initHistory = function(){
        add2History('#index_section');
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
            J.Markup.init(hash);
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