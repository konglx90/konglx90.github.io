define([
    'controllers/base' ,
    'components/topiclist',
    'components/topic-reply',
    'components/topic-share',
    'components/join-apply',
    'components/promotion-panel',
    'components/alert',
    'components/SideBar',
    'components/guide-attention',
    'global',
    'utils/wx',
    'requests'
], function (baseController, topicList, topicReply, topicShare, JoinApply, panel, alert, SideBar, GuideAttention, global, wx, requests) {
    var scrollHandler;
    var tag_scroll_swipper;
    var tag_swipper;
    return baseController.extend({
        events: {
            'click [data-role="join-forum"]': "joinApply",
            'click [data-action="hide-more-forum-tag"]': 'hideMoreTags',
            'click [data-action="show-more-forum-tag"]': "showMoreTags",
            'click [data-action="toggle-stick-top-arrow"]': "toggleShowStickTopics",

            'click [data-action="filter-topics"]': 'filterTopics',
            'click [data-action="forum-share"]': "shareForum",
            'click [data-action="pub-topic"]': 'goPub',
            'click [data-role="user-sidebar"]': 'showSidebar'
        },

        initialize: function (opts) {
            var that = this;
            var forum = $('.forum-show').data('forum');
            that.forum_id = opts.forum_id;
            window.location.hash = "";
            that.limit = 32;

            tag_scroll_swipper = new Swiper('.tag-slider', {
                direction: 'horizontal',
                slidesPerView: 'auto'
            });

            new Swiper('.pic-window-slider', {
                direction: 'horizontal',
                slidesPerView: 'auto',
                autoplay: 4000,
                pagination: '.swiper-pagination',
                autoplayDisableOnInteraction: false,
                paginationClickable: true,
                onTransitionEnd: function (swiper) {
                    var _slider_el = $('.pic-window-slider .pic_text');
                    if ($(swiper.slides[swiper.activeIndex]).data('text')) {
                        var curr_width = _slider_el.width();
                        _slider_el.text($(swiper.slides[swiper.activeIndex]).data('text')).css('max-width', curr_width).show().animate({maxWidth: '6.18667rem'}, 1000)
                    }
                    else {
                        _slider_el.animate({maxWidth: 0}, 500, function(){$(this).hide()});
                    }
                },
                onInit: function(swiper) {
                    var _slider_el = $('.pic-window-slider .pic_text');
                    if ($(swiper.slides[swiper.activeIndex]).data('text')) {
                        var curr_width = _slider_el.width();
                        _slider_el.text($(swiper.slides[swiper.activeIndex]).data('text')).css('max-width', curr_width).show().animate({maxWidth: '6.18667rem'}, 1000)
                    }
                    else {
                        _slider_el.animate({maxWidth: 0}, 500, function(){$(this).hide()});
                    }
                }
            });

            new Swiper('.topic-images', {
                direction: 'horizontal',
                slidesPerView: 'auto'
            });

            this.views["topicList"] = new topicList({
                el: ".topic-list",
                context: this,
                forum_id: this.forum_id,
                limit: that.limit,
                init_send_data: {
                    limit: that.limit,
                    offset: 0,
                    state: 50,
                    with_stickings: false,
                    with_announcements: false
                }
            });

            this.views["topicReply"] = new topicReply({
                el: "#pub-box",
                max_images: 9
            });

            //判断bower环境是否为app
            if((global.is_kzapp_ios && global.current_kzapp_ios_version >= 1.3) || (global.is_kzapp_android && global.current_kzapp_android_version >= 1.3)){
                global.env = 'kzapp';
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
                    forum.site_id);
            }

            if((global.is_kzapp_ios && (global.current_kzapp_ios_version >= 1.3)) || (global.is_kzapp_android && (global.current_kzapp_android_version >= 1.4))) {
                that.views["topicReply"].showAudio();
            }
            
            this.views["guideAttention"] = new GuideAttention({forum_id: this.forum_id});

            this.views["topicShare"] = new topicShare({
                el: "#topic-share"
            });

            this.views["joinApply"] = new JoinApply({
                el: "#join-apply"
            });

            that.views["sidebar"] = new SideBar();

            var topics_count = that.views["topicList"].$el.children().length;

            if (topics_count <= 0) {
                that.getForum().then(function(forum) {
                    if (forum.openness == 200 && !(forum.current_user && forum.current_user.is_subscriber)) {
                        $('#forbidden-forum-tip').show();
                    } else {
                        $('#empty-list-tip').show();
                    }
                });
            }

            global.get_current_user().then(function(current_user) {
                var $footer_el = $('.forum-index-footer');
                $footer_el.find('.pub-topic').addClass('logged-in');
                $footer_el.find('.me').addClass('logged-in').html('<img src="' + (current_user.avatar.mid || '/clubv2/images/default-avatar.png') + '">');
                $footer_el.animateCss('fadeInUp');
                $footer_el.show();
            })
            .catch(function() {
                $('.forum-index-footer').animateCss('fadeInUp');
                $('.forum-index-footer').show();
            });

        },

        showSidebar: function () {
            this.views["sidebar"].show();
        },

        showMoreTags: function() {
            $('.tag-slider').hide();
            $('.tag-select').show();
            if (!tag_swipper) {
                tag_swipper = new Swiper('.all-tags', {
                    direction: 'vertical',
                    slidesPerView: 'auto',
                    mousewheelControl: true,
                    freeMode: true
                });
            }
            else {
                tag_swipper.slideTo(0);
            }
        },

        hideMoreTags: function() {
            $('.tag-select').hide();
            $('.tag-slider').show();
        },

        toggleShowStickTopics: function () {
            var sticking_topics_el = $('.sticking-topics');
            if ($('.stick-top-arrow span').hasClass('arrow-down')) {
                var total_num = $('.stick-top-arrow').data('total-num');
                var max_height = total_num/4.0*2.88;
                sticking_topics_el.animate({maxHeight: max_height + 'rem'}, 500, function(){
                    $('.stick-top-arrow span').removeClass('arrow-down').addClass('arrow-up')
                });
            }
            else {
                sticking_topics_el.animate({maxHeight: '2.88rem'}, 500, function(){
                    $('.stick-top-arrow span').removeClass('arrow-up').addClass('arrow-down')
                });
            }
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

        filterTopics: function (ev) {
            this.hideMoreTags();
            var that = this;
            var $tag_el = $(ev.target).closest("[data-tag-id]");
            var sendData = {
                'offset': 0,
                'limit': that.limit
            };
            if ($tag_el.hasClass('all-type')) {
                sendData['state'] = 50;
                sendData['with_stickings'] = false;
                sendData['with_announcements'] = false;
            }
            else if($tag_el.hasClass('star-type')) {
                sendData['state'] = 400;
            }
            else {
                sendData['tag_id'] = $tag_el.data('tag-id');
            }
            $('[data-action="filter-topics"].cur').removeClass('cur');
            $('[data-tag-id="'+$tag_el.data('tag-id')+'"]').addClass('cur');
            var $tag_scroll_el = $('.forum-tag[data-tag-id="'+$tag_el.data('tag-id')+'"]');
            var i = $tag_scroll_el.parent().children().index($tag_scroll_el);
            if (i > 0) {
                tag_scroll_swipper.slideTo(i - 1, 500);
            }
            else if (i == 0) {
                tag_scroll_swipper.slideTo(i, 500);
            }

            that.views["topicList"].reloadTopics(sendData);
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

        goPub: function(ev) {
            var that = this;
            this.testJoin(null, "发表话题").then(function(forum) {
                that.views["topicReply"].show({
                    pub_type: 'pub_topic',
                    placeholder: '发点什么吧...',
                    forum_id: that.forum_id,
                    pub_succ_cb : _.bind(that._pub_succ_cb, that)
                });
            });

        },

        _pub_succ_cb: function(data){
            var that = this;
            if (data){
                alert.closeWaitingNoFadeOut();
                if (data['grade_update'] && data['grade_update']['update']){
                    var score = data['grade_update']['score'],
                        grade = data['grade_update']['grade'];
                    alert.show("话题已发布</br>积分加" + score + ",经验值加" + grade);
                } else {
                    alert.show("话题已发布");
                }
                requests.getTopicHtml(
                    {topic_id: data._id},
                    {},
                    function(html_data){
                        that.$el.find('.topic-list').prepend(html_data);
                        new Swiper('.topic-images', {
                            direction: 'horizontal',
                            slidesPerView: 'auto'
                        });
                    },
                    function(){
                        if(global.is_weixin) {
                            window.location = '/clubv2/forums/' + that.forum_id + "?v=" + (new Date().getTime());
                        }
                        else {
                            window.location = '/clubv2/forums/' + that.forum_id;
                        }
                    }
                );
            }
            else {
                alert.closeWaiting();
            }
        },

        joinForum: function() {
            var that = this;

            return new Promise(function(resolve, reject) {
                that.getForum().then(function(forum) {

                    requests.joinCommunityDirect(
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

    });
})
;
