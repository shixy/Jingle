Jingle.Toast = (function(){
    var TEMPLATE = {
        toast : '<a href="#">{value}</a>',
        success : '<i class="icon checkmark-circle"></i>{value}',
        error : '<i class="icon cancel-circle"></i>{value}',
        info : '<i class="icon info-2"></i>{value}',
        loading : '<i class="icon spinner"></i><p>{value}</p><div id="tag_close_toast" class="icon cancel-circle"></div>'
    }
    var toast_type = 'toast';
    var _toast,_mask;
    var timer;
    var _closeToastCallback = function(){};
    var _init = function(){
        $('body').append('<div id="jingle_toast"></div><div id="jingle_toast_mask"></div>');
        _mask = $('#jingle_toast_mask');
        _toast = $('#jingle_toast');
        _subscribeCloseTag();
    }
    var hide = function(){
        if(toast_type == 'loading'){
            _toast.hide();
            _mask.hide();
        }else if(toast_type =='toast'){
            J.anim(_toast,'scaleOut',function(){
                _toast.hide();
            });
        }else{
            J.anim(_toast,'slideUpOut',function(){
                _toast.hide();
            });
        }

    }
    var show = function(type,text,closeCallback){
        if(timer) clearTimeout(timer);
        toast_type = type;
        _toast.attr('class',type).html(TEMPLATE[type].replace('{value}',text)).show();
        if(type == 'loading'){
            _mask.show();
            if(closeCallback)_closeToastCallback=closeCallback;
        }else if(type =='toast'){
            J.anim(_toast,'scaleIn');
            timer = setTimeout(hide,3000);
        }else{
            J.anim(_toast,'slideDownIn');
            timer = setTimeout(hide,3000);
        }

    }
    var _subscribeCloseTag = function(){
        _toast.on('tap','#tag_close_toast',function(){
            hide();
            _closeToastCallback();
        })
    }

    _init();

    return {
        show : show,
        hide : hide
    }
})();