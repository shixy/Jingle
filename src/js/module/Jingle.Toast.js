/**
 *  通知组件
 */
Jingle.Toast = (function(J,$){
    //定义模板
    var TEMPLATE = {
        toast : '<a href="#">{value}</a>',
        success : '<a href="#"><i class="icon checkmark-circle"></i>{value}</a>',
        error : '<a href="#"><i class="icon cancel-circle"></i>{value}</a></div>',
        info : '<a href="#"><i class="icon info-2"></i>{value}</a>'
    }
    var toast_type = 'toast',_toast,timer;
    var _init = function(){
        $('body').append('<div id="jingle_toast"></div>');
        _toast = $('#jingle_toast');
        _subscribeCloseTag();
    }
    var hide = function(){
        J.anim(_toast,'scaleOut',function(){
            _toast.hide();
        });
    }
    var show = function(type,text,duration){
        if(timer) clearTimeout(timer);
        toast_type = type;
        _toast.attr('class',type).html(TEMPLATE[type].replace('{value}',text)).show();
        J.anim(_toast,'scaleIn');
        if(duration === 0){//为0 不自动关闭
            //todo 添加关闭按钮
        }else{
            timer = setTimeout(hide,duration || 5000);
        }
    }
    var _subscribeCloseTag = function(){
        _toast.on('tap','[data-target="close"]',function(){
            hide();
        })
    }
    _init();
    return {
        show : show,
        hide : hide
    }
})(Jingle,Zepto);