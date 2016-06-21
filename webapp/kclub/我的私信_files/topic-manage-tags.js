define([
    'global',
    'views/view',
    'components/alert',
    'text!templates/topic-manage-tag.html',
    'requests'
],
function (global, view, alert, template, requests) {
    return view.extend({

        initialize: function (opts) {
            this.$el.html("");
            //this.$el.on("touchmove", function (ev) {
            //    ev.preventDefault();
            //    ev.stopPropagation();
            //});
            var that = this;
            this.topic_id = opts.topic_id;
            this.context = opts.context;

            $("body").addClass("no-scroll");

            function render() {
                global.get_current_user().then(function(current_user) {
                    that.$el.html(_.template(template)({tags: that.tags, curTags: that.curTags, me: current_user}));

                    that.curTags && that.curTags.forEach(function (x) {
                        that.$el.find('li[data-tag-id="' + x.tag_id + '"]').addClass("cur");
                    });
                });
            }

            function check_and_render() {
                global.get_current_user().then(function(current_user) {
                    if (that.tags) {
                        for (var i = 0; i < that.tags.length; i++) {
                            if (that.tags[i].tag_id!= "ORDINARY" && that.tags[i].tag_id!= "ANNOUNCEMENT" && that.tags[i].tag_id!= "PIC_SHOW" && that.tags[i].tag_id!= "ACTIVITY" && that.tags[i].is_used) {
                                return render();
                            }
                        }
                    }
                    that.close();
                    alert.show("暂无可用标签");
                });
            }

            function readTags() {
                //$.ajax({
                //    url: "/club/apiv1/forums/" + that.forum_id + "/tags",
                //    success: function (data) {
                //        that.tags = data;
                //        check_and_render();
                //    }
                //})

                requests.getForumTags(
                    {forum_id: that.forum_id},
                    {},
                    function (data) {
                        that.tags = data;
                        check_and_render();
                    }
                )

            }

            //$.ajax({
            //    url: "/club/apiv1/topics/" + this.topic_id,
            //    success: function (data) {
            //        that.curTags = data.tags;
            //        that.forum_id = data.forum_id;
            //        readTags();
            //    }
            //})

            requests.getTopic(
                {topic_id: that.topic_id},
                {},
                function (data) {
                    that.curTags = data.tags;
                    that.forum_id = data.forum_id;
                    readTags();
                }
            );



            this.$el.on("click", function (ev) {
                if ($(ev.target).is("#topic-manage-tags")) {
                    that.close()
                }
            })
        },

        views: {},

        events: {
            'click [data-role="cancel"]': 'close',
            'click [data-role="confirm"]': 'changeTags',
            'click [data-tag-id]': 'toggleTags'
        },

        close: function () {
            this.$el.remove();
            $("body").removeClass("no-scroll");
        },

        toggleTags: function (ev) {
            //this.$el.find("li.cur").removeClass("cur");
            $(ev.target).closest("[data-tag-id]").toggleClass("cur");
        },

        changeTags: function () {
            var that = this;
            var data = {
                tag_ids: []
            };
            var tags = [];

            that.$el.find("li[data-tag-id].cur").each(function (i) {
                var $elem = $(this);
                data.tag_ids.push($elem.attr("data-tag-id"));

                var tag = $elem.data('tag');
                tags.push(tag);
            });

            //$.ajax({
            //    url: "/club/apiv1/topics/" + that.topic_id + "/tags",
            //    method: "POST",
            //    data: data,
            //    success: function () {
            //        that.close();
            //        alert.show("修改成功");
            //        that.trigger('updateSuccess', {tags: tags});
            //    },
            //    error: function () {
            //        alert.show("修改失败");
            //    }
            //})

            requests.modifyTopic(
                {topic_id: that.topic_id},
                {},
                function () {
                    that.close();
                    alert.show("修改成功");
                    that.trigger('updateSuccess', {tags: tags});
                },
                function () {
                    alert.show("修改失败");
                }
            )
        }
    });
});
