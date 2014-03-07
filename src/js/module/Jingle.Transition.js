/**
 * page转场动画
 * 可自定义css动画
 */
J.Transition = (function($){
    var isBack,$current,$target,transitionName,
        animationClass = {
        //[[currentOut,targetIn],[currentOut,targetIn]]
        slide : [['slideLeftOut','slideLeftIn'],['slideRightOut','slideRightIn']],
        cover : [['','slideLeftIn'],['slideRightOut','']],
        slideUp : [['','slideUpIn'],['slideDownOut','']],
        slideDown : [['','slideDownIn'],['slideUpOut','']],
        popup : [['','scaleIn'],['scaleOut','']]
        };

    var _doTransition = function(){
        //触发 beforepagehide 事件
        $current.trigger('beforepagehide',[isBack]);
        //触发 beforepageshow 事件
        $target.trigger('beforepageshow',[isBack]);
        var c_class = transitionName[0]||'empty' ,t_class = transitionName[1]||'empty';
        $current.bind('webkitAnimationEnd.jingle', _finishTransition);
        $current.addClass('anim '+ c_class);
        $target.addClass('anim animating '+ t_class);
    }
    var _finishTransition = function() {
        $current.off('webkitAnimationEnd.jingle');
        $target.off('webkitAnimationEnd.jingle');
        //reset class
        $current.attr('class','');
        $target.attr('class','active');
        //add custom events
        if(!$target.data('init')){
            //触发pageinit事件
            $target.trigger('pageinit');
            $target.data('init',true);
        }
        //触发pagehide事件
        $current.trigger('pagehide',[isBack]);

        var url = $target.data('remote');
        if(!isBack && url){
            J.Page.loadSection(url,$target);
        }
        //触发pageshow事件
        $target.trigger('pageshow',[isBack]);

        $current.find('article.active').trigger('articlehide');
        $target.find('article.active').trigger('articleshow');
    }

    /**
     * 执行转场动画，动画类型取决于目标page上动画配置(返回时取决于当前page)
     * @param current 当前page
     * @param target  目标page
     * @param back  是否为后退
     */
    var run = function(current,target,back){
        //关闭键盘
        $(':focus').trigger('blur');
        isBack = back;
        $current = $(current);
        $target = $(target);
        var type = isBack?$current.attr('data-transition'):$target.attr('data-transition');
        type = type|| J.settings.transitionType;
        //后退时取相反的动画效果组
        transitionName  = isBack ? animationClass[type][1] : animationClass[type][0];
        _doTransition();
    }

    /**
     * 添加自定义转场动画效果
     * @param name  动画名称
     * @param currentOut 正常情况下当前页面退去的动画class
     * @param targetIn   正常情况下目标页面进入的动画class
     * @param backCurrentOut 后退情况下当前页面退去的动画class
     * @param backCurrentIn 后退情况下目标页面进入的动画class
     */
    var addAnimation = function(name,currentOut,targetIn,backCurrentOut,backCurrentIn){
        if(animationClass[name]){
            console.error('该转场动画已经存在，请检查你自定义的动画名称(名称不能重复)');
            return;
        }
        animationClass[name] = [[currentOut,targetIn],[backCurrentOut,backCurrentIn]];
    }
    return {
        run : run,
        add : addAnimation
    }

})(J.$);