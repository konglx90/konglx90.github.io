define([
    'global',
    'components/view',
    'utils/imageUploader',
    'components/alert',
    'utils/exif',
    'text!templates/image-uploader.html',
    'utils/wx',
    'requests'
],
function (global, view, imageUploader, alert, exif, template, wx, requests) {

    /*
    * 图片上传（带有展示框）
    * 参数
    *   $el                 挂载dom节点
    *   context             上下文
    *   limit               最多添加图片数
    * clearImage()          清楚所有图片
    */
    return view.extend({
        views: {},

        initialize: function (opts) {
            var that = this;
            this.$el.html(template);
            this.views["alert"] = alert;
            this.limit = opts.limit || 9;

            if (this.limit > 1) {
                this.$el.find('input:file').attr("multiple", "multiple");
            }

            if(opts.show_input){
                this.$el.find('input:file').show();
            }

        },

        events: {
            "change input:file": "imageUpload",
            "click [data-role='remove-image']": "removeImage"
        },

        removeImage: function (ev) {
            $(ev.target).closest("li").remove();
            var $add = this.$el.find('[data-role="add-image"]');
            if (this.getImages().length >= this.limit) {
                $add.hide();
            } else {
                $add.show();
            }
            this.trigger("removeImage");
        },

        addImage: function (ev) {
           switch(global.env){
                case 'kzapp':
                    this.appImageUpload();
                    break;
                case 'wx':
                    this.chooseImage();
                    break;
                default:
                    this.$el.find('input:file').click();
            }
        },

        clearImage: function () {
            this.$el.find('li[data-img]').remove();
            this.trigger("removeImage");
        },

        appImageUpload:function(){
            var that = this;
            if(global.is_kzapp_android && (global.current_kzapp_android_version == 1.3)){
                window.kzsdk.ready({
                    readyCallback: function () {
                        window.kzsdk.choose_pic(function(url){//1.3版本使用该旧api
                            var urls = JSON.parse(url);
                            setTimeout(function () {
                                for( var index in urls){
                                    $("<li data-img='" + urls[index] + "'><a><img src='" + urls[index] + "/imageView/v1/thumbnail/152x152'><i data-role='remove-image' class='icon-close'></i></li>").insertBefore(that.$el.find('ul [data-role="loading"]'));
                                    if (that.getImages().length >= that.limit) {
                                        that.$el.find('[data-role="add-image"]').hide();
                                    }
                                }
                                that.trigger("addImage");
                            }, 100);
                        })
                    },
                    errorCallback: function () {
                        //非SDK环境
                    }
                });
            } else if ((global.is_kzapp_ios && (global.current_kzapp_ios_version >= 1.3)) ||(global.is_kzapp_android && (global.current_kzapp_android_version >= 1.4))) {
                try {//android 1.4之后, ios 1.3之后使用新的api
                    window.kzsdk.pictureOperate({
                        operateType:2,
                        callback:function(url){
                            that.appendImage(url);
                    }});
                } catch (error) {
                    console.log('app image upload failed: function appImageUploadNew()...');
                }
            }
            
        },

        chooseImage: function(){
            var that = this;
            wx.choose_image(function(localIds){
                if(localIds.length == 0){
                    return ;
                }
                that.showLoading();
                var item = localIds.shift();
                function download(localId){
                    wx.upload_image(localId,function(serverId){
                        //$.ajax({
                        //    url: "/club/apiv1/wx/media/download",
                        //    type: 'POST',
                        //    data: {
                        //        app_id: wx.wxdata.appId,
                        //        media_id: serverId
                        //    },
                        //    success: function (data) {
                        //        that.appendImage(data.data);
                        //        if(localIds.length == 0){
                        //            that.hideLoading();
                        //            return ;
                        //        }
                        //        download(localIds.shift());
                        //    },
                        //    error:function(){
                        //        that.views["alert"].show("图片上传失败");
                        //    }
                        //});

                        requests.wxUploadMedia(
                            {},
                            {app_id: wx.wxdata.appId, media_id: serverId},
                            function (data) {
                                that.appendImage(data.data);
                                if (localIds.length == 0) {
                                    that.hideLoading();
                                    return;
                                }
                                download(localIds.shift());
                            },
                            function(){
                                that.views["alert"].show("图片上传失败");
                            }
                        )

                    });
                }
                download(item);
            });
        },

        imageUpload: function (ev) {
            var $file = this.$("input:file");
            if ($file[0].files.length <= 0) {
                return;
            }
            var count = $file[0].files.length;
            var that = this;
            var existsCount =  that.getImages().length;
            var index = 0;


            function upload() {

                //console.log(i);
                if (index >= count || (index + existsCount)>=that.limit) {
                    $file.val("");
                    return;
                }
                that.showLoading();
                var file = $file[0].files[index];
                var Orientation = null;
                EXIF.getData(file, function () {
                    Orientation = this.exifdata.Orientation;
                });
                var url = webkitURL.createObjectURL(file);
                var $img = new Image();

                $img.onload = function () {
                    if (file.type === "image/gif") {
                        that.uploadHandler(file, null, function () {
                            index++;
                            upload();
                        });
                        return;
                    }
                    //if(file.)
                    //console.log(Orientation);


                    var width = $img.width,
                        height = $img.height,
                        scale = width / height;
                    var $canvas = $("<canvas></canvas>");
                    var ctx = $canvas[0].getContext('2d');
                    var canvas = $canvas[0];

                    //width = width < 1280 ? width : 1280;
                    //height = parseInt(width / scale);
                    if (width >= height) {
                        height = height < 640 ? height : 640;
                        width = parseInt(height * scale);
                    }
                    else {
                        width = width < 640 ? width : 640;
                        height = parseInt(width / scale);
                    }

                    //$canvas.appendTo("body");
                    if (Orientation == 6) {
                        $canvas.attr({width: height, height: width });
                        ctx.rotate(0.5 * Math.PI);
                        ctx.translate(0, -height);


                    } else if (Orientation == 8) {
                        $canvas.attr({width: height, height: width });
                        ctx.rotate(-.5 * Math.PI);
                        ctx.translate(-width, 0);


                    } else if (Orientation == 3) {
                        $canvas.attr({width: width, height: height });
                        ctx.rotate(Math.PI);
                        ctx.translate(-width, -height);

                    } else {
                        $canvas.attr({width: width, height: height});

                    }
                    if (global.is_apple && /OS\s[4|5|6|7]_/ig.test(window.navigator.userAgent)) {
                        //window.alert(window.navigator.userAgent);
                        //ctx.drawImage($img, 0, 0, width, width);

                        function detectVerticalSquash(img) {
                            var iw = img.naturalWidth, ih = img.naturalHeight;
                            var canvas = document.createElement('canvas');
                            canvas.width = 1;
                            canvas.height = ih;
                            var ctx = canvas.getContext('2d');
                            ctx.drawImage(img, 0, 0);
                            var data = ctx.getImageData(0, 0, 1, ih).data;
                            // search image edge pixel position in case it is squashed vertically.
                            var sy = 0;
                            var ey = ih;
                            var py = ih;
                            while (py > sy) {
                                var alpha = data[(py - 1) * 4 + 3];
                                if (alpha === 0) {
                                    ey = py;
                                } else {
                                    sy = py;
                                }
                                py = (ey + sy) >> 1;
                            }
                            var ratio = (py / ih);
                            return (ratio === 0) ? 1 : ratio;
                        }

                        /**
                         * A replacement for context.drawImage
                         * (args are for source and destination).
                         */
                        function drawImageIOSFix(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
                            var vertSquashRatio = detectVerticalSquash(img);
                            console.log(vertSquashRatio);
                            // Works only if whole image is displayed:
                            // ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
                            // The following works correct also when only a part of the image is displayed:
                            ctx.drawImage(img, sx * vertSquashRatio, sy * vertSquashRatio,
                                sw * vertSquashRatio, sh * vertSquashRatio,
                                dx, dy, dw, dh);
                        }

                        //console.log('image to unsquish', myImage);
                        // draw it up and to the left by half the width
                        // and height of the image

                        drawImageIOSFix(ctx, $img, 0, 0, $img.width, $img.height, 0, 0, width, height);


                    } else {
                        ctx.drawImage($img, 0, 0, width, height);
                    }

                    console.log(file.type);
                    var base64 = $canvas[0].toDataURL("image/jpeg", 0.5);
                    that.uploadHandler(file, base64, function () {
                        index++;
                        upload()
                    });


                }
                $img.onerror = function () {
                    that.views["alert"].show("图片上传失败");
                    that.hideLoading();
                    index++;
                    upload();
                }
                $img.src = url;
            }

            upload(index);

        },
        appendImage: function (url) {
            var that = this;
            //金庸说：裁图需要100毫秒
            setTimeout(function () {
                $("<li data-img='" + url + "'><a><img src='" + url + "/imageView/v1/thumbnail/152x152'><i data-role='remove-image' class='icon-close'></i></li>").insertBefore(that.$el.find('ul [data-role="loading"]'));
                if (that.getImages().length >= that.limit) {
                    that.$el.find('[data-role="add-image"]').hide();
                }
                that.trigger("addImage");
            }, 100);
        },
        uploadHandler: function (file, base64, callback) {
            var that = this;
            var uploader;
            if (base64) {
                uploader = imageUploader();
                uploader.appendInput({name: "filename", value: file.name})
                    .appendInput({name: "filebody", value: base64.substr(22)})
                    .appendInput({name: "content_type", value: 'image/jpeg'})
            } else {
                uploader = imageUploader("/club/apiv1/me/upload");
                uploader.appendInput({name: "file", value: file})
            }

            uploader.submit(
                function (data) {

                    that.hideLoading();
                    callback();
                    if (!data || !data.data || data.data == "http://pic.kuaizhan.com/") {
                        that.views["alert"].show("图片上传失败");
                        return;
                    }
                    that.appendImage(data.data);

                },
                function (code, message) {

                    that.hideLoading();
                    callback();
                    that.views["alert"].show(message || "图片上传失败");
                })
        },

        showLoading: function () {
            this.trigger('loadingImage');
            this.$el.find('li[data-role="loading"]').show();
        },
        hideLoading: function () {
            this.$el.find('li[data-role="loading"]').hide();
        },
        getImages: function () {
            var images = [];
            this.$el.find('[data-img]').each(function () {
                images.push($(this).data('img'));
            });
            return images;
        }
    });
});
