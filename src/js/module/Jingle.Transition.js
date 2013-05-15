Jingle.Transition = (function(J){

    var TRANSITION = {
        //[back,in]
        slide : [['slideRightOut','slideRightIn'],['slideLeftOut','slideLeftIn']],
        scale : [['scaleOut','none'],['none','scaleIn']]
    }

    var _doTransition = function(current, target, transitionName){
        target.addClass('active');
        if(transitionName[0] == 'none'){
            J.anim(target,transitionName[1],function(){_finishTransition(current, target)});
        }else{
            J.anim(current,transitionName[0],function(){_finishTransition(current, target)});
            J.anim(target,transitionName[1]);
        }

    }

    var _finishTransition = function(current, target) {
        current.removeClass('active');
        current.trigger('pagehide');
        target.trigger('pageshow');
    }

    var run = function(current,target,isBack){
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

})(Jingle)