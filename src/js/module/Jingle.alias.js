/**
 * 显示loading框
 * @param text
 */
J.showMask = function(text){
    J.Popup.loading(text);
}
/**
 * 关闭loading框
 */
J.hideMask = function(){
    J.Popup.close(true);
}
/**
 *  显示消息
 * @param text
 * @param type toast|success|error|info
 * @param duration 持续时间，为0则不自动关闭
 */
J.showToast = function(text,type,duration){
    type = type || 'toast';
    J.Toast.show(type,text,duration);
}
/**
 * 关闭消息提示
 */
J.hideToast = function(){
    J.Toast.hide();
}
J.alert = function(title,content){
    J.Popup.alert(title,content);
}
J.confirm = function(title,content,okCall,cancelCall){
    J.Popup.confirm(title,content,okCall,cancelCall);
}
/**
 * 弹出窗口
 * @param options
 */
J.popup = function(options){
    J.Popup.show(options);
}
/**
 * 关闭窗口
 */
J.closePopup = function(){
    J.Popup.close();
}
/**
 * 带箭头的弹出框
 * @param html [可选]
 * @param pos [可选]  位置
 * @param arrowDirection [可选] 箭头方向
 * @param onShow [可选] 显示之前执行
 */
J.popover = function(html,pos,arrowDirection,onShow){
    J.Popup.popover(html,pos,arrowDirection,onShow);
}
/**
 * 自动渲染模板并填充到页面
 * @param containerSelector 欲填充的容器
 * @param templateId 模板ID
 * @param data 数据源
 * @param type [可选] add|replace
 */
J.tmpl = function(containerSelector,templateId,data,type){
    J.Template.render(containerSelector,templateId,data,type);
}