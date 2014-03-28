window.JChart = {
    version : '0.1',
    animationOptions : {
        linear : function (t){
            return t;
        },
        easeInQuad: function (t) {
            return t*t;
        },
        easeOutQuad: function (t) {
            return -1 *t*(t-2);
        },
        easeInOutQuad: function (t) {
            if ((t/=1/2) < 1) return 1/2*t*t;
            return -1/2 * ((--t)*(t-2) - 1);
        },
        easeInCubic: function (t) {
            return t*t*t;
        },
        easeOutCubic: function (t) {
            return 1*((t=t/1-1)*t*t + 1);
        },
        easeInOutCubic: function (t) {
            if ((t/=1/2) < 1) return 1/2*t*t*t;
            return 1/2*((t-=2)*t*t + 2);
        },
        easeInQuart: function (t) {
            return t*t*t*t;
        },
        easeOutQuart: function (t) {
            return -1 * ((t=t/1-1)*t*t*t - 1);
        },
        easeInOutQuart: function (t) {
            if ((t/=1/2) < 1) return 1/2*t*t*t*t;
            return -1/2 * ((t-=2)*t*t*t - 2);
        },
        easeInQuint: function (t) {
            return 1*(t/=1)*t*t*t*t;
        },
        easeOutQuint: function (t) {
            return 1*((t=t/1-1)*t*t*t*t + 1);
        },
        easeInOutQuint: function (t) {
            if ((t/=1/2) < 1) return 1/2*t*t*t*t*t;
            return 1/2*((t-=2)*t*t*t*t + 2);
        },
        easeInSine: function (t) {
            return -1 * Math.cos(t/1 * (Math.PI/2)) + 1;
        },
        easeOutSine: function (t) {
            return 1 * Math.sin(t/1 * (Math.PI/2));
        },
        easeInOutSine: function (t) {
            return -1/2 * (Math.cos(Math.PI*t/1) - 1);
        },
        easeInExpo: function (t) {
            return (t==0) ? 1 : 1 * Math.pow(2, 10 * (t/1 - 1));
        },
        easeOutExpo: function (t) {
            return (t==1) ? 1 : 1 * (-Math.pow(2, -10 * t/1) + 1);
        },
        easeInOutExpo: function (t) {
            if (t==0) return 0;
            if (t==1) return 1;
            if ((t/=1/2) < 1) return 1/2 * Math.pow(2, 10 * (t - 1));
            return 1/2 * (-Math.pow(2, -10 * --t) + 2);
        },
        easeInCirc: function (t) {
            if (t>=1) return t;
            return -1 * (Math.sqrt(1 - (t/=1)*t) - 1);
        },
        easeOutCirc: function (t) {
            return 1 * Math.sqrt(1 - (t=t/1-1)*t);
        },
        easeInOutCirc: function (t) {
            if ((t/=1/2) < 1) return -1/2 * (Math.sqrt(1 - t*t) - 1);
            return 1/2 * (Math.sqrt(1 - (t-=2)*t) + 1);
        },
        easeInElastic: function (t) {
            var s=1.70158;var p=0;var a=1;
            if (t==0) return 0;  if ((t/=1)==1) return 1;  if (!p) p=1*.3;
            if (a < Math.abs(1)) { a=1; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (1/a);
            return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*1-s)*(2*Math.PI)/p ));
        },
        easeOutElastic: function (t) {
            var s=1.70158;var p=0;var a=1;
            if (t==0) return 0;  if ((t/=1)==1) return 1;  if (!p) p=1*.3;
            if (a < Math.abs(1)) { a=1; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (1/a);
            return a*Math.pow(2,-10*t) * Math.sin( (t*1-s)*(2*Math.PI)/p ) + 1;
        },
        easeInOutElastic: function (t) {
            var s=1.70158;var p=0;var a=1;
            if (t==0) return 0;  if ((t/=1/2)==2) return 1;  if (!p) p=1*(.3*1.5);
            if (a < Math.abs(1)) { a=1; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (1/a);
            if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*1-s)*(2*Math.PI)/p ));
            return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*1-s)*(2*Math.PI)/p )*.5 + 1;
        },
        easeInBack: function (t) {
            var s = 1.70158;
            return 1*(t/=1)*t*((s+1)*t - s);
        },
        easeOutBack: function (t) {
            var s = 1.70158;
            return 1*((t=t/1-1)*t*((s+1)*t + s) + 1);
        },
        easeInOutBack: function (t) {
            var s = 1.70158;
            if ((t/=1/2) < 1) return 1/2*(t*t*(((s*=(1.525))+1)*t - s));
            return 1/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2);
        },
        easeInBounce: function (t) {
            return 1 - JChart.animationOptions.easeOutBounce (1-t);
        },
        easeOutBounce: function (t) {
            if ((t/=1) < (1/2.75)) {
                return 1*(7.5625*t*t);
            } else if (t < (2/2.75)) {
                return 1*(7.5625*(t-=(1.5/2.75))*t + .75);
            } else if (t < (2.5/2.75)) {
                return 1*(7.5625*(t-=(2.25/2.75))*t + .9375);
            } else {
                return 1*(7.5625*(t-=(2.625/2.75))*t + .984375);
            }
        },
        easeInOutBounce: function (t) {
            if (t < 1/2) return JChart.animationOptions.easeInBounce (t*2) * .5;
            return JChart.animationOptions.easeOutBounce (t*2-1) * .5 + 1*.5;
        }
    },
    /**
     * 通用的计时控制器
     */
    requestAnimFrame : (function(){
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })(),
    isNumber : function(n){
        return !isNaN(parseFloat(n)) && isFinite(n);
    },
    isEqual : function(number1, number2, digits){
        digits = digits == undefined? 10: digits; // 默认精度为10
        return number1.toFixed(digits) === number2.toFixed(digits);
    },
    /**
     * 取有效区域内的值
     * @param valueToCap
     * @param maxValue
     * @param minValue
     * @return {*}
     */
    capValue : function(valueToCap, maxValue, minValue){
        var value;
        if(this.isNumber(maxValue) && valueToCap > maxValue) {
            return maxValue;
        }
        if(this.isNumber(minValue) && valueToCap < minValue ){
            return minValue;
        }
        return valueToCap;
    },
    getDecimalPlaces : function(num){
        if (num%1!=0){
            return num.toString().split(".")[1].length
        }
        else{
            return 0;
        }
    },
    mergeObj : function(dest,source){
        for(var p in source){
            dest[p] = source[p];
        }
    },
    clone : function(obj){
        var o;
        if (typeof obj == "object") {
            if (obj === null) {
                o = null;
            } else {
                if (obj instanceof Array) {
                    o = [];
                    for (var i = 0, len = obj.length; i < len; i++) {
                        o.push(this.clone(obj[i]));
                    }
                } else {
                    o = {};
                    for (var j in obj) {
                        o[j] = this.clone(obj[j]);
                    }
                }
            }
        } else {
            o = obj;
        }
        return o;
    },
    each : function(array,fn){
        for(var i = 0,len=array.length;i<len;i++){
            fn.call(null,i,array[i]);
        }
    },
    tmpl : (function(){
        //Javascript micro templating by John Resig - source at http://ejohn.org/blog/javascript-micro-templating/
        var cache = {};
        function tmpl(str, data){
            // Figure out if we're getting a template, or if we need to
            // load the template - and be sure to cache the result.
            var fn = !/\W/.test(str) ?
                cache[str] = cache[str] ||
                    tmpl(document.getElementById(str).innerHTML) :

                // Generate a reusable function that will serve as a template
                // generator (and which will be cached).
                new Function("obj",
                    "var p=[],print=function(){p.push.apply(p,arguments);};" +

                        // Introduce the data as local variables using with(){}
                        "with(obj){p.push('" +

                        // Convert the template into pure JavaScript
                        str
                            .replace(/[\r\t\n]/g, " ")
                            .split("<%").join("\t")
                            .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                            .replace(/\t=(.*?)%>/g, "',$1,'")
                            .split("\t").join("');")
                            .split("%>").join("p.push('")
                            .split("\r").join("\\'")
                        + "');}return p.join('');");

            // Provide some basic currying to the user
            return data ? fn( data ) : fn;
        };
        return tmpl;
    })()
};
(function(_){
    var Chart = function(){
        this.events = {};
        /**
         * 初始化参数
         */
        this.initial = function(cfg){
            //合并设置参数
            if(typeof cfg == 'string'){
                this.config.id = cfg;
            }else{
                JChart.mergeObj(this.config,cfg);
            }
            this.ctx = document.getElementById(this.config.id).getContext('2d');
            var canvas = this.ctx.canvas;
            this.width = canvas.width;
            this.height = canvas.height;
            //High pixel density displays - multiply the size of the canvas height/width by the device pixel ratio, then scale.
            //如果设备为视网膜屏，将canvas按照设备像素比放大像素，然后再等比缩小
            if (window.devicePixelRatio) {
                canvas.style.width = this.width + "px";
                canvas.style.height = this.height + "px";
                canvas.height = this.height * window.devicePixelRatio;
                canvas.width = this.width * window.devicePixelRatio;
                this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
            }
            this.init();
            this.bindTouchEvents();
            this.bindEvents();
        };
        this.clear = function(){
            this.ctx.clearRect(0,0,this.width,this.height);
        };
        /**
         * 更新
         */
        this.update = function(data,config){
            this.data = data;
            if(config){
                this.config = JChart.mergeObj(this.config,config);
            }
            this.init();

        };
        /**
         * 动画函数
         * @param drawScale 缩放动画 函数
         * @param drawData  增长式动画 函数
         * @param callback  执行成功回调函数
         */
        this.doAnim = function(drawScale,drawData,callback){
            var config = this.config;
            // 1/动画帧数
            var animFrameAmount = (config.animation)? 1/ _.capValue(config.animationSteps,Number.MAX_VALUE,1) : 1,
            //动画效果
                easingFunction = _.animationOptions[config.animationEasing],
            //动画完成率
                percentAnimComplete =(config.animation)? 0 : 1,
                _this = this;

            if (typeof drawScale !== "function") drawScale = function(){};
            _.requestAnimFrame.call(window,animLoop);
            function animLoop(){
                //We need to check if the animation is incomplete (less than 1), or complete (1).
                percentAnimComplete += animFrameAmount;
                animateFrame();
                //Stop the loop continuing forever
                if (percentAnimComplete <= 1){
                    _.requestAnimFrame.call(window,animLoop);
                }
                else{
                    callback && callback();
                    _this.trigger('animationComplete');
                }
            };
            function animateFrame(){
                _this.clear();
                var easeAdjustedAnimationPercent =(config.animation)? _.capValue(easingFunction(percentAnimComplete),null,0) : 1;
                if(config.scaleOverlay){
                    drawData(easeAdjustedAnimationPercent);
                    drawScale();
                } else {
                    drawScale();
                    drawData(easeAdjustedAnimationPercent);
                }
            };
        }
        /**
         * 简易的事件绑定
         */
        this.on = function(event,callback){
            this.events[event] = callback;
        };
        /**
         * 调用事件函数
         * @param event 事件名称
         * @param data 参数(数组形式)
         */
        this.trigger = function(event,data){
            var callback = this.events[event];
            if(callback){
                return callback.apply(this,data);
            }else{
                return null;
            }
        };
        //sprite from zepto touch.js
        //给chart添加tap longTap doubleTap事件
        this.bindTouchEvents = function(){
            var touch = {},touchTimeout, tapTimeout,longTapDelay = 750, longTapTimeout,now, delta,
                _this = this;

            this.ctx.canvas.addEventListener('mousedown',touchstart);
            this.ctx.canvas.addEventListener('mousemove',touchmove);
            this.ctx.canvas.addEventListener('mouseup',touchend);
            this.ctx.canvas.addEventListener('touchcancel',cancelAll);

            function touchstart(e){
                now = Date.now();
                e = e.touches ? e.touches[0] : e;
                delta = now - (touch.last || now);
                touchTimeout && clearTimeout(touchTimeout);
                touch.x1 = e.pageX;
                touch.y1 = e.pageY;
                if (delta > 0 && delta <= 250) touch.isDoubleTap = true;
                touch.last = now;
                longTapTimeout = setTimeout(longTap, longTapDelay);
            }
            function touchmove(e){
                e = e.touches ? e.touches[0] : e;
                touch.x2 = e.pageX;
                touch.y2 = e.pageY;
                cancelLongTap()
                if (Math.abs(touch.x1 - touch.x2) > 15){
                    //e.preventDefault();
                    cancelAll();
                }
            }
            function touchend(e){
                cancelLongTap();
                if ('last' in touch){
                    tapTimeout = setTimeout(function() {
                        if (touch.isDoubleTap) {
                            _this.trigger('_doubleTap');
                            touch = {};
                        }else {
                            touchTimeout = setTimeout(function(){
                                touchTimeout = null;
                                _this.trigger('_tap');
                                touch = {};
                            }, 250);
                        }
                    }, 0);
                };
            }

            function longTap() {
                longTapTimeout = null;
                if (touch.last) {
                    _this.trigger('_longTap');
                    touch = {};
                }
            }

            function cancelLongTap() {
                if (longTapTimeout) clearTimeout(longTapTimeout);
                longTapTimeout = null;
            }

            function cancelAll() {
                if (touchTimeout) clearTimeout(touchTimeout);
                if (tapTimeout) clearTimeout(tapTimeout);
                if (longTapTimeout) clearTimeout(longTapTimeout);
                touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null;
                touch = {};
            }
        }
    }
    _.Chart = Chart;
})(JChart);
(function(_){
    function Pie(data,cfg){
        _.Chart.apply(this);
        var _this = this;
        this.data = data;
        var pieRadius,segmentTotal = 0,startAngle = 0,rotateAngle = 0,currentPullOutIndex = -1;
        this.config = {
            id:'',
            //border
            segmentShowStroke : true,
            //border color
            segmentStrokeColor : "#fff",
            //border width
            segmentStrokeWidth : 2,
            //开始角度,默认为12点钟方向
            startAngle : -Math.PI/2,
            //旋转扇形，使其中线对应的角度
            rotateAngle : Math.PI/2,
            //扇形弹出距离
            pullOutDistance : 10,
            //点击扇形默认触发的事件类型
            clickType : 'pullOut',// pullOut||rotate
            //是否开启动画
            animation : true,
            //动画执行步数
            animationSteps : 20,
            //动画效果
            animationEasing : "linear",
            //环形图
            isDount : false,
            dountRadiusPercent :0.4,
            dountText : '',
            dountTextFont : 'bold 30px Arial',
            dountTextColor : '#e74c3c',
            dountTextBaseline : 'middle',
            dountTextAlign : 'center'
        }
        /**
         * 计算各个扇形的起始角度
         * @param data
         */
        function calcAngel(){
            var angle = 0;
            _.each(_this.data,function(i,d){
                d['startAngle'] = angle;
                angle = angle + (d.value/segmentTotal) * (Math.PI*2);
                d['endAngle'] = angle;
            })
        }

        function animRotate(percent){
            drawPie(percent,'rotate');
        }

        /**
         *  画饼图
         * @param percent 动画比例
         */
        function drawPie (percent,type){
            _this.clear();
            var animPercent = 1;
            if (_this.config.animation) {
                animPercent = percent;
            }
            _.each(_this.data,function(i){
                drawSegment(i,animPercent,type);
            });
            if(_this.config.isDount && _this.config.dountText){
                drawText();
            }
        }

        /**
         * 计算扇形真实的其实角度
         */
        function calcSegmentAngle(d,percent,type){
            var start =d.startAngle,
                end = d.endAngle;
            if(type == 'rotate'){
                //旋转
                start = start + startAngle + rotateAngle*percent;
                end = end + startAngle + rotateAngle*percent;
            }else{
                //默认动画
                start = start*percent + startAngle;
                end = end*percent + startAngle
            }
            return {
                start : start,
                end : end
            }
        }

        /**
         * 画扇形
         * @param i
         * @param animPercent
         */
        function drawSegment(i,percent,type){
            var x = _this.width/2,
                y = _this.height/ 2,
                d = _this.data[i];
            if(i == currentPullOutIndex){
                var midAngle = (d.startAngle + d.endAngle)/2+startAngle;
                x += Math.cos(midAngle) * _this.config.pullOutDistance;
                y += Math.sin(midAngle) * _this.config.pullOutDistance;
            }
            var angle = calcSegmentAngle(d,percent,type);
            drawPiePart(x,y,pieRadius,angle.start,angle.end,d);
        }

        function drawPiePart(x,y,r,start,end,data){
            var ctx = _this.ctx;
            ctx.beginPath();
            ctx.arc(x,y,r,start,end,false);
            if(_this.config.isDount){
                ctx.arc(x,y,r*_this.config.dountRadiusPercent,end,start,true);
            }else{
                ctx.lineTo(x,y);
            }
            ctx.closePath();
            ctx.fillStyle = data.color;
            ctx.fill();
            if(_this.config.segmentShowStroke){
                ctx.lineWidth = _this.config.segmentStrokeWidth;
                ctx.strokeStyle = _this.config.segmentStrokeColor;
                ctx.stroke();
            }
        }

        /**
         * 绑定canvas dom元素上的事件 如：click、touch
         */
        this.bindEvents = function(){
            this.ctx.canvas.addEventListener('click',clickHandler);
            //添加一个默认点击事件
            this.on('click',function(){return true;})
        }
        /**
         * click handler
         * 计算点击位置在图形中的所属
         * @param event
         */
        function clickHandler(event){
            var type = _this.config.clickType;
            var x = event.pageX - this.offsetLeft - _this.width/2;
            var y = event.pageY - this.offsetTop - _this.height/2;
            var distanceFromCentre = Math.sqrt( Math.pow( Math.abs(x), 2 ) + Math.pow( Math.abs(y), 2 ) );
            var isInPie = (distanceFromCentre <= pieRadius);
            if(isInPie && _this.config.isDount){
                isInPie = (distanceFromCentre >= pieRadius*_this.config.dountRadiusPercent);
            }
            if (isInPie) {//点击在圆形内
                var clickAngle = Math.atan2(y, x)-startAngle;
                if ( clickAngle < 0 ) clickAngle = 2 * Math.PI + clickAngle;
                if(clickAngle > 2 * Math.PI) clickAngle = clickAngle - 2 * Math.PI;
                _.each(_this.data,function(i,d){//判断属于哪个扇形
                    if ( clickAngle >= d['startAngle'] && clickAngle <= d['endAngle'] ) {
                        if(!_this.trigger('click',[i,d]))return;
                        if(type == 'rotate'){
                            _this.rotate(i);
                        }else if(type == 'pullOut'){
                            _this.toggleSegment(i);
                        }
                        return;
                    }
                })
            }
        }

        /**
         * 弹出/收起扇形块
         * @param i 扇形索引
         */
        this.toggleSegment = function(i){
            if(i == currentPullOutIndex){
                this.pushIn();
            }else{
                this.pullOut(i);
            }
        }
        /**
         * 收起所有弹出的扇形块
         */
        this.pushIn = function(){
            currentPullOutIndex = -1;
            drawPie(1);
            this.trigger('pushIn');
        }
        /**
         * 弹出指定的扇形块
         * @param i 扇形索引
         */
        this.pullOut = function(i){
            if ( currentPullOutIndex == i ) return;
            currentPullOutIndex = i;
            drawPie(1);
            this.trigger('pullOut',[i,_this.data[i]]);
        }
        /**
         * 旋转扇形块的中线指向6点钟方向
         * @param i 扇形索引
         */
        this.rotate = function(i){
            var middAngle = (_this.data[i].startAngle + _this.data[i].endAngle) / 2 + startAngle;
            var newRotateAngle = _this.config.rotateAngle-middAngle;
            if(_.isEqual(newRotateAngle,0))return;
            this.pushIn();
            rotateAngle = newRotateAngle;
            this.doAnim(null,animRotate,function(){
                startAngle += rotateAngle;
                _this.trigger('rotate',[i,_this.data[i]]);
            });
        }
        this.setDountText = function(text){
            _this.config.dountText = text;
            drawPie(1);
        }
        /**
         * 初始化部分元素值
         */
        this.init = function(){
            //计算半径(留10个像素)
            pieRadius = Math.min(_this.height/2,_this.width/2) - 10;
            _.each(_this.data,function(i,d){
                segmentTotal += d.value;
            });
            calcAngel();
            this.doAnim(null,drawPie);
            startAngle = _this.config.startAngle;
        }

        function drawText(){
            var ctx = _this.ctx;
            ctx.textBaseline = _this.config.dountTextBaseline;
            ctx.textAlign = _this.config.dountTextAlign;
            ctx.font = _this.config.dountTextFont;
            ctx.fillStyle = _this.config.dountTextColor;
            ctx.fillText(_this.config.dountText,_this.width/2,_this.height/2,pieRadius*2);
        }

        //初始化参数
        if(cfg)this.initial(cfg);
    }
    _.Pie = Pie;
}(JChart));
(function(_){
    /**
     * 抽象类-刻度值
     * 用来初始化XY轴各项数据
     * @constructor
     */
    function Scale(){
        _.Chart.apply(this);
        var _this = this;
        this.scaleData = {
            x : 0,//圆点坐标
            y : 0,
            xHop : 0,//x轴数据项宽度
            yHop : 0,//y轴每个刻度的高度
            xLength : 0,//x轴长度
            yHeight : 0,//y轴高度
            yScaleValue : null,//y轴刻度指标
            labelRotate : 0,//x轴label旋转角度
            widestXLabel : 0,//x轴label占用的最宽宽度
            barWidth : 0//柱形图柱子宽度
        }
        /**
         * 计算X轴文本宽度、旋转角度及Y轴高度
         */
        this.calculateDrawingSizes = function(){
            var maxSize = _this.height,widestXLabel = 1,labelRotate = 0;
            //计算X轴，如果发现数据宽度超过总宽度，需要将label进行旋转
            _this.ctx.font = _this.config.scaleFontStyle + " " + _this.config.scaleFontSize+"px " + _this.config.scaleFontFamily;
            //找出最宽的label
            _.each(_this.data.labels,function(i,o){
                var textLength = _this.ctx.measureText(o).width;
                widestXLabel = (textLength > widestXLabel)? textLength : widestXLabel;
            })
            if (_this.width/_this.data.labels.length < widestXLabel){
                labelRotate = 45;
                if (_this.width/_this.data.labels.length < Math.cos(labelRotate) * widestXLabel){
                    labelRotate = 90;
                    maxSize -= widestXLabel;
                }
                else{
                    maxSize -= Math.sin(labelRotate) * widestXLabel;
                }
            }
            else{
                maxSize -= _this.config.scaleFontSize;
            }
            //给Y轴顶部留一点空白
            maxSize -= 5;
            maxSize -= _this.config.scaleFontSize;

            this.scaleData.yHeight = maxSize;
            this.scaleData.labelRotate = labelRotate;
            this.scaleData.widestXLabel = widestXLabel;
        }

        /**
         * 计算Y轴刻度的边界及刻度步数
         * @return {Object}
         */
        this.getValueBounds =function() {
            var upperValue = Number.MIN_VALUE;
            var lowerValue = Number.MAX_VALUE;
            _.each(_this.data.datasets,function(i,o){
                _.each(o.data,function(j,obj){
                    if(obj > upperValue){upperValue = obj};
                    if (obj < lowerValue) { lowerValue = obj};
                })
            })
            var yh = this.scaleData.yHeight;
            var lh = _this.config.scaleFontSize;
            var maxSteps = Math.floor((yh/(lh*0.66)));
            var minSteps = Math.floor((yh/lh*0.5));

            return {
                maxValue : upperValue,
                minValue : lowerValue,
                maxSteps : maxSteps,
                minSteps : minSteps
            };
        }

        /**
         * 初始化刻度的各项数据
         */
        this.initScaleData = function(){
            var config = _this.config,calculatedScale;
            //Check and set the scale
            var labelTemplateString = (config.scaleShowLabels)? config.scaleLabel : "";
            if (!config.scaleOverride){
                var bounds = _this.getValueBounds();
                calculatedScale = _this.calcScale(_this.scaleData.yHeight,bounds.maxSteps,bounds.minSteps,bounds.maxValue,bounds.minValue,labelTemplateString);
            }else {
                calculatedScale = {
                    steps : config.scaleSteps,
                    stepValue : config.scaleStepWidth,
                    graphMin : config.scaleStartValue,
                    labels : []
                }
                _this.populateLabels(labelTemplateString, calculatedScale.labels,calculatedScale.steps,config.scaleStartValue,config.scaleStepWidth);
            }
            this.scaleData.yScaleValue = calculatedScale;
            this.scaleData.yHop = Math.floor(_this.scaleData.yHeight/calculatedScale.steps);
        }
        /**
         * 计算坐标轴的刻度
         */
        this.calcScale = function(drawingHeight,maxSteps,minSteps,maxValue,minValue,labelTemplateString){
            var graphMin,graphMax,graphRange,stepValue,numberOfSteps,valueRange,rangeOrderOfMagnitude,decimalNum;

            valueRange = maxValue - minValue;

            rangeOrderOfMagnitude = calculateOrderOfMagnitude(valueRange);

            graphMin = Math.floor(minValue / (1 * Math.pow(10, rangeOrderOfMagnitude))) * Math.pow(10, rangeOrderOfMagnitude);

            graphMax = Math.ceil(maxValue / (1 * Math.pow(10, rangeOrderOfMagnitude))) * Math.pow(10, rangeOrderOfMagnitude);

            graphRange = graphMax - graphMin;

            stepValue = Math.pow(10, rangeOrderOfMagnitude);

            numberOfSteps = Math.round(graphRange / stepValue);

            //Compare number of steps to the max and min for that size graph, and add in half steps if need be.
            while(numberOfSteps < minSteps || numberOfSteps > maxSteps) {
                if (numberOfSteps < minSteps){
                    stepValue /= 2;
                    numberOfSteps = Math.round(graphRange/stepValue);
                }
                else{
                    stepValue *=2;
                    numberOfSteps = Math.round(graphRange/stepValue);
                }
            };

            var labels = [];
            _this.populateLabels(labelTemplateString, labels, numberOfSteps, graphMin, stepValue);

            return {
                steps : numberOfSteps,
                stepValue : stepValue,
                graphMin : graphMin,
                labels : labels
            }
            function calculateOrderOfMagnitude(val){
                return Math.floor(Math.log(val) / Math.LN10);
            }
        }

        /**
         * 计算X轴宽度，每个数据项宽度大小及坐标原点
         */
        this.calculateXAxisSize = function(){
            var config = _this.config,scale = _this.scaleData,longestText = 1,xAxisLength,valueHop, x,y;
            //if we are showing the labels
            if (config.scaleShowLabels){
                _this.ctx.font = config.scaleFontStyle + " " + config.scaleFontSize+"px " + config.scaleFontFamily;
                //找出Y轴刻度的最宽值
                _.each(scale.yScaleValue.labels,function(i,o){
                    var measuredText = _this.ctx.measureText(o).width;
                    longestText = (measuredText > longestText)? measuredText : longestText;
                })
                //Add a little extra padding from the y axis
                longestText +=10;
            }
            xAxisLength = _this.width - longestText - scale.widestXLabel;

            if(_this._type_ == 'bar'){//计算柱形图柱子宽度，柱形图x轴文本居中显示，需要重新计算数据项宽度
                valueHop = Math.floor(xAxisLength/_this.data.labels.length);
                var len = _this.data.datasets.length;
                scale.barWidth = (valueHop - config.scaleGridLineWidth*2 - (config.barValueSpacing*2) - (config.barDatasetSpacing*len-1) - ((config.barStrokeWidth/2)*len-1))/len;
            }else{
                valueHop = Math.floor(xAxisLength/(_this.data.labels.length-1));
            }
            x = _this.width-scale.widestXLabel/2-xAxisLength;
            y = scale.yHeight + config.scaleFontSize/2;
            scale.x = x;
            scale.y = y;
            scale.xWidth = xAxisLength;
            scale.xHop = valueHop;
        }

        this.drawScale = function(){
            var ctx = _this.ctx,config = _this.config,scale = _this.scaleData;
            //画X轴数据项
            ctx.lineWidth = config.scaleLineWidth;
            ctx.strokeStyle = config.scaleLineColor;
            ctx.beginPath();
            ctx.moveTo(_this.width-scale.widestXLabel/2+5,scale.y);
            ctx.lineTo(_this.width-(scale.widestXLabel/2)-scale.xWidth-5,scale.y);
            ctx.stroke();


            if (scale.labelRotate > 0){
                ctx.save();
                ctx.textAlign = "right";
            }
            else{
                ctx.textAlign = "center";
            }
            ctx.fillStyle = config.scaleFontColor;
            for (var i=0; i<_this.data.labels.length; i++){
                ctx.save();
                var labelX = scale.x + i*scale.xHop,labelY = scale.y + config.scaleFontSize;
                if(_this._type_ == 'bar'){
                    labelX += scale.xHop/2;
                }
                if (scale.labelRotate > 0){
                    ctx.translate(labelX,labelY);
                    ctx.rotate(-(scale.labelRotate * (Math.PI/180)));
                    ctx.fillText(_this.data.labels[i], 0,0);
                    ctx.restore();
                }else{
                    ctx.fillText(_this.data.labels[i], labelX,labelY+3);
                }

                ctx.beginPath();

                //Check i isnt 0, so we dont go over the Y axis twice.
                if(this._type_ == 'bar'){
                    ctx.moveTo(scale.x + (i+1) * scale.xHop, scale.y+3);
                    drawGridLine(scale.x + (i+1) * scale.xHop, 5);
                }else{
                    ctx.moveTo(scale.x + i * scale.xHop, scale.y+3);
                    if(config.scaleShowGridLines && i>0){
                        drawGridLine(scale.x + i * scale.xHop, 5);
                    }
                    else{
                        ctx.lineTo(scale.x + i * scale.xHop, scale.y+3);
                    }
                }
                ctx.stroke();
            }

            //画Y轴
            ctx.lineWidth = config.scaleLineWidth;
            ctx.strokeStyle = config.scaleLineColor;
            ctx.beginPath();
            ctx.moveTo(scale.x,scale.y+5);
            ctx.lineTo(scale.x,5);
            ctx.stroke();

            ctx.textAlign = "right";
            ctx.textBaseline = "middle";
            for (var j=0; j<scale.yScaleValue.steps; j++){
                ctx.beginPath();
                ctx.moveTo(scale.x-3,scale.y - ((j+1) * scale.yHop));
                if (config.scaleShowGridLines){
                    drawGridLine(scale.x + scale.xWidth + 5,scale.y - ((j+1) * scale.yHop));
                }
                else{
                    ctx.lineTo(scale.x-0.5,scale.y - ((j+1) * scale.yHop));
                }

                ctx.stroke();

                if (config.scaleShowLabels){
                    ctx.fillText(scale.yScaleValue.labels[j],scale.x-8,scale.y - ((j+1) * scale.yHop));
                }
            }
            function drawGridLine(x,y){
                ctx.lineWidth = config.scaleGridLineWidth;
                ctx.strokeStyle = config.scaleGridLineColor;
                ctx.lineTo(x, y);
            }
        }

        /**
         * 计算坐标轴的刻度
         * @param drawingHeight
         * @param maxSteps
         * @param minSteps
         * @param maxValue
         * @param minValue
         * @param labelTemplateString
         */
        this.calcScale = function(drawingHeight,maxSteps,minSteps,maxValue,minValue,labelTemplateString){
            var graphMin,graphMax,graphRange,stepValue,numberOfSteps,valueRange,rangeOrderOfMagnitude,decimalNum;

            valueRange = maxValue - minValue;

            rangeOrderOfMagnitude = calculateOrderOfMagnitude(valueRange);

            graphMin = Math.floor(minValue / (1 * Math.pow(10, rangeOrderOfMagnitude))) * Math.pow(10, rangeOrderOfMagnitude);

            graphMax = Math.ceil(maxValue / (1 * Math.pow(10, rangeOrderOfMagnitude))) * Math.pow(10, rangeOrderOfMagnitude);

            graphRange = graphMax - graphMin;

            stepValue = Math.pow(10, rangeOrderOfMagnitude);

            numberOfSteps = Math.round(graphRange / stepValue);

            //Compare number of steps to the max and min for that size graph, and add in half steps if need be.
            while(numberOfSteps < minSteps || numberOfSteps > maxSteps) {
                if (numberOfSteps < minSteps){
                    stepValue /= 2;
                    numberOfSteps = Math.round(graphRange/stepValue);
                }
                else{
                    stepValue *=2;
                    numberOfSteps = Math.round(graphRange/stepValue);
                }
            };

            var labels = [];
            this.populateLabels(labelTemplateString, labels, numberOfSteps, graphMin, stepValue);

            return {
                steps : numberOfSteps,
                stepValue : stepValue,
                graphMin : graphMin,
                labels : labels
            }
            function calculateOrderOfMagnitude(val){
                return Math.floor(Math.log(val) / Math.LN10);
            }
        }

        /**
         * Populate an array of all the labels by interpolating the string.
         * @param labelTemplateString
         * @param labels
         * @param numberOfSteps
         * @param graphMin
         * @param stepValue
         */
        this.populateLabels = function (labelTemplateString, labels, numberOfSteps, graphMin, stepValue) {
            if (labelTemplateString) {
                //Fix floating point errors by setting to fixed the on the same decimal as the stepValue.
                for (var i = 1; i < numberOfSteps + 1; i++) {
                    labels.push(_.tmpl(labelTemplateString, {value: (graphMin + (stepValue * i)).toFixed(_.getDecimalPlaces(stepValue))}));
                }
            }
        }

        this.calculateOffset = function(val,calculatedScale,scaleHop){
            var outerValue = calculatedScale.steps * calculatedScale.stepValue;
            var adjustedValue = val - calculatedScale.graphMin;
            var scalingFactor = _.capValue(adjustedValue/outerValue,1,0);
            return (scaleHop*calculatedScale.steps) * scalingFactor;
        }

        this.initScale = function(){
            _this.calculateDrawingSizes();
            _this.initScaleData();
            _this.calculateXAxisSize();
        }

        this.sliceData = function(data,offset,len,num){
            var newdata = _.clone(data);
            var min = offset,max = offset + num;
            if(max > len){
                min = len - num;
                max = len;
            }
            newdata.labels = newdata.labels.slice(min,max);
            _.each(newdata.datasets,function(i,d){
                d.data = d.data.slice(min,max)
            });
            return newdata;
        }


        this.bindDataGestureEvent = function(data){
            var touchDistanceX,//手指滑动偏移量
                startPosition,//触摸初始位置记录
                dataOffset = 0,//数据偏移量
                currentOffset = 0,//当前一次滑动的偏移量
                dataNum = this.config.datasetOffsetNumber,//每屏显示的数据条数
                totalLen = data.labels.length,//数据总长度
                gestureStarted;

            this.ctx.canvas.addEventListener('mousedown',touchstart);
            this.ctx.canvas.addEventListener('mousemove',touchmove);
            this.ctx.canvas.addEventListener('mouseup',touchend);

            function touchstart(event){
                startPosition = {
                    x : event.pageX,
                    y : event.pageY
                }
                touchDistanceX = 0;
                gestureStarted = true;
            }
            function touchmove(event){
                if(!gestureStarted || !_this.config.datasetGesture){return;};
                var x = event.pageX;
                var y = event.pageY;
                touchDistanceX = x - startPosition.x;
                //允许1/10的误差范围
                if(touchDistanceX%_this.scaleData.xHop < _this.scaleData.xHop/10){
                    var offset = dataOffset - Math.floor(touchDistanceX/_this.scaleData.xHop);
                    if(offset+dataNum > totalLen)return;
                    if(offset < 0)return;
                    currentOffset = offset;
                    _this.load(_this.sliceData(data,offset,totalLen,dataNum));
                }
            }
            function touchend(event){
                gestureStarted = false;
                dataOffset = currentOffset;
            }
        }

    }
    _.Scale = Scale;
})(JChart);
(function(_){
    function Bar(data,cfg){
        _.Scale.apply(this);
        this._type_ = 'bar';
        var _this = this;
        this.data = data;
        //配置项
        this.config = {
            scaleOverlay : false,
            scaleOverride : false,
            scaleSteps : null,
            scaleStepWidth : null,
            scaleStartValue : null,
            scaleLineColor : "rgba(0,0,0,.1)",
            scaleLineWidth : 1,
            scaleShowLabels : true,
            scaleLabel : "<%=value%>",
            scaleFontFamily : "'Arial'",
            scaleFontSize : 12,
            scaleFontStyle : "normal",
            scaleFontColor : "#666",
            scaleShowGridLines : true,
            scaleGridLineColor : "rgba(0,0,0,.05)",
            scaleGridLineWidth : 1,
            barShowStroke : true,
            barStrokeWidth : 2,
            barValueSpacing : 5,
            barDatasetSpacing : 1,
            animation : true,
            animationSteps : 60,
            animationEasing : "easeOutQuart",
            onAnimationComplete : null,
            //是否可以对数据进行拖动
            datasetGesture : true,
            //每次显示的数据条数
            datasetOffsetNumber : 12
        }
        /**
         * 绑定canvas dom元素上的事件 如：click、touch
         */
        this.bindEvents = function(){
            //this.ctx.canvas.addEventListener('click',clickHandler);
            if(this.config.datasetGesture){
                this.bindDataGestureEvent(data);
            }
        }
        /**
         * 初始化部分元素值
         */
        this.init = function(){
            var _data = data;
            if(_this.config.datasetGesture){
                _data = _this.sliceData(data,0,data.labels.length,_this.config.datasetOffsetNumber);
            }
            this.data = _data;
            _this.initScale();
            _this.doAnim(_this.drawScale,_this.drawBars);
        }

        this.load = function(data){
            this.data = data;
            this.clear();
            this.initScale();
            this.drawScale();
            this.drawBars(1);
        }

        this.drawBars = function(animPc){
            var ctx = _this.ctx,config = _this.config,dataset = _this.data.datasets,scale = _this.scaleData;
            ctx.lineWidth = config.barStrokeWidth;
            for (var i=0; i<dataset.length; i++){
                ctx.fillStyle = dataset[i].fillColor;
                ctx.strokeStyle = dataset[i].strokeColor;
                for (var j=0; j<dataset[i].data.length; j++){
                    var barOffset = scale.x + config.barValueSpacing + scale.xHop*j + scale.barWidth*i + config.barDatasetSpacing*i + config.barStrokeWidth*i;
                    ctx.beginPath();
                    ctx.moveTo(barOffset, scale.y);
                    ctx.lineTo(barOffset, scale.y - animPc*_this.calculateOffset(dataset[i].data[j],scale.yScaleValue,scale.yHop)+(config.barStrokeWidth/2));
                    ctx.lineTo(barOffset + scale.barWidth, scale.y - animPc*_this.calculateOffset(dataset[i].data[j],scale.yScaleValue,scale.yHop)+(config.barStrokeWidth/2));
                    ctx.lineTo(barOffset + scale.barWidth, scale.y);
                    if(config.barShowStroke){
                        ctx.stroke();
                    }
                    ctx.closePath();
                    ctx.fill();
                }
            }
        }
        //初始化参数
        if(cfg)this.initial(cfg);
    }
    _.Bar = Bar;
})(JChart);
(function(_){
    function Line(data,cfg){
        _.Scale.apply(this);
        var pointRanges;//记录线的节点位置 (for click 事件)
        this._type_ = 'line';
        var _this = this;
        //配置项
        this.config = {
            scaleOverlay : false,
            scaleOverride : false,
            scaleSteps : null,
            scaleStepWidth : null,
            scaleStartValue : null,
            scaleLineColor : "rgba(0,0,0,.1)",
            scaleLineWidth : 1,
            scaleShowLabels : true,
            scaleLabel : "<%=value%>",
            scaleFontFamily : "'Arial'",
            scaleFontSize : 12,
            scaleFontStyle : "normal",
            scaleFontColor : "#666",
            scaleShowGridLines : true,
            scaleGridLineColor : "rgba(0,0,0,.05)",
            scaleGridLineWidth : 1,
            bezierCurve : true,
            pointDot : true,
            pointDotRadius : 4,
            pointDotStrokeWidth : 2,
            pointClickBounds : 10,
            datasetStroke : true,
            datasetStrokeWidth : 2,
            datasetFill : true,
            animation : true,
            animationSteps : 30,
            animationEasing : "easeOutQuart",
            onAnimationComplete : null,
            //是否可以对数据进行拖动
            datasetGesture : true,
            //每次显示的数据条数
            datasetOffsetNumber : 12
        }
        /**
         * 绑定canvas dom元素上的事件 如：click、touch
         */
        this.bindEvents = function(){
            this.ctx.canvas.addEventListener('click',clickHandler);
            if(this.config.datasetGesture){
                this.bindDataGestureEvent(data);
            }
        }
        /**
         * 初始化部分元素值
         */
        this.init = function(){
            var _data = data;
            if(_this.config.datasetGesture){
                _data = _this.sliceData(data,0,data.labels.length,_this.config.datasetOffsetNumber);
            }
            this.data = _data;
            _this.initScale();
            _this.doAnim(_this.drawScale,_this.drawLines);
        }
        this.load = function(data){
            this.data = data;
            this.clear();
            this.initScale();
            this.drawScale();
            this.drawLines(1);
        }
        this.drawLines = function(animPc){
            if(animPc == 1)pointRanges = [];
            var ctx = _this.ctx,config = _this.config,dataset = _this.data.datasets,scale = _this.scaleData;
            for (var i=0; i<dataset.length; i++){
                ctx.strokeStyle = dataset[i].strokeColor;
                ctx.lineWidth = config.datasetStrokeWidth;
                ctx.beginPath();
                ctx.moveTo(scale.x, scale.y - animPc*(_this.calculateOffset(dataset[i].data[0],scale.yScaleValue,scale.yHop)))

                for (var j=1; j<dataset[i].data.length; j++){
                    var pointX = xPos(j),pointY = yPos(i,j);
                    if (config.bezierCurve){
                        ctx.bezierCurveTo(xPos(j-0.5),yPos(i,j-1),xPos(j-0.5),yPos(i,j),pointX,pointY);
                    }else{
                        ctx.lineTo(pointX,pointY);
                    }
                    if(animPc == 1){
                        pointRanges.push([pointX,pointY,j,i]);
                    }
                }
                ctx.stroke();
                if (config.datasetFill){
                    ctx.lineTo(scale.x + (scale.xHop*(dataset[i].data.length-1)),scale.y);
                    ctx.lineTo(scale.x,scale.y);
                    ctx.closePath();
                    ctx.fillStyle = dataset[i].fillColor;
                    ctx.fill();
                }
                else{
                    ctx.closePath();
                }
                if(config.pointDot){
                    ctx.fillStyle = dataset[i].pointColor;
                    ctx.strokeStyle = dataset[i].pointStrokeColor;
                    ctx.lineWidth = config.pointDotStrokeWidth;
                    for (var k=0; k<dataset[i].data.length; k++){
                        ctx.beginPath();
                        ctx.arc(scale.x + (scale.xHop *k),scale.y - animPc*(_this.calculateOffset(dataset[i].data[k],scale.yScaleValue,scale.yHop)),config.pointDotRadius,0,Math.PI*2,true);
                        ctx.fill();
                        ctx.stroke();
                    }
                }
            }

            function yPos(dataSet,iteration){
                return scale.y - animPc*(_this.calculateOffset(dataset[dataSet].data[iteration],scale.yScaleValue,scale.yHop));
            }
            function xPos(iteration){
                return scale.x + (scale.xHop * iteration);
            }
        }

        function clickHandler(){
            //计算手指在canvas中的位置
            var x = event.pageX - this.offsetLeft;
            var y = event.pageY - this.offsetTop;
            var p = isInPointRange(x,y);
            if(p){
                _this.trigger('click',[_this.data.datasets[p[3]].data[p[2]],p[2],p[3]]);
            }
        }

        function isInPointRange(x,y){
            var point,pb = _this.config.pointClickBounds;
            pointRanges = pointRanges || [];
            _.each(pointRanges,function(i,p){
                if(x >= p[0] - pb && x <= p[0] + pb && y >= p[1]-pb && y <= p[1] + pb){
                    point = p;
                    return;
                }
            });
            return point;
        }

        //初始化参数
        if(cfg)this.initial(cfg);
    }
    _.Line = Line;
})(JChart);

