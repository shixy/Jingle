window.JingleChart = JChart = {
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
    //只对array有效
    each : function(array,fn,context){
        for(var i = 0,len=array.length;i<len;i++){
            var result = fn.call(context,array[i],i,array);
            if(result === true){
                continue;
            }else if(result === false){
                break;
            }
        }
    },
    getOffset : function(el){
    	var box = el.getBoundingClientRect(), 
		doc = el.ownerDocument, 
		body = doc.body, 
		html = doc.documentElement, 
		clientTop = html.clientTop || body.clientTop || 0, 
		clientLeft = html.clientLeft || body.clientLeft || 0, 
		top = box.top + (self.pageYOffset || html.scrollTop || body.scrollTop ) - clientTop, 
		left = box.left + (self.pageXOffset || html.scrollLeft || body.scrollLeft) - clientLeft 
		return { 'top': top, 'left': left }; 
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


;(function(_){
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
                _.mergeObj(this.config,cfg);
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
        this.refresh = function(config){
            if(config){
               _.mergeObj(this.config,config);
            }
            this.init();
        };
        /**
         * 加载数据
         * @param data
         * @param config
         */
        this.load = function(data,config){
            this.data = data;
            config && _.mergeObj(this.config,config);
            this.clear();
            this.init(true);
        }
        /**
         * 动画函数
         * @param drawScale 缩放动画 函数
         * @param drawData  增长式动画 函数
         * @param callback  执行成功回调函数
         */
        this.doAnim = function(drawScale,drawData,callback){
            var config = this.config,_this = this;
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
                    callback && callback.call(_this);
                    _this.trigger('animationComplete');
                }
            };
            function animateFrame(){
                _this.clear();
                var animPercent =(config.animation)? _.capValue(easingFunction(percentAnimComplete),null,0) : 1;
                if(config.scaleOverlay){
                    drawData.call(_this,animPercent);
                    drawScale.call(_this);
                } else {
                    drawScale.call(_this);
                    drawData.call(_this,animPercent);
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
        //给chart添加tap longTap doubleTap事件
        this.bindTouchEvents = function(){
            var touch = {},touchTimeout,longTapDelay = 750, longTapTimeout,now, delta,
	            offset = _.getOffset(this.ctx.canvas),
	            hasTouch = 'ontouchstart' in window,
				START_EV = hasTouch ? 'touchstart' : 'mousedown',
				MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
				END_EV = hasTouch ? 'touchend' : 'mouseup',
				CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup',
	            _this = this;

            this.ctx.canvas.addEventListener(START_EV,touchstart);
            this.ctx.canvas.addEventListener(MOVE_EV,touchmove);
            this.ctx.canvas.addEventListener(END_EV,touchend);
            this.ctx.canvas.addEventListener(CANCEL_EV,cancelAll);

            function touchstart(e){
                now = Date.now();
                e = e.touches ? e.touches[0] : e;
                delta = now - (touch.last || now);
                touchTimeout && clearTimeout(touchTimeout);
                touch.x1 = e.pageX - offset.left;
                touch.y1 = e.pageY - offset.top;
                if (delta > 0 && delta <= 250) touch.isDoubleTap = true;
                touch.last = now;
                longTapTimeout = setTimeout(longTap, longTapDelay);
            }
            function touchmove(e){
                var ev = e.touches ? e.touches[0] : e;
                touch.x2 = ev.pageX - offset.left;
                touch.y2 = ev.pageY - offset.top;
                if (Math.abs(touch.x1 - touch.x2) > 15){
                    e.preventDefault();
                    cancelAll();
                }
            }
            function touchend(e){
                cancelLongTap();
                if ('last' in touch){
                    //tap事件，单击/双击都会触发，0延迟，建议在不使用doubleTap的环境中使用，如果要同时使用tap和doubleTap，请使用singleTap
                    _this.trigger('_tap',[touch.x1,touch.y1]);
                    _this.trigger('tap',[touch.x1,touch.y1]);
                    if (touch.isDoubleTap) {
                        cancelAll();
                        _this.trigger('_doubleTap',[touch.x1,touch.y1]);
                        _this.trigger('doubleTap',[touch.x1,touch.y1]);
                    }else {
                        touchTimeout = setTimeout(function(){
                            touchTimeout = null;
                            _this.trigger('_singleTap',[touch.x1,touch.y1]);
                            _this.trigger('singleTap',[touch.x1,touch.y1]);
                            touch = {};
                        }, 250)

                    }
                };
            }

            function longTap() {
                longTapTimeout = null;
                if (touch.last) {
                    _this.trigger('_longTap',[touch.x1,touch.y1]);
                    _this.trigger('longTap',[touch.x1,touch.y1]);
                    touch = {};
                }
            }

            function cancelLongTap() {
                if (longTapTimeout) clearTimeout(longTapTimeout);
                longTapTimeout = null;
            }

            function cancelAll() {
                if (touchTimeout) clearTimeout(touchTimeout);
                if (longTapTimeout) clearTimeout(longTapTimeout);
                touchTimeout = longTapTimeout = null;
                touch = {};
            }
        }
    }
    _.Chart = Chart;
})(JChart);
;(function(_){
    /**
     * 抽象类-刻度值
     * 用来初始化XY轴各项数据
     * @constructor
     */
    function Scale(){
        _.Chart.apply(this);
        this.scaleData = {
            x : 0,//圆点坐标
            y : 0,
            xHop : 0,//x轴数据项宽度
            yHop : 0,//y轴每个刻度的高度
            xLength : 0,//x轴长度
            yHeight : 0,//y轴高度
            yLabelHeight : 0,//y轴刻度文本高度
            yScaleValue : null,//y轴刻度指标
            labelRotate : 0,//x轴label旋转角度
            widestXLabel : 0,//x轴label占用的最宽宽度
            barWidth : 0//柱形图柱子宽度
        }
        /**
         * 计算X轴文本宽度、旋转角度及Y轴高度
         */
        this.calcDrawingSizes = function(){
            var maxSize = this.height,widestXLabel = 1,labelRotate = 0;
            //计算X轴，如果发现数据宽度超过总宽度，需要将label进行旋转
            this.ctx.font = this.config.scaleFontStyle + " " + this.config.scaleFontSize+"px " + this.config.scaleFontFamily;
            //找出最宽的label
            _.each(this.chartData.labels,function(o){
                var textLength = this.ctx.measureText(o).width;
                widestXLabel = (textLength > widestXLabel)? textLength : widestXLabel;
            },this);
            if (this.width/this.chartData.labels.length < widestXLabel){
                labelRotate = 45;
                if (this.width/this.chartData.labels.length < Math.cos(labelRotate) * widestXLabel){
                    labelRotate = 90;
                    maxSize -= widestXLabel;
                }
                else{
                    maxSize -= Math.sin(labelRotate) * widestXLabel;
                }
            }
            else{
                maxSize -= this.config.scaleFontSize;
            }
            //给Y轴顶部留一点空白
            maxSize -= 5;
            maxSize -= this.config.scaleFontSize;

            this.scaleData.yHeight = maxSize;
            this.scaleData.yLabelHeight = this.config.scaleFontSize;
            this.scaleData.labelRotate = labelRotate;
            this.scaleData.widestXLabel = widestXLabel;
        }

        /**
         * 计算Y轴刻度的边界及刻度步数
         * @return {Object}
         */
        this.getValueBounds = function(dataset) {
            var upperValue = Number.MIN_VALUE;
            var lowerValue = Number.MAX_VALUE;
            _.each(dataset,function(o){
                _.each(o.data,function(obj){
                    if(obj > upperValue){upperValue = obj};
                    if (obj < lowerValue) { lowerValue = obj};
                })
            })
            var yh = this.scaleData.yHeight;
            var lh = this.scaleData.yLabelHeight;
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
         * 计算Y轴刻度的各项数据
         */
        this.calcYAxis = function(){
            var config = this.config,calculatedScale;
            //Check and set the scale
            var labelTemplateString = (config.scaleShowLabels)? config.scaleLabel : "";
            if (!config.scaleOverride){
                var bounds = this.getValueBounds(this.chartData.datasets);
                calculatedScale = this.calcScale(this.scaleData.yHeight,bounds.maxSteps,bounds.minSteps,bounds.maxValue,bounds.minValue,labelTemplateString);
            }else {
                calculatedScale = {
                    steps : config.scaleSteps,
                    stepValue : config.scaleStepWidth,
                    graphMin : config.scaleStartValue,
                    labels : []
                }
                this.populateLabels(labelTemplateString, calculatedScale.labels,calculatedScale.steps,config.scaleStartValue,config.scaleStepWidth);
            }
            this.scaleData.yScaleValue = calculatedScale;
            this.scaleData.yHop = Math.floor(this.scaleData.yHeight/calculatedScale.steps);
        }

        /**
         * 计算X轴宽度，每个数据项宽度大小及坐标原点
         */
        this.calcXAxis = function(){
            var config = this.config,scale = this.scaleData,longestText = 1,xAxisLength,valueHop, x,y;
            //if we are showing the labels
            if (config.scaleShowLabels){
                this.ctx.font = config.scaleFontStyle + " " + config.scaleFontSize+"px " + config.scaleFontFamily;
                //找出Y轴刻度的最宽值
                _.each(scale.yScaleValue.labels,function(o){
                    var measuredText = this.ctx.measureText(o).width;
                    longestText = (measuredText > longestText)? measuredText : longestText;
                },this);
                //Add a little extra padding from the y axis
                longestText +=10;
            }
            xAxisLength = this.width - longestText - scale.widestXLabel;

            if(this._type_ == 'bar'){//计算柱形图柱子宽度，柱形图x轴文本居中显示，需要重新计算数据项宽度
                valueHop = Math.floor(xAxisLength/this.chartData.labels.length);
                var len = this.chartData.datasets.length;
                scale.barWidth = (valueHop - config.scaleGridLineWidth*2 - (config.barValueSpacing*2) - (config.barDatasetSpacing*len-1) - ((config.barStrokeWidth/2)*len-1))/len;
            }else{
                valueHop = Math.floor(xAxisLength/(this.chartData.labels.length-1));
            }
            x = this.width-scale.widestXLabel/2-xAxisLength;
            y = scale.yHeight + config.scaleFontSize/2;
            scale.x = x;
            scale.y = y;
            scale.xWidth = xAxisLength;
            scale.xHop = valueHop;
        }

        this.drawScale = function(){
            var ctx = this.ctx,config = this.config,scale = this.scaleData;
            //画X轴数据项
            ctx.lineWidth = config.scaleLineWidth;
            ctx.strokeStyle = config.scaleLineColor;
            ctx.beginPath();
            ctx.moveTo(this.width-scale.widestXLabel/2+5,scale.y);
            ctx.lineTo(this.width-(scale.widestXLabel/2)-scale.xWidth-5,scale.y);
            ctx.stroke();


            if (scale.labelRotate > 0){
                ctx.save();
                ctx.textAlign = "right";
            }
            else{
                ctx.textAlign = "center";
            }
            ctx.fillStyle = config.scaleFontColor;
            _.each(this.chartData.labels,function(label,i){
                ctx.save();
                var labelX = scale.x + i*scale.xHop,labelY = scale.y + config.scaleFontSize;
                if(this._type_ == 'bar'){
                    labelX += scale.xHop/2;
                }
                if (scale.labelRotate > 0){
                    ctx.translate(labelX,labelY);
                    ctx.rotate(-(scale.labelRotate * (Math.PI/180)));
                    ctx.fillText(label, 0,0);
                    ctx.restore();
                }else{
                    ctx.fillText(label, labelX,labelY+3);
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
            },this);

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

        this.initScale = function(showX){
            this.calcDrawingSizes();
            this.calcYAxis();
            showX && this.calcXAxis();
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
        },
        this.calculateOffset = function(val,calculatedScale,scaleHop){
            var outerValue = calculatedScale.steps * calculatedScale.stepValue;
            var adjustedValue = val - calculatedScale.graphMin;
            var scalingFactor = _.capValue(adjustedValue/outerValue,1,0);
            return (scaleHop*calculatedScale.steps) * scalingFactor;
        },
        
        this.sliceData = function(data,offset,len,num){
            var newdata = _.clone(data);
            var min = offset,max = offset + num;
            if(max > len){
                min = len - num;
                max = len;
            }
            newdata.labels = newdata.labels.slice(min,max);
            _.each(newdata.datasets,function(d){
                d.data = d.data.slice(min,max)
            });
            return newdata;
        }
		

        this.bindDataGestureEvent = function(){
            var _this = this,
            	touchDistanceX,//手指滑动偏移量
                startPosition,//触摸初始位置记录
                dataOffset = 0,//数据偏移量
                currentOffset = 0,//当前一次滑动的偏移量
                dataNum = this.config.datasetOffsetNumber,//每屏显示的数据条数
                gestureStarted,
                hasTouch = 'ontouchstart' in window,
				START_EV = hasTouch ? 'touchstart' : 'mousedown',
				MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
				END_EV = hasTouch ? 'touchend' : 'mouseup';

            this.ctx.canvas.addEventListener(START_EV,touchstart);
            this.ctx.canvas.addEventListener(MOVE_EV,touchmove);
            this.ctx.canvas.addEventListener(END_EV,touchend);

            function touchstart(e){
            	e = e.touches ? e.touches[0] : e;
                startPosition = {
                    x : e.pageX,
                    y : e.pageY
                }
                touchDistanceX = 0;
                gestureStarted = true;
            }
            function touchmove(e){
                if(!gestureStarted || !_this.config.datasetGesture)return;
                e = e.touches ? e.touches[0] : e;
                var x = e.pageX;
                var y = e.pageY;
                touchDistanceX = x - startPosition.x;
				//允许1/10的误差范围
                //if(touchDistanceX%_this.scaleData.xHop < _this.scaleData.xHop/10){
            	if(Math.floor(touchDistanceX)%20 < 10){//每滑动20px加载下一组数据，中间偶尔可能会重复加载
                    var totalLen = _this.data.labels.length;//数据总长度
                    var offset = dataOffset - Math.floor(touchDistanceX/_this.scaleData.xHop);
                    if(offset+dataNum > totalLen)return;
                    if(offset < 0)return;
                    currentOffset = offset;
                    //将操作加入系统队列，解决android系统下touchmove的bug
                    setTimeout(function(){
                    	_this.redraw(_this.sliceData(_this.data,offset,totalLen,dataNum));
                    },0)
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
;(function(_){
    function Line(data,cfg){
      	_.Scale.apply(this);
        var pointRanges = [];//记录线的节点位置 (for click 事件)
        this._type_ = 'line';
        this.data = data;
        this.chartData = null;
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
            pointClickBounds : 20,
            datasetStroke : true,
            datasetStrokeWidth : 2,
            datasetFill : true,
            animation : true,
            animationSteps : 30,
            animationEasing : "easeOutQuart",
            onAnimationComplete : null,
            //是否可以对数据进行拖动
            datasetGesture : false,
            //每次显示的数据条数
            datasetOffsetNumber : 12
        }
        /**
         * 绑定canvas dom元素上的事件 如：click、touch
         */
        this.bindEvents = function(){
            //this.ctx.canvas.addEventListener('click',tapHandler);
            this.on('_tap',tapHandler);
            if(this.config.datasetGesture){
                this.bindDataGestureEvent();
            }
        }
        /**
         * 初始化部分元素值
         */
        this.init = function(noAnim){
            if(this.config.datasetGesture && this.data.labels.length > _this.config.datasetOffsetNumber){
                this.chartData = this.sliceData(this.data,0,this.data.labels.length,this.config.datasetOffsetNumber);
            }else{
                this.chartData = this.data;
            }
            _this.initScale(true);
            if(noAnim){
                this.drawScale();
                this.drawLines(1);
            }else{
                this.doAnim(this.drawScale,this.drawLines);
            }
        }
        this.redraw = function(data){
            this.chartData = data;
            this.clear();
            this.initScale(true);
            this.drawScale();
            this.drawLines(1);
        }
        this.drawLines = function(animPc){
            if(animPc == 1)pointRanges = [];
            var ctx = _this.ctx,config = _this.config,dataset = _this.chartData.datasets,scale = _this.scaleData;
            _.each(dataset,function(set,i){
                ctx.strokeStyle = set.strokeColor;
                ctx.lineWidth = config.datasetStrokeWidth;
                ctx.beginPath();
                ctx.moveTo(scale.x, scale.y - animPc*(_this.calculateOffset(set.data[0],scale.yScaleValue,scale.yHop)))
                _.each(set.data,function(d,j){
                    var pointX = xPos(j),pointY = yPos(i,j);
                    if (config.bezierCurve){
                        ctx.bezierCurveTo(xPos(j-0.5),yPos(i,j-1),xPos(j-0.5),yPos(i,j),pointX,pointY);
                    }else{
                        ctx.lineTo(pointX,pointY);
                    }
                    if(animPc == 1){
                        pointRanges.push([pointX,pointY,j,i]);
                    }
                });
                ctx.stroke();
                if (config.datasetFill){
                    ctx.lineTo(scale.x + (scale.xHop*(set.data.length-1)),scale.y);
                    ctx.lineTo(scale.x,scale.y);
                    ctx.closePath();
                    ctx.fillStyle = set.fillColor;
                    ctx.fill();
                }
                else{
                    ctx.closePath();
                }
                if(config.pointDot){
                    ctx.fillStyle = set.pointColor;
                    ctx.strokeStyle = set.pointStrokeColor;
                    ctx.lineWidth = config.pointDotStrokeWidth;
                    _.each(set.data,function(d,k){
                        ctx.beginPath();
                        ctx.arc(scale.x + (scale.xHop *k),scale.y - animPc*(_this.calculateOffset(d,scale.yScaleValue,scale.yHop)),config.pointDotRadius,0,Math.PI*2,true);
                        ctx.fill();
                        ctx.stroke();
                    })
                }
            });

            function yPos(dataSet,iteration){
                return scale.y - animPc*(_this.calculateOffset(dataset[dataSet].data[iteration],scale.yScaleValue,scale.yHop));
            }
            function xPos(iteration){
                return scale.x + (scale.xHop * iteration);
            }
        }

        function tapHandler(x,y){
            var p = isInPointRange(x,y);
            if(p){
                _this.trigger('tap.point',[_this.chartData.datasets[p[3]].data[p[2]],p[2],p[3]]);
            }
        }

        function isInPointRange(x,y){
            var point,pb = _this.config.pointClickBounds;
            _.each(pointRanges,function(p){
                if(x >= p[0] - pb && x <= p[0] + pb && y >= p[1]-pb && y <= p[1] + pb){
                    point = p;
                    return false;
                }
            });
            return point;
        }

        //初始化参数
        if(cfg)this.initial(cfg);
    }
    _.Line = Line;
})(JChart)
;(function(_){
    function Bar(data,cfg){
        _.Scale.apply(this);
        var barRanges = [];//记录柱状图的占据的位置
        this._type_ = 'bar';
        var _this = this;
        this.data = data;//所有的数据
        this.chartData = null;//图表当前展示的数据
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
            animationSteps : 30,
            animationEasing : "easeOutQuart",
            onAnimationComplete : null,
            //是否可以对数据进行拖动
            datasetGesture : false,
            //每次显示的数据条数
            datasetOffsetNumber : 12
        }
        /**
         * 绑定canvas dom元素上的事件 如：click、touch
         */
        this.bindEvents = function(){
            this.on('_tap',function(x,y){tapHandler(x,y,'tap.bar')});
            //this.on('_doubleTap',function(x,y){tapHandler(x,y,'doubleTap.bar')});
            this.on('_longTap',function(x,y){tapHandler(x,y,'longTap.bar')});
            if(this.config.datasetGesture){
                this.bindDataGestureEvent();
            }
        }
        /**
         * 初始化部分元素值
         */
        this.init = function(noAnim){
            if(this.config.datasetGesture && this.data.labels.length > _this.config.datasetOffsetNumber){
                this.chartData = this.sliceData(this.data,0,this.data.labels.length,this.config.datasetOffsetNumber);
            }else{
                this.chartData = this.data;
            }
            this.initScale(true);
            if(noAnim){
                this.drawScale();
                this.drawBars(1);
            }else{
                this.doAnim(this.drawScale,this.drawBars);
            }
        }
        this.redraw = function(data){
            this.chartData = data;
            this.clear();
            this.initScale(true);
            this.drawScale();
            this.drawBars(1);
        }

        this.drawBars = function(animPc){
            if(animPc == 1)barRanges = [];
            var ctx = _this.ctx,config = _this.config,scale = _this.scaleData;
            ctx.lineWidth = config.barStrokeWidth;
            _.each(_this.chartData.datasets,function(set,i){
                ctx.fillStyle = set.fillColor;
                ctx.strokeStyle = set.strokeColor;
                _.each(set.data,function(d,j){
                    var x1 = scale.x + config.barValueSpacing + scale.xHop*j + scale.barWidth*i + config.barDatasetSpacing*i + config.barStrokeWidth* i,
                        y1 = scale.y,x2 = x1 + scale.barWidth,
                        y2 = scale.y - animPc*_this.calculateOffset(d,scale.yScaleValue,scale.yHop)+(config.barStrokeWidth/2);
                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x1, y2);
                    ctx.lineTo(x2,y2);
                    ctx.lineTo(x2, y1);
                    if(config.barShowStroke){
                        ctx.stroke();
                    }
                    ctx.closePath();
                    ctx.fill();
                    if(animPc == 1){
                        barRanges.push([x1,x2,y1,y2,j,i]);
                    }

                });
            })
        }

        function tapHandler(x,y,event){
            var p = isInBarRange(x,y);
            if(p){
                _this.trigger(event,[_this.chartData.datasets[p[5]].data[p[4]],p[4],p[5]]);
            }
        }

        function isInBarRange(x,y){
            var range;
            _.each(barRanges,function(r){
                if(x >= r[0] && x <= r[1] && y >= r[3] && y <= r[2]){
                    range = r;
                    return false;
                }
            });
            return range;
        }
        //初始化参数
        if(cfg)this.initial(cfg);
    }
    _.Bar = Bar;
})(JChart)
;(function(_){
    function Pie(data,cfg){
        _.Chart.apply(this);
        var angleRanges;//记录每个扇形的起始角度（从0开始）
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
            animationSteps : 30,
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
            angleRanges = [];
            _.each(_this.data,function(d,i){
                var start = angle;
                angle = angle + (d.value/segmentTotal) * (Math.PI*2);
                var end = angle;
                angleRanges.push([start,end,d,i]);
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
            _.each(angleRanges,function(a){
                drawSegment(a,animPercent,type);
            });
            if(_this.config.isDount && _this.config.dountText){
                drawText();
            }
        }

        /**
         * 计算扇形真实的其实角度
         */
        function calcSegmentAngle(range,percent,type){
            var start = range[0],
                end = range[1];
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
        function drawSegment(range,percent,type){
            var x = _this.width/2,
                y = _this.height/ 2,
                index = range[3];
            if(index == currentPullOutIndex){
                var midAngle = (range[0] + range[1])/2+startAngle;
                x += Math.cos(midAngle) * _this.config.pullOutDistance;
                y += Math.sin(midAngle) * _this.config.pullOutDistance;
            }
            var angle = calcSegmentAngle(range,percent,type);
            drawPiePart(x,y,pieRadius,angle.start,angle.end,_this.data[index]);
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
            this.on('_tap',function(x,y){tapHandler(x,y,'tap.pie')});
            //暂时关闭doubleTap事件
            //this.on('_doubleTap',function(x,y){tapHandler(x,y,'doubleTap.pie')});
            this.on('_longTap',function(x,y){tapHandler(x,y,'longTap.pie')});
            //添加一个默认点击事件
            this.on('tap.pie',function(){return true;})
        }

        function tapHandler(x,y,event){
            var type = _this.config.clickType;
            var angle = isInSegment(x,y);
            if(angle){
                if(event == 'tap.pie'){//处理一些默认行为
                    if(!_this.trigger(event,[angle[2],angle[3]]))return;
                    if(type == 'rotate'){
                        _this.rotate(angle[3]);
                    }else if(type == 'pullOut'){
                        _this.toggleSegment(angle[3]);
                    }
                }else{
                    _this.trigger(type,[angle[2],angle[3]]);
                }

            }
        }

        function isInSegment(offsetX,offsetY){
            var angle;
            var x = offsetX - _this.width/2;
            var y = offsetY - _this.height/2;
            //距离圆点的距离
            var dfc = Math.sqrt( Math.pow( Math.abs(x), 2 ) + Math.pow( Math.abs(y), 2 ) );
            var isInPie = (dfc <= pieRadius);
            if(isInPie && _this.config.isDount){//排除dount图中心区
                isInPie = (dfc >= pieRadius*_this.config.dountRadiusPercent);
            }
            if(!isInPie)return;

            var clickAngle = Math.atan2(y, x)-startAngle;
            if ( clickAngle < 0 ) clickAngle = 2 * Math.PI + clickAngle;
            if(clickAngle > 2 * Math.PI) clickAngle = clickAngle - 2 * Math.PI;

            _.each(angleRanges,function(a){
                if(clickAngle >= a[0] && clickAngle < a[1]){
                    angle = a;
                    return false;
                }
            });
            return angle;
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
            var middAngle = (angleRanges[i][0] + angleRanges[i][1]) / 2 + startAngle;
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
        this.init = function(noAnim){
            //计算半径(留10个像素)
            pieRadius = Math.min(_this.height/2,_this.width/2) - 10;
            segmentTotal = 0;
            currentPullOutIndex = -1;
            _.each(_this.data,function(d){
                segmentTotal += d.value;
            });
            calcAngel();
            if(noAnim){
                drawPie(1);
            }else{
                this.doAnim(null,drawPie);
            }
            startAngle = _this.config.startAngle;
        }

        this.load = function(data){
            this.data = data;
            this.init(true);

        }
        function drawText(){
            var ctx = _this.ctx;
            ctx.textBaseline = _this.config.dountTextBaseline;
            ctx.textAlign = _this.config.dountTextAlign;
            ctx.font = _this.config.dountTextFont;
            ctx.fillStyle = _this.config.dountTextColor;
            ctx.fillText(_this.config.dountText,_this.width/2,_this.height/2,pieRadius*_this.config.dountRadiusPercent);
        }

        //初始化参数
        if(cfg)this.initial(cfg);
    }
    _.Pie = Pie;
}(JChart));
