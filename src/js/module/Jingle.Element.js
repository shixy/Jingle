/**
 * 初始化页面组件元素
 */
J.Element = (function($){
    var SELECTOR  = {
        'icon' : '[data-icon]',
        'scroll' : '[data-scroll="true"]',
        'toggle' : '.toggle',
        'range' : '[data-rangeinput]',
        'progress' : '[data-progress]',
        'count' : '[data-count]',
        'checkbox' : '[data-checkbox]'
    }
    /**
     * 初始化容器内组件
     * @param {String} 父元素的css选择器
     * @param {Object} 父元素或者父元素的zepto实例
     */
    var init = function(selector){
        if(!selector){
            //iscroll 必须在元素可见的情况下才能初始化
            $(document).on('articleshow','article',function(){
                J.Element.scroll(this);
            });
        };
        var $el = $(selector || 'body');
        if($el.length == 0)return;

        $.map(_getMatchElements($el,SELECTOR.icon),_init_icon);
        $.map(_getMatchElements($el,SELECTOR.toggle),_init_toggle);
        $.map(_getMatchElements($el,SELECTOR.range),_init_range);
        $.map(_getMatchElements($el,SELECTOR.progress),_init_progress);
        $.map(_getMatchElements($el,SELECTOR.count),_init_badge);
        $.map(_getMatchElements($el,SELECTOR.checkbox),_init_checkbox);
    }

    /**
     * 初始化按钮组(绑定事件)
     */
    var initControlGroup = function(){
        $(document).on('tap','ul.control-group li',function(){
            var $this = $(this);
            if($this.hasClass('active'))return;
            $this.addClass('active').siblings('.active').removeClass('active');
            $this.parent().trigger('change',[$this]);
        });
    }
    /**
     * 自身与子集相结合
     */
    var _getMatchElements = function($el,selector){
        return $el.find(selector).add($el.filter(selector));
    }
    /**
     * 初始化iscroll组件或容器内iscroll组件
     */
    var initScroll = function(selector){
        $.map(_getMatchElements($(selector),SELECTOR.scroll),function(el){J.Scroll(el);});
    }
    /**
     * 构造icon组件
     */
    var _init_icon = function(el){
        var $el = $(el),$icon=$el.children('i.icon'),icon = $el.data('icon');
        if($icon.length > 0){//已经初始化，就更新icon
            $icon.attr('class','icon '+icon);
        }else{
            $el.prepend('<i class="icon '+icon+'"></i>');
        }
    }
    /**
     * 构造toggle切换组件
     */
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
    /**
     * 构造range滑块组件
     */
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
    /**
     * 构造progress组件
     */
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
    /**
     * 构造count组件
     */
    var _init_badge = function(el){
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
        init : init,
        initControlGroup : initControlGroup,
        icon : _init_icon,
        toggle : _init_toggle,
        progress : _init_progress,
        range : _init_range,
        badge : _init_badge,
        scroll : initScroll
    }
})(J.$);