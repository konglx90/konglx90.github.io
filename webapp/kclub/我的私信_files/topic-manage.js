define([
    'global',
    'components/view',
    'components/alert',
    'views/topic-manage-tags',
    'views/user-manage-groups',
    'components/topic-share',
    'utils/tools',
    'text!templates/topic-manage.html',
    'requests'
],
function (global, view, alert, TopicManageTags, UserManageGroups, TopicShare, utils, template, requests) {

    var role = {
        topic_manage: {
            anonymous: ['share', 'hide', "im-user",'report'],
            self: ['share', "del"],
            manager: ['share', 'hide', "del", 'stick', 'unstick', "update-tag", "im-user", "banning", "unbanning", 'blacklist', 'unblacklist', 'update-user-tags', 'starring', 'unstarring', 'report'],
            owner: ['share', 'hide', "del", 'stick', 'unstick', "update-tag", "im-user", "banning", "unbanning",'set-admin', 'unset-admin', 'blacklist', 'unblacklist', 'update-user-tags', 'starring', 'unstarring', 'report'],
            others: ['share', 'hide', "im-user", 'report']
        },
        reply_manage: {
            anonymous: [],
            self: ["del-reply"],
            manager: ["del-reply", "im-user", "banning", "unbanning",'blacklist', 'unblacklist', 'update-user-tags'],
            owner: ["del-reply", "im-user", "banning", "unbanning",'set-admin', 'unset-admin', 'blacklist', 'unblacklist', 'update-user-tags'],
            others: ["im-user"]
        }
    };

   
    return view.extend({

        /*
        * 话题管理栏
        * init参数
        *   $el                 挂载dom节点
        *   context             上下文
        */
        initialize: function (opts) {
            var that = this;

            this.context = opts.context;

            this.$el.html(template);
            this.$el.on("click", function (ev) {
                if ($(ev.target).is("#topic-manage")) {
                    that.close()
                }
            });

            this.views["topicShare"] = new TopicShare({
                el: "#topic-share"
            });
        },

        views: {},

        events: {
            'click [data-role="cancel"]': 'close',
            'click [data-role="hide"]': 'hideTopic',
            'click [data-role="del"]': 'delTopic',
            'click [data-role="del-reply"]': 'delReply',
            'click [data-role="stick"]': 'stickTopic',
            'click [data-role="unstick"]': 'unstickTopic',
            'click [data-role="update-tag"]': 'showManageTag',
            'click [data-role="im-user"]': 'imUser',
            'click [data-role="set-admin"]': 'setAdmin',
            'click [data-role="unset-admin"]': 'unsetAdmin',
            'click [data-role="blacklist"]': 'blacklist',
            'click [data-role="unblacklist"]': 'unblacklist',
            'click [data-role="update-user-tags"]': 'showUserGroups',
            'click [data-role="banning"]': "banningUser",
            'click [data-role="unbanning"]': "banningUser",
            'click [data-role="starring"]': 'starTopic',
            'click [data-role="unstarring"]': 'unstarTopic',
            'click [data-role="report"]': 'reportTopic',
            'click [data-role="delete-confirm"]': 'delConfirm',
            'click [data-role="delete-cancel"]': 'delCancel',
            'click [data-role="share"]': 'showShareLayer'
        },

        close: function () {
            //var curr_top = $('html').css('top');
            //$("html").removeClass("no-scroll").css('top', 'auto');
            //if (curr_top) {
            //    $("body").scrollTop(-parseInt(curr_top))
            //}
            $('body').removeClass("no-scroll");
            this.$el.hide();
            $('.topic-delete-confirm').hide();
            $('.topic-manage-box').show();
        },

        show: function (topic_id, user_id, reply_id, forum_id, options) {
            this.topic_id = topic_id;
            this.user_id = user_id;
            this.reply_id = reply_id;
            this.forum_id = forum_id;
            this.site_id = options.site_id;

            //$("html").css('top', -$(document.body).scrollTop()).addClass("no-scroll");
            $('body').addClass("no-scroll");
            this.$el.find('.js-topic-manage-box').animateCss('fadeInUp')
            this.$el.show();

            this.$el.find("li[data-role]").hide();

            var type_role = this.reply_id ? "reply_manage" : "topic_manage";
            var user_role;

            var that = this;

            var do_things = function() {

                role[type_role][user_role].forEach(function (x) {
                    that.$el.find("li[data-role='" + x + "']").show();
                });

                if (options && options.is_sticking) {
                    that.$el.find("li[data-role='stick']").hide();
                }
                else {
                    that.$el.find("li[data-role='unstick']").hide();
                }

                if (options && options.is_manager) {
                    that.$el.find("li[data-role='set-admin']").hide();
                }
                else {
                    that.$el.find("li[data-role='unset-admin']").hide();
                }

                if (options && options.is_blacklisted) {
                    that.$el.find("li[data-role='blacklist']").hide();
                }
                else {
                    that.$el.find("li[data-role='unblacklist']").hide();
                }

                if (options && options.is_starred) {
                    that.$el.find("li[data-role='starring']").hide();
                }
                else {
                    that.$el.find("li[data-role='unstarring']").hide();
                }

                if (options && options.is_banned) {
                    that.$el.find("li[data-role='banning']").hide();
                }
                else {
                    that.$el.find("li[data-role='unbanning']").hide();
                }
            };

            global.get_current_user().then(function(current_user) {
                if (current_user.is_site_owner) {
                    user_role = "owner";
                }
                else if (current_user.is_forum_admin) {
                    user_role = "manager";
                }
                else if (current_user._id === user_id) {
                    user_role = "self";
                }
                else {
                    user_role = "others";
                }
                do_things();
            }).catch(function() {
                user_role = "anonymous";
                do_things();
            });
        },

        imUser: function () {
            this.close();
            var that = this;
            global.auth(function(current_user) {
                window.location = '/club/im/user/' + that.user_id;
            })
        },

        setAdmin: function() {
            var that = this;
            global.auth(function () {
                //$.ajax({
                //    url: "/club/apiv1/forums/" + that.forum_id + "/admins/" + that.user_id,
                //    method: "POST",
                //    success: function () {
                //        that.close();
                //        var _html = ' <span class="forum-admin-icon v-mid-ele"></span> ';
                //        var $user_tag_el = $("[data-user-id='" + that.user_id + "'] .topic-user-info[data-model='contains-icon'] .user-tag");
                //        if ($user_tag_el.length > 0) {
                //            $user_tag_el.before(_html);
                //        }
                //        else {
                //            $("[data-user-id='" + that.user_id + "'] .topic-user-info[data-model='contains-icon']").append(_html);
                //        }
                //        $("[data-user-id='" + that.user_id + "']").data('is-manager', true);
                //        alert.show("设置成功");
                //    },
                //    error: function () {
                //        alert.show("操作失败");
                //    }
                //})

                requests.setForumAdmin(
                    {forum_id: that.forum_id, user_id: that.user_id},
                    {},
                    function () {
                        that.close();
                        var _html = ' <span class="forum-admin-icon g-v-mid-ele"></span> ';
                        var $user_tag_el = $("[data-user-id='" + that.user_id + "'] .topic-user-info[data-model='contains-icon'] .user-tag");
                        if ($user_tag_el.length > 0) {
                            $user_tag_el.before(_html);
                        }
                        else {
                            $("[data-user-id='" + that.user_id + "'] .topic-user-info[data-model='contains-icon']").append(_html);
                        }
                        $("[data-user-id='" + that.user_id + "']").data('is-manager', true);
                        alert.show("设置成功");
                    },
                    function () {
                        alert.show("操作失败");
                    }
                )

            });
        },

        unsetAdmin: function() {
            var that = this;
            global.auth(function () {
                //$.ajax({
                //    url: "/club/apiv1/forums/" + that.forum_id + "/admins/" + that.user_id,
                //    method: "DELETE",
                //    success: function () {
                //        that.close();
                //        $("[data-user-id='" + that.user_id + "'] .topic-user-info[data-model='contains-icon'] .forum-admin-icon").remove().data('is-manager', false);
                //        $("[data-user-id='" + that.user_id + "']").data('is-manager', false);
                //        alert.show("设置成功");
                //    },
                //    error: function () {
                //        alert.show("操作失败");
                //    }
                //})
                //
                requests.unsetForumAdmin(
                    {forum_id: that.forum_id, user_id: that.user_id},
                    {},
                    function () {
                        that.close();
                        $("[data-user-id='" + that.user_id + "'] .topic-user-info[data-model='contains-icon'] .forum-admin-icon").remove().data('is-manager', false);
                        $("[data-user-id='" + that.user_id + "']").data('is-manager', false);
                        alert.show("设置成功");
                    },
                    function () {
                        alert.show("操作失败");
                    }
                )

            });
        },

        blacklist: function() {
            var that = this;
            global.auth(function () {
                //$.ajax({
                //    url: "/club/apiv1/forums/" + that.forum_id + "/blacklist/" + that.user_id,
                //    method: "POST",
                //    success: function () {
                //        that.close();
                //        $("[data-user-id='" + that.user_id + "']").data('is-blacklisted', true);
                //        alert.show("成功拉入黑名单");
                //    },
                //    error: function () {
                //        alert.show("操作失败");
                //    }
                //})

                requests.blacklistForumUser(
                    {forum_id: that.forum_id, user_id: that.user_id},
                    {},
                    function () {
                        that.close();
                        $("[data-user-id='" + that.user_id + "']").data('is-blacklisted', true);
                        alert.show("成功拉入黑名单");
                    },
                    function () {
                        alert.show("操作失败");
                    }
                )


            });
        },

        unblacklist: function() {
            var that = this;
            global.auth(function () {
                //$.ajax({
                //    url: "/club/apiv1/forums/" + that.forum_id + "/blacklist/" + that.user_id,
                //    method: "DELETE",
                //    success: function () {
                //        that.close();
                //        $("[data-user-id='" + that.user_id + "']").data('is-blacklisted', false);
                //        alert.show("成功撤销黑名单身份");
                //    },
                //    error: function () {
                //        alert.show("操作失败");
                //    }
                //})

                requests.unblacklistForumUser(
                    {forum_id: that.forum_id, user_id: that.user_id},
                    {},
                    function () {
                        that.close();
                        $("[data-user-id='" + that.user_id + "']").data('is-blacklisted', false);
                        alert.show("成功撤销黑名单身份");
                    },
                    function () {
                        alert.show("操作失败");
                    }
                )
            });
        },

        showUserGroups: function () {
            this.close();
            var that = this;

            var groupsManage = new UserManageGroups({
                site_id: this.site_id,
                forum_id: this.forum_id,
                user_id: this.user_id,
                el: $("<div class='topic-manage'></div>").appendTo("body")
            });

            groupsManage.on("updateGroupsSuccess", function (options) {
                $("[data-user-id='" + that.user_id + "'] .user-tag").remove();

                var html = "";
                for (var i = 0; i < options.groups.length; i++) {
                    var group = options.groups[i];
                    if (group.is_hidden) {
                       continue;
                    }
                    html += '<span class="user-tag g-v-mid-ele">' + utils.html_escape(group.title || group.name)  + '</span>';
                    break;
                }

                $("[data-user-id='" + that.user_id + "'] .topic-user-info[data-model='contains-icon']").append(html);

            })
        },

        stickTopic: function() {
            var that = this;

            global.auth(function () {
                //$.ajax({
                //    url: "/club/apiv1/topics/" + that.topic_id + "/sticking",
                //    method: "POST",
                //    success: function () {
                //        that.close();
                //        var html = ' <i class="sticking-tag k-i-top va-t-b"></i> ';
                //        $(".topic-item[data-topic-id='" + that.topic_id + "'] .topic-wrapper div").first().prepend(html);
                //        $(".topic-item[data-topic-id='" + that.topic_id + "']").data('sticking', true);
                //    },
                //    error: function () {
                //        alert.show("操作失败");
                //    }
                //})

                requests.stickTopic(
                    {topic_id: that.topic_id},
                    {},
                    function () {
                        that.close();
                        var html = ' <i class="sticking-tag k-i-top va-t-b"></i> ';
                        $(".topic-item[data-topic-id='" + that.topic_id + "'] .topic-wrapper div").first().prepend(html);
                        $(".topic-item[data-topic-id='" + that.topic_id + "']").data('sticking', true);
                    },
                    function () {
                        alert.show("操作失败");
                    }
                )

            });
        },

        starTopic: function() {
            var that = this;

            global.auth(function () {
                //$.ajax({
                //    url: "/club/apiv1/topics/" + that.topic_id + "/starring",
                //    method: "POST",
                //    success: function () {
                //        that.close();
                //        var html = ' <i class="star-tag k-i-sel va-t-b"></i> ';
                //        $(".topic-item[data-topic-id='" + that.topic_id + "'] .topic-wrapper div").first().prepend(html);
                //        $(".topic-item[data-topic-id='" + that.topic_id + "']").data('starred', true);
                //    },
                //    error: function () {
                //        alert.show("操作失败");
                //    }
                //})

                requests.starTopic(
                    {topic_id: that.topic_id},
                    {},
                    function () {
                        that.close();
                        var html = ' <i class="star-tag k-i-sel va-t-b"></i> ';
                        $(".topic-item[data-topic-id='" + that.topic_id + "'] .topic-wrapper div").first().prepend(html);
                        $(".topic-item[data-topic-id='" + that.topic_id + "']").data('starred', true);
                    },
                    function () {
                        alert.show("操作失败");
                    }
                )

            });
        },

        unstarTopic: function() {
            var that = this;

            global.auth(function () {
                //$.ajax({
                //    url: "/club/apiv1/topics/" + that.topic_id + "/starring",
                //    method: "DELETE",
                //    success: function () {
                //        that.close();
                //        $(".topic-item[data-topic-id='" + that.topic_id + "'] .star-tag").remove();
                //        $(".topic-item[data-topic-id='" + that.topic_id + "']").data('starred', false);
                //    },
                //    error: function () {
                //        alert.show("操作失败");
                //    }
                //})

                requests.unstarTopic(
                    {topic_id: that.topic_id},
                    {},
                    function () {
                        that.close();
                        $(".topic-item[data-topic-id='" + that.topic_id + "'] .star-tag").remove();
                        $(".topic-item[data-topic-id='" + that.topic_id + "']").data('starred', false);
                    },
                    function () {
                        alert.show("操作失败");
                    }
                )


            });
        },


        unstickTopic: function() {
            var that = this;

            global.auth(function () {
                //$.ajax({
                //    url: "/club/apiv1/topics/" + that.topic_id + "/sticking",
                //    method: "DELETE",
                //    success: function () {
                //        that.close();
                //        $(".topic-item[data-topic-id='" + that.topic_id + "'] .sticking-tag").remove();
                //        $(".topic-item[data-topic-id='" + that.topic_id + "']").data('sticking', false);
                //    },
                //    error: function () {
                //        alert.show("操作失败");
                //    }
                //})

                requests.unstickTopic(
                    {topic_id: that.topic_id},
                    {},
                    function () {
                        that.close();
                        $(".topic-item[data-topic-id='" + that.topic_id + "'] .sticking-tag").remove();
                        $(".topic-item[data-topic-id='" + that.topic_id + "']").data('sticking', false);
                    },
                    function () {
                        alert.show("操作失败");
                    }
                )

            });
        },

        //屏蔽话题
        hideTopic: function () {
            var that = this;

            global.auth(function () {
                //$.ajax({
                //    url: "/club/apiv1/topics/" + that.topic_id + "/hide",
                //    method: "POST",
                //    success: function () {
                //        that.close();
                //        $(".topic-item[data-topic-id='" + that.topic_id + "']").remove();
                //        alert.show("屏蔽成功");
                //        //that.trigger('hideTopicSuccess');
                //    },
                //    error: function () {
                //        alert.show("操作失败");
                //    }
                //})

                requests.hideTopic(
                    {topic_id: that.topic_id},
                    {},
                    function () {
                        that.close();
                        $(".topic-item[data-topic-id='" + that.topic_id + "']").remove();
                        alert.show("屏蔽成功");
                        //that.trigger('hideTopicSuccess');
                    },
                    function () {
                        alert.show("操作失败");
                    }
                )

            });
        },

        //举报话题
        reportTopic: function () {
            var that = this;

            global.auth(function () {
                //$.ajax({
                //    url: "/club/apiv1/topics/" + that.topic_id + "/reports",
                //    method: "POST",
                //    success: function () {
                //        that.close();
                //        alert.show("举报成功");
                //        $(".topic-item[data-topic-id='" + that.topic_id + "']").remove();
                //        //that.trigger('reportTopicSuccess');
                //    },
                //    error: function () {
                //        alert.show("操作失败");
                //    }
                //})

                requests.reportTopic(
                    {topic_id: that.topic_id},
                    {},
                    function () {
                        that.close();
                        alert.show("举报成功");
                        $(".topic-item[data-topic-id='" + that.topic_id + "']").remove();
                        //that.trigger('reportTopicSuccess');
                    },
                    function () {
                        alert.show("操作失败");
                    }
                )

            });
        },

        showManageTag: function () {
            this.close();
            var that = this;

            var tagManage = new TopicManageTags({context: this.context, topic_id: this.topic_id, el: $("<div class='topic-manage'></div>").appendTo("body")});

            tagManage.on("updateSuccess", function (options) {
                $(".topic-item[data-topic-id='" + that.topic_id + "'] .topic-tag").remove();

                var html = "";
                for (var i = 0; i < options.tags.length; i++) {
                    var tag = options.tags[i];
                    if (tag.is_hidden) {
                       continue;
                    }
                    html += ' <span class="topic-tag va-t-b">' + utils.html_escape(tag.title || tag.name)  + '</span>';
                }

                $(".topic-item[data-topic-id='" + that.topic_id + "'] .topic-wrapper div").first().prepend(html);
            })
        },

        delReply: function () {
            var that = this;

            //$.ajax({
            //    url: "/club/apiv1/comments/" + that.reply_id,
            //    method: "DELETE",
            //    success: function (data) {
            //        that.close();
            //        $(".topic-comment[data-comment-id='" + that.reply_id + "']").remove();
            //        if(data['update']){
            //            var score = data['score'],
            //                grade = data['grade'];
            //                alert.show("删除成功</br>积分加" + score + ",经验值加" + grade);
            //        } else {
            //            alert.show("删除成功");
            //        }
            //    },
            //    error: function () {
            //        alert.show("删除失败");
            //    }
            //})

            requests.delReply(
                {reply_id: that.reply_id},
                {},
                function (data) {
                    that.close();
                    $(".topic-comment[data-comment-id='" + that.reply_id + "']").remove();
                    if(data['update']){
                        var score = data['score'],
                            grade = data['grade'];
                            alert.show("删除成功</br>积分加" + score + ",经验值加" + grade);
                    } else {
                        alert.show("删除成功");
                    }
                },
                function () {
                    alert.show("删除失败");
                }
            )


        },

        banningUser: function () {
            var that = this;
            var user_banned = $("[data-user-id='" + that.user_id + "']").data("user-banned");

            global.auth(function(current_user) {
                //$.ajax({
                //    url: " /club/apiv1/forums/" + that.forum_id + "/banning/" + that.user_id,
                //    "method": user_banned ? "DELETE" : "POST",
                //    "data": {reason: current_user._id + "禁言用户:" + that.user_id, days: 7},
                //    success: function () {
                //        that.close();
                //        alert.show("操作成功");
                //        $("[data-user-id='" + that.user_id + "']").data("user-banned", user_banned ? false : true);
                //    },
                //    error: function () {
                //        alert.show("操作失败");
                //    }
                //});

                var banning_request = user_banned ? requests.unbanningUser : requests.banningUser;
                banning_request(
                    {forum_id: that.forum_id, user_id: that.user_id},
                    {reason: current_user._id + "禁言用户:" + that.user_id, days: 7},
                    function () {
                        that.close();
                        alert.show("操作成功");
                        $("[data-user-id='" + that.user_id + "']").data("user-banned", user_banned ? false : true);
                    },
                    function () {
                        alert.show("操作失败");
                    }
                )


            });
        },

        showShareLayer: function (ev) {
            if (global.is_weixin || global.is_qq) {
                window.location = '/club/topic/' + this.topic_id + "#share";
                return;
            }
            this.close();
            this.views["topicShare"].show({
                topic_id: this.topic_id
            });
        },

        delTopic: function () {
            $('.topic-delete-confirm').show();
            $('.topic-manage-box').hide();
        },

        delConfirm: function () {
            var that=this;

            //$.ajax({
            //    url: "/club/apiv1/topics/" + that.topic_id,
            //    method: "DELETE",
            //    success: function (data) {
            //        $('.topic-delete-confirm').hide();
            //        that.close();
            //        $('.topic-manage-box').show();
            //        $(".topic-item[data-topic-id='" + that.topic_id + "']").remove();
            //        if(data['update']){
            //            var score = data['score'],
            //                grade = data['grade'];
            //            alert.show("删除成功</br>积分加" + score + ",经验值加" + grade);
            //            //that.trigger('delTopicSuccess');
            //        } else {
            //            alert.show("删除成功")
            //            //that.trigger('delTopicSuccess');
            //        }
            //    },
            //    error: function () {
            //        alert.show("删除失败");
            //    }
            //})

            requests.delConfirm(
                {topic_id: that.topic_id},
                {},
                function (data) {
                    $('.topic-delete-confirm').hide();
                    that.close();
                    $('.topic-manage-box').show();
                    $(".topic-item[data-topic-id='" + that.topic_id + "']").remove();
                    if(data['update']){
                        var score = data['score'],
                            grade = data['grade'];
                        alert.show("删除成功</br>积分加" + score + ",经验值加" + grade);
                        //that.trigger('delTopicSuccess');
                    } else {
                        alert.show("删除成功")
                        //that.trigger('delTopicSuccess');
                    }
                },
                function () {
                    alert.show("删除失败");
                }
            )

        },

        delCancel: function () {
            $('.topic-delete-confirm').hide();
            this.close();
            $('.topic-manage-box').show();
        }

    });
});
