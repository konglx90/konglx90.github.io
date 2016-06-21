define([
    'components/view',
    'global',
    'text!templates/topic-share.html',
    'text!templates/weixin-share.html',
    'text!templates/qq-share.html'
], function (view, global, template, template2, template3) {

    return view.extend({

        /* 话题分享 */
        /* 
        * init
        * 参数
        *  $el              挂载dom节点
        */
        initialize: function (opts) {
            if (global.is_weixin) {
                this.$el.html(_.template(template2, {}));

            } else if (global.is_qq) {
                this.$el.html(_.template(template3, {}));
            }
            else {
                this.$el.html(_.template(template, {}));
            }
        },

        /* event */
        events: {
            'click [data-role="cancel"]': 'close',
            'click .weixin-share-layer': 'close',
            'click [data-role="submit-share"]': 'submitShare',
            'click [data-role="share-place"] a': 'choosePlace',
            'click .share-layer-bottom': "close"
        },

        /* event funcs */
        close: function () {
            this.$el.find("textarea").val('');
            this.$el.hide();
            $("body").removeClass("no-scroll");
        },

        show: function (opts) {
            this.forum_id = opts.forum_id;
            this.topic_id = opts.topic_id;
            this.comment_id = opts.comment_id;
            if (!this.forum_id) {
                this.$el.find("textarea").attr("placeholder", "很有趣的帖子，小伙伴们来看看吧~");
            }
            else {
                this.$el.find("textarea").attr("placeholder", "很有趣的社区，小伙伴们来看看吧~");
            }
            this.$el.show();
            $("body").addClass("no-scroll");
        },

        choosePlace: function (ev) {
            var $tar = $(ev.target).closest('[data-role]');
            this.$el.find('[data-role="share-place"] a.cur').removeClass("cur");
            $tar.addClass("cur");
            if ($tar.data('role') == 'weixin') {
                this.$el.find('[data-role="share-words"]').hide();
                this.$el.find('[data-role="share-qrcode"]').show();
            }
            else {
                this.$el.find('[data-role="share-qrcode"]').hide();
                this.$el.find('[data-role="share-words"]').show();
            }
        },

        submitShare: function () {
            var content;
            if (this.$el.find("textarea").val()) {
                content = this.$el.find("textarea").val();
            }
            else {
                content = this.$el.find("textarea").attr("placeholder");
            }
            var url;
            var flag = this.$el.find('[data-role="share-place"] a.cur').data("role");

            var buildUrl = window.location.href
            if (this.topic_id) {
                buildUrl = window.encodeURIComponent('http://' + window.location.host + '/club/topic/' + this.topic_id) + '&title=' + window.encodeURIComponent(content);
            }
            else if (this.comment_id) {
                buildUrl = window.encodeURIComponent('http://' + window.location.host + '/club/comment/' + this.comment_id) + '&title=' + window.encodeURIComponent(content);
            }
            else if (this.forum_id) {
                buildUrl = window.encodeURIComponent('http://' + window.location.host + '/clubv2/forums/' + this.forum_id) + '&title=' + window.encodeURIComponent(content);
            }

            var dict = {
                "sina": "http://service.weibo.com/share/share.php?url=",
                "zone": 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=',
                "tengxun": 'http://share.v.t.qq.com/index.php?c=share&a=index&url=',
                "renren": 'http://widget.renren.com/dialog/share?resourceUrl='
            };
            url = dict[flag];

            if (url) {
                window.open(url + buildUrl);
            }
        }
    });
});
