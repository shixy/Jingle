#日历组件#
功能比较简单

**html代码:**

----------
	<div id="calendarId"></div>

**javascript代码：**

----------
	J.Calendar('#calendarId');

**Settings:**

----------

	J.Refresh(selector,config);
	config:
		swipeable ： 是否可以滑动
		date : 日历需要显示的日期，默认为当天
		onRenderDay : 渲染天单元格的事件
		onSelect : 选中日期时的事件
		

**Methods :** 

----------
refresh(date);
	
	将日历调整到指定日期
	

