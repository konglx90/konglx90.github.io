define([
    'components/view',
    'components/face/face-config',
    'text!templates/face.html'
], function (view, config, template) {
    var hasTouch = 'ontouchstart' in window;
    var startEvent = hasTouch ? 'touchstart' : 'mousedown',
        moveEvent = hasTouch ? "touchmove" : 'mousemove',
        endEvent = hasTouch ? 'touchend touchcancel' : 'mouseup';

    return view.extend({

        initialize: function (opts) {
            this.display = ["default", "animate"];
            if (opts && opts.display)
                this.display = opts.display;
            this.pageSize = opts.pageSize || 27;
            this.$el.html(template);
            this.$head = this.$el.find("[data-role='face-head']");
            this.$panel = this.$el.find("[data-role='face-panel']");
            this.initFaceHead();
            this.setFaceList("default");
            this.preventDefault = typeof(opts.preventDefault)==="undefined"?true:opts.preventDefault;
            var $list = this.$panel.find("[data-role='face-list']");

            var that = this;
            this.$el.on(startEvent, function (ev) {
                if (ev.originalEvent.touches) {
                    that.touch_start = $.extend({}, ev.originalEvent.touches[0]);
                }
                else {
                    that.touch_start = {'clientX': ev.originalEvent.clientX}
                }

                //ev.stopPropagation();

            });
            this.$el.on(moveEvent, function (ev) {
                if (that.touch_start) {
                    if (ev.originalEvent.touches) {
                        that.touch_end = ev.originalEvent.touches[0];
                    }
                    else {
                        that.touch_end = {'clientX': ev.originalEvent.clientX}
                    }
                    //ev.stopPropagation();
                    if (that.preventDefault) {
                        ev.preventDefault();
                    }
                }

            });
            this.$el.on(endEvent, function (ev) {
               // ev.stopPropagation();
                var touch_end = that.touch_end;

                if (that.touch_start && that.touch_end) {
                    if (that.touch_start.clientX - touch_end.clientX > 30) {
                        that.next();
                    } else if (that.touch_start.clientX - touch_end.clientX < -30) {
                        that.prev();
                    }
                }
                that.touch_end = null;
                that.touch_start = null;

            });


        },
        events: {
            'click [data-role="face-list"]': 'clickFace',
            "click [data-list-name]": "clickFaceListName"

        },
        clickFaceListName: function (ev) {
            this.setFaceList($(ev.target).data("list-name"));
        },
        next: function (ev) {
            if (this.recordCount > (this.pageIndex + 1) * this.pageSize) {
                this.pageIndex++;
                this.changePage(this.pageIndex);
            }

        },
        prev: function () {
            if (this.pageIndex > 0) {
                this.pageIndex--;
                this.changePage(this.pageIndex);
            }
        },
        clickFace: function (ev) {
            var $tar = $(ev.target).closest("[data-face]");
            if ($tar.size() <= 0)
                return;
            var data = $tar.data('face');
            var group = $tar.data('group');
            var txt = _.template(config.config[group]["text-disp"])({face: data});
            //console.log(txt);
            this.trigger("clickface", txt);
        },
        setFaceList: function (list_name) {

            this.pageIndex = 0;

            this.faceList = list_name;
            this.$head.find("[data-list-name]").removeClass("cur");
            this.$head.find("[data-list-name='" + list_name + "']").addClass("cur");
            this.recordCount = config.sort[list_name].length;

            var pageCount = Math.ceil(this.recordCount / this.pageSize);

            var $list = this.$panel.find("[data-role='face-list']").html("").css("width", pageCount * 100 + "%");
            var html = "<ul>";
            for (var i = 0; i < this.recordCount; i++) {
                if (i > 0 && i % this.pageSize == 0) {
                    html += '</ul><ul>';
                }
                if (config.sort[this.faceList][i]) {
                    html += "<li data-group='" + this.faceList + "' data-face='" + config.sort[this.faceList][i] + "'><img src='" + config.config[this.faceList].path + config.dict[this.faceList][config.sort[this.faceList][i]] + "'/></li>";
                }

            }
            html += '</ul>';
            $list.html(html);
            $list.find("ul").css("width", parseInt(100 / pageCount) + "%");
            this.changePage(0);
        },
        changePage: function (index) {
            var pageCount = Math.ceil(this.recordCount / this.pageSize);

            var $list = this.$panel.find("[data-role='face-list']");
            $list.css("transform", "translate(" + parseInt(0 - 100 * index / pageCount) + "%,0)");

            this.pageIndex = index;
            var $page = this.$panel.find("[data-role='face-paging']").html("");


            for (var i = 0; i < pageCount; i++) {
                $page.append("<li class='" + (i === this.pageIndex ? "cur" : "") + "'>" + (i + 1) + "</li>");
            }
        },
        initFaceHead: function () {
            var that = this;
            this.display.forEach(function (o) {
                that.$head.find('ul').append("<li data-list-name='" + o + "'>" + config.config[o].title + "</li>");
            })

        }

    });
});
