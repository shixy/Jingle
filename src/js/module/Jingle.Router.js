/**
 * 路由控制器
 */
J.Router = (function($){
        var _history = [];
    /**
     * 初始化events、state
     */
    var init = function(){
        $(window).on('popstate', _popstateHandler);
        //点击时click事件和tap事件都会触发，在此阻止a标签的默认click行为
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
        var currentHash = location.hash;
        var $section = $('#section_container section.active');
        _add2History('#'+$section.attr('id'));
        $section.trigger('pageinit').trigger('pageshow').data('init',true).find('article.active').trigger('articleshow');
        if(currentHash != ''){
            _showSection(currentHash);//跳转到指定的页面
        }
    }

    /**
     * 处理浏览器的后退事件
     * 前进事件不做处理
     * @private
     */
    var _popstateHandler = function(e){
        if(e.state && e.state.hash){
            var hash = e.state.hash;
            if(_history[1] && hash === _history[1].hash){//存在历史记录，证明是后退事件
                J.Menu.hide();//关闭当前页面的菜单
                J.Popup.close();//关闭当前页面的弹出窗口
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

    /**
     * 跳转到新页面
     * @param hash 新page的'#id'
     */
    var _showSection  = function(hash){
        if(J.hasMenuOpen){//关闭菜单后再转场
            J.Menu.hide(200,function(){
                _showSection(hash);
            });
            return;
        }
        //读取hash信息
        var hashObj = J.Util.parseHash(hash);
        //同一个页面
        if(_history[0].tag === hashObj.tag)return;
        //加载模板
        J.Page.load(hashObj,function(){
            _changePage(_history[0].tag,hashObj.tag);
            _add2History(hash);
        });
    }
    /**
     * 后退
     */
    var back = function(){
        _changePage(_history.shift().tag,_history[0].tag,true)
        window.history.replaceState(_history[0],'',_history[0].hash);
    }
    var _changePage = function(current,target,isBack){
        J.Transition.run(current,target,isBack);
    }
    /**
     * 缓存访问记录
     */
    var _add2History = function(hash){
       var hashObj = J.Util.parseHash(hash);
        _history.unshift(hashObj);
        window.history.pushState(hashObj,'',hash);
    }

    /**
     * 激活href对应的article
     * @param href #id
     * @param el 当前锚点
     */
    var _showArticle = function(href,el){
        var article = $(href);
        if(article.hasClass('active'))return;
        el.addClass('active').siblings('.active').removeClass('active');
        var activeArticle = article.addClass('active').siblings('.active').removeClass('active');
        article.trigger('articleshow');
        activeArticle.trigger('articlehide');
    }

    var _toggleMenu = function(hash){
        J.hasMenuOpen?J.Menu.hide():J.Menu.show(hash);
    }

    return {
        init : init,
        goTo : _showSection,
        showArticle : _showArticle,
        back : back
    }
})(J.$);