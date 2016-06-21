define([
    'global',
    'utils/wx'
], function (global, wx) {

    function whichTransitionEvent() {
        var t;
        var el = document.createElement('fakeelement');
        var transitions = {
            'transition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'MozTransition': 'transitionend',
            'WebkitTransition': 'webkitTransitionEnd'
        }

        for (t in transitions) {
            if (el.style[t] !== undefined) {
                return transitions[t];
            }
        }
    }

    /* Listen for a transition! */

    var windowResizeHandler = null;

    var imageViewer = {
        init: function (el) {
            var that = this;
            this.$el = $("#imageView").size() > 0 ? $("#imageView") : $("<div id='imageView' class='image-viewer'><div class='view'></div><div class='paging'></div><div class='close'><span class='icon-close'></span></div></div>").appendTo("body");
            this.$contentEl = this.$el.find(".view");
            this.$paging = this.$el.find(".paging");
            this.bindEvents();

            $(el).delegate("[data-role='pic-list']", "click", function (ev) {
                //console.log(this);
                var current = $(ev.target).closest('[data-origin]').data("origin");
                if (ev.target.tagName !== "IMG") {
                    return;
                }
                var $all = $(this).find('[data-origin]');

                that.all = [];
                that.index = 0;

                $all.each(function (i, o) {
                    var url = $(o).data("origin");
                    if (current == url) {
                        that.index = i;
                    }
                    that.all[i] = url;
                });

                that.show();
            });

            $(window).on('hashchange', function () {
                if (window.location.hash == "") {
                    that.close();
                }
            });
        },

        bindEvents: function () {
            var that = this;
            var hasTouch = 'ontouchstart' in window;
            var startEvent = hasTouch ? 'touchstart' : 'mousedown',
                moveEvent = hasTouch ? "touchmove" : 'mousemove',
                endEvent = hasTouch ? 'touchend' : 'mouseup';

            this.$el.find('.close').on('click', function (ev) {
                setTimeout(function () {
                    that.back();
                }, 300);
            });

            this.$el.on(startEvent, function (ev) {

                if (ev.originalEvent.touches && ev.originalEvent.touches.length == 1) {
                    that.touch_start = $.extend({}, ev.originalEvent.touches[0]);
                    ev.preventDefault();
                    ev.stopPropagation();
                    that.startTime = new Date().getTime();
                    that.image_top = parseInt(that.$el.find('img').position().top);
                } else if (ev.originalEvent.touches.length == 2) {
                    var x1 = ev.originalEvent.touches[0].pageX,
                        x2 = ev.originalEvent.touches[1].pageX,
                        y1 = ev.originalEvent.touches[0].pageY,
                        y2 = ev.originalEvent.touches[1].pageY;
                    that.startSize = (x1 - x2) * (y1 - y2);
                }
            });

            this.$el.on(moveEvent, function (ev) {

                ev.stopPropagation();
                ev.preventDefault();
                //alert(2);
                if (ev.originalEvent.touches && ev.originalEvent.touches.length == 1) {
                    that.touch_end = ev.originalEvent.touches && ev.originalEvent.touches[0];
                    var offset_top = (that.image_top + (that.touch_end.clientY - that.touch_start.clientY) );
                    var max = that.$el.find('img').height() * that.scale - that.$el.height();
                    max = max < 0 ? 0 : max;

                    if (max > -offset_top && offset_top < 0) {
                        //console.log(-offset_top);
                        that.trans_y = offset_top;
                    } else if (offset_top > 0) {
                        that.trans_y = 0;
                    } else if (max <= -offset_top) {
                        that.trans_y = -max;
                    }
                    that.setTranslate(false);

                } else if (ev.originalEvent.touches && ev.originalEvent.touches.length == 2) {
                    /*var x1 = ev.originalEvent.touches[0].pageX,
                     x2 = ev.originalEvent.touches[1].pageX,
                     y1 = ev.originalEvent.touches[0].pageY,
                     y2 = ev.originalEvent.touches[1].pageY;

                     that.endSize = (x1 - x2) * (y1 - y2);
                     if (that.endSize / that.startSize > 2) {
                     that.scale = 2;
                     } else if (that.endSize / that.startSize <= .5) {
                     that.scale = 1;
                     }
                     that.setTranslate(true);*/
                    that.istouch = true;
                }
            });

            this.$el.on(endEvent, function (ev) {
                ev.stopPropagation();
                ev.preventDefault();
                if (!that.touch_end && !that.istouch) {
                    setTimeout(function () {
                        that.back();
                    }, 300);
                    return;
                }
                //that.duration = new Date().getTime() -that.startTime;
                var offset_top = (that.image_top + 1.5 * (that.touch_end.clientY - that.touch_start.clientY) );
                var max = that.$el.find('img').height() * that.scale - that.$el.height();
                max = max < 0 ? 0 : max;

                if (max > -offset_top && offset_top < 0) {
                    //console.log(-offset_top);
                    that.trans_y = offset_top;
                } else if (offset_top > 0) {
                    that.trans_y = 0;
                } else if (max <= -offset_top) {
                    that.trans_y = -max;
                }
                that.setTranslate(true);

                var touch_end = that.touch_end;
                if (that.touch_start && that.touch_end) {
                    if (that.touch_start.clientX - touch_end.clientX > 40) {
                        that.next();
                    } else if (that.touch_start.clientX - touch_end.clientX < -40) {
                        that.prev();
                    } else if (Math.abs(that.touch_start.clientX - touch_end.clientX) < 10 && Math.abs(that.touch_start.clientY - touch_end.clientY) < 10) {
                        setTimeout(function () {
                            that.back();
                        }, 300);
                    }
                }

                that.touch_end = null;
                that.touch_start = null;
                that.istouch = false;
            });
        },

        next: function () {
            if (this.index < this.all.length - 1) {
                this.index++;
                this.displayImage();
            }
        },

        prev: function () {
            if (this.index > 0) {
                this.index--;
                this.displayImage();
            }
        },

        show: function () {
            var current = this.all[this.index];
            if (!current) {
                return;
            }

            if (global.is_weixin) {
                try {
                    wx.preview_image(current, this.all);
                    return;
                }
                catch (err) {
                }
            }

            // else or err
            window.location.hash = "#showImage";
            this.$el.show();
            $("body").addClass("no-scroll");
            this.displayImage();

            var that = this;
            windowResizeHandler = function () {
                that.displayImage();
            };
            $(window).resize(windowResizeHandler);
        },

        close: function () {
            if (windowResizeHandler) {
                $(window).unbind("resize", windowResizeHandler);
            }
            this.$el.find('img').removeAttr("style");
            $("body").removeClass("no-scroll");
            this.$el.hide();
        },

        back: function () {
            if (window.location.hash == "#showImage") {
                window.history.back();
            }
            else {
                this.close();
            }
        },

        displayImage: function () {
            var current = this.all[this.index];
            if (!current) {
                return;
            }

            this.now = Date.now();
            var now = this.now;

            this.$paging.html("<span> " + (this.index + 1) + " / " + this.all.length + "</span>");
            this.$paging.show();
            this.showLoading();

            var that = this;
            var img = new Image();

            img.onload = function () {
                var hasTouch = 'ontouchstart' in window;
                var w = img.width,
                    h = img.height,
                    s_w = window.innerWidth > 640 ? 640: window.innerWidth,
                    s_h = window.innerHeight, scale, display_w, display_h;
                if (!hasTouch) {
                    scale = s_w < s_h ? w / s_w : h / s_h;
                    display_w = s_w < s_h ? scale < 1 ? w : s_w : w / scale;
                    display_h = s_w < s_h ? scale < 1 ? h : h / scale : s_h;
                } else {
                    scale = w / s_w;
                    display_w = scale < 1 ? w : s_w;
                    display_h = scale < 1 ? h : h / scale;
                }

                offset_top = display_h > s_h ? 0 : (s_h - display_h) / 2,
                    offset_left = display_w > s_w ? 0 : (s_w - display_w) / 2;

                //console.log(display_w, display_h);
                that.$contentEl.html("<img src='" + current + "'>").find("img").css({
                    width: display_w,
                    height: display_h,
                    "margin-top": offset_top + 'px',
                    "margin-left": offset_left + 'px'
                });
                that.trans_x = 0;
                that.trans_y = 0;
                that.scale = 1;

                setTimeout(function () {
                    if (now === that.now) {
                        that.$paging.hide();
                    }
                }, 1000);
            }

            img.onerror = function () {
                that.$contentEl.html("<span>图片加载失败</span>");
            }

            img.src = current;
        },

        setTranslate: function (withtransition) {
            this.$el.find('img').css({
                "transform": "translate(" + this.trans_x + "px," + this.trans_y + "px) scale(" + this.scale + ")",
                "-webkit-transform": "translate(" + this.trans_x + "px," + this.trans_y + "px) scale(" + this.scale + ")",
                "transition": withtransition ? "transform 600ms cubic-bezier(0.1, 0.57, 0.1, 1)" : " none",
                "-webkit-transition": withtransition ? "-webkit-transform 600ms cubic-bezier(0.1, 0.57, 0.1, 1)" : " none"
            });
        },

        showLoading: function () {
            this.$contentEl.html("<span class='loading loading-black'></span>");
        }
    }

    return imageViewer;
})
