Jingle.Transition = (function(J){

    var TRANSITION = {
        slide : [['slideRightOut','slideRightIn'],['slideLeftOut','slideLeftIn']]
    }

    var _doTransition = function(current, target, transitionName){
        var duration = J.settings.transitionTime;
        var easing = J.settings.transitionTimingFunc;
        target.addClass('active');
        current.animate(transitionName[0],duration,easing,function(){
            _finishTransition(current, target);
        });
        target.animate(transitionName[1],duration,easing);
    }

    var _finishTransition = function(current, target) {
        current.removeClass('active');
        current.trigger('pagehide');
        target.trigger('pageshow');
    }

    var run = function(current,target,isBack){
        current = $(current);
        target = $(target);
        var type = current.attr('data-transition')|| J.settings.transitionType;
        var transitionName  = isBack ? TRANSITION[type][0] : TRANSITION[type][1];
        _doTransition(current,target,transitionName);
    }
    return {
        run : run
    }

})(Jingle)