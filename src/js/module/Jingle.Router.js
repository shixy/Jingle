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
        //阻止含data-target或者href以'#'开头的的a元素的默认行为
        $(document).on('click','a',function(e){
            var target = $(this).data('target'),
                href = $(this).attr('href');
            if(!href ||  href.match(/^#/) || target){
                e.preventDefault();
                return false;
            }
        });
        $(document).on('tap','a[data-target]',_targetHandler);
        _initIndex();
    }

    //处理app页面初始化
    var _initIndex = function(){
        var targetHash = location.hash;
        //取页面中第一个section作为app的起始页
        var $section = $('#section_container section').first();
        var indexHash = '#'+$section.attr('id');
        _add2History(indexHash,true);
        if(targetHash != '' && targetHash != indexHash){
            _showSection(targetHash);//跳转到指定的页面
        }else{
            $section.trigger('pageinit').trigger('pageshow').data('init',true).find('article.active').trigger('articleshow');
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
                J.hasMenuOpen && J.Menu.hide();//关闭当前页面的菜单
                J.hasPopupOpen && J.Popup.close();//关闭当前页面的弹出窗口
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
                if(J.settings.appType == 'single'){
                    _showSection(href);
                }
                break;
            case 'article' :
                _showArticle(href,_this);
                break;
            case 'menu' :
                _toggleMenu(href);
                break;
            case 'back' :
                window.history.go(-1);
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
        var current = _history[0];
        //同一个页面,则不重新加载
        if(current.hash === hashObj.hash){
            return;
        }
        //加载模板
        J.Page.load(hashObj,function(){
            var sameSection = (current.tag == hashObj.tag);
           if(sameSection){//相同页面，触发相关事件
               $(current.tag).trigger('pageshow').find('article.active').trigger('articlehide');
           }else{//不同卡片页跳转动画
               _changePage(current.tag,hashObj.tag);
           }
            _add2History(hash,sameSection);
        });
    }
    /**
     * 后退
     */
    var back = function(){
        if(J.settings.appType == 'single'){
            _changePage(_history.shift().tag,_history[0].tag,true)
        }
    }
    var _changePage = function(current,target,isBack){
        J.Transition.run(current,target,isBack);
    }
    /**
     * 缓存访问记录
     */
    var _add2History = function(hash,noState){
       var hashObj = J.Util.parseHash(hash);
        if(noState){//不添加浏览器历史记录
            _history.shift(hashObj);
            window.history.replaceState(hashObj,'',hash);
        }else{
            window.history.pushState(hashObj,'',hash);
        }
        _history.unshift(hashObj);
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