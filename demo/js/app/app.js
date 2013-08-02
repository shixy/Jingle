$('#section-container').on('pageinit','#scroll_section',function(){
    J.Refresh.pullUp({
        containerId : 'scroll_article',
        callback : function(){
            var scroll = this;
            setTimeout(function () {
                var html = '';
                for(var i=0;i<10;i++){
                    html += '<li style="color:#E74C3C">自动生成的..</li>'
                }
                $('#scroll_article ul.list').append(html);
                scroll.refresh();
                J.showToast('加载成功','success');
            }, 1000)
        }
    })
});
