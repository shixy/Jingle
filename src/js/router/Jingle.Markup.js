Jingle.Markup = (function(){
    var attr = {
        icon : '<i class="icon {value}"></i>'
    }
    var init = function(selector){
        var el = $(selector || 'body');
        if(el.length == 0)return;
        for(var k in attr){
            el.find('[data-'+k+']').each(function(i,children){
                var value = $(children).data(k);
                $(children).prepend(attr[k].replace('{value}',value));
            })
        }
    }
    return {
        init : init
    }
})()