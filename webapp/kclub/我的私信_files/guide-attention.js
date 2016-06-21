define([
    'components/view',
    'global',
    'components/alert',
    'requests',
    'text!templates/guide-attention.ejs'
], function (view, global, alert, requests, tpl_guide_attention) {


    return view.extend({
        /*
        * 引导关注
        * show()                显示
        * hide()                隐藏
        */
        tagName: 'div',
        id: 'guide-attention-container',
        template: _.template(tpl_guide_attention),
        initialize: function (opts) {
            var that = this;

            that.bottom = opts.bottom || 100;
            that.is_wx = global.is_weixin;
            that.forum_id = opts.forum_id;

            that.bottom = opts.bottom || false;
            if (!global.is_kzapp_android && !global.is_kzapp_ios) {
                requests.guideAttention(
                    {forum_id: that.forum_id},
                    {},
                    function(json){
                        if (json && json.is_open && !json.is_followed && json.display_mode) {
                            that.config = json;
                            that.render();
                            that.delayShow()
                        }
                    },
                    function(){}
                );
            }
        },

        events: {
            "click .guide-attention--backdrop": "backdrop_click",
            "click .js-attention": "showQr",
            "click .js-close": "hideGuideAttention",
            "click .qr-content": "stopPropagation"
        },

        render: function(){
            var that = this;
            this.$el.html(this.template({config: this.config, is_wx: this.is_wx, bottom: this.bottom}));
            if (!document.getElementById(that.id)) {
                $('body').append(this.el);
            }
            this.delegateEvents();
        },

        delayShow: function() {
            if (global.is_kzapp_android || global.is_kzapp_ios) {
                return;
            }
            if (!this.config.display_mode.footer) {
                return;
            }
            var that = this;
            var delay = that.config.delay_time_status && that.config.delay_time * 1000 || 0;
            setTimeout(
                function() {
                    that.$el.find('.guide-attention').animateCss('fadeInUp');
                    that.$el.find('.guide-attention').show();
                    that.delayHide();
                },
                delay
            )
        },

        delayHide: function(){
            var that = this;
            var duration = that.config.continue_time_status && that.config.continue_time * 1000 || 0;
            if (!duration) {
                return;
            }
            setTimeout(
                that.hideGuideAttention(),
                duration
            )
        },

        checkShowQr: function () {
            if (global.is_kzapp_android || global.is_kzapp_ios) {
                return;
            }
            var that = this;
            requests.getForumFollow(
                {forum_id: this.forum_id},
                {},
                function (data) {
                    if (data && data.is_open && !data.is_followed) {
                        that.showQr();
                    }
                }
            )
        },

        showQr: function() {
            this.$el.find('.guide-attention--backdrop').show();
            this.$el.find('.guide-attention--backdrop .qr-content').animateCss('fadeIn');
            $('body').addClass('no-scroll');
        },
        
        backdrop_click: function () {
            this.$el.find('.guide-attention--backdrop').hide();
            $('body').removeClass('no-scroll');
        },
        hideGuideAttention: function() {
            var that = this;
            that.$el.find('.guide-attention').animateCss(
                'fadeOutDown',
                function() {
                    that.$el.find('.guide-attention').hide();
                }
            );
        },
        stopPropagation: function(ev) {
            ev.preventDefault();
            ev.stopPropagation();
        },
        /*
        * tool function
        * */
        is_animating: function() {
            return this.$el.find('.guide-attention--animate').hasClass('animated');
        }

    });
});
