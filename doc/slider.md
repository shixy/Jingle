##轮换组件Slider##

**html代码**

------

	<div id="sliderId">
		<div>
			<div>slider1</div>
			<div>slider2</div>
			<div>slider2</div>
		</div>
	</div>

**javascript代码**

------
	var slider = new J.Slider("#sliderId");

**Settings:**

------

简单设置

	var slider = new J.Slider(selector,nodots);

		selector : slider容器
		nodots : [可选] true|false，是否不显示dots

高级配置

	var slider = new J.Slider(config);

	wrapper : slider容器
	noDots : 是否显示导航 点，默认为false
	onBeforeSlide : 切换之前的事件，返回false可阻止切换
	onAfterSlide : 切换之后的事件
	autoPlay : 是否自动播放，默认为false

**Methods:**

------
refresh()

	重新装载整个slider，一般在动态添加元素后或者屏幕尺寸更改后调用
prev()

	切换到上一个slide
next()

	切换到下一个slide
index(i)

	切换到指定的slide
	i:slide的索引，默认从0开始
	
		