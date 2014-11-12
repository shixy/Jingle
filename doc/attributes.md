#1. 自装配UI组件#
通过data-*等不同配置来实现组件的自动装配

###基本组件###
图标

	data-icon="icon name"
	icon name请参见demo中的icons页面，基本所有的组件都可以用

badge 数字标签

	<a class="button" data-count=3 data-orient="left">按钮</a>
	data-orient: left|right 标签显示位置，默认显示在右上角

###布局组件###

section *页面*

	data-transition:页面转场动画，默认为“slide”,
	目前框架已内置“slideUp”，“slideDown”,"scale"，亲们可以自己编写css3动画...
	data-remote : 远程加载页面路径，hash中附带的参数会一并解析到remoteurl中

aside *侧边菜单*

基本属性：

	data-position:  left(左侧边栏) right(右侧边栏)
	data-transition: push(抽屉式) overlay(侧边栏覆盖页面) reveal(页面退出显示侧边栏)
	data-show-close: true false (是否显示关闭按钮)

list *列表组件*

	ul class="list" 基本设置
	li data-selected="selected" data-icon="next"
	// selected的值为class名称，元素被触摸时的高亮样式
	// icon用来表示li行后的小图标

###交互组件###
	<a href="#" data-target="section">ok</a>
data-target的值有：

	section:页面跳转
	article:页面中的元素块切换
	menu:显示/隐藏侧边菜单
	link:执行a标签默认行为
	back:后退

	href对应section|article|menu 的 #id

###组件模板###
导航栏

	<!--只有文字-->
	<ul class="control-group">
        <li class="active"><a href="#">Hello</a></li>
        <li><a href="#">Jingle</a></li>
        <li><a href="#" >html5</a></li>
    </ul>
	<!--只有图标-->
	<ul class="control-group">
        <li data-icon="home"></li>
        <li class="active" data-icon="bell"></li>
        <li data-icon="spinner"></li>
    </ul>
	<!--图标+文字 左右-->
	<ul class="control-group">
        <li class="active"><a href="#" data-icon="home">Hello</a></li>
        <li><a href="#" data-icon="bell">Jingle</a></li>
        <li><a href="#" data-icon="spinner">html5</a></li>
    </ul>
	<!--图标+文字 上下-->
	<ul class="control-group">
        <li class="active" data-icon="home"><a href="#">Hello</a></li>
        <li data-icon="bell"><a href="#">Jingle</a></li>
        <li data-icon="spinner"><a href="#" >html5</a></li>
    </ul>



toggle

	<div class="toggle" class="active"></div>
	默认为√和×，可以自定义文字
	data-on="开启"
	data-off="关闭"

范围选择器

	<div  data-rangeinput="right">
        <input type="range" min=4 max=10 value="7"/>
    </div>
	data-rangeinput: 输入框显示在左侧还是右侧

进度条

	<div data-progress="80" data-title="已完成"></div>
	data-title:自定义进度文字

checkbox

	<div data-checkbox="unchecked">爱我你就勾勾我</div>
	data-checkbox:unchecked(未选中) checked(选中)


#2. 功能组件#
toast 消息提示框(单例)

	J.Toast.show(type,text,duration);
		//type: toast|success|error|info  内置的几种样式
		//text： 显示文本
		//duration:持续时间，为0则不自动关闭

	J.Toast.hide(); //关闭消息

popup 弹出框(单例)

	J.Popup.show(options);
	J.Popup.close();
	J.Popup.alert();
	J.Popup.confirm();
	J.Popup.popover();
	J.Popup.loading();
	J.Popup.actionsheet();

slider 轮换组件

javascript

	var slider = new J.Slider("#sliderId");
html

	<div id="sliderId">
		<div>
			<div>slider1</div>
			<div>slider2</div>
			<div>slider2</div>
		</div>
	</div>
	**注意：有2层wrapper**

scroll 滚动组件(下拉刷新)

 	自动装载模式：data-scroll=true
javascript

	var scroll = new J.Scroll("#scrollId");
html

	<div id="scrollId">
		<div>
			<div>content</div>
		</div>
	</div>
	**注意：有2层wrapper**