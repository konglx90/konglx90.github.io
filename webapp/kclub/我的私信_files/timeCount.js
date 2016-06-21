define([
], function () {
    var timeCount = function (DOM) {
        var DOM = DOM || $(".topic-list");
        var timers = DOM.find(".label-value.vote-time-count");
        setInterval(function () {
            timers.each(function () {
                var start_arr = $(this).data("start-time").split(/[- T : .]/);
                var end_arr = $(this).data("end-time").split(/[- T : .]/);
                var startTime = new Date(start_arr[0], start_arr[1] - 1, start_arr[2], start_arr[3], start_arr[4]);
                var endTime = new Date(end_arr[0], end_arr[1] - 1, end_arr[2], end_arr[3], end_arr[4]);
                var $el = $(this);
                var nowTime = new Date();
                if (startTime > nowTime) {
                    var t = startTime.getTime() - nowTime.getTime();
                    var d = parseInt(t / 1000 / 60 / 60 / 24);
                    var h = parseInt(t / 1000 / 60 / 60 % 24);
                    var m = parseInt(t / 1000 / 60 % 60);
                    var s = parseInt(t / 1000 % 60);
                    console.log($(this).find('.vote-html'));
                    $el.html('<div class="label-name">距离活动开始: </div><span class="time-count"> ' +
                        d + "天" + h + "时" + m + "分" + s + '秒</span>');
                } else if (nowTime < endTime) {
                    var t = endTime.getTime() - nowTime.getTime();
                    var d = parseInt(t / 1000 / 60 / 60 / 24);
                    var h = parseInt(t / 1000 / 60 / 60 % 24);
                    var m = parseInt(t / 1000 / 60 % 60);
                    var s = parseInt(t / 1000 % 60);
                    $el.html('<div class="label-name">距离活动结束: </div><span class="time-count"> ' +
                        d + "天" + h + "时" + m + "分" + s + '秒</span>');
                } else {
                    $el.parents('.info-time').remove();
                }
            });
        }, 1000);
    };
    return timeCount;
});


