;(function(){
    function slider(selector,noDots){
        var gestureStarted = false,
            index = 0,
            speed = 300,
            wrapper = $(selector),
            dots,
            container,
            slides,
            slideNum,
            slideWidth,
            deltaX;

        /**
         * 初始化容器大小
         */
        var _init = function() {
            wrapper.css('overflow','hidden');
            container = wrapper.children().first();
            slides = container.children();
            slideNum = slides.length;
            slideWidth = wrapper.offset().width;
            container.css('width',slideNum * slideWidth);

            slides.css({
                    'width':slideWidth,
                    'display':'table-cell',
                    'verticalAlign' : 'top'
            })
            if(!noDots)_initDots();
            _slide(0, 0);
        };

        var _initDots = function(){
            dots = wrapper.find('.dots');
            if(dots.length>0){
                dots.show();
            }else{
                var dotsWidth = slideNum*30+20+2;
                var html = '<div class="dots"><ul>';
                for(var i=0;i<slideNum;i++){
                    html +='<li index="'+i+'"><a href="#"></a></li>'
                }
                html += '</ul></div>';
                wrapper.append(html);
                dots = wrapper.find('.dots');
                dots.children().css('width',dotsWidth+'px');
                dots.find('li').on('tap',function(){
                    var index = $(this).attr('index');
                    _slide(parseInt(index), speed);
                })
            }
        }

        /**
         * 滑动到指定卡片
         * @param i
         * @param duration
         * @private
         */
        var _slide = function(i, duration) {
            duration = duration || speed;
            container.animate({
                translateX : -(i * slideWidth)+'px'
            },duration)
            index = i;
            if(dots) $(dots.find('li').get(index)).addClass('active').siblings().removeClass('active');
        };

        /**
         * 绑定滑动事件
         */
        var _bindEvents = function() {
            container.on('touchstart',_touchStart,false);
            container.on('touchmove',_touchMove,false);
            container.on('touchend',_touchEnd,false);
            //屏幕旋转时重新计算大小
            $(window).on('resize',_init);
        };

        var  _touchStart = function(event) {
            var e = event.touches[0];
            start = {
                pageX: e.pageX,
                pageY: e.pageY,
                time: Number(new Date())
            };
            isScrolling = undefined;
            deltaX = 0;
            container[0].style.webkitTransitionDuration = 0;
            gestureStarted = true;
            //阻止事件冒泡
            event.stopPropagation();
        };

        var _touchMove = function(event) {
            if(!gestureStarted)return;
            var e = event.touches[0];
            deltaX = e.pageX - start.pageX;
            if ( typeof isScrolling == 'undefined') {
                //根据X、Y轴的偏移量判断用户的意图是左右滑动还是上下滑动
                isScrolling = !!( isScrolling || Math.abs(deltaX) < Math.abs(e.pageY - start.pageY) );
            }
            if (!isScrolling) {
                event.preventDefault();
                var factor = ((!index && deltaX > 0 || index == slideNum - 1 && deltaX < 0) ?(Math.abs(deltaX)/slideWidth + 1):1);
                deltaX = deltaX / factor;
                var pos = (deltaX - index * slideWidth);
                container[0].style.webkitTransform = 'translateX('+pos+'px)';
                event.stopPropagation();
            }
        };

        var _touchEnd = function(e) {
            //判定是否跳转到下一个卡片
            //滑动时间小于250ms或者滑动X轴的距离大于屏幕宽度的1/3
            var isValidSlide = Number(new Date()) - start.time < 250 && Math.abs(deltaX) > 20 || Math.abs(deltaX) > slideWidth/3;
            //判定是否达到了边界即第一个右滑、最后一个左滑
            var isPastBounds = !index && deltaX > 0 || index == slideNum - 1 && deltaX < 0;
            if (!isScrolling) {
                _slide( index + ( isValidSlide && !isPastBounds ? (deltaX < 0 ? 1 : -1) : 0 ), speed );
            }
            gestureStarted = false;
            e.stopPropagation();
        };


        _init();
        _bindEvents();

        this.refresh = function(){
            container.attr('style','');
            _init();
        };

        this.prev = function() {
            if (index) _slide(index-1, speed);
        };

        this.next = function() {
            if(index < slideNum-1){
                _slide(index+1, speed);
            }
        };
        this.index = function(i) {
            _slide(i);
        };
    }
    J.Slider = slider;
}())