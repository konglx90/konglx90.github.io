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
    'kuaivote_portal',
    'views/activity-apply-form'
], function (baseController, TopicReply, TopicShare, Toolbar, TopicManage, CommentList, imageViewer, JoinApply, panel, PromotionBottom, alert, GuideAttention, global, wx, requests, portal, ActivityApplyForm) {

    var picsSwiper;

    return baseController.extend({
        tagName: 'body',

        events: {
            "click a.content": "breakLink",
            //"click video": "playVideo",
            "click [data-role='share']": 'topicShare',
            "click [data-role='upvote']": 'upVote',
            "click [data-role='upvote-activity']": 'upVoteActivity',
            "click [data-role='upvote-comment']": "upVoteComment",
            "click [data-role='add-comment']": 'showAddComment',
            'click [data-role="join-forum"]': 'joinApply',
            'click [data-role="topic-manage"]': "showTopicManage",
            'click [data-role="comment-manage"]': "showCommentManage",
            'click [data-role="back"]': 'back',
            'click .hottest' : 'showHottest',
            'click .jumpAd' : 'jumpAdPage',
            "click [data-role='enter-reward']": 'Reward',
            'click .guide-close-icon': "closeGuide",
            'click .follow-btn': "followShow",
            'click .share-layer-bottom': "closeShare",

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
            'click [data-action="show-topic-detail"]': 'showTopicDetail',

        },

        initialize: function (opts) {
            var that = this;
            this.limit = 32;
            this.topic_id = opts.topic_id;


            this.views["topicShare"] = new TopicShare({
                el: "#topic-share",
                context: this
            });

            this.views["topicManage"] = new TopicManage({
                el: "#topic-manage"
            });


            this.getTopic().then(function(topic) {

                that.views["guideAttention"] = new GuideAttention({forum_id: topic.forum_id});

                var max_images = 9;
                var min_images = 0;

                var init_data = {
                    limit: that.limit,
                    offset: 0,
                    state: 50,
                    sort: 'ctime'
                };

                if (topic.form_id == 'PIC_SHOW') {
                    init_data['sort_type'] = 'topness';
                    init_data['parent_id'] = '';
                    max_images = 9;
                    min_images = 1;
                }
                that.form_id = topic.form_id;

                that.views["topicReply"] = new TopicReply({
                    el: "#pub-box",
                    max_images: max_images,
                    min_images: min_images
                });

                that.views["commentList"] = new CommentList({
                    el: ".topic-comments",
                    topicManage: that.views["topicManage"],
                    context: that,
                    site_id: topic.site_id,
                    forum_id: topic.forum._id,
                    topic_id: that.topic_id,
                    limit: that.limit,
                    init_send_data: init_data
                });

                that.views["activityApplyForm"] = new ActivityApplyForm({
                    el: "#activity-apply-form",
                    context: this,
                    topic: topic
                });

                new Swiper('.topic-images', {
                    direction: 'horizontal',
                    slidesPerView: 'auto'
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
                            var img = forum.avatar || "http://club.kuaizhan.com/club/images/face/default-avatar.png";
                            var title = forum.title;
                            var desc = forum.desc;
                            wx.config_share(title, desc, img, window.location.href);
                            that.views["topicReply"].showAudio();
                        },
                        function(){},
                        topic.site_id);
                }
                if((global.is_kzapp_ios && (global.current_kzapp_ios_version >= 1.3)) || (global.is_kzapp_android && (global.current_kzapp_android_version >= 1.4))) {
                    that.views["topicReply"].showAudio();
                }
            });

            if($('.mod-vote-multi').length != 0){
                 portal.onAfterRender(".mod-vote-multi", window, document);
                $('head').append("<link rel='stylesheet' href='http://pfile.kuaizhan.com/files/??7k7kgame/latest_version/components/portal_all.css,crm2/latest_version/components/portal_all.css,dsp/latest_version/components/portal_all.css,kuaivote/latest_version/components/portal_all.css,kuaizhan_promotion/latest_version/components/portal_all.css,page/latest_version/components/portal_all.css,pc_shipei/latest_version/components/portal_all.css,plugin_render/latest_version/components/portal_all.css'>")
                $('head').append("<link rel='stylesheet' href='http://kzcdn.itc.cn/res/skin/css/mod.css'>");
                $('head').append("<meta name='format-detection' content='telephone=no, email=no'>");
            }

            this.showTopicDetailBtn();
        },

        reply: function(ev){
            var that = this;
            var do_things = function() {
                var $obj_el = $(ev.target).closest('[data-nickname]');
                var placeholder = "回复" + $obj_el.data("nickname");
                if (that.form_id == 'PIC_SHOW') {
                    placeholder = "我也来晒图!"
                }
                var parent_id;
                if ($obj_el.data("reply-id")) {
                    parent_id = $obj_el.data("reply-id");
                }
                requests.topicTestReply(
                    {topic_id: that.topic_id},
                    {},
                    function (data) {
                        if (data.enable) {
                            that.views["topicReply"].show({
                                pub_type: 'reply_topic',
                                topic_id: that.topic_id,
                                parent_id: parent_id,
                                placeholder: placeholder,
                                pub_succ_cb : _.bind(that._succ_reply_cb, that)
                            });
                        } else {
                            alert.show("回复数已达该话题上限");
                        }
                    }
                )
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

        showTopicDetailBtn: function(){
            $('.topic-content.hide-more').map(function(){
                if (this.offsetHeight < this.scrollHeight) {
                    $(this).closest('.activity-topic-content').find('.show-topic-detail').show();
                }
            });
        },

        showTopicDetail: function(ev){
            var $tar_el = $(ev.target);
            $tar_el.closest('.activity-topic-content').find('.hide-more').removeClass('hide-more');
            $tar_el.closest('.activity-topic-content').find('.show-topic-detail').remove();

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
                var vote_request =  isVoted ? requests.downVoteTopic : requests.upVoteTopic;
                vote_request(
                    {topic_id: topic_id},
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
                var $el = $(ev.target).closest(".topic-item[data-topic-id]");
                var options = {
                    site_id: topic.site_id,
                    is_starred: $el.data('starred'),
                    is_sticking: $el.data('sticking'),
                    is_banned: $el.data('user-banned'),
                    is_manager: $el.data('is-manager'),
                    is_blacklisted: $el.data('is-blacklisted')};
                that.views["topicManage"].show(topic._id, topic.user_id, null, topic.forum_id, options);
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
                if ($(ev.target).hasClass('comments-header-split')) {
                    this.$el.find('.comments-header-split.cur').removeClass('cur');
                    $(ev.target).addClass('cur');
                }
            }
        },

        commentCtimeAscOrder: function(ev) {
            if (this.views["commentList"]) {
                this.views["commentList"].resetOrderAndSort(1, 'ctime');
                if ($(ev.target).data('role') == 'change-ctime-order') {
                    $(ev.target).removeClass('ctime-asc-order').addClass('ctime-desc-order').text('倒序查看');
                }
                if ($(ev.target).hasClass('comments-header-split')) {
                    this.$el.find('.comments-header-split.cur').removeClass('cur');
                    $(ev.target).addClass('cur');
                }
            }
        },

        commentTopnessDescOrder: function(ev) {
            if (this.views["commentList"]) {
                this.views["commentList"].resetOrderAndSort(1, 'topness');
                if ($(ev.target).hasClass('comments-header-split')) {
                    this.$el.find('.comments-header-split.cur').removeClass('cur');
                    $(ev.target).addClass('cur');
                }
            }
        },

        getTopic: function() {
            var that = this;

            return new Promise(function(resolve, reject) {
                if (that.topic) {
                    resolve(that.topic);
                }
                else {

                    that.topic = $('.main-content .topic-item').data('topic');;
                    if (that.topic) {
                        return resolve(that.topic);
                    }
                    return reject(that.topic);
                }
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
                that.getTopic()
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

        followShow: function () {
            this.views["guideAttention"].showQr();
        },

        closeGuide: function () {
            this.views["guideAttention"].closeGuide();
        },

        breakLink: function (ev) {
            ev.preventDefault();
            return false;
        },



        Reward: function(ev) {
            var topic_id = $('.topic-view').data("topic-id");
            this.testJoin(null, "打赏").then(function() {
                window.location = "/club/topic/" + topic_id +"/reward-page";
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


        upVoteActivity: function (ev) {
            var that = this;

            this.testParticipatable(null, "点赞").then(function(data) {
                var $tar = $(ev.target).closest(".upvote");
                var isVoted = $tar.is(".voted");
                var topic_id = that.topic_id;
                $tar.toggleClass("voted");
                var $count = $tar.find(".count");
                $count.html(parseInt($count.html()) + (isVoted ? -1 : 1));

                var vote_request = isVoted ? requests.downVoteTopic : requests.upVoteTopic;
                vote_request({topic_id: topic_id})

            });
        },

        showGuideAttentionQrCode: function() {
            this.views["guideAttention"].checkShowQr();
        },

        upVoteComment: function (ev) {
            var that = this;
            var $tar = $(ev.target).closest(".upvote-comment");
            var $count = $tar.find(".count");
            var isVoted = $tar.is(".voted");
            var comment_id = $(ev.target).closest("[data-reply-id]").data('reply-id');

            this.getTopic().then(function(topic) {
                if ($tar.is('.pic-show-comment')) {
                    var view = (topic.form && topic.form.options && topic.form.options.view) ? topic.form.options.view : "",
                        upvote_forbid = topic.forbid_upvote_after_end ? topic.forbid_upvote_after_end: false;
                    if (view == 'pic_show' && topic.is_ended && upvote_forbid) {
                        return alert.show("活动已结束");
                    }
                }

                that.testParticipatable(null, "点赞").then(function(data) {
                    var vote_request = isVoted ? requests.downVoteComment : requests.upVoteComment;
                    vote_request(
                        {comment_id: comment_id},
                        {},
                        function () {
                            $tar.toggleClass("voted");
                            $count.html(parseInt($count.html()) + (isVoted ? -1 : 1));
                            if (!isVoted) {
                                that.showGuideAttentionQrCode();
                            }
                        },
                        function(err) {
                            alert((err.responseJSON && err.responseJSON.msg) || "投票成功");
                            $tar.toggleClass("voted");
                            $count.html(parseInt($count.html()) + (isVoted ? -1 : 1));
                        }
                    )
                });
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

        goSearch: function(ev) {
            this.testViewTopicsPermission(ev).then(function(forum) {
                window.location.href = "/club/forum/" + forum._id + "/search";
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




        appendComments: function (html) {
            this.$el.find("#comment-list").append(html);
        },

        topicShare: function () {
            this.views["topicShare"].show({
                topic_id: this.topic_id
            });
            $('.share-wrap').show();
            $('.wxshare-url').hide();
        },


        showAddComment: function (ev, view) {
            var that = this;
            this.testParticipatable(null, "参加活动").then(function(data) {
                var reply_name = $(".topic-show .col-info-2-2 .row-title-labels a.title").text();
                reply_name = reply_name ? "回复" + reply_name : "";

                requests.topicTestReply(
                    {topic_id: that.topic_id},
                    {},
                    function (data) {
                        if (data.enable && view === 'pic_show') {
                            that.views["topicReply"].show({topic_id: that.topic_id, placeholder: "我也来晒图！"});
                        }else if(data.enable){
                            that.views["topicReply"].show({topic_id: that.topic_id, placeholder: reply_name});
                        }else{
                            alert.show("回复数已达该话题上限");
                        }
                    }
                )
            });
        },

        participate: function (ev) {
            var that = this;

            return new Promise(function(resolve, reject) {
                that.testParticipatable(null, "参加活动")
                    .then(function(data) {
                        return that.getTopic();
                    })
                    .then(function(topic) {
                        var partin_request = topic.is_participated ? requests.topicWithdraw : requests.topicPartIn;
                        partin_request(
                            {topic_id: that.topic_id},
                            {},
                            function() {
                                if (topic.is_participated) {
                                    alert.show("取消报名");
                                    topic.is_participated = false;
                                    resolve(false);
                                }
                                else {
                                    alert.show("报名成功");
                                    topic.is_participated = true;
                                    resolve(true);
                                }
                            },
                            function() {
                                alert.show(topic.is_participated ? "取消报名失败，请重试" : "报名失败，请重试");
                                reject();
                            }
                        )
                    });
                }
            );
        },

        joinActivity: function(ev){
            var that = this;

            this.getTopic().then(function(topic) {
                if(!topic.is_participated){
                    if(topic.has_apply_info){
                        that.testParticipatable(null, "参加活动").then(function (data) {
                            var currentUser = {};
                            global.get_current_user().then(function (current_user) {
                                currentUser = current_user;

                                if (topic.apply_condition > 0) {
                                    if (currentUser.score_grade_on) {
                                        //满足条件才可以参加活动
                                        if (topic.apply_condition <= currentUser.grade_info.total) {
                                            that.views['activityApplyForm'].show({topic: topic}, function () {

                                            })
                                        } else {
                                            alert.show('对不起，您的经验值不足！');
                                        }
                                    } else {
                                        that.views['activityApplyForm'].show({topic: topic}, function () {

                                        })
                                    }
                                } else {
                                    that.views['activityApplyForm'].show({topic: topic}, function () {

                                    })
                                }

                            }).catch(function (error) {
                                alert.show("获取当前用户失败！");
                            });
                       });
                    }else{
                        that.participate(ev).then(function(is_participated) {
                            $(ev.target).html(is_participated ? "取消报名" : "立即参加");
                            window.location.reload();
                        }).catch(function(err){
                            console.log(err)
                        });
                    }
                }else{
                   that.participate(ev).then(function(is_participated) {
                        $(ev.target).html(is_participated ? "取消报名" : "立即参加");
                        window.location.reload();
                   }).catch(function(err){
                        console.log(err)
                   });
                }
            });
        },


        guideAttention: function() {
            this.views["guideAttention"].checkShowGuideAttentionBar();
        }

    });
});
