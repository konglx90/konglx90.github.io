define([
    'global',
    'views/view',
    'text!templates/guide-attention-qr-code.html',
    'requests'
],
function (global, view, template, requests) {

    return view.extend({
        initialize: function (opts) {
            this.$el.html(template);
        },

        views: {},

        events: {
            'click .guide-close-qr-icon': 'close',
            'click .guide-attention-qr-code': 'close',
            'click .content-wrapper': 'preventClose'
        },

        close: function (ev) {
            this.$el.hide();
            $("body").removeClass("no-scroll");
        },

        preventClose: function (ev) {
            ev.preventDefault();
            ev.stopPropagation();
        },

        showQr: function () {
            if (global.is_kzapp_android || global.is_kzapp_ios) {
                return;
            }
            var that = this;
            var forum_id = this._get_forum_id();
            if (forum_id) {
                this._getAndCacheOfficialAccountRule(forum_id, function(guide_data) {
                    if (guide_data) {
                        if (global.is_weixin) {
                            that.$el.find(".guide-attention-qr-code .prefix-tips-one").text("长按后");
                            that.$el.find(".guide-attention-qr-code .red-bold-one").text("识别二维码");
                            that.$el.find(".guide-attention-qr-code .prefix-tips-one-one").text("");
                            that.$el.find(".guide-attention-qr-code .prefix-tips-two").text("快来");
                        }
                        else {
                            that.$el.find(".guide-attention-qr-code .prefix-tips-one").text("请保存");
                            that.$el.find(".guide-attention-qr-code .red-bold-one").text("二维码");
                            that.$el.find(".guide-attention-qr-code .prefix-tips-one-one").text("图片");
                            that.$el.find(".guide-attention-qr-code .prefix-tips-two").text("用微信识别，");
                        }
                        that.$el.find(".guide-attention-qr-code .qr-code").attr("src", guide_data.account_qr_code);
                        that.$el.show();
                        $("body").addClass("no-scroll");
                    }
                });
            }
        },

        checkShowQr: function () {
            if (global.is_kzapp_android || global.is_kzapp_ios) {
                return;
            }
            var that = this;
            var forum_id = this._get_forum_id();
            if (forum_id) {

                requests.getForumFollow(
                    forum_id,
                    {},
                    function (data) {
                        if (data && data.is_open && !data.is_followed) {
                            that.showQr();
                        }
                    }
                )
            }
        },

        showGuideAttentionBar: function(guide_data) {
            if (global.is_kzapp_android || global.is_kzapp_ios) {
                return;
            }
            if (!guide_data) {
                return;
            }
            var that = this;
            var delay_time = 0;
            if(guide_data.delay_time_status) {
                delay_time = guide_data.delay_time;
            }
            $('.guide-attention .official-avatar').attr('src', guide_data.account_avatar);
            $('.guide-attention .title').text(guide_data.title);
            setTimeout(function(){
                $('.fake-guide-attention-bar').show();
                $('.guide-attention').show();
                var continue_time = 0;
                if(guide_data.continue_time_status) {
                    continue_time = guide_data.continue_time;
                }
                if (continue_time != 0) {
                    setTimeout(function(){
                        that.closeGuide();
                    }, 1000*continue_time);
                }
            }, 1000*delay_time);
        },

        _getAndCacheOfficialAccountRule: function(forum_id, callback) {
            var official_account_rule = $('.main-content').data('official-account-rule');
            if (official_account_rule) {
                callback(official_account_rule);
                return;
            }

            requests.getForumFollow(
                forum_id,
                {},
                function (data) {
                    if (data) {
                        $('.main-content').data('official-account-rule', data);
                        callback(data);
                    }
                }
            )
        },

        _get_forum_id: function() {
            var forum_id;
            var main_content = $('.main-content');
            var forum = main_content.data('forum');
            if (forum) {
                forum_id = forum._id;
            }
            if (!forum_id) {
                var topic = main_content.data('topic');
                if (topic) {
                    forum_id = topic.forum_id;
                }
            }
            return forum_id;
        },

        checkShowGuideAttentionBar: function() {
            if (global.is_kzapp_android || global.is_kzapp_ios) {
                return;
            }
            var forum_id = this._get_forum_id();
            if (forum_id) {
                var that = this;
                try {
                    this._getAndCacheOfficialAccountRule(forum_id, function (data){
                        if (data && data.is_open && !data.is_followed && data.display_mode && data.display_mode.footer) {
                            that.showGuideAttentionBar(data);
                        }
                    });
                }
                catch (e) {
                }
            }
        },

        closeGuide: function() {
            $('.guide-attention').hide();
        }

    });
});
