/**
 * 初始化一些页面组件元素
 */
Jingle.Element = (function(J,$){
    var SELECTOR  = {
        'icon' : '[data-icon]',
        'scroll' : '[data-scroll="true"]',
        'toggle' : '.toggle',
        'range' : '[data-rangeinput]',
        'progress' : '[data-progress]',
        'count' : '[data-count]',
        'checkbox' : '[data-checkbox]'
    }

    var init = function(selector){
        if(!selector){
            //iscroll 必须在元素可见的情况下才能初始化
            $(document).on('articleshow','article',function(){
                J.Element.initScroll(this);
            });
        };
        var $el = $(selector || 'body');
        if($el.length == 0)return;

        $.map(_getMatchElements($el,SELECTOR.icon),_init_icon);
        $.map(_getMatchElements($el,SELECTOR.toggle),_init_toggle);
        $.map(_getMatchElements($el,SELECTOR.range),_init_range);
        $.map(_getMatchElements($el,SELECTOR.progress),_init_progress);
        $.map(_getMatchElements($el,SELECTOR.count),_init_count);
        $.map(_getMatchElements($el,SELECTOR.checkbox),_init_checkbox);
    }
    //自身与子集相结合
    var _getMatchElements = function($el,selector){
        return $el.find(selector).add($el.filter(selector));
    }
    var initScroll = function(selector){
        $.map(_getMatchElements($(selector),SELECTOR.scroll),_init_scroll);
    }
    var _init_icon = function(el){
        var $el = $(el),$icon=$el.children('i.icon'),icon = $el.data('icon');
        if($icon.length > 0){//已经初始化，就更新icon
            $icon.attr('class','icon '+icon);
        }else{
            $el.prepend('<i class="icon '+icon+'"></i>');
        }

    }
    var _init_scroll = function(el){
        J.Scroll(el);
    }

    var _init_toggle = function(el){
        var $el = $(el),$input;
        if($el.find('div.toggle-handle').length>0){//已经初始化
            return;
        }
        var name = $el.attr('name');
        //添加隐藏域，方便获取值
        if(name){
            $el.append('<input style="display: none;" name="'+name+'" value="'+$el.hasClass('active')+'"/>');
        }
        $el.append('<div class="toggle-handle"></div>');
        $input = $el.find('input');
        $el.tap(function(){
            var value;
            if($el.hasClass('active')){
                $el.removeClass('active');
                value = false;
            }else{
                $el.addClass('active');
                value = true;
            }
            $input.val(value);
            //自定义事件：toggle
            $el.trigger('toggle');
        })
    }

    var _init_range = function(el){
        var $el = $(el),$input;
        var $range = $('input[type="range"]',el);
        var align = $el.data('rangeinput');
        var input = $('<input type="text" name="test" value="'+$range.val()+'"/>');
        if(align == 'left'){
            $input = input.prependTo($el);
        }else{
            $input = input.appendTo($el);
        }
        var max = parseInt($range.attr('max'),10);
        var min = parseInt($range.attr('min'),10);
        $range.change(function(){
            $input.val($range.val());
        });
        $input.on('input',function(){
            var value = parseInt($input.val(),10);
            value = value>max?max:(value<min?min:value);
            $range.val(value);
            $input.val(value);
        })
    }

    var _init_progress = function(el){
        var $el = $(el),$bar;
        var progress = parseFloat($el.data('progress'))+'%';
        var title = $el.data('title') || '';
        $bar = $el.find('div.bar');
        if($bar.length == 0){
            $bar = $('<div class="bar"></div>').appendTo($el);
        }
        $bar.width(progress).text(title+progress);
        if(progress == '100%'){
            $bar.css('border-radius','10px');
        }
    }
    var _init_count = function(el){
        var $el = $(el),$count;
        var count = parseInt($el.data('count'));
        var orient = $el.data('orient');
        var className = (orient == 'left')?'left':'';
        var $markup = $('<span class="count '+className+'">'+count+'</span>');
        $count = $el.find('span.count');
        if($count.length>0){
            $count.text(count);//更新数字
        }else{
            $count = $markup.appendTo($el);
        }
        if(count == 0){
            $count.hide();
        }
    }

    var _init_checkbox = function(el){
        var $el = $(el);
        var value = $el.data('checkbox');
        if($el.find('i.icon').length>0){
            return;
        }
        $el.prepend('<i class="icon checkbox-'+value+'"></i>');
        $el.on('tap',function(){
            var status = ($el.data('checkbox') == 'checked') ? 'unchecked':'checked';
            $el.find('i.icon').attr('class','icon checkbox-'+status);
            $el.data('checkbox',status);
            //自定义change事件
            $el.trigger('change');
        });

    }

    return {
        /**
         * 初始化容器内组件
         */
        init : init,
        /**
         * 构造icon组件
         */
        initIcon : _init_icon,
        /**
         * 构造toggle组件
         */
        initToggle : _init_toggle,
        /**
         * 构造progress组件
         */
        initProgress : _init_progress,
        /**
         * 构造range组件
         */
        initRange : _init_range,
        /**
         * 构造count组件
         */
        initCount : _init_count,
        /**
         * 初始化iscroll组件或容器内iscroll组件
         */
        initScroll : initScroll
    }
})(Jingle,Zepto);