define([
    'components/view',
    'components/alert',
    'utils/kzscroller',
    'components/topic-manage',
    "global",
    'requests',
    'utils/timeCount'
], function (view, alert, kzscroller, TopicManage, global, requests, timeCount) {

    var that;
    var last_send_data;

    return view.extend({

        views: {},

        initialize: function (opts) {
            this.context = opts.context;
            this.forum_id = opts.forum_id;
            this.pageIndex = 1;
            this.limit = opts.limit;
            this.last_send_data = opts.init_send_data;
            that = this;
            this.views["topicManage"] = new TopicManage({
                el: "#topic-manage"
            });
            if (this.$el.find('.topic-item').length >= this.limit/2) {
                kzscroller.check_and_register('topic_list', that, function(){
                    if (that.last_send_data){
                        that.last_send_data['offset'] = that.pageIndex * that.limit;
                        that.appendTopics(that.last_send_data);
                    }
                });
            }
            timeCount(this.$el);
        },

        events: {
            'click [data-action="topic-manage"]': "showTopicManage",
            'click [data-action="upvote-topic"]': "upVote",
            'click [data-action="enter-topics"]': "goTopicDetail",
            'click [data-action="reply-comment"]': "reply",
            'click [data-action="reply-topic"]': "reply",
            'click [data-action="play-audio"].play':"playAudio",
            'click [data-action="play-audio"].stop':"stopAudio"
        },

        reply: function(ev){
                var that = this;
                var do_things = function() {
                    var $topic_el = $(ev.target).closest('[data-topic-id]');
                    var topic_id = $topic_el.data("topic-id");
                    var $obj_el = $(ev.target).closest('[data-nickname]');
                    var placeholder = "回复" + $obj_el.data("nickname");
                    var parent_id;
                    if ($obj_el.data("reply-id")) {
                        parent_id = $obj_el.data("reply-id");
                    }
                    $.ajax({
                        url: "/club/apiv1/topics/" + topic_id + "/test-reply",
                        method: 'get',
                        success: function (data) {
                            if(data.enable){
                                that.context.views["topicReply"].show({
                                    pub_type: 'reply_topic',
                                    placeholder: placeholder,
                                    topic_id: topic_id,
                                    parent_id: parent_id,
                                    pub_succ_cb : _.bind(that._succ_reply_cb, that)
                                });
                            }else{
                                alert.show("回复数已达该话题上限");
                            }
                        }
                    });
                };

                if (this.context.testParticipatable) {
                    this.context.testParticipatable(null, "回复").then(function(forum) {
                        do_things();
                    });
                }
                else {
                    do_things();
                }

        },

        _succ_reply_cb: function(data){
            if (data.code) {
                alert.show("回复失败，"+data.code);
                alert.closeWaitingNoFadeOut();
            } else {
                alert.closeWaiting();
                requests.getTopicHtml(
                    {topic_id: data.topic_id},
                    {},
                    function(html_data){
                        that.$el.find('.topic-item[data-topic-id="'+ data.topic_id +'"]').replaceWith(html_data);
                        new Swiper('.topic-images', {
                            direction: 'horizontal',
                            slidesPerView: 'auto'
                        });
                        that.context.views["guideAttention"]&&that.context.views["guideAttention"].checkShowQr();
                    },
                    function(){
                        if(global.is_weixin) {
                            window.location = window.location + "?v=" + (new Date().getTime());
                        }
                        else {
                            window.location.reload();
                        }
                    }
                );
            }
        },

        playAudio:function(ev){
            var $el = $(ev.target).closest("[data-action='play-audio']");
            $el.removeClass('play').addClass('stop');
            $el.find('.audio-show')[0].play();
            $el.find('.audio-show').on('ended',function(){
                $el.removeClass('stop').addClass('play');
            })

        },
        stopAudio:function(ev){
            var $el = $(ev.target).closest("[data-action='play-audio']");
            $el.find('.audio-show')[0].pause();
            $el.find('.audio-show')[0].currentTime = 0;
            $el.removeClass('stop').addClass('play');
        },

        append: function (html) {
            this.$el.append($(html));
        },

        html: function (html) {
            this.$el.html($(html))
        },

        goTopicDetail: function (ev) {
            if ($(ev.target).closest('a').size() <= 0){
                window.location = $(ev.target).closest("[data-href]").data("href");
            }
        },

        reloadTopics: function(send_data) {
            that._getAndSetTopics(
                send_data,
                function(data){
                    that.pageIndex = 1;
                    if (data.trim().length > 0) {
                        $('#empty-list-tip').hide();
                        $('#forbidden-forum-tip').hide();
                        kzscroller.check_and_register('topic_list', that, function(){
                            if (that.last_send_data){
                                that.last_send_data['offset'] = that.pageIndex * that.limit;
                                that.appendTopics(that.last_send_data);
                            }
                        });
                    }
                    else {
                        if ($('#forbidden-forum-tip').is(':hidden')) {
                            $('#empty-list-tip').show();
                        }
                        kzscroller.remove('topic_list');
                    }

                    that.html(data);
                    timeCount();
                    new Swiper('.topic-images', {
                        direction: 'horizontal',
                        slidesPerView: 'auto'
                    });
                }
            );
        },

        appendTopics: function(send_data) {
            that._getAndSetTopics(
                send_data,
                function(data){
                    that.pageIndex += 1;
                    if (data.trim().length == 0) {
                        kzscroller.remove('topic_list');
                    }
                    that.append(data);
                    timeCount();
                    new Swiper('.topic-images', {
                        direction: 'horizontal',
                        slidesPerView: 'auto'
                    });
                }
            );
        },

        _getAndSetTopics: function(send_data, succ_cb) {
            send_data = send_data || {};
            that.last_send_data = send_data;
            that.loading = true;
            alert.showWaiting("话题加载中...");
            requests.getForumTopics(
                {forum_id: this.forum_id},
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


        showTopicManage: function (ev) {
            var $el = $(ev.target).closest(".topic-item[data-topic-id]");
            var topic_id = $el.data("topic-id"),
                user_id = $el.data("user-id"),
                options = {
                    is_sticking: $el.data('sticking'),
                    site_id: $el.data('site-id'),
                    is_manager: $el.data('is-manager'),
                    is_blacklisted: $el.data('is-blacklisted'),
                    is_banned: $el.data('user-banned'),
                    is_starred: $el.data('starred')};
            this.views["topicManage"].show(topic_id, user_id, null, this.forum_id, options);
        },

        upVote: function (ev) {
            var that = this;
            var do_things = function() {
                var $tar = $(ev.target).closest(".js-upvote");
                var isVoted = $tar.hasClass("voted");
                var $el = $tar.closest("[data-topic-id]");
                var topic_id = $el.data("topic-id");
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
                //    url: "/club/apiv1/topics/" + topic_id + "/upvotes",
                //    success: function () {
                //    }
                //});

                var vote_request = isVoted ? requests.downVoteTopic : requests.upVoteTopic;
                vote_request(
                    {topic_id: topic_id},
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
