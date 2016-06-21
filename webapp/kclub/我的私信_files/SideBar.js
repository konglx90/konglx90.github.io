define([
    'components/view',
    'global',
    'components/alert',
    'requests',
    'text!templates/side-bar.ejs'
], function (view, global, alert, requests, tpl_side_bar) {

    var hasTouch = 'ontouchstart' in window;
    var startEvent = hasTouch ? 'touchstart' : 'mousedown',
        moveEvent = hasTouch ? "touchmove" : 'mousemove',
        endEvent = hasTouch ? 'touchend touchcancel' : 'mouseup';
    return view.extend({
        /*
        * 侧边栏
        * show()                显示
        * hide()                隐藏
        * 需要在html文件中添加 <div id="side-bar-container"></div>
        *
        * 根据 side-bar--backdrop dom是否有 active class 来判断是否显示
        *
        */
        tagName: 'div',
        id: 'sidebar-container',
        template: _.template(tpl_side_bar),

        initialize: function (opts) {
            console.log('sidebar init');
            var that = this;
            opts = opts || {};
            global.get_current_user()
                .then(function(current_user){
                    that.user = current_user;
                    global.getUnreadChatsCount().then(function(count) {
                        if (count > 0) {
                            that.user['msg-count'] = count
                        }
                        that.render()
                    });
                })
                .catch(function(err){
                    console.log(err);
                    that.render();
                });

            //this.$el = $("#side-bar").size() > 0 ? $("#side-bar") : $("<div id='side-bar' class='side-bar'></div>").appendTo("body");
            //this.$bg_el = $("#side-bar-bg").size() > 0 ? $("#side-bar-bg") : $("<div id='side-bar-bg' class='side-bar-bg'></div>").appendTo("body");

            //this.$bg_el.on(startEvent, function (ev) {
            //    that.touch_start = $.extend({}, ev.originalEvent.touches&&ev.originalEvent.touches[0]);
            //});
            //
            //this.$bg_el.on(moveEvent, function (ev) {
            //    that.touch_end = ev.originalEvent.touches && ev.originalEvent.touches[0];
            //
            //    if ($("body").is(".no-scroll")) {
            //        ev.stopPropagation();
            //        ev.preventDefault();
            //    }
            //});
            //
            //this.$bg_el.on(endEvent, function (ev) {
            //    var touch_end = that.touch_end;
            //
            //    if (that.touch_start && that.touch_end) {
            //        if (that.touch_start.clientX - touch_end.clientX > 30) {
            //            that.show();
            //        } else if (that.touch_start.clientX - touch_end.clientX < -30) {
            //            ev.stopPropagation();
            //            ev.preventDefault();
            //            that.hide();
            //        }
            //    }
            //    else {
            //        that.hide();
            //        ev.stopPropagation();
            //        ev.preventDefault();
            //    }
            //
            //    that.touch_end = null;
            //    that.touch_start = null;
            //});
        },

        events: {
            //"click [data-role='jump-login']": "jumpLogin",
            "click .js-sign": "sign",
            "click .side-bar--backdrop": "backdrop_click",
        },

        render: function(){
            this.$el.html(this.template({user: this.user || {}}));
            if (document.getElementById(this.id)) {
                $('#' + this.id).replaceWith(this.$el);
            } else {
                $('body').append(this.el);
            }
            this.delegateEvents();
        },

        jumpLogin: function () {
            //window.location = '/club/apiv1/me/login?callback=' + window.encodeURIComponent(window.location);
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
            var that = this;
            if (this.el.style.display || this.is_animating()) {
                return;
            }

            var $backdrop = this.$el.find('.side-bar--backdrop');
            var $side_bar = this.$el.find('.side-bar');

            $backdrop.addClass("active");
            $backdrop.animateCss('fadeIn');
            $backdrop.show();

            $side_bar.animateCss('fadeInRight');
            $side_bar.show();

            $("body").addClass("no-scroll");

            //var that = this;

            //global.get_current_user()
            //.then(function(current_user) {
            //    that.$el.html(_.template(template)(data = current_user));
            //    global.getNoticeCount().then(function(count) {
            //        if (count > 0) {
            //            that.$el.find("[data-role='notice']").addClass('active');
            //        }
            //    });
            //    global.getTipNoticeCount().then(function(count) {
            //        if (count > 0) {
            //            that.$el.find("[data-role='myreward']").addClass('active');
            //        }
            //    });
            //    global.getUnreadChatsCount().then(function(count) {
            //        if (count > 0) {
            //            that.$el.find("[data-role='chat']").addClass('active');
            //        }
            //    });
            //    that.$bg_el.show();
            //    that.$el.removeClass("hide").addClass("show");
            //})
            //.catch(function() {
            //    that.$el.html(_.template(template_no_login)());
            //    that.$bg_el.show();
            //    that.$el.removeClass("hide").addClass("show");
            //});
        },

        hide: function () {
            if (!this.$el.find('.side-bar--backdrop').hasClass('active') || this.is_animating()){
                return
            }
            var $side_bar = this.$el.find('.side-bar');
            var $backdrop = this.$el.find('.side-bar--backdrop');
            $side_bar.animateCss('fadeOutRight', function(){
                $side_bar.hide();
            });
            $("body").removeClass("no-scroll");
            $backdrop.removeClass("active");
            $backdrop.animateCss('fadeOut', function(){
                $backdrop.hide()
            });
            //$(".main-content").removeClass("filter_blur");
            //this.$bg_el.hide();
            //this.$el.addClass("hide").removeClass("show");
        },
        backdrop_click: function(ev) {
            var backdrop = ev.target;
            if (!$(backdrop).hasClass('active') || this.is_animating()) {
                return
            }
            this.hide()
        },

        sign: function(ev){
            requests.signIn(
                null,
                null,
                function(){
                    $(ev.target).text('已签到')
                },
                function(){}
            )
        },

        /*
        * tool function
        * */
        is_animating: function() {
            return this.$el.find('.side-bar--animate').hasClass('animated');
        }

    });
});
