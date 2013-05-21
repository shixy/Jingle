Jingle.Popup = (function(){
    var POSITION = {
        'top':{
            top:0
        },
        'top-second':{
            top:'44px'
        },
        'center':{
            top:'30%',
            left:'10%',
            right:'10%',
            'border-radius' : '5px'
        },
        'bottom' : {
            bottom:0
        },
        'bottom-second':{
            bottom : '51px'
        }
    };
    var ANIM = {
        top : ['slideDownIn','slideUpOut'],
        bottom : ['slideUpIn','slideDownOut'],
        default : ['scaleIn','scaleOut']
    };
    var _popup,_mask;
    var transition;
    var _init = function(){
        $('body').append('<div id="jingle_popup"></div><div id="jingle_popup_mask"></div>');
        _mask = $('#jingle_popup_mask');
        _popup = $('#jingle_popup');
        _subscribeEvents();
    }
    var show = function(html,pos,closeable){
        var pos_type = $.type(pos);
        _mask.show();
        _popup.html(html).show();;
        J.Element.init(_popup);
        if(pos_type == 'object'){
            _popup.css(pos);
        }else if(pos_type == 'string'){
            _popup.css(POSITION[pos])
        }else{
            console.error('错误的参数！');
            return;
        }
        if(closeable){
            _popup.append('<div id="tag_close_popup" data-target="closePopup" class="icon cancel-circle"></div>');
        }
        if(pos.indexOf('top')>-1){
            transition = ANIM['top'];
        }else if(pos.indexOf('bottom')>-1){
            transition = ANIM['bottom'];
        }else{
            transition = ANIM['default'];
        }
        J.anim(_popup,transition[0]);
        _popup.trigger('open');
        J.hasPopupOpen = true;
    }
    var hide = function(callback){
        _mask.hide();
        J.anim(_popup,transition[1],function(){
            _popup.hide();
            J.hasPopupOpen = false;
            _popup.trigger('close');
            callback.call();
        });
    }
    var _subscribeEvents = function(){
        _mask.on('tap',hide);
        _popup.on('tap','[data-target="closePopup"]',function(){
            hide();
        });
    }
    _init();

    var alert = function(title){
        var markup = '<div class="title">'+title+'</div><div id="popup_btn_container"><button data-target="closePopup" data-icon="checkmark">OK</button></div>'
        show(markup,'center',false);
    }
    var confirm = function(title,okCall,cancelCall){
        var markup = '<div class="title">'+title+'</div><div id="popup_btn_container"><button data-icon="checkmark">确定</button><button class="cancel" data-icon="close">取消</button></div>'
        show(markup,'center',true);
        $('#popup_btn_container [data-icon="checkmark"]').tap(function(){
            hide(okCall);
        });
        $('#popup_btn_container [data-icon="close"]').tap(function(){
            hide(cancelCall);
        });
    }

    return {
        show : show,
        close : hide,
        alert : alert,
        confirm : confirm
    }
})();