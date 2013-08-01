$('#scroll_section').on('page.init',function(){
    alert('init');
    J.Refresh({
        containerId : 'scroll_article',
        callback : function(){

        }
    })
})
$('#scroll_section').on('page.show',function(){
    alert('show');
})