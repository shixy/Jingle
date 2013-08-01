Jingle.Element = (function(){
    var SELECTOR  = {
        'icon' : '[data-icon]',
        'scroll' : '[data-scroll="true"]',
        'toggle' : '.toggle',
        'range' : '[data-rangeinput]',
        'progress' : '[data-progress]',
        'count' : '[data-count]'
    }

    var init = function(selector){
        var el = $(selector || 'body');
        if(el.length == 0)return;
        $.map($(SELECTOR.icon,el),_init_icon);
        $.map($(SELECTOR.toggle,el),_init_toggle);
        $.map($(SELECTOR.range,el),_init_range);
        $.map($(SELECTOR.progress,el),_init_progress);
        $.map($(SELECTOR.count,el),_init_count);
        $.map($(SELECTOR.scroll,el),_init_scroll);
    }
    var _init_icon = function(el){
        $(el).prepend('<i class="icon '+$(el).data('icon')+'"></i>');
    }

    var _init_scroll = function(el){
        J.Scroll(el);
    }

    var _init_toggle = function(el){
        var $el = $(el);
        var name = $el.attr('name');
        //添加隐藏域，方便获取值
        if(name){
            $el.append('<input style="display: none;" name="'+name+'" value="'+$el.hasClass('active')+'"/>');
        }
        var $input = $el.find('input');
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
            $el.trigger('toggle');
        })
    }

    var _init_range = function(el){
        var $input;
        var $el = $(el);
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
        var $el = $(el);
        var progress = parseFloat($el.data('progress'));
        var title = $el.data('title') || '';
        var $bar = $('<div class="bar"></div>');
        progress = progress+'%';
        $bar.appendTo($el).width(progress).text(title+progress);
        if(progress == '100%'){
            $bar.css('border-radius','10px');
        }
    }
    var _init_count = function(el){
        var $el = $(el);
        var count = parseInt($el.data('count'));
        var orient = $el.data('orient');
        var className = (orient == 'left')?'left':'';
        var markup = '<span class="count '+className+'">'+count+'</span>'
        $el.append(markup);
        if(count == 0){
            $('.count',el).hide();
        }
    }

    return {
        init : init
    }
})();