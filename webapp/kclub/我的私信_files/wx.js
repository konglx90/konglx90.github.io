define([
], function () {
    var sign = true;
    var wx_wrapper = {

        get_ready: function(jsApiList, callback, err, options) {
            var that =this;
            if(!sign){
                err && err();
                return;
            }
            if(that.wxsdk && that.wxdata){
                callback && callback(that.wxsdk, that.wxdata);
                return;
            }
            var api_list = ['onMenuShareTimeline', 'onMenuShareAppMessage','startRecord',
                'stopRecord',
                'onVoiceRecordEnd',
                'playVoice',
                'pauseVoice',
                'stopVoice',
                'onVoicePlayEnd',
                'uploadVoice',
                'downloadVoice',
                'chooseImage',
                'previewImage',
                'uploadImage',
                'downloadImage'];
            var data = {'url': window.location.href, 'scene_type': 2};
            if (options && options.is_upload) {
                data.is_upload = options.is_upload;
            }

            if (options && options.site_id) {
                data.site_id = options.site_id;
            }

            require(['wxsdk'], function(wxsdk) {
                $.post(
                    '/club/apiv1/wx/config',
                    data
                ).success(function(wxdata) {
                    console.log("get ready");
                    console.log(wxdata);
                    wxdata['jsApiList'] = api_list;
                        wxsdk.ready(function() {
                            that.wxsdk = wxsdk;
                            if (sign){
                                that.wxdata = wxdata;
                                console.log("callback success");
                                callback && callback(wxsdk, wxdata);
                            }
                        });
                        wxsdk.error(function(res) {
                            console.log("wx error");
                            sign=false;
                            err && err();
                        });

                    wxsdk.config(wxdata);

                }).error(function(){
                        sign=false;
                        err && err();
                });
            });
        },

        config_share: function (title, desc, img, link, callback) {
            console.log(title, desc, img, link);

                this.wxsdk.onMenuShareTimeline({
                    title: title,
                    desc: desc,
                    link: link,
                    imgUrl: img,
                    success: function () {
                        callback && callback();
                    },
                    cancel: function () {
                        callback && callback();
                    }
                });
                this.wxsdk.onMenuShareAppMessage({
                    title: title,
                    desc: desc,
                    link: link,
                    imgUrl: img,
                    success: function () {
                        callback && callback();
                    },
                    cancel: function () {
                        callback && callback();
                    }
                });
        },

        preview_image: function(current_url, urls) {
            this.wxsdk.previewImage({
                current: current_url,
                urls: urls || []
            });
        },

        choose_image:function(callback){
            this.wxsdk.chooseImage({
                success: function (res) {
                    var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    callback(localIds);
                }
            });
        },
        start_record: function (success_callback, error_callback) {
            this.wxsdk.startRecord({
                success : success_callback,
                fail: error_callback
            });
        },
        stop_record:function(callback,error){
             this.wxsdk.stopRecord({
                 success: function (res) {
                     var localId = res.localId;
                     callback(localId);
                 },
                 fail: function(res){
                     error && error();
                 }
             });
        },
        record_end:function(callback){
            this.wxsdk.onVoiceRecordEnd({
                // 录音时间超过一分钟没有停止的时候会执行 complete 回调
                complete: function (res) {
                    console.log('end_record');
                    var localId = res.localId;
                    callback(localId);
                }
            });
        },
        play_audio:function(localId,success_callback){
            this.wxsdk.playVoice({
                localId: localId, // 需要播放的音频的本地ID，由stopRecord接口获得
                success : success_callback
            });
        },
        pause_play:function(localId){
            this.wxsdk.pauseVoice({
                localId: localId // 需要暂停的音频的本地ID，由stopRecord接口获得
            });
        },
        stop_play:function(localId,success_callback){
             this.wxsdk.stopVoice({
                 localId: localId, // 需要停止的音频的本地ID，由stopRecord接口获得
                 success : success_callback
             });
        },
        end_play:function(callback){
            this.wxsdk.onVoicePlayEnd({
                success: function (res) {
                    var localId = res.localId; // 返回音频的本地ID
                    callback(localId);
                }
            });
        },
        upload_audio:function(local_id,callback){
            this.wxsdk.uploadVoice({
                localId: local_id, // 需要上传的音频的本地ID，由stopRecord接口获得
                isShowProgressTips: 1, // 默认为1，显示进度提示
                success: function (res) {
                    var serverId = res.serverId; // 返回音频的服务器端ID
                    callback(serverId);
                }
            });
        },
        upload_image:function(local_id,callback){
            this.wxsdk.uploadImage({
                localId: local_id, // 需要上传的图片的本地ID，由chooseImage接口获得
                isShowProgressTips: 1, // 默认为1，显示进度提示
                success: function (res) {
                    var serverId = res.serverId;// 返回图片的服务器端ID
                    callback(serverId);
                    }
                });
            },
        config_post: function(success, error, site_id) {
            this.get_ready(['startRecord',
                            'stopRecord',
                            'onVoiceRecordEnd',
                            'playVoice',
                            'pauseVoice',
                            'stopVoice',
                            'onVoicePlayEnd',
                            'uploadVoice',
                            'downloadVoice',
                            'chooseImage',
                            'previewImage',
                            'uploadImage',
                            'downloadImage'],
                           success,
                           error,
                           {is_upload: true, site_id: site_id});
        }

    };

    return wx_wrapper;
});
