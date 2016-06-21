define([
    'components/view',
    'global',
    'components/alert',
    'text!templates/side-bar.html',
    'text!templates/side-bar-nologin.html',
    'requests'
], function (view, global, alert, template, template_no_login, requests) {

    var hasTouch = 'ontouchstart' in window;
    var startEvent = hasTouch ? 'touchstart' : 'mousedown',
        moveEvent = hasTouch ? "touchmove" : 'mousemove',
        endEvent = hasTouch ? 'touchend touchcancel' : 'mouseup';
    return view.extend({

        /*
        * 侧边栏
        * show()                显示
        */
        initialize: function (opts) {
            var that = this;

            this.$el = $("#side-bar").size() > 0 ? $("#side-bar") : $("<div id='side-bar' class='side-bar'></div>").appendTo("body");
            this.$bg_el = $("#side-bar-bg").size() > 0 ? $("#side-bar-bg") : $("<div id='side-bar-bg' class='side-bar-bg'></div>").appendTo("body");

            this.$bg_el.on(startEvent, function (ev) {
                that.touch_start = $.extend({}, ev.originalEvent.touches&&ev.originalEvent.touches[0]);
            });

            this.$bg_el.on(moveEvent, function (ev) {
                that.touch_end = ev.originalEvent.touches && ev.originalEvent.touches[0];

                if ($("body").is(".no-scroll")) {
                    ev.stopPropagation();
                    ev.preventDefault();
                }
            });

            this.$bg_el.on(endEvent, function (ev) {
                var touch_end = that.touch_end;

                if (that.touch_start && that.touch_end) {
                    if (that.touch_start.clientX - touch_end.clientX > 30) {
                        that.show();
                    } else if (that.touch_start.clientX - touch_end.clientX < -30) {
                        ev.stopPropagation();
                        ev.preventDefault();
                        that.hide();
                    }
                }
                else {
                    that.hide();
                    ev.stopPropagation();
                    ev.preventDefault();
                }

                that.touch_end = null;
                that.touch_start = null;
            });
        },

        events: {
            "click [data-role='jump-login']": "jumpLogin",
            "click .sign-button": "sign"
        },

        jumpLogin: function () {
            window.location = '/club/apiv1/me/login?callback=' + window.encodeURIComponent(window.location);
        },

        sign: function() {
            var site_id = this.$('.sign').data("site-id"),
                user_id = this.$('.side-head').data("user-id"),
                data = {
                    'site_id': site_id,
                    'module': 'sign',
                    'submodule': '',
                    'action_id': 1,
                    'user_id': user_id
                };

            //$.ajax({
            //    url: "/club/apiv1/score/score_signal",
            //    method: "POST",
            //    data: data,
            //    success: function (data) {
            //        alert.show("签到成功");
            //        $('.sign-button').addClass('has-signed');
            //        $('.has-signed').html('<div class="icon-2 icon-signed"></div>已签到');
            //    },
            //    error: function (err) {
            //        alert.show("您已签到");
            //    }
            //});
            var that = this;
            requests.signIn(
                {},
                data,
                function (data) {
                    alert.show("签到成功");
                    that.$('.sign-button').addClass('has-signed');
                    that.$('.has-signed').html('<div class="icon-2 icon-signed"></div>已签到');
                },
                function (err) {
                    alert.show("您已签到");
                }
            )

        },

        show: function () {
            if (this.$el.is(".show")) {
                return;
            }
            this.delegateEvents();
            $("body").addClass("no-scroll");

            var that = this;

            global.get_current_user()
            .then(function(current_user) {
                that.$el.html(_.template(template)(data = current_user));
                global.getNoticeCount().then(function(count) {
                    if (count > 0) {
                        that.$el.find("[data-role='notice']").addClass('active');
                    }
                });
                global.getTipNoticeCount().then(function(count) {
                    if (count > 0) {
                        that.$el.find("[data-role='myreward']").addClass('active');
                    }
                });
                global.getUnreadChatsCount().then(function(count) {
                    if (count > 0) {
                        that.$el.find("[data-role='chat']").addClass('active');
                    }
                });
                that.$bg_el.show();
                that.$el.removeClass("hide").addClass("show");
            })
            .catch(function() {
                that.$el.html(_.template(template_no_login)());
                that.$bg_el.show();
                that.$el.removeClass("hide").addClass("show");
            });
        },

        hide: function () {
            if (!this.$el.is(".show")) {
                return;
            }

            $("body").removeClass("no-scroll");
            $(".main-content").removeClass("filter_blur");
            this.$bg_el.hide();
            this.$el.addClass("hide").removeClass("show");
        }

    });
});
