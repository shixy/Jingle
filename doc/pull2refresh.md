#下拉刷新#
调用iscroll来实现的，html代码结构与scroller的一样

**html代码:**

----------
	<div id="scrollId">
		<div>
			<div>content</div>
		</div>
	</div>

**javascript代码：**

----------
	J.Refresh('#scrollId','pullDown',function(){...});

**Settings:**

----------
简单设置

	J.Refresh(selector,type,callback);

		selector : pull2refresh容器
		type : 拉动方向  pullUp | pullDown
		callback : 回调函数

高级设置

	J.Refresh(config);

		selector : pull2refresh容器,
        type : 拉动方向  pullUp | pullDown
        minPullHeight : 拉动的像素相对值，超过才会翻转,默认为10
        pullText: "下拉刷新...",
        releaseText: "松开立即刷新...",
        refreshText: "刷新中...",
        refreshTip : 下拉时显示的文本，比如：最后更新时间:2013-....
        callback : 回调函数

**Properties :** 

----------
scroller
	
	对应的iscroll实例

**Methods :** 

----------
destory();
	
	销毁pull2refresh实例，对应的iscroll实例会一并销毁
	

