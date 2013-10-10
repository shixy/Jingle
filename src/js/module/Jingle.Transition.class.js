/**
 * section之间的动画过渡
 */
Jingle.Transition = (function(J,$){
    var isBack,$current,$target,transitionName,
        animationClass = {
        //[[currentOut,targetIn],[currentOut,targetIn]]
        slide : [['slideLeftOut','slideLeftIn'],['slideRightOut','slideRightIn']],
        slideUp : [['','slideUpIn'],['slideDownOut','']],
        slideDown : [['','slideDownIn'],['slideUpOut','']],
        scale : [['','scaleIn'],['scaleOut','']]
        };

    var _doTransition = function(){
        var c_class = transitionName[0] ,t_class = transitionName[1],tmpSection = $target;
        if(t_class == ''){
            t_class = ' activing ' + t_class;
            c_class = ' active ' + c_class;
            tmpSection = $current;
        }else{
            t_class = ' active ' + t_class;
            c_class = ' activing ' + c_class;
        }
        tmpSection.bind('webkitAnimationEnd.jingle', _finishTransition);
        $current.attr('class',c_class);
        $target.attr('class',t_class);
    }
    var _finishTransition = function() {
        $current.off('webkitAnimationEnd.jingle');
        $target.off('webkitAnimationEnd.jingle');

        //reset class
        $current.attr('class','');
        $target.attr('class','active');

        if(!$target.data('init')){
            $target.trigger('pageinit');
            $target.data('init',true);
        }
        //add custom events
        $current.trigger('pagehide',[isBack]);
        $target.trigger('pageshow',[isBack]);

        $current.find('article.active').trigger('articlehide');
        $target.find('article.active').trigger('articleshow');
    }

    var run = function(current,target,back){
        isBack = back;
        $current = $(current);
        $target = $(target);
        var type = isBack?$current.attr('data-transition'):$target.attr('data-transition');
        type = type|| J.settings.transitionType;
        transitionName  = isBack ? animationClass[type][1] : animationClass[type][0];
        _doTransition();
    }
    return {
        run : run
    }

})(Jingle,$);