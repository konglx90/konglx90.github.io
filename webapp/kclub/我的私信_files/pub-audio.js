define([
    'global',
    'components/view',
    'components/alert',
    'utils/exif',
    'text!templates/pub-audio.html',
    'utils/wx',
    'requests'
],
function (global, view, alert, exif, template, wx, requests) {

    /*
    * 语音上传
    * 参数
    *   $el                     挂载dom节点
    *   context                 前后问
    *   limit                   语音个数限制
    */
    return view.extend({
        display: "normal",
        views: {},

        initialize: function (opts) {
            this.$el.html(template);

            this.context = opts.context;

            this.limit = opts.limit || 1;
            if (opts.audio_container) {
                this.audio_container_el = $(opts.audio_container);
            }
        },

        events: {
            'click .record-link':'startRecording',
            'click .stop-link':'stopRecording',
            "click [data-role='remove-audio']": "removeAudio",
            'click .play':"playAudio",
            'click .stop':"stopAudio"
        },
        removeAudio: function (ev) {
            var audio_id = $(ev.target).closest("[data-audio]").find('[data-audio-id]').data('audio-id');
            this.$el.find('.audio-product [data-audio-id="' + audio_id + '"]').closest(".audio-product").remove();
            if (this.audio_container_el) {
                this.audio_container_el.find('.audio-product-show [data-audio-id="' + audio_id + '"]').closest(".audio-product-show").remove();
            }
            var $add = this.$el.find('[data-role="add-audio"]');
            if (this.getAudios().length >= this.limit) {
                $add.hide();
            } else {
                $add.show();
            }

            this.trigger("removeAudio");
        },
        clearAudio: function () {
            this.$el.find('li[data-audio]').remove();
            $('[data-role="add-audio"]').show();
            this.trigger("removeAudio");

            var that = this;
            that.hideLoading();
        },
        getAudios: function () {
            var audios = [];

            this.$el.find('[data-audio]').each(function () {
                var voice = {};
                voice.url = $(this).data('audio');
                audios.push(JSON.stringify(voice));
            });
            return audios;
        },
        appendAudio: function (url,localId) {
            var that = this;
            setTimeout(function () {
                that.$el.find('[data-role="audio-play-control"]').append('<li data-audio="' + url +'" class="audio-product"><a data-audio-id="' + localId + '" class="audio-bar play" href="javascript:void(0)"><audio class="audio-show" src="' + url +'"></audio><div class="g-pos-relative g-mid-abs"><span class="pub-time g-va-mid"></span><span class="bar-icon g-va-mid"></span></div></a><a href="javascript:void(0)" data-role="remove-audio" class="bar-close kclub-icon"></a></li>').show();
                if (that.audio_container_el) {
                    that.audio_container_el.append('<li data-audio="' + url +'" class="audio-product-show"><a data-audio-id="' + localId + '" class="audio-bar play" href="javascript:void(0)"><audio class="audio-show" src="' + url +'"></audio><div class="g-pos-relative g-mid-abs"><span class="pub-time g-va-mid"></span><span class="bar-icon g-va-mid"></span></div></a><a href="javascript:void(0)" data-role="remove-audio" class="bar-close kclub-icon"></a></li>')
                }
                if (that.getAudios().length >= that.limit) {
                    that.$el.find('[data-role="add-audio"]').hide();
                }
                $('.pub-time').html(that.time);
                that.trigger("addAudio");
            }, 100);
        },

        startRecording: function(){
            var that = this;

            if(global.env == 'wx'){
                if (that.is_recordding) {
                    return;
                }
                that.is_recordding = true;
                wx.start_record(
                    function (){
                        that.$el.find('.record-link').addClass('stop-link').removeClass('record-link');
                        that.$el.find('.record-tip').hide();
                        that.$el.find('.stop-record-tip').show();
                        that.$el.find('.record-time').show();
                        var sec = 0;
                        var wid = 100;
                        $('.speed-bar').css('width', wid + "%");
                        that.$el.find('.time-code').html(sec+'\'\'');
                        t = setInterval(function(){
                            sec++;
                            wid = (60-sec)/60.0*100;
                            $('.speed-bar').css('width', wid + "%");
                            if(sec == 60){
                                alert.show("录音已达1分钟");
                                clearInterval(t);
                            }
                            $('.time-code').html(sec+'\'\'');
                            return sec;
                        },1000)  ;
                        wx.record_end(function(localId){
                            that.stopHandle(localId);
                        })

                    },
                    function(){
                        wx.stop_record(function(localId){
                            that.is_recordding = false;
                            that.startRecording();
                        },function(){
                            that.is_recordding = false;
                            that.$('.record-time').remove();
                            that.$('.stop-link').addClass('record-link');
                            that.$('.record-link').removeClass('stop-link');
                            that.$('.record-tip').addClass('show');
                            that.$('.stop-record-tip').removeClass('show');
                        })
                    });
            } else if ((global.is_kzapp_ios && (global.current_kzapp_ios_version >= 1.3)) || (global.is_kzapp_android && (global.current_kzapp_android_version >= 1.4))){
                try{
                    window.kzsdk.record({callback:function (url){
                        that.appendAudio(url, 0);
                    }});
                } catch (error){
                    console.log("kzapp record error");
                }
            }
        },


        stopRecording: function(){
            if (!this.is_recordding) {
                return;
            }
            clearInterval(t);
            this.time = $('.time-code').html();
            var that = this;

            wx.stop_record(function(localId){
                that.is_recordding = false;
                if(parseInt(that.time)<1){
                    alert.show("多说两句吧……");
                    that.$('.record-time').hide();
                    that.$('.stop-link').addClass('record-link').removeClass('stop-link');
                    that.$('.record-tip').show();
                    that.$('.stop-record-tip').hide();
                }  else{
                    that.stopHandle(localId);
                }
            },function(){
                that.is_recordding = false;
                that.$('.record-time').hide();
                that.$('.stop-link').addClass('record-link').removeClass('stop-link');
                that.$('.record-tip').show();
                that.$('.stop-record-tip').hide();
            })
        },

        stopHandle: function(localId){
            this.time = $('.time-code').html();
            var that = this;
            that.is_recordding = false;
            this.$('.record-time').hide();
            this.$('.stop-link').addClass('record-link').removeClass('stop-link');
            this.$('.record-tip').show();
            this.$('.stop-record-tip').hide();

            that.$el.find('[data-role="add-audio"]').hide();

            that.showLoading();
            wx.upload_audio(localId,function(serverId){

                requests.wxUploadMedia(
                    {},
                    {app_id: wx.wxdata.appId, media_id: serverId},
                    function (data) {
                        that.hideLoading();
                        that.appendAudio(data.data,localId);
                    },
                    function(){
                        alert.show("语音上传失败");
                        that.hideLoading();
                    }
                )

            });
        },

        playAudio:function(ev){
            if(global.env == 'wx'){
                var $el = $(ev.target).closest(".audio-bar");
                var localId = $el.data("audio-id");
                wx.play_audio(localId,function(){
                    $el.removeClass('play').addClass('stop');
                    wx.end_play(function(){
                        $el.removeClass('stop').addClass('play');
                    });
                });
            } else if((global.is_kzapp_ios && (global.current_kzapp_ios_version >= 1.3)) || (global.is_kzapp_android && (global.current_kzapp_android_version >= 1.4))){
                // window.alert('play');
                var $el = $(ev.target).closest(".audio-product");
                $el.find('.audio-show')[0].play();
                var playController = $el.find(".audio-bar");
                playController.removeClass('play').addClass('stop');
                $el.find('.audio-show').on('ended',function(){
                    playController.removeClass('stop').addClass('play');
                });
            }
        },

        stopAudio:function(ev){
            if(global.env == 'wx'){
                var $el = $(ev.target).closest(".audio-bar");
                var localId = $el.data("audio-id");
                wx.stop_play(localId,function(){
                    $el.removeClass('stop').addClass('play');
                });
            } else if((global.is_kzapp_ios && (global.current_kzapp_ios_version >= 1.3)) || (global.is_kzapp_android && (global.current_kzapp_android_version >= 1.4))){
                var $el = $(ev.target).closest(".audio-product");
                $el.find('.audio-show')[0].pause();
                $el.find(".audio-bar").removeClass('stop').addClass('play');
            }
        },

        showLoading: function () {
            this.$el.find('li[data-role="loading"]').show();
        },

        hideLoading: function () {
            this.$el.find('li[data-role="loading"]').hide();
        }
    });
});
