/**
 * 弹出框组件
 */
Jingle.Popup = (function(J,$){
    var _popup,_mask,transition,clickMask2close,
        POSITION = {
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
                top:'50%',
                left:'10%',
                right:'10%',
                'border-radius' : '3px'
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
        },
        ANIM = {
            top : ['slideDownIn','slideUpOut'],
            bottom : ['slideUpIn','slideDownOut'],
            defaultAnim : ['scaleIn','scaleOut']
        },
        TEMPLATE = {
            alert : '<div class="popup-title">{title}</div><div class="popup-content">{content}</div><div id="popup_btn_container"><a data-target="closePopup" data-icon="checkmark">{ok}</a></div>',
            confirm : '<div class="popup-title">{title}</div><div class="popup-content">{content}</div><div id="popup_btn_container"><a class="cancel" data-icon="close">{cancel}</a><a data-icon="checkmark">{ok}</a></div>',
            loading : '<i class="icon spinner"></i><p>{title}</p>'
        };

    var _init = function(){
        $('body').append('<div id="jingle_popup"></div><div id="jingle_popup_mask"></div>');
        _mask = $('#jingle_popup_mask');
        _popup = $('#jingle_popup');
        _subscribeEvents();
    }

    var show = function(options){
        var settings = {
            height : undefined,
            width : undefined,
            backgroundOpacity : 0,
            url : null,//远程加载内容
            tplId : null,//加载模板
            tplData : null,//配合tpl使用
            html : '',//@String popup内容
            pos : 'center',//位置 @String top|top-second|center|bottom|bottom-second   @object  css样式
            clickMask2Close : true,//@boolean 是否点击外层遮罩关闭popup
            showCloseBtn : true,//@boolean 是否显示关闭按钮
            arrowDirection : undefined,//popover的箭头指向
            animation : true,
            onShow : undefined //@event 在popup动画开始前执行
        }
        $.extend(settings,options);
        clickMask2close = settings.clickMask2Close;
        _mask.css('opacity',settings.backgroundOpacity);
        //rest position and class
        _popup.attr({'style':'','class':''});
        settings.width && _popup.width(settings.width);
        settings.height && _popup.height(settings.height);
        var pos_type = $.type(settings.pos);
        if(pos_type == 'object'){// style
            _popup.css(settings.pos);
            transition = ANIM['defaultAnim'];
        }else if(pos_type == 'string'){
            if(POSITION[settings.pos]){ //已经默认的样式
                _popup.css(POSITION[settings.pos])
                var trans_key = settings.pos.indexOf('top')>-1?'top':(settings.pos.indexOf('bottom')>-1?'bottom':'defaultAnim');
                transition = ANIM[trans_key];
            }else{// pos 为 class
                _popup.addClass(settings.pos);
                transition = ANIM['defaultAnim'];
            }
        }else{
            console.error('错误的参数！');
            return;
        }
        _mask.show();
        var html;
        if(settings.html){
            html = settings.html;
        }else if(settings.url){//远程加载
            html = J.Page.loadContent(settings.url);
        }else if(settings.tplId){//加载模板
            html = template(settings.tplId,settings.tplData)
        }

        //是否显示关闭按钮
        if(settings.showCloseBtn){
            html += '<div id="tag_close_popup" data-target="closePopup" class="icon cancel-circle"></div>';
        }
        //popover 箭头方向
        if(settings.arrowDirection){
            _popup.addClass('arrow '+settings.arrowDirection);
            _popup.css('padding','8px');
            if(settings.arrowDirection=='top'||settings.arrowDirection=='bottom'){
                transition = ANIM[settings.arrowDirection];
            }
        }

        _popup.html(html).show();

        //执行onShow事件，可以动态添加内容
        settings.onShow && settings.onShow.call(this);

        //显示获取容器高度，调整至垂直居中
        if(settings.pos == 'center'){
            var height = _popup.height();
            _popup.css('margin-top','-'+height/2+'px')
        }
        J.Element.init(_popup);
        if(settings.animation){
            J.anim(_popup,transition[0]);
        }
        J.hasPopupOpen = true;
    }
    var hide = function(){
        _mask.hide();
        J.anim(_popup,transition[1],function(){
            _popup.hide();
            J.hasPopupOpen = false;
        });
    }
    var _subscribeEvents = function(){
        _mask.on('tap',function(){
            if(clickMask2close){
                hide();
            }
        });
        _popup.on('tap','[data-target="closePopup"]',function(){hide();});
    }

    var alert = function(title,content){
        var markup = TEMPLATE.alert.replace('{title}',title).replace('{content}',content).replace('{ok}','确定');
        show({
            html : markup,
            pos : 'center',
            clickMask2Close : false,
            showCloseBtn : false
        });
    }
    var confirm = function(title,content,okCall,cancelCall){
        var markup = TEMPLATE.confirm.replace('{title}',title).replace('{content}',content).replace('{cancel}','取消').replace('{ok}','确定');
        show({
            html : markup,
            pos : 'center',
            clickMask2Close : false,
            showCloseBtn : false
        });
        $('#popup_btn_container [data-icon="checkmark"]').tap(function(){
            hide();
            okCall.call(this);
        });
        $('#popup_btn_container [data-icon="close"]').tap(function(){
            hide();
            cancelCall.call(this);
        });
    }

    var popover = function(html,pos,arrow_direction,onShow){
        show({
            html : html,
            pos : pos,
            showCloseBtn : false,
            arrowDirection : arrow_direction,
            onShow : onShow
        });
    }

    var loading = function(text){
        var markup = TEMPLATE.loading.replace('{title}',text||'加载中...');
        show({
            html : markup,
            pos : 'loading',
            animation : false,
            clickMask2Close : false
        });
    }

    _init();

    return {
        show : show,
        close : hide,
        alert : alert,
        confirm : confirm,
        popover : popover,
        loading : loading
    }
})(Jingle,Zepto);