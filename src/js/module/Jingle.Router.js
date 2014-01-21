/**
 * Router 控制页面的流转
 */
Jingle.Router = (function(J,$){
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
        var $section = $('#section_container section.active');
        add2History('#'+$section.attr('id'));
        $section.trigger('pageinit').trigger('pageshow').data('init',true).find('article.active').trigger('articleshow');
        _showSection(location.hash);//跳转到指定的页面
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
     * 页面转场
     * @param hash 新page的'#id'
     * @private
     */
    var _showSection  = function(hash){
        if(J.hasMenuOpen){//关闭菜单后再转场
            J.Menu.hide(200,function(){
                _showSection(hash);
            });
            return;
        }
        var hashObj = _parseHash(hash);
        if(_history[0].tag === hashObj.tag)return;
        add2History(hash);
        if($(hashObj.tag).length === 0){//当前dom树中不存在
            //同步加载模板
            J.Page.load(hashObj);
            //TODO 为了性能要求，可根据配置只保留N个page
        }
        _changePage(_history[1].tag,hashObj.tag);
    }
    var back = function(){
        _changePage(_history.shift().tag,_history[0].tag,true)
        //window.history.replaceState(_history[0],'',_history[0].hash);
    }
    var _changePage = function(current,target,isBack){
        J.Transition.run(current,target,isBack);
    }
    /**
     * 缓存访问记录
     */
    var add2History = function(hash){
        var hashObj = _parseHash(hash);
        _history.unshift(hashObj);
        window.history.pushState(hashObj,'',hash);
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
        J.hasMenuOpen?J.Menu.hide():J.Menu.show(hash);
    }

    var _parseHash = function(hash){
        //#index_section?a=1&b=1
        var tag,query,param;
        var arr = hash.split('?');
        tag = arr[0];
        if(arr.length>1){
            var seg,s;
            query = arr[1];
            seg = query.split('&');
            for(var i=0;i<seg.lenth;i++){
                if(!seg[i])continue;
                s = seg[i].split('=');
                param[s[0]] = s[1];
            }
        }
        return {
            hash : hash,
            tag : tag,
            param : query,
            param : param
        }
    }

    return {
        init : init,
        goTo : _showSection,
        showArticle : _showArticle,
        back : back
    }

})(Jingle,Zepto);