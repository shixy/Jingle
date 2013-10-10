/**
 * section之间的动画过渡
 */
Jingle.Transition11 = (function(J,$){
    var TRANSITION = {
        //[back,in]
        slide : [['slideRightOut','slideRightIn'],['slideLeftOut','slideLeftIn']],
        scale : [['scaleOut','none'],['none','scaleIn']]
        },
        isBack = false;


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
        if(!target.data('init')){
            target.trigger('pageinit');
            target.data('init',true);
            J.Element.initScroll(target)
        }
        current.trigger('pagehide',[isBack]);
        target.trigger('pageshow',[isBack]);
        current.find('article.active').trigger('articlehide');
        target.find('article.active').trigger('articleshow');
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

})(Jingle,$);