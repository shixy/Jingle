function Component() {};

Component.prototype.install = function(url,compName,win,err){
	cordova.exec(win, err, "Component", "install", [url, compName]);
};


if(!window.plugins) {
    window.plugins = {};
}
if (!window.plugins.component) {
    window.plugins.component = new Component();
}