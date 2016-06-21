define([
    'global',
    'views/view',
    'components/alert',
    'text!templates/user-manage-change-groups.html',
    'requests'
],
function (global, view, alert, template, requests) {

    return view.extend({

        initialize: function (opts) {
            $("body").addClass("no-scroll");
            this.$el.html("");

            this.site_id = opts.site_id;
            this.forum_id = opts.forum_id;
            this.user_id = opts.user_id;

            var that = this;

            function render() {
                global.get_current_user().then(function(current_user) {
                    that.$el.html(_.template(template)({groups: that.groups, curGroups: that.curGroups, me: current_user}));
                    that.curGroups && that.curGroups.forEach(function (x) {
                        that.$el.find('li[data-group-id="' + x.group_id + '"]').addClass("cur");
                    });
                });
            }

            function check_and_render() {
                global.get_current_user().then(function(current_user) {
                    if (that.groups) {
                        for (var i = 0; i < that.groups.length; i++) {
                            if (that.groups[i].form == 100) {
                                return render();
                            }
                        }
                    }
                    that.close();
                    alert.show("暂无可用标签");
                });
            }

            function readGroups() {
                //$.ajax({
                //    url: "/club/apiv1/forums/" + that.forum_id + "/site-groups",
                //    data: {is_used: true},
                //    success: function (data) {
                //        that.groups = data;
                //        check_and_render();
                //    }
                //})
                requests.getForumGroups(
                    {forum_id: that.forum_id},
                    {},
                    function (data) {
                        that.groups = data;
                        check_and_render();
                    }
                )

            }

            //$.ajax({
            //    url: "/club/apiv1/users/" + this.user_id,
            //    data: {site_id: that.site_id},
            //    success: function (data) {
            //        that.curGroups = data.groups;
            //        readGroups();
            //    }
            //})

            requests.getUserInfo(
                {user_id: this.user_id},
                {site_id: that.site_id},
                function (data) {
                    that.curGroups = data.groups;
                    readGroups();
                }
            );

            this.$el.on("click", function (ev) {
                if ($(ev.target).is("#user-manage-groups")) {
                    that.close()
                }
            })
        },

        views: {},

        events: {
            'click [data-role="cancel"]': 'close',
            'click [data-role="confirm"]': 'changeGroups',
            'click [data-group-id]': 'toggleGroups'
        },

        close: function () {
            this.$el.remove();
            $("body").removeClass("no-scroll");
        },

        toggleGroups: function (ev) {
            //this.$el.find("li.cur").removeClass("cur");
            $(ev.target).closest("[data-group-id]").toggleClass("cur");
        },

        changeGroups: function () {
            var that = this;
            var data = {
                group_ids: []
            };
            var groups = [];

            that.$el.find("li[data-group-id].cur").each(function (i) {
                var $elem = $(this);
                data.group_ids.push($elem.attr("data-group-id"));

                var group = $elem.data('group');
                groups.push(group);
            });

            if (this.forum_id) {
                data.forum_id = this.forum_id;
            }

            //$.ajax({
            //    url: "/club/apiv1/sites/" + that.site_id + "/users/" + that.user_id + '/groups',
            //    method: "POST",
            //    data: data,
            //    success: function () {
            //        that.close();
            //        alert.show("修改成功");
            //        that.trigger('updateGroupsSuccess', {groups: groups});
            //    },
            //    error: function () {
            //        alert.show("修改失败");
            //    }
            //})

            requests.changeUserGroup(
                {site_id: that.site_id, user_id: that.user_id},
                data,
                function () {
                    that.close();
                    alert.show("修改成功");
                    that.trigger('updateGroupsSuccess', {groups: groups});
                },
                function () {
                    alert.show("修改失败");
                }
            )

        }

    });
});
