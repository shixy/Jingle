(function ($) {
    /**
     * If no touch events are available map touch events to corresponding mouse events.
     **/

    try {
        document.createEvent("TouchEvent");
    } catch (e) {
        var _fakeCallbacks = {}, // store the faked callbacks so that they can be unbound
            eventmap = {
                "touchstart": "mousedown",
                "touchend": "mouseup",
                "touchmove": "mousemove"
            };

        function touch2mouse(type, callback, context) {
            if ((typeof type) == "object") {
                // Assume we have been called with an event object.
                // Do not map the event.
                // TODO: Should this still try and map the event.
                return [type]
            }

            // remove the extra part after the .
            var p = type.match(/([^.]*)(\..*|$)/),
                orig = p[0],type = p[1], extra=p[2],
                mappedevent = eventmap[type];

            result = [(mappedevent||type)+extra]
            if (arguments.length > 1) {
                if (mappedevent) {
                    callback = fakeTouches(type, callback, context);
                }

                result.push(callback);
            }


            return result;
        }
        function fakeTouches(type, callback, context) {
            // wrap the callback with a function that adds a fake
            // touches property to the event.

            return _fakeCallbacks[callback] = function (event) {
                if(event.liveFired)context = this;//if it is delegate event,change context to target element
                if (event.button) {
                    return false;
                }
                event.touches = [{
                    length: 1,// 1 mouse (finger)
                    clientX: event.clientX,
                    clientY: event.clienty,
                    pageX: event.pageX,
                    pageY: event.pageY,
                    screenX: event.screenX,
                    screenY: event.screenY,
                    target: event.target
                }]

                event.touchtype = type;

                return callback.apply(context, [event]);
            }
        }

        var _bind = $.fn.bind;
        $.fn.bind = function(event, callback){
            return _bind.apply(this,  touch2mouse(event, callback, this));
        };
        var _unbind = $.fn.unbind;
        $.fn.unbind = function(event, callback){
            if (!event) {
                _unbind.apply(this);
                return;
            }
            var result = _unbind.apply(this, touch2mouse(event).concat([_fakeCallbacks[callback]||callback]));
            delete(_fakeCallbacks[callback]);
            return result;
        };
        var _one = $.fn.one;
        $.fn.one = function(event, callback){
            return _one.apply(this,  touch2mouse(event, callback, this));
        };
        var _delegate = $.fn.delegate;
        $.fn.delegate = function(selector, event, callback){
            return _delegate.apply(this, [selector].concat(touch2mouse(event, callback, this)));
        };
        var _undelegate = $.fn.undelegate;
        $.fn.undelegate = function(selector, event, callback){
            var result = _undelegate.apply(this, [selector].concat(touch2mouse(event), [_fakeCallbacks[callback]||callback]));
            delete(_fakeCallbacks[callback]);
            return result;
        };
        var _live = $.fn.live;
        $.fn.live = function(event, callback){
            return _live.apply(this,  touch2mouse(event, callback, this));
        };
        var _die = $.fn.die;
        $.fn.die = function(event, callback){
            var result = _die.apply(this,  touch2mouse(event).concat([_fakeCallbacks[callback]||callback]));
            delete(_fakeCallbacks[callback]);
            return result;
        };
        var _trigger = $.fn.trigger;
        $.fn.trigger = function(event, data){
            return _trigger.apply(this,  touch2mouse(event).concat([data]));
        };
        var _triggerHandler = $.fn.triggerHandler;
        $.fn.triggerHandler = function(event, data){
            return _triggerHandler.apply(this,  touch2mouse(event).concat([data]));
        };
//        var _on = $.fn.on;
//        $.fn.on = function(event, selector, callback){
//            return _on.apply(this,  touch2mouse(event).concat([selector]));
//        }
//        var _off = $.fn.off;

    }
})(Zepto);