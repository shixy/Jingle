;(function($){
    /**
     * 日历组件
     * @param selector selector
     * @param options 配置参数
     */
    var calendar = function(selector,options){
        var defaults = {
                months : ["01月", "02月", "03月", "04月", "05月", "06月",
                    "07月", "08月", "09月", "10月", "11月", "12月"],
                days : ["日", "一", "二", "三", "四", "五", "六"],
                swipeable : true,//是否可通过手指滑动
                date : new Date(),//日历当前日期
                onRenderDay : undefined,//渲染单元格时的事件
                onSelect : undefined //选中日期时的事件
            },
            _this = this,
            $el = $(selector),
            $yearText,
            $monthText,
            $calendarBody,
            currentDate,currentYear,currentMonth;

        var _init = function(){
            _this.settings = $.extend({},defaults,options);
            currentYear = _this.settings.date.getFullYear();
            currentMonth = _this.settings.date.getMonth();
            currentDate = new Date(currentYear,currentMonth,_this.settings.date.getDate());
            _render();
            _subscribeEvents();
        }

        /**
         * 获取月份第一天是星期几[0-6]
         */
        var _fisrtDayOfMonth = function(date){
            return ( new Date(date.getFullYear(), date.getMonth(), 1) ).getDay();
        }
        /**
         * 获取月份总天数[1-31]
         */
        var _daysInMonth = function(date){
            return ( new Date(date.getFullYear(),date.getMonth()+1,0) ).getDate();
        }

        /**
         * 渲染日历
         * @private
         */
        var _render = function(){
            var html = '';
            html += '<div class="jingle-calendar">';
            html += _renderNav(currentYear,currentMonth);
            html += _renderHead();
            html += '<div class="jingle-calendar-body">';
            html += _renderBody(currentDate);
            html += '</div></div>'
            $el.html(html);
            var $span = $el.find('span');
            $yearText = $span.eq(0);
            $monthText = $span.eq(1);
            $calendarBody = $el.find('.jingle-calendar-body');
        }

        var _renderNav = function(year,month){
            var html = '<div class="jingle-calendar-nav">';
            html += '<div> <i class="icon previous" data-year='+year+'></i><span>'+year+'</span><i class="icon next" data-year='+year+'></i></div>';
            html += '<div ><i class="icon previous" data-month='+month+'></i> <span>'+_this.settings.months[month]+'</span><i class="icon next" data-month='+month+'></i></div>';
            html += '</div>';
            return html;
        }

        var _renderHead = function(){
            var html = '<table><thead><tr>';
            for(var i = 0; i < 7; i++){
                html += '<th>'+_this.settings.days[i]+'</th>';
            }
            html += '</tr></thead></table>'
            return html;
        }

        var _renderBody = function(date){
            var firstDay = _fisrtDayOfMonth(date),
                days = _daysInMonth(date),
                rows = Math.ceil((firstDay+days) / 7),
                beginDate,
                html = '';
            currentYear = date.getFullYear();
            currentMonth = date.getMonth();
            beginDate = new Date(currentYear,currentMonth,1-firstDay);//日历开始的日期
            html += '<table><tbody>';
            for(var i = 0; i < rows; i++){
                html += '<tr>';
                for(var j = 0; j < 7; j++){
                    html += _renderDay(beginDate,currentMonth);
                    beginDate.setDate(beginDate.getDate() + 1);
                }
                html += '</tr>';
            }
            html += '</tbody></table>';
            return html;
        }
        var _renderDay = function(date,month){
            var otherMonth = (date.getMonth() !== month);
            var dateStr = _this.format(date);
            var classname = (_this.format(_this.settings.date) == dateStr) ? 'active':'';
            var dayStr = date.getDate();
            if(_this.settings.onRenderDay){
                dayStr = _this.settings.onRenderDay.call(null,dayStr,dateStr);
            }
            return otherMonth ? '<td>&nbsp;</td>' : '<td data-selected="selected" class="'+classname+ '" data-date= '+dateStr+'>'+dayStr+'</td>';
        }

        var _subscribeEvents = function(){
            var $target,$ctarget;
            $el.on('tap',function(e){
                $target = $(e.target);
                if($target.is('[data-year].next')){
                    //后一年
                    currentDate.setFullYear(currentDate.getFullYear()+1);
                    _this.refresh(currentDate);
                }else if($target.is('[data-year].previous')){
                    //前一年
                    currentDate.setFullYear(currentDate.getFullYear()-1);
                    _this.refresh(currentDate);
                }else if($target.is('[data-month].next')){
                    //后一月
                    currentDate.setMonth(currentDate.getMonth()+1);
                    _this.refresh(currentDate);
                }else if($target.is('[data-month].previous')){
                    //前一月
                    currentDate.setMonth(currentDate.getMonth()-1);
                    _this.refresh(currentDate);
                }
                $ctarget = $target.closest('td');
                if(!$target.is('td') && $ctarget.length > 0){
                    $target = $ctarget;
                }
                if($target.is('td')){
                    var dateStr = $target.data('date');
                    if(dateStr && _this.settings.onSelect){
                        _this.settings.onSelect.call(_this,dateStr)
                    }
                }

            });
            $el.on('swipeLeft',function(){
                currentDate.setMonth(currentDate.getMonth()+1);
                _this.refresh(currentDate);
            });
            $el.on('swipeRight',function(){
                currentDate.setMonth(currentDate.getMonth()-1);
                _this.refresh(currentDate);
            })
        }

        /**
         * 刷新日历为指定日期
         * @param date 指定日期
         */
        this.refresh = function(date){
            var oldDate = new Date(currentYear,currentMonth,1),
                newDate = new Date(date.getFullYear(),date.getMonth(),1),
                transition = undefined,$table;

            if(oldDate.getTime() == newDate.getTime())return;
            transition = oldDate<newDate ? 'slideLeftRound' : 'slideRightRound';

            $yearText.text(date.getFullYear());
            $monthText.text(this.settings.months[date.getMonth()]);
            var newbody = _renderBody(date);
            J.anim($calendarBody,transition,function(){
                $calendarBody.html(newbody);
            });

        }
        _init();
    }
    /**
     * 字符串转化为日期对象，只支持yyyy-MM-dd 和 yyyy/MM/dd
     * @param date
     * @return {*}
     */
    calendar.prototype.parse = function(date){
        var dateRE = /^(\d{4})(?:\-|\/)(\d{1,2})(?:\-|\/)(\d{1,2})$/;
        return dateRE.test(date) ? new Date(parseInt(RegExp.$1, 10), parseInt(RegExp.$2, 10) - 1, parseInt(RegExp.$3, 10)) : null;
    }
    /**
     * 格式化日期  yyyy-MM-dd
     * @return {String}
     */
    calendar.prototype.format = function(date){
        var y  = date.getFullYear(),m = date.getMonth()+1,d = date.getDate();
        m = (m<10)?('0'+m):m;
        d = (d<10)?('0'+d):d;
        return y + '-' + m + '-' + d;
    }
    J.Calendar = calendar;
})(J.$);