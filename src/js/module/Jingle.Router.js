/**
 * controller 控制页面的流转
 */
Jingle.Router = (function(J,$){
        var _history = [];

    /**
     * 初始化events、state
     */
    var init = function(){
        $(window).on('popstate', _popstateHandler);
        $(document).on('click','a',function(e){
            var target = $(this).data('target');
            if(!target || target != 'link'){
                e.preventDefault();
                return false;
            }
        });
        //阻止data-target != 'link'的a元素的默认行为
        $(document).on('tap','a',function(e){
            var target = $(this).data('target');
            if(!target){
                e.preventDefault();
            }else{
                if(target != 'link'){
                    e.preventDefault();
                    _targetHandler.call(this);
                }
            }
        });
        _initIndex();
    }

    var _initIndex = function(){
        var $section = $('#section_container section.active');
        add2History('#'+$section.attr('id'));
        $section.trigger('pageinit').trigger('pageshow').data('init',true);
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
    var _targetHandler = function(){
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
            J.Menu.hide(200,function(){
                _showSection(hash);
            });
            return;
        }
        if(_history[0] === hash)return;
        add2History(hash);
        if($(hash).length === 0){
            //同步加载模板
            J.Page.load(hash);
        }
        _changePage(_history[1],hash);
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
        article.trigger('articleshow');
        activeArticle.trigger('articlehide');
    }

    var _toggleMenu = function(hash){
        J.isMenuOpen?J.Menu.hide():J.Menu.show(hash);
    }

    return {
        init : init,
        turnTo : _showSection,
        showArticle : _showArticle,
        back : back
    }

})(Jingle,Zepto);