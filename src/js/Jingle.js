/*
 * Jingle v0.4 Copyright (c) 2013 shixy, http://shixy.github.io/Jingle/
 * Released under MIT license
 * walker.shixy@gmail.com
 */
var Jingle = J = {
    version : '0.41',
    $ : window.Zepto,
    //参数设置
    settings : {
        //single  单页面工程  muti  多页面工程
        appType : 'single',
        //page默认动画效果
        transitionType : 'slide',
        //自定义动画时的默认动画时间(非page转场动画时间)
        transitionTime : 250,
        //自定义动画时的默认动画函数(非page转场动画函数)
        transitionTimingFunc : 'ease-in',
        //toast 持续时间,默认为3s
        toastDuration : 3000,
        //是否显示欢迎界面
        showWelcome : false,
        //欢迎界面卡片切换时的执行函数，可以制作酷帅吊炸天的欢迎界面
        welcomeSlideChange : null,
        //加载page模板时，是否显示遮罩
        showPageLoading : false,
        //page模板默认的相对位置，主要用于开发hybrid应用，实现page的自动装载
        basePagePath : 'html/',
        basePageSuffix : '.html',
        //page模板的远程路径{#id: href,#id: href}
        remotePage:{}
    },
    //手机或者平板
    mode : window.innerWidth < 800 ? "phone" : "tablet",
    hasTouch : 'ontouchstart' in window,
    //是否启动完成
    launchCompleted : false,
    //是否有打开的侧边菜单
    hasMenuOpen : false,
    //是否有打开的弹出框
    hasPopupOpen : false,
    isWebApp : location.protocol == 'http:',
    /**
     * 启动Jingle
     * @param opts {object}
     */
    launch : function(opts){
        $.extend(this.settings,opts);
        var hasShowWelcome = window.localStorage.getItem('hasShowWelcome');
        if(!hasShowWelcome && this.settings.showWelcome){
            this.Welcome.show();
        }
        this.Element.init();
        this.Element.initControlGroup();
        this.Router.init();
        this.Menu.init();
    }
};
