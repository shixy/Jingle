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
        releaseText : '什么时候你才愿意放手？',
        refreshTip : '最后一次拉的人：<span style="color:#e222a5">骚年</span>',
        callback : function(){
            var scroll = this;
            setTimeout(function () {
                $('#down_refresh_article ul.list li').text('嗯哈，长大后我就成了你~');
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
    $.get('html/custom_aside.html',function(aside){
        $('#aside_container').append(aside);
    })
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
	J.Transition.add('flip','slideLeftOut','flipOut','slideRightOut','flipIn');
    Jingle.launch({
        showPageLoading : true
    });
})
