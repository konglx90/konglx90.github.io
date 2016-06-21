define([
    'views/view',
    'components/alert',
    'utils/kzscroller',
    'components/topic-manage',
    "global",
    'requests'
], function (view, alert, kzscroller, TopicManage, global, requests) {

    var that;
    var last_send_data;

    return view.extend({

        views: {},

        initialize: function (opts) {
            this.order = 1;
            this.sort = opts.init_send_data.sort;
            this.context = opts.context;
            this.site_id = opts.site_id;
            this.forum_id = opts.forum_id;
            this.topic_id = opts.topic_id;
            this.pageIndex = 1;
            this.limit = opts.limit;
            this.init_send_data = _.clone(opts.init_send_data);
            this.last_send_data = opts.init_send_data;
            that = this;
            this.views["topicManage"] = opts.topicManage;
            if (this.$el.find('[data-role="topic-comment"]').length >= this.limit/2) {
                kzscroller.check_and_register('comment_list', that, function(){
                    if (that.last_send_data){
                        that.last_send_data['offset'] = that.pageIndex * that.limit;
                        that.appendComments(that.last_send_data);
                    }
                });
            }
            this.hideParentComment();
        },

        events: {
            'click [data-action="comment-manage"]': "showCommentManage",
            'click [data-action="upvote-comment"]': "upVote",
            'click [data-action="show-parent-comment"]': "showParentComment"
        },

        hideParentComment: function(){
            $('.comment-parent-text').map(function(){
                if (this.offsetHeight < this.scrollHeight || $(this).closest('.comment-parent').find('.topic-images').children().length > 5) {
                    $(this).closest('.comment-parent').find('.show-parent-comment').removeClass('g-hide');
                }
            });

        },

        showParentComment: function(ev){
            var $tar_el = $(ev.target);
            var $parent_el = $tar_el.closest('.comment-parent');
            $parent_el.find('.comment-parent-text').removeClass('hide-more');
            $parent_el.find('.topic-images').removeClass('hide-more');
            $parent_el.find('.show-parent-comment').addClass('g-hide');
        },

        append: function (html) {
            this.$el.append($(html));
        },

        html: function (html) {
            this.$el.html($(html))
        },

        resetOrderAndSort: function(order, sort) {
            if (order){
                this.order = order;
            }
            if (sort) {
                this.sort = sort;
            }
            this.reloadComments(_.clone(this.init_send_data));
        },

        reloadComments: function(send_data) {
            that._getAndSetComments(
                send_data,
                function(data){
                    that.pageIndex = 1;
                    if (data.trim().length > 0) {
                        $('#empty-list-tip').hide();
                        kzscroller.check_and_register('comment_list', that, function(){
                            if (that.last_send_data){
                                that.last_send_data['offset'] = that.pageIndex * that.limit;
                                that.appendComments(that.last_send_data);
                            }
                        });
                    }
                    else {
                        $('#empty-list-tip').show();
                        kzscroller.remove('comment_list');
                    }

                    that.html(data);
                    that.hideParentComment();

                }
            );
        },

        appendComments: function(send_data) {
            that._getAndSetComments(
                send_data,
                function(data){
                    that.pageIndex += 1;
                    if (data.trim().length == 0) {
                        kzscroller.remove('comment_list');
                    }
                    that.append(data);
                    that.hideParentComment();
                }
            );
        },

        _getAndSetComments: function(send_data, succ_cb) {
            var that = this;
            send_data = send_data || {};
            send_data['order'] = this.order;
            send_data['sort'] = this.sort;
            if (send_data['sort'] != 'ctime') {
                delete send_data['order']
            }
            that.last_send_data = send_data;
            that.loading = true;
            alert.showWaiting("话题加载中...");
            //$.ajax({
            //    url: "/clubv2/api/topics/" + this.topic_id + "/comments",
            //    type: 'GET',
            //    data: send_data,
            //    success: function (data) {
            //        that.loading = false;
            //        alert.closeWaiting();
            //        if (succ_cb){
            //            succ_cb(data)
            //        }
            //    },
            //    error: function () {
            //        alert.show("加载失败");
            //        alert.closeWaitingNoFadeOut();
            //    }
            //});
            requests.getTopicCommentsV2(
                {topic_id: that.topic_id},
                send_data,
                function (data) {
                    that.loading = false;
                    alert.closeWaiting();
                    if (succ_cb){
                        succ_cb(data)
                    }
                },
                 function () {
                    alert.show("加载失败");
                    alert.closeWaitingNoFadeOut();
                }
            )


        },


        showCommentManage: function (ev) {
            var $el = $(ev.target).closest("[data-role='topic-comment'][data-comment-id]");
            var comment_id = $el.data("comment-id"),
                user_id = $el.data("user-id"),
                options = {
                    site_id: that.site_id,
                    is_manager: $el.data('is-manager'),
                    is_blacklisted: $el.data('is-blacklisted'),
                    is_banned: $el.data('user-banned')
                };
            this.views["topicManage"].show(that.topic_id, user_id, comment_id, that.forum_id, options);
        },

        upVote: function (ev) {
            var that = this;
            var do_things = function() {
                var $tar = $(ev.target).closest(".js-upvote");
                var isVoted = $tar.hasClass("voted");
                var $el = $tar.closest("[data-comment-id]");
                var comment_id = $el.data("comment-id");
                $el.find(".js-upvote").toggleClass("voted");
                if (isVoted) {
                    $el.find('.js-upvote i').removeClass('k-i-like-o').addClass('k-i-like');
                }
                else {
                    $el.find('.js-upvote i').removeClass('k-i-like').addClass('k-i-like-o');
                }
                var $count = $el.find(".js-upvote .upvote-nums");
                $count.html((parseInt($count.html()) || 0) + (isVoted ? -1 : 1));

                //$.ajax({
                //    method: isVoted ? "delete" : "post",
                //    url: "/club/apiv1/comments/" + comment_id + "/upvotes",
                //    success: function () {
                //    }
                //});

                var vote_request = isVoted ? requests.downVoteComment : requests.upVoteComment;
                vote_request(
                    {comment_id: comment_id},
                    {},
                    function(){
                        if (!isVoted) {
                            that.context.views["guideAttention"]&&that.context.views["guideAttention"].checkShowQr();
                        }
                    }
                )
            };

            if (this.context.testParticipatable) {
                this.context.testParticipatable(null, "点赞").then(function(forum) {
                    do_things();
                });
            }
            else {
                do_things();
            }
        }
    });
});
