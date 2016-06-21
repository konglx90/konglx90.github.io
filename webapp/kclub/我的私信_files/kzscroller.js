define([
], function() {

    var _dpr = $('html').data('dpr') || 1;

    var scroll_wrapper = function() {};
    var _scroll_dict = {};

    scroll_wrapper.check_and_register = function(id, context, callback) {
        if (_scroll_dict[id]) {
            console.log('scroll id: ' + id + 'is already exist');
            return;
        }
        var scrollHandler = function () {
            var h = document.body.clientHeight;
            var screen_h = window.screen.availHeight * _dpr;
            //下拉到底部10像素以内
            if (window.scrollY + screen_h + 10 > h && context && !context.loading) {
                if (callback) {
                    callback()
                }
            }

        };
        _scroll_dict[id] = scrollHandler;
        $(window).scroll(scrollHandler);
    };

    scroll_wrapper.remove = function(id) {
        if (_scroll_dict[id]) {
            $(window).off("scroll", _scroll_dict[id]);
            delete _scroll_dict[id];
        }
        else {
            console.log('scroll id: ' + id + 'does not exist');
        }
    };

    return scroll_wrapper;
});


