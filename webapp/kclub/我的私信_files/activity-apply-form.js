define([
    'global',
    'views/view',
    'components/image-uploader',
    'components/alert',
    'text!templates/activity-apply-form.html',
    'utils/wx'
], function (global, view, ImageUploader, alert, template, wx) {

    return view.extend({
        views: {},

        initialize: function (opts) {
            var that = this;

            this.options = opts;
            this.$el.html(_.template(template, {}));
            this.context = opts.context;
            this.topic = opts.topic;
            this.views["alert"] = alert;

            this.$apply_form_name = this.$el.find(".js-apply-form-name input");
            this.$apply_form_age = this.$el.find(".js-apply-form-age input");
            this.$apply_form_occuption = this.$el.find(".js-apply-form-occupation input");
            this.$apply_form_phone = this.$el.find(".js-apply-form-phone input");
            this.$apply_form_email = this.$el.find(".js-apply-form-email input");
            this.$apply_form_qq = this.$el.find(".js-apply-form-qq input");

            this.forum_id = $('#_trace_key').val();

            $(window).on('hashchange', function () {
                if (window.location.hash !== "#topic-apply-form") {
                    that.close();
                }
            });

            this.views["imageUploader"] = new ImageUploader({
                el: "[data-role='image-container2']",
                limit: 1,
                show_input: true
            });

            this.$el.on("touchmove", function (ev) {
                ev.stopPropagation();
                ev.preventDefault();
            });
        },

        events: {
            'click [data-action="back"]': 'back',
            'click .js-commit-btn': 'submitReplyForm',
            'click .js-quit-btn': 'back',
            "click a[data-role='add-image']": "uploadImg",
            "click .js-sex-select": "selectSex"
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
            if ( window.location.hash === "#topic-apply-form") {
                window.history.back();
            } else {
                window.location.hash = '';
            }
        },

        uploadImg: function (ev) {
            var that = this;
            this.$el.find(".utils-container").hide();
            this.$el.find("[data-role='image-container2']").show();
            if (this.views["imageUploader"].getImages().length <= 0) {
                if ($('#_kzjssdk').val() == "false") {
                    if (global.wx_ready) {
                        that.views["imageUploader"].$el.find('.wx-upload').click();
                    } else {
                        that.views["imageUploader"].$el.find('.wx-upload').removeClass('wx-upload');
                        that.views["imageUploader"].$el.find('input').click();
                    }
                }
            }else{
                alert.show("对不起，您只能上传一张图片！");
            }
        },

        selectSex: function(ev) {
            var that = this;
            $(ev.currentTarget).siblings().removeClass('cur');
            $(ev.currentTarget).addClass('cur');
            // that.$el.find("[data-role='select-sex]");
        },

        testKey: function () {
            var $btn = this.$el.find('.js-commit-btn');
            $btn.removeClass("cur");
        },

        show: function (opts) {
            window.location.hash = "#topic-apply-form";
            var that = this;
            topic = opts.topic;
            this.topic_id = topic._id;
            this.parent_id = opts.parent_id;
            var all_keys = ['has_apply_form_sex',
                            'has_apply_form_age',
                            'has_apply_form_email',
                            'has_apply_form_occupation',
                            'has_apply_form_phone',
                            'has_apply_form_photo',
                            'has_apply_form_qq'];
            for(var key in all_keys){
                if(!topic.apply_info_details[all_keys[key]]){
                    that.$el.find('.js-' + all_keys[key].substring(4).replace(/_/g, '-')).css('display','none');
                }
            }
            if(!topic.apply_info_details['has_apply_form_sex']){
                that.$el.find('.js-apply-form-name input').css('width','80%');
            }

            this.$el.show();
            this.$el.find(".utils-container").hide();
            $(".js-sex-select[data-role='man']").addClass("cur");
            this.$el.find(".js-image-container").css('display','inline-block');
        },

        submitReplyForm: function (callback) {
            var that = this;
            var data = {};

            //判断是否上传头像
            if(this.topic.apply_info_details.has_apply_form_photo && this.views["imageUploader"].getImages().length <= 0){
                alert.show("请您上传一张图片！");
                return ;
            }else if(this.topic.apply_info_details.has_apply_form_photo && this.views["imageUploader"].getImages().length == 1){
                data.apply_form_photo = this.views["imageUploader"].getImages()[0];
            }

            //判断名字是否为空
            if(this.topic.apply_info_details.has_apply_form_name) {
                if (!this.$apply_form_name.val().trim()) {
                    alert.show("请填写您的名字！");
                    return ;
                }
                else if (this.$apply_form_name.val().trim().length > 50) {
                    alert.show("名字超过50个字，请修改！");
                    return ;
                }
                else {
                    data.apply_form_name = this.$apply_form_name.val().trim();
                }
            }

            //判断性别
            if(this.topic.apply_info_details.has_apply_form_sex && !this.$el.find(".js-apply-form-sex .cur").val().trim()){
                alert.show("性别不能为空！");
                return ;
            }else if(this.topic.apply_info_details.has_apply_form_sex && this.$el.find(".js-apply-form-sex .cur").val().trim()){
                data.apply_form_sex = this.$el.find(".js-apply-form-sex .cur").val().trim();
            }

            //判断年龄
            if(this.topic.apply_info_details.has_apply_form_age && !this.$apply_form_age.val().trim()){
                alert.show("年龄不能为空！");
                return ;
            }else if(this.topic.apply_info_details.has_apply_form_age && this.$apply_form_age.val().trim() ){
                var reg =  /^[0-9]*[1-9][0-9]*$/;
                if(reg.test(this.$apply_form_age.val().trim()) && this.$apply_form_age.val().trim() <=100 ){
                    data.apply_form_age = this.$apply_form_age.val().trim();
                }else{
                    alert.show("年龄：请输入0-100之间的整数！");
                    return ;
                }
            }

            //判断职业
            if(this.topic.apply_info_details.has_apply_form_occupation && !this.$apply_form_occuption.val().trim()){
                alert.show("请填写您的职业！");
                return ;
            }else if(this.topic.apply_info_details.has_apply_form_occupation && this.$apply_form_occuption.val().trim()){
                data.apply_form_occupation = this.$apply_form_occuption.val().trim();
            }

            //判断电话
            if(this.topic.apply_info_details.has_apply_form_phone && !this.$apply_form_phone.val().trim()){
                alert.show("请填写您的电话！");
                return ;
            }else if(this.topic.apply_info_details.has_apply_form_phone && this.$apply_form_phone.val().trim()){
                var reg = /^([+]{0,1}\d{1,4}([-]{0,1}\d{1,4})+)$/;
                if(reg.test(this.$apply_form_phone.val().trim())){
                    data.apply_form_phone= this.$apply_form_phone.val().trim();
                }else{
                    alert.show("请输入正确格式的电话或手机号！");
                    return ;
                }

            }

            //判断邮箱
            if(this.topic.apply_info_details.has_apply_form_email&& !this.$apply_form_email.val().trim()){
                alert.show("请填写您的邮箱！");
                return ;
            }else if(this.topic.apply_info_details.has_apply_form_email && this.$apply_form_email.val().trim()){
                var reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
                if (reg.test(this.$apply_form_email.val().trim())) {
                    data.apply_form_email = this.$apply_form_email.val().trim();
                } else {
                    alert.show("请填写正确的邮箱！");
                    return ;
                }

            }




            //判断QQ
            if(this.topic.apply_info_details.has_apply_form_qq && !this.$apply_form_qq.val().trim()){
                alert.show("请填写您的QQ！");
                return;
            }else if(this.topic.apply_info_details.has_apply_form_qq && this.$apply_form_qq.val().trim()){
                var reg = /^[1-9][0-9]{4,10}$/;
                if (reg.test(this.$apply_form_qq.val().trim())) {
                    qq = parseInt(this.$apply_form_qq.val().trim(), 10);
                    if (qq > 10000) {
                        data.apply_form_qq = this.$apply_form_qq.val().trim();
                    } else {
                        alert.show("请填写您正确的QQ！");
                        return;
                    }
                } else {
                    alert.show("请填写您正确的QQ！");
                    return;
                }

            }

            if (this.parent_id) {
                data["parent_id"] = this.parent_id;
            }

            alert.showWaiting('报名中...');

            $.ajax({
                url: "/club/apiv1/topics/" + this.topic_id + "/participations",
                method: "POST",
                data: data,

                success: function () {
                    window.location.href = window.location.href.split('#')[0];
                },

                error: function (xhr) {
                    if (xhr.status === 400) {
                        if (xhr.responseJSON && xhr.responseJSON.msg) {
                            that.views["alert"].show(xhr.responseJSON.msg);
                        }
                        else {
                            that.views["alert"].show("您没有权限或暂时被限制报名");
                        }
                    }else {
                        that.views["alert"].show("报名失败，请稍后再试");
                    }
                }
            });
        }
    });

});
