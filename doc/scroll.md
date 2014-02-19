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
	J.Scroll('#scrollId');

**Settings:**

----------

	J.Refresh(selector,config);
	config的配置与iscroll4的配置一样，具体请参考iscroll4
		

**Properties :** 

----------
scroller
	
	对应的iscroll实例

**Methods :** 

----------
destory();
	
	销毁scroll实例
	

