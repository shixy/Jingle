document.addEventListener('deviceready', onDeviceReady, false);
function onDeviceReady(){
    alert('ready');
    navigator.splashscreen.hide();
    //注册后退按钮
    document.addEventListener("backbutton", function (e) {
        if(J.isMenuOpen){
            J.Menu.hide();
        }else if(J.hasPopupOpen){
            J.closePopup();
        }else{
            var sectionId = $('section.active').attr('id');
            if(sectionId == 'login_section' || sectionId == 'index_section'){
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
$('#section_container').on('pageinit','#scroll_section',function(){
    J.Refresh( '#scroll_article','pullDown', function(){
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
    })
});
$('#section_container').on('pageload','#menu_section',function(){
    var asides = J.Page.loadContent('html/custom_aside.html');
    var $asides = $(asides);
    $('#aside_container').append($asides);
    J.Menu.init($asides);

});
$(function () {
    Jingle.launch();
})
