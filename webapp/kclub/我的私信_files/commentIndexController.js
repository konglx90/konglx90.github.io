define([
    'controllers/base' ,
    'components/topic-reply',
    'components/topic-share',
    'views/toolbar-topic',
    'components/topic-manage',
    'views/comment-list',
    'utils/imageViewer',
    'components/join-apply',
    'components/promotion-panel',
    'views/promotion-bottom',
    'components/alert',
    'components/guide-attention',
    'global',
    'utils/wx',
    'requests',
    'kuaivote_portal'
], function (baseController, TopicReply, TopicShare, Toolbar, TopicManage, CommentList, imageViewer, JoinApply, panel, PromotionBottom, alert, GuideAttention, global, wx, requests, portal) {

    var picsSwiper;

    return baseController.extend({
        tagName: 'body',

        events: {
            "click a.content": "breakLink",
            //"click video": "playVideo",
            'click [data-role="join-forum"]': 'joinApply',
            'click [data-role="back"]': 'back',

            'click [data-action="play-audio"].play':"playAudio",
            'click [data-action="play-audio"].stop':"stopAudio",
            'click [data-action="topic-manage"]': "showTopicManage",
            'click .ctime-desc-order': "commentCtimeDescOrder",
            'click .ctime-asc-order': "commentCtimeAscOrder",
            'click .topness-desc-order': "commentTopnessDescOrder",
            'click [data-action="upvote-topic"]': "upVoteTopic",
            'click [data-action="show-pics"]': "showPics",
            'click [data-role="pic-control"]': "stopClickParent",
            'click #pics-viewer img': "stopClickParent",
            'click #pics-viewer': "closePicViewer",
            'click [data-action="video-full-screen-play"]': "playVideoFull",
            'click [data-action="reply-comment"]': "reply",
            'click [data-action="reply-topic"]': "reply",
            'click [data-action="take-part-in"]': "joinActivity",
            'click [data-action="show-topic-detail"]': 'showTopicDetail'

        },

        initialize: function (opts) {
            var that = this;
            this.limit = 32;
            this.comment_id = opts.comment_id;


            this.views["topicShare"] = new TopicShare({
                el: "#topic-share",
                context: this
            });

            this.views["topicManage"] = new TopicManage({
                el: "#topic-manage"
            });

            this.views["topicReply"] = new TopicReply({
                el: "#pub-box",
                max_images: 9
            });

            this.getComment().then(function(comment) {

                that.topic_id = comment.topic_id;
                that.views["guideAttention"] = new GuideAttention({forum_id: comment.forum_id});

                that.views["commentList"] = new CommentList({
                    el: ".topic-comments",
                    load_type: 'comment',
                    topicManage: that.views["topicManage"],
                    context: that,
                    site_id: comment.site_id,
                    forum_id: comment.forum._id,
                    topic_id: comment.topic_id,
                    limit: that.limit,
                    init_send_data: {
                        limit: that.limit,
                        offset: 0,
                        state: 50,
                        sort: 'ctime',
                        is_passed: true,
                        ancestor_id: comment._id
                    }
                });

                //判断bower环境是否为app
                if((global.is_kzapp_ios && global.current_kzapp_ios_version >= 1.3) || (global.is_kzapp_android && global.current_kzapp_android_version >= 1.3)){
                    global.env = 'kzapp'
                }

                //判断是非为weixin环境
                if (global.is_weixin) {
                    wx.config_post(
                        function(wxsdk, wxdata){
                            global.env = 'wx';
                            var img = comment.forum.avatar || "http://club.kuaizhan.com/club/images/face/default-avatar.png";
                            var title = comment.forum.title;
                            var desc = comment.forum.desc;
                            wx.config_share(title, desc, img, window.location.href);
                            that.views["topicReply"].showAudio();
                        },
                        function(){},
                        comment.site_id);
                }
                if((global.is_kzapp_ios && (global.current_kzapp_ios_version >= 1.3)) || (global.is_kzapp_android && (global.current_kzapp_android_version >= 1.4))) {
                    that.views["topicReply"].showAudio();
                }
            });

        },

        reply: function(ev){
            var that = this;
            var do_things = function() {
                var $obj_el = $(ev.target).closest('[data-nickname]');
                var placeholder = "回复" + $obj_el.data("nickname");

                that.views["topicReply"].show({
                    pub_type: 'reply_topic',
                    topic_id: that.topic_id,
                    parent_id: that.comment_id,
                    placeholder: placeholder,
                    pub_succ_cb : _.bind(that._succ_reply_cb, that)
                });
            };

            if (this.testParticipatable) {
                this.testParticipatable(null, "回复").then(function(forum) {
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
                this.views["commentList"].resetOrderAndSort();
                this.views["guideAttention"].checkShowQr();
            }
        },

        playVideoFull: function(ev) {
            var video_player = $(ev.target).closest('.comment-video').find('.video-player');
            if (video_player.length == 1) {
                var video_player_elem = video_player[0];
                if (video_player_elem.requestFullscreen) {
                    video_player_elem.requestFullscreen();
                    video_player_elem.play();
                } else if (video_player_elem.mozRequestFullScreen) {
                    video_player_elem.mozRequestFullScreen();
                    video_player_elem.play();
                } else if (video_player_elem.webkitRequestFullscreen) {
                    video_player_elem.webkitRequestFullscreen();
                    video_player_elem.play();
                } else if (video_player_elem.msRequestFullscreen) {
                    video_player_elem.msRequestFullscreen();
                    video_player_elem.play();
                } else if (video_player_elem.oRequestFullscreen) {
                    video_player_elem.oRequestFullscreen();
                    video_player_elem.play();
                }
                else {
                    alert.show('您的手机暂不支持预览')
                }
            }
        },

        stopClickParent: function(ev) {
            ev.stopPropagation();
            ev.preventDefault();
        },

        closePicViewer: function() {
            $('#pics-viewer').hide();
            $('body').removeClass("no-scroll");
        },

        upVoteTopic: function (ev) {
            var that = this;

            this.testParticipatable(null, "点赞").then(function(data) {
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
                var vote_request =  isVoted ? requests.downVoteComment : requests.upVoteComment;
                vote_request(
                    {comment_id: comment_id},
                    {},
                    function(){
                        if (!isVoted) {
                            that.views["guideAttention"].checkShowQr();
                        }
                    }
                )
            });
        },

        showTopicManage: function (ev) {
            var that = this;
            this.getTopic().then(function(topic) {
                var $el = $(ev.target).closest(".comment-item[data-comment-id]");
                var options = {
                    site_id: topic.site_id,
                    is_manager: $el.data('is-manager'),
                    is_blacklisted: $el.data('is-blacklisted')};
                that.views["topicManage"].show(topic._id, topic.user_id, that.comment_id, topic.forum_id, options);
            });
        },

        showPics: function(ev) {
            var $pic_el = $(ev.target).closest('[data-action="show-pics"]');
            var $pics_el = $(ev.target).closest(".topic-images").find('[data-action="show-pics"]');
            var tar_pic_index = $pics_el.index($pic_el);
            var $pics_viewer_el = $('#pics-viewer');
            $pics_viewer_el.find('.swiper-wrapper .swiper-slide').remove();
            if (picsSwiper) {
                picsSwiper.removeAllSlides();
            }
            $pics_el.each(function(){
                $pics_viewer_el.find('.swiper-wrapper').append('<div class="swiper-slide pos-relative"><img class="mid-abs" src="' + $(this).find('img').attr('src')+'"/></div>');
            });
            $('body').addClass("no-scroll");
            if ($pics_el.length > 1) {
                $pics_viewer_el.find('.pagination-wrapper').show();
            }
            else {
                $pics_viewer_el.find('.pagination-wrapper').hide();
            }
            $pics_viewer_el.show();
            if (picsSwiper) {
                picsSwiper.removeAllSlides();
            }
            else {
                if (global.is_mobile) {
                    picsSwiper = new Swiper('.pics-wrapper', {
                        pagination: '.swiper-pagination'
                    });
                }
                else {
                    $pics_viewer_el.find('.swiper-button-prev').show();
                    $pics_viewer_el.find('.swiper-button-next').show();
                    picsSwiper = new Swiper('.pics-wrapper', {
                        pagination: '.swiper-pagination',
                        nextButton: '.swiper-button-next',
                        prevButton: '.swiper-button-prev'
                    });
                }
            }
            picsSwiper.slideTo(tar_pic_index, 0);
        },

        commentCtimeDescOrder: function(ev) {
            if (this.views["commentList"]) {
                this.views["commentList"].resetOrderAndSort(-1, 'ctime');
                if ($(ev.target).data('role') == 'change-ctime-order') {
                    $(ev.target).removeClass('ctime-desc-order').addClass('ctime-asc-order').text('正序查看');
                }
            }
        },

        commentCtimeAscOrder: function(ev) {
            if (this.views["commentList"]) {
                this.views["commentList"].resetOrderAndSort(1, 'ctime');
                if ($(ev.target).data('role') == 'change-ctime-order') {
                    $(ev.target).removeClass('ctime-asc-order').addClass('ctime-desc-order').text('倒序查看');
                }
            }
        },

        getComment: function() {
            var that = this;

            return new Promise(function(resolve, reject) {
                if (that.topic) {
                    resolve(that.topic);
                }
                else {

                    that.topic = $('.main-content .comment-item').data('comment');
                    if (that.topic) {
                        return resolve(that.topic);
                    }
                    return reject(that.topic);
                }
            });
        },

        getTopic: function() {
            var that = this;

            return new Promise(function(resolve, reject) {
                that.getComment()
                .then(function(data) {
                    if (data.topic) {
                        return resolve(data.topic);
                    }
                    return reject(data.topic);
                })
                .catch(function(error) {
                    return reject(error);
                });
            });
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

        getForum: function() {
            var that = this;

            return new Promise(function(resolve, reject) {
                that.getComment()
                .then(function(data) {
                    if (data.forum) {
                        return resolve(data.forum);
                    }
                    return reject(data.forum);
                })
                .catch(function(error) {
                    return reject(error);
                });
            });
        },

        getUser: function() {
            var that = this;

            return new Promise(function(resolve, reject) {
                that.getTopic()
                .then(function(data) {
                    if (data.user) {
                        return resolve(data.user);
                    }
                    return reject(data.user);
                })
                .catch(function(error) {
                    return reject(error);
                });
            });
        },

        closeShare: function () {
            this.views["topicShare"].close();
        },

        breakLink: function (ev) {
            ev.preventDefault();
            return false;
        },

        joinForum: function() {
            var that = this;

            return new Promise(function(resolve, reject) {
                that.getForum().then(function(forum) {

                    $.post("/club/apiv1/forums/" + forum._id + "/users", {
                    }).success(function () {
                        forum.current_user = forum.current_user || {};
                        forum.current_user.is_subscriber = true;
                        $('[data-role="join-forum"]').html('已加入').attr('data-role', 'conf-quit-forum');

                        resolve();

                    }).error(function (e) {
                        if (e.responseJSON !== null && e.responseJSON.code == 20402) {
                            return resolve();
                        }
                        reject();
                    })
                });
            })
        },

        back: function () {
            this.getForum().then(function(data) {
                if (!document.referrer || document.referrer.indexOf(window.location.origin) < 0) {
                    window.location = '/club/forum/' + data._id;
                }
            })
            .catch(function(error) {
                window.history.go(-1);
            });
        },

        testJoin: function (ev, msg) {
            var that = this;
            return new Promise(function(resolve, reject) {

                global.auth(function(current_user) {
                    that.getForum().then(function(forum) {

                        if (!forum.current_user || !forum.current_user.is_subscriber) {
                            if (forum.howto_join == 100) {
                                that.joinForum().then(function() {
                                    resolve(forum);
                                }).catch(function(err) {
                                    console.log(err);
                                    panel.show({
                                        msg: "加入社区失败，您可能被本社区禁止",
                                        buttons: [{
                                            label: "关闭",
                                            role: "close"
                                        }]
                                    });
                                });
                            }
                            else {
                                panel.show({
                                    msg: "加入社区才能" + (msg || "回复"),
                                    buttons: [{
                                        label: "关闭",
                                        role: "close"
                                    }, {
                                        label: forum.howto_join == 100 ? "加入社区" : "申请加入",
                                        role: 'join-forum'
                                    }]
                                });
                                ev && ev.preventDefault();
                                reject();
                            }
                        }
                        else {
                            resolve(forum);
                        }
                    });
                })
            });
        },

        testParticipatable: function(ev, msg) {
            var that = this;
            return new Promise(function(resolve, reject) {

                global.auth(function(current_user) {
                    that.getForum().then(function(forum) {

                        if (!forum.current_user || !forum.current_user.is_subscriber) {
                            if (forum.howto_join == 100) {
                                that.joinForum().then(function() {
                                    resolve(forum);
                                }).catch(function(err) {
                                    console.log(err);
                                    panel.show({
                                        msg: "加入社区失败，您可能被本社区禁止",
                                        buttons: [{
                                            label: "关闭",
                                            role: "close"
                                        }]
                                    });
                                });
                            }

                            else if (forum.openness == 100 && !forum.allow_stranger_participate) {
                                panel.show({
                                    msg: "加入社区才能" + (msg || "回复"),
                                    buttons: [{
                                        label: "关闭",
                                        role: "close"
                                    }, {
                                        label: forum.howto_join == 100 ? "加入社区" : "申请加入",
                                        role: 'join-forum'
                                    }]
                                });
                                ev && ev.preventDefault();
                                reject();
                            }
                            else {
                                resolve(forum);
                            }
                        }
                        else {
                            resolve(forum);
                        }
                    });
                })
            });
        },

        testViewTopicsPermission: function(ev) {
            var that = this;
            return new Promise(function(resolve, reject) {
                that.getForum().then(function(forum) {
                    if (forum.openness == 200){
                        that.testJoin(ev, '搜索话题').then(function() {
                            resolve(forum);
                        });
                    }
                    else {
                        resolve(forum);
                    }
                });
            });
        },

    });
});
