/**
 * 检查并更新APP
 * version.js
 * [{'verCode':2,'verName':'1.2.1','apkPath':'http://****.com/your.apk'}]
 * verCode 版本号
 * verName 版本名称
 * apkPath APK下载路径
 * @author walker
 */
function UpdateApp() {
}
UpdateApp.prototype.checkAndUpdate = function(checkPath){
	cordova.exec(null, null, "UpdateApp", "checkAndUpdate", [checkPath]);
}
UpdateApp.prototype.getCurrentVerInfo = function(successCallback){
	cordova.exec(successCallback, null, "UpdateApp", "getCurrentVersion", []);
}
UpdateApp.prototype.getServerVerInfo = function(successCallback,failureCallback,checkPath){
	cordova.exec(successCallback, failureCallback, "UpdateApp", "getServerVersion", [checkPath]);
}
cordova.addConstructor(function() {
	if (!window.plugins) {
		window.plugins = {};
	}
	window.plugins.updateApp = new UpdateApp();
});