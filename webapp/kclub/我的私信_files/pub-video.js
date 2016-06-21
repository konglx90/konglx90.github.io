define([
    'global',
    'components/view',
    'utils/imageUploader',
    'components/alert',
    'utils/exif',
    'text!templates/pub-video.html'
],
function (global, view, imageUploader, alert, exif, template) {

    /*
    * 上传视频
    * init参数
    *   $el                 挂载dom节点
    *   context             上下文
    *   limit               视频个数限制
    */
    return view.extend({
        display: "normal",
        views: {},

        initialize: function (opts) {
            this.$el.html(template);

            this.context = opts.context;

            this.limit = opts.limit || 1;
            if (this.limit > 1) {
                this.$el.find('input:file').attr("multiple", "multiple");
            }
        },

        events: {
            "change input:file": "videoUpload",
            "click [data-role='remove-video']": "removeVideo",
        },
        
        appPubVideo:function(ev){
            var that = this;
            try {
                window.kzsdk.videoOperate({
                    operateType:2,
                    callback:function(videoUrl){
                        that.appendVideo(videoUrl);
                    }
                });
            } catch (error){
                console.log("app choose or record video error");
            }

        },

        addVideo: function(ev) {
            switch(global.env){
                case 'kzapp':
                    this.appPubVideo();
                    break;
                default:
                    this.$el.find('input').click();
            }
        },

        removeVideo: function (ev) {
            $(ev.target).closest("li").remove();

            var $add = this.$el.find('[data-role="add-video"]');
            if (this.getVideos().length >= this.limit) {
                $add.hide();
            } else {
                $add.show();
            }

            this.trigger("removeVideo");
        },

        clearVideo: function () {
            this.$el.find('li[data-video]').remove();
            this.trigger("removeVideo");
        },

        getVideos: function () {
            var videos = [];
            this.$el.find('[data-video]').each(function () {
                videos.push($(this).data('video'));
            });
            return videos;
        },

        appendVideo: function (url) {
            var that = this;
            //金庸说：裁图需要100毫秒
            setTimeout(function () {
                $("<li data-video='" + url + "'><a><img src='" + url + "/imageView/v1/thumbnail/152x152'><i data-role='remove-video' class='icon-close'></i><span class='g-black-cover'></span><i class='icon-video k-i-play g-mid-abs'></i></li>").insertBefore(that.$el.find('ul [data-role="loading"]'));
                if (that.getVideos().length >= that.limit) {
                    that.$el.find('[data-role="add-video"]').hide();
                }
                that.trigger("addVideo");
            }, 100);
        },

        uploadHandler: function (file, postfix, callback) {
            var that = this;
            var uploader;

            uploader = imageUploader("/club/apiv1/me/upload");
            uploader.appendInput({name: "file", value: file})
            if (postfix) {
                uploader.appendInput({name: 'postfix', value: postfix});
            }

            uploader.submit(
                function (data) {
                    that.hideLoading();
                    callback();

                    if (!data || !data.data || data.data == "http://pic.kuaizhan.com/") {
                        alert.show("视频上传失败");
                        return;
                    }

                    that.appendVideo(data.data);
                },
                function (code, message) {
                    that.hideLoading();
                    callback();
                    alert.show(message || "图片上传失败");
                }
            );
        },

        videoUpload: function (ev) {
            console.log('videoUpload');
            var that = this;

            var $file = this.$el.find("input:file");
            if ($file[0].files.length <= 0) {
                console.log('have not chosen video.');
                return;
            }
            var count = $file[0].files.length;
            var existsCount =  that.getVideos().length;
            var index = 0;

            var upload;
            upload = function() {
                console.log('upload video', index);
                if (index >= count || (index + existsCount)>=that.limit) {
                    $file.val("");
                    return;
                }

                var file = $file[0].files[index];
                console.log(file.type);

                var regex = /\.([^\.]+)$/;
                var postfix = (file.name && file.name.match(regex)) ? file.name.match(regex)[1].toLowerCase() : '';

                if (postfix == '') {
                    postfix = 'mp4';
                    // Useless. You can't change name property in File object.
                    //file.name = file.name + '.mp4';
                }
                if (!postfix.match(/^(mpeg4|mp4|mov|avi|wmv|asf|odd|3gp)$/)) {
                    alert.show('暂不支持所选视频格式，仅支持<br>mpeg4,mp4,mov,avi,wmv,asf,odd,3gp');
                    return;
                }
                console.log('file.size:', file.size);
                if (file.size > 50 * 1024 * 1024) {
                    var size_mb = parseInt(file.size / (1024 * 1024));
                    alert.show("视频不能大于 50 MB，所选视频 " + size_mb + " MB");
                    return;
                }

                that.showLoading();
                that.uploadHandler(file, postfix, function () {
                    index++;
                    upload()
                });
            };

            upload();
        },

        showLoading: function () {
            this.trigger('loadingVideo');
            this.$el.find('li[data-role="loading"]').show();
        },

        hideLoading: function () {
            this.$el.find('li[data-role="loading"]').hide();
        }
    });
});
