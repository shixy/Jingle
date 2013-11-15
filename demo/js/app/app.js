document.addEventListener('deviceready', onDeviceReady, false);
function onDeviceReady(){
    navigator.splashscreen.hide();
    //注册后退按钮
    document.addEventListener("backbutton", function (e) {
        if(J.hasMenuOpen){
            J.Menu.hide();
        }else if(J.hasPopupOpen){
            J.closePopup();
        }else{
            var sectionId = $('section.active').attr('id');
            if(sectionId == 'index_section'){
                J.confirm('提示','是否退出程序？',function(){
                    navigator.app.exitApp();
                });
            }else{
                J.Router.back();
            }
        }
    }, false);
}

$('#btn_show_welcome').on('tap', J.showWelcome);
$('#section_container').on('pageinit','#refresh_section',function(){
    J.Refresh({
        selector : '#down_refresh_article',
        type : 'pullDown',
        pullText : '你敢往下拉么...',
        releaseText : '快松开的你的咸猪手！！',
        refreshTip : '使劲往下拽吧，亲',
        callback : function(){
            var scroll = this;
            setTimeout(function () {
                $('#down_refresh_article ul.list li').text('擦，我被更新了');
                scroll.refresh();
                J.showToast('更新成功','success');
            }, 2000);
        }
    });
//    最简约的调用方式
    J.Refresh( '#up_refresh_article','pullUp', function(){
        var scroll = this;
        setTimeout(function () {
            var html = '';
            for(var i=0;i<10;i++){
                html += '<li style="color:#E74C3C">我是被拉出来的...</li>'
            }
            $('#up_refresh_article ul.list').append(html);
            scroll.refresh();
            J.showToast('加载成功','success');
        }, 2000);
    })

});
$('#section_container').on('articleshow','#h_scroll_article',function(){
    J.Scroll('#h_scroll_demo',{hScroll:true,hScrollbar : false});
})
$('#section_container').on('pageload','#menu_section',function(){
    var asides = J.Page.loadContent('html/custom_aside.html');
    var $asides = $(asides);
    $('#aside_container').append($asides);
});
$('#btn_scan_barcode').on('tap',function(){
    window.plugins.barcodeScanner.scan('all',function(result) {
            if(!result.cancelled){
                J.alert('扫描结果：','结果：'+result.text+'<br>格式：'+result.format);
            }
        }, function(error) {
            J.showToast("扫描失败: " + error,'error');
        }
    );
})
$(function () {
    Jingle.launch({
        showPageLoading : true
    });
})
