define([
    'controllers/base' ,
    'global',
    'components/alert',
    'components/topic-share',
    'components/join-apply',
    'requests'
], function (baseController, global, alert, topicShare, JoinApply, requests) {
    return baseController.extend({
        events: {
            'click [data-role="join-forum"]': "joinApply",
            'click [data-action="forum-share"]': "shareForum",
            "click [data-action='show-hidden-users']": "showHiddenUsers"
        },

        initialize: function(opt){
            this.views["topicShare"] = new topicShare({
                el: "#topic-share"
            });
            this.views["joinApply"] = new JoinApply({
                el: "#join-apply"
            });

            this.getForum().then(function(forum) {
                if (global.is_weixin) {
                    wx.config_post(
                        function(wxsdk, wxdata){
                            global.env = 'wx';
                            var img = forum.avatar || "http://club.kuaizhan.com/club/images/face/default-avatar.png";
                            var title = forum.title;
                            var desc = forum.desc;
                            wx.config_share(title, desc, img, window.location.href);
                        },
                        function(){},
                        forum.site_id);
                }
            });

        },

        showHiddenUsers: function(ev) {
            var $users_item_el = $(ev.target).closest(".users-item").find('.users');
            $users_item_el.addClass('show-more-users')
        },

        shareForum: function (ev) {
            this.views["topicShare"].show({
                forum_id: this.forum_id
            });
        },

        getForum: function() {
            var that = this;

            return new Promise(function(resolve, reject) {
                if (that.forum) {
                    resolve(that.forum);
                }
                else {
                    that.forum = $('.main-content').data('forum');
                    if (that.forum) {
                        return resolve(that.forum);
                    }
                    return reject(that.forum);
                }
            });
        },

        joinApply: function (ev) {
            var that = this;

            global.auth(function(current_user) {
                that.getForum().then(function(forum) {

                    if (forum.howto_join == "100") {
                        that.joinForum().then(function() {
                            alert.show("已成功加入社区");
                        }).catch(function() {
                            if (forum.current_user && forum.current_user.is_blacklisted) {
                                alert.show("您已被拉入黑名单，无法加入该社区");
                            } else {
                                alert.show("加入失败");
                            }
                        });
                    }

                    else {
                        that.views["joinApply"].show({forum_id: forum._id});
                    }
                });
            });
        },
        joinForum: function() {
            var that = this;

            return new Promise(function(resolve, reject) {
                that.getForum().then(function(forum) {

                    requests.joinCommunity(
                        {forum_id: forum._id},
                        {},
                        function () {
                            forum.current_user = forum.current_user || {};
                            forum.current_user.is_subscriber = true;
                            $('[data-role="join-forum"]').addClass('conf-quit-forum');
                            $('[data-role="join-forum"]').html('已加入').attr('data-role', 'conf-quit-forum');
                            resolve();
                        },
                        function (e) {
                            if (e.responseJSON !== null && e.responseJSON.code == 20402) {
                                return resolve();
                            }
                            reject();
                        }
                    );

                });
            })
        },



    });
});
