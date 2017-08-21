/**
 * 欢迎界面，可以制作酷炫吊炸天的欢迎界面哦
 * @module Welcome
 */
J.Welcome = (function($){
    /**
     * 显示欢迎界面
     */
    var showWelcome = function(){
        $.ajax({
            url : J.settings.basePagePath+'welcome.html',
            timeout : 5000,
            async : false,
            success : function(html){
                //添加到dom树中
                $('body').append(html);
                new J.Slider({
                    selector : '#jingle_welcome',
                    onAfterSlide  : J.settings.welcomeSlideChange
                });
            }
        })
    }
    /**
     * 关闭欢迎界面
     */
    var hideWelcome = function(){
        J.anim('#jingle_welcome','slideLeftOut',function(){
            $(this).remove();
            window.localStorage.setItem('hasShowWelcome',true);
        })
    }

    return {
        show : showWelcome,
        hide : hideWelcome
    }
})(J.$);