define([
    'global',
    'components/view',
    'components/face/face-show',
    'components/image-uploader',
    'components/pub-audio',
    'components/pub-video',
    'components/alert',
    'views/guide-attention',
    'text!templates/pub-box.html',
    'text!templates/forum-tags.html',
    'utils/wx',
    'vendor/autosize',
    'requests'
], function (global, view, FaceShow, ImageUploader, PubAudio, PubVideo, alert, GuideAttention, template, forumTagsTpl, wx, autosize, requests) {

    return view.extend({
        views: {},

        /*
        * 话题回复
        * init参数
        *   $el                 挂载dom节点
        *   context             上下文 
        * show(opts)            显示，opts={'topic_id', 'parent_id'}   
        */

        initialize: function (opts) {
            var that = this;

            this.options = opts;

            var config = opts.config || {};
            this.config = {};
            this.config['enable_img'] = config.enable_img !== false;
            this.config['enable_audio'] = config.enable_audio !== false;
            this.config['enable_video'] = config.enable_video !== false;
            this.config['enable_img'] = config.enable_img !== false;
            this.config['enable_add_tag'] = config.enable_add_tag !== false;
            this.config['title'] = config.title !== false;
            this.config['pub_loc'] = config.pub_loc !== false;
            this.config['pub_tag'] = config.pub_tag !== false;
            this.submit_func = opts.submit_func;


            var tpl = _.template(template)
            this.$el.html(tpl({config: this.config}));
            this.context = opts.context;
            this.views["alert"] = alert;
            this.$inputBox = this.$el.find("textarea");

            this.views["imageUploader"] = new ImageUploader({
                el: "[data-role='image-container']",
                limit: opts.max_images || 1
            });
            this.views["imageUploader"].on("loadingImage", function () {
                that.scrollToEle($('.pub-content-wrapper'), $('.pub-pics-show'));
            });
            this.views["imageUploader"].on("addImage", function () {
                that.testKey();
            });
            this.views["imageUploader"].on("removeImage", function () {
                that.testKey();
            });

            this.views["pubAudio"] = new PubAudio({
                el: "[data-role='audio-op-container']",
                limit: 1,
                context: this,
                audio_container: '[data-role="audio-container"]'
            });
            this.views["pubAudio"].on('removeAudio', function() {
                that.testKey();
            });
            this.views["pubAudio"].on('addAudio', function() {
                that.testKey();
                that.scrollToEle($('.pub-content-wrapper'), $('.pub-audios-show'));
            });

            this.views["pubVideo"] = new PubVideo({
                el: "[data-role='video-container']",
                limit: 1,
                context: this
            });
            this.views["pubVideo"].on('removeVideo', function() {
                that.testKey();
            });
            this.views["pubVideo"].on('addVideo', function() {
                that.testKey();
            });
            this.views["pubVideo"].on("loadingVideo", function () {
                that.scrollToEle($('.pub-content-wrapper'), $('.pub-videos-show'));
            });

            this.views["guideAttention"] = new GuideAttention({
                el: "#guide-attention-qr",
                context: this
            });

            this.views["faceShow"] = new FaceShow({
                el: "[data-role='face-container']",
                display: opts.display
            });
            this.views["faceShow"].on("clickface", function (data) {
                var tmpStr = that.$inputBox.val();
                if (typeof(that.startPos)==="undefined") {
                    that.startPos = tmpStr.length > 0 ? tmpStr.length - 1 : 0;
                }
                that.$inputBox.val(tmpStr.substring(0, that.startPos) + data + tmpStr.substring(that.startPos, tmpStr.length));
                that.startPos += data.length;
                that.testKey();
            });

            $(window).on('hashchange', function () {
                if (window.location.hash !== "#pub") {
                    that.close();
                }
            });

            autosize($("textarea"));
        },

        events: {
            "click .pub-tools a[data-action]": "switchUtils",
            "click .pub-tag a[data-action='add-tag']": "clickAddTag",
            "click .pub-location a[data-action='add-location']": "addLocation",
            'click [data-action="submit"]': 'submit',
            'blur textarea': "setTextFocusIndex",
            'click [data-action="select-pub-tag"]': 'selectPubTag',
            'keyup textarea': "testKey",
            'focus textarea': "testKey",
            'input textarea': "testKey",
            "click [data-role='remove-audio']": "removeAudio"
        },


        pub_type_settings: {
            pub_topic:{
                hide_setting: [],
                submit_btn_txt: '发表',
                submit_func: '_pub_topic'

            },
            reply_topic: {
                hide_setting: ['.pub-title', '.pub-tag', '.pub-location', '.pub-tools [data-action="add-tag"]'],
                submit_btn_txt: '回复',
                submit_func: '_reply_topic'
            }
        },

        show: function (opts) {
            window.location.hash = "#pub";
            this.resetPubbox();
            this.pub_type = opts.pub_type || 'pub_topic';
            this.pub_succ_cb = opts.pub_succ_cb;
            _.each(this.pub_type_settings[this.pub_type].hide_setting, function(item){$(item).hide()});
            this.$el.find('[data-action="submit"]').text(this.pub_type_settings[this.pub_type].submit_btn_txt);
            this.forum_id = opts.forum_id;
            this.topic_id = opts.topic_id;
            this.parent_id = opts.parent_id;
            this.$el.find("textarea").attr("placeholder", opts.placeholder);
            this.$el.show();
            this.$el.find("textarea").focus();
            $("body").addClass("no-scroll");
        },

        scrollToEle: function($parentEle, $objEle) {
            $parentEle.animate({
                scrollTop: $objEle.offset().top - $parentEle.offset().top + $parentEle.scrollTop()
            });
        },

        submit: function(){
            if (this.submit_func) {
                this.submit_func(this.getSendContent());
                return
            }
            this[this.pub_type_settings[this.pub_type || 'pub_topic'].submit_func]();
        },

        removeAudio: function(ev){
            if (this.views['pubAudio']) {
                this.views['pubAudio'].removeAudio(ev)
            }
        },

        _reply_topic: function() {
            var that = this;
            this.testKey();
            if (!this.submitVerified) {
                console.log('this.submitVerified', this.submitVerified);
                return;
            }

            if (alert.isWaiting()) {
                return;
            }

            var data = {
                content: that.$inputBox.val(),
                attachment_urls: that.views["imageUploader"].getImages(),
                video_urls: that.views["pubVideo"].getVideos(),
                audios: that.views["pubAudio"].getAudios()
            };

            if (that.parent_id) {
                data["parent_id"] = that.parent_id;
            }
            if (that.options.min_images
                && (!data.attachment_urls || data.attachment_urls.length < that.options.min_images)) {
                alert.show("请至少上传" + that.options.min_images + "张图片");
                return;
            }

            alert.showWaiting();

            requests.replyComments(
                {topic_id: that.topic_id},
                data,
                function (data) {
                    that.back();
                    that.pub_succ_cb(data);
                },
                function (xhr) {
                    if (xhr.status === 400) {
                        alert.show("您没有权限或暂时被禁言");
                    } else {
                        alert.show("回复失败，请稍后再试");
                    }
                    alert.closeWaitingNoFadeOut();
                }
            )
        },


        _pub_topic: function () {
            var that = this;
            this.testKey();
            if (!this.submitVerified) {
                console.log('this.submitVerified', this.submitVerified);
                return;
            }

            if (!this.forum_id) {
                console.log('no forum id');
                return;
            }

            if (alert.isWaiting()) {
                return;
            }
            alert.showWaiting();

            var data = {
                tag_ids: [],
                title: $(".pub-title input").val(),
                content: this.$el.find("textarea").val(),
                attachment_urls: this.views["imageUploader"].getImages(),
                video_urls: this.views["pubVideo"].getVideos(),
                audios: this.views["pubAudio"].getAudios()
            };

            if (this.location) {
                data = $.extend(data, this.location);
            }
            var tag_id = this.$el.find('.pub-tag [data-action="add-tag"]').data('tag_id');
            if (tag_id) {
                data.tag_ids.push(tag_id);
            }

            requests.pubTopic(
                {forum_id: that.forum_id},
                data,
                function (data) {
                    that.back();
                    that.pub_succ_cb(data);
                },
                function (xhr) {
                    if (xhr.status === 400) {
                        that.views["alert"].show("您没有权限或暂时被禁言");
                    } else {
                        that.views["alert"].show("发帖失败，请稍后再试");
                    }
                    alert.closeWaitingNoFadeOut();
                }
            );
        },
        
        getSendContent: function(){
            return {
                tag_ids: [],
                title: $(".pub-title input").val(),
                content: this.$el.find("textarea").val(),
                attachment_urls: this.views["imageUploader"].getImages(),
                video_urls: this.views["pubVideo"].getVideos(),
                audios: this.views["pubAudio"].getAudios()
            }
        },

        selectPubTag: function(ev){
            var $tar = $(ev.target);
            var tag_id = $tar.data('tag-id');
            if (tag_id) {
                if ($tar.hasClass('cur')) {
                    this.$el.find('[data-role="tag-container"] .pub-select-tag').removeClass('cur');
                    this.resetTag();
                }
                else {
                    this.$el.find('[data-role="tag-container"] .pub-select-tag').removeClass('cur');
                    $tar.addClass('cur');
                    this.$el.find('.pub-tag .tag-name').text($tar.text().trim());
                    this.$el.find('.pub-tag i').addClass('selected');
                    this.$el.find('.pub-tag [data-action="add-tag"]').data('tag_id', tag_id);
                }
            }
        },

        clickAddTag: function(ev) {
            this.$el.find('.pub-tools a[data-action="add-tag"]').click();
        },

        switchUtils: function(ev) {
            var that = this;
            var $tar = $(ev.target);
            var $action_el = $tar.closest("[data-action]");
            var data_action = $action_el.data("action");
            if (data_action == "submit-topic"){
                return;
            }
            this.$el.find('.pub-tools a.cur').removeClass('cur');
            $tar.closest('a').addClass('cur');
            this.$el.find('.utils-container').hide();
            switch (data_action) {
                case 'add-image':
                    this.addImage();
                    break;
                case 'add-audio':
                    this.addAudio();
                    break;
                case 'add-video':
                    this.addVideo();
                    break;
                case 'add-tag':
                    this.addTag();
                    break;
                case 'add-face':
                    this.addFace();
                    break;
            }
        },

        addImage: function(){
            this.views["imageUploader"].addImage();
        },

        addVideo: function(){
            if(this.views["pubVideo"].getVideos().length < this.views["pubVideo"].limit){
                this.views["pubVideo"].addVideo();
            }
            else {
                alert.show('只能添加一个视频');
            }
        },

        addAudio: function(){
            var $face_el = this.$el.find("[data-role='audio-op-container']");
            $face_el.show();
        },

        addFace: function(){
            var $face_el = this.$el.find("[data-role='face-container']");
            $face_el.show();
        },

        addTag: function() {
            var that = this;
            this.getForumTags().then(function(forum_tags){
                if (!that.$el.find("[data-role='tag-container']").html().trim()) {
                    that.$el.find("[data-role='tag-container']").html(_.template(forumTagsTpl)({forum_tags:forum_tags})).show();
                }
                else {
                    that.$el.find("[data-role='tag-container']").show();
                }
            })
        },

        addLocation: function () {
            var that = this;
            var $noLocal = this.$el.find(".no-loc");
            var $loadingLocal = this.$el.find(".loc-loading");
            var $gotLocal = this.$el.find(".got-loc");

            var handle_error = function(err) {
                $noLocal.show();
                $gotLocal.hide();
                $noLocal.find("[data-role='content']").html("获取地址失败");
                $loadingLocal.hide();
            };

            var show_map = function(position) {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;

                $.ajax({
                    url: "http://api.map.baidu.com/geocoder/v2/?callback=?",
                    "dataType": "jsonp",
                    "type": "get",
                    "data": {
                        ak: '48da9553cdc8a1f9475beaea226eaedd',
                        location: latitude + "," + longitude,
                        output: "json",
                        coordtype: "wgs84ll",
                        pois: 0
                    },
                    success: function (data) {
                        if (data.status === 0 && data.result.formatted_address) {
                            $noLocal.hide();
                            $noLocal.find("[data-role='content']").html("获取地址失败");
                            $loadingLocal.hide();
                            that.location = {
                                geo_address: data.result.formatted_address,
                                geo_latitude: latitude,
                                geo_longitude: longitude
                            };
                            $gotLocal.show().find("[data-role='content']").html(data.result.formatted_address);
                        } else {
                            handle_error();
                        }
                    },
                    error: handle_error
                })
            };

            if (navigator.geolocation) {
                $noLocal.hide();
                $gotLocal.hide();
                $loadingLocal.show();
                navigator.geolocation.getCurrentPosition(show_map, handle_error);
            }
            else {
                error('not supported');
            }
        },

        getForumTags: function() {
            var that = this;

            return new Promise(function(resolve, reject) {
                if (that.forum_tags) {
                    resolve(that.forum_tags);
                }
                else {
                    var forum_tags = $('.main-content').data('forum-tags');
                    if (forum_tags) {
                        that.forum_tags = forum_tags;
                        resolve(that.forum_tags);
                    }
                    else {
                        requests.getForumTags(
                            {forum_id: that.forum_id},
                            {},
                            function(data) {
                                that.forum_tags = data;
                                resolve(that.forum_tags);
                            },
                            function(){
                                reject();
                            }
                        )
                    }
                }
            });
        },

        setTextFocusIndex: function () {
            this.testKey();
            this.startPos = this.$inputBox[0].selectionStart;
        },

        close: function () {
            this.$el.hide();
            $("body").removeClass("no-scroll");
        },

        back: function () {
            if ( window.location.hash === "#pub") {
                window.history.back();
            } else {
                window.location.hash = '';
            }
        },

        testKey: function () {
            var $el = this.$el.find("textarea");
            var $btn = this.$el.find('[data-action="submit"]');
            this.submitVerified = false;
            if ($el.val().length > 0) {
                this.submitVerified = true;
            }
            else if (this.views["imageUploader"].getImages().length > 0) {
                this.submitVerified = true;
            }
            else if (this.views["pubVideo"].getVideos().length > 0) {
                this.submitVerified = true;
            }
            else if (this.views["pubAudio"].getAudios().length > 0) {
                this.submitVerified = true;
            }

            this.submitVerified ? $btn.addClass("cur") : $btn.removeClass("cur");
        },

        resetPubbox: function(){
            var that = this;
            _.each(_.keys(this.pub_type_settings), function(_key){_.each(that.pub_type_settings[_key].hide_setting, function(item){$(item).show()});})
            this.$el.find(".pub-title input").val('');
            this.$el.find("textarea").val('');
            this.$el.find('a.cur').removeClass('cur');
            this.$el.find('.i.selected').removeClass('selected');
            this.views["imageUploader"].clearImage();
            this.views["pubVideo"].clearVideo();
            this.views["pubAudio"].clearAudio();
            this.resetTag();
            this.removeLocation();
        },

        showAudio: function(){
            this.$el.find('.pub-tools [data-action="add-audio"]').show();
        },

        showGuideAttentionQrCode: function() {
        },

        resetTag: function(){
            this.$el.find('.pub-tag i').removeClass('selected');
            this.$el.find('.pub-tag .tag-name').text('点击添加标签');
            this.$el.find('.pub-tag [data-action="add-tag"]').data('tag_id', '');
        },

        removeLocation: function () {
            this.location = null;
            var $noLocal = this.$el.find(".no-loc");
            var $loadingLocal = this.$el.find(".loc-loading");
            var $gotLocal = this.$el.find(".got-loc");
            $noLocal.find("[data-role='content']").html("点击获取地址");
            $noLocal.show();
            $gotLocal.hide();
            $loadingLocal.hide();
        }

    });
});
