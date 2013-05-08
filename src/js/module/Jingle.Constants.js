Jingle.Constants = (function(J){
    return {
        Events : {
            startEvent :J.hasTouch ? 'touchstart':'mousedown',
            moveEvent :J.hasTouch ? 'touchmove':'mousemove',
            endEvent :J.hasTouch ? 'touchend':'mouseup',
            tap :J.hasTouch ? 'tap':'click'
        }
    }
})(J)