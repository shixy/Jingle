Jingle.Popup = (function(){
    var POSITION = {
        'top':{
            top:0,
            left:0,
            right:0
        },
        'top-second':{
            top:'44px',
            left:0,
            right:0
        },
        'center':{
            top:'30%',
            left:'10%',
            right:'10%',
            'border-radius' : '5px'
        },
        'bottom' : {
            bottom:0,
            left:0,
            right:0
        },
        'bottom-second':{
            bottom : '51px',
            left:0,
            right:0
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
    var show = function(html,pos,closeable,arrow_direction){
        var pos_type = $.type(pos);
        _mask.show();
        //rest position and class
        _popup.attr({'style':'','class':''});
        if(pos_type == 'object'){
            _popup.css(pos);
            transition = ANIM['default'];
        }else if(pos_type == 'string'){
            _popup.css(POSITION[pos])
            var trans_key = pos.indexOf('top')>-1?'top':(pos.indexOf('bottom')>-1?'bottom':'default');
            transition = ANIM[trans_key];
        }else{
            console.error('错误的参数！');
            return;
        }
        if(arrow_direction){
            _popup.addClass('arrow '+arrow_direction);
            if(arrow_direction=='top'||arrow_direction=='bottom'){
                transition = ANIM[arrow_direction];
            }
        }
        if(closeable){
            _popup.append('<div id="tag_close_popup" data-target="closePopup" class="icon cancel-circle"></div>');
        }
        _popup.html(html).show();;
        J.Element.init(_popup);
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
            if(callback)callback();
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

    var popover = function(html,pos,arrow_direction){
        show(html,pos,false,arrow_direction)
    }

    return {
        show : show,
        close : hide,
        alert : alert,
        confirm : confirm,
        popover : popover
    }
})();