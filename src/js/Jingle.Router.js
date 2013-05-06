/**
 * 框架的运作机制
 */
Jingle.Router = (function(J){
    var TARGET_SELECTOR = 'a[data-target]';
    var _history = [];

    /**
     * 初始化events、state
     */
    var init = function(){
        var tapEvent = J.Constants.Events.tap;
        $(window).on('popstate', _popstateHandler);
        $(document).on(tapEvent,TARGET_SELECTOR,_targetHandler);
        add2History('#main');
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
        J.menuShow?J.Menu.hide():J.Menu.show();
    }

    return {
        init : init,
        turnTo : _showSection
    }

})(Jingle)