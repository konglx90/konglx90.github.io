define([
    'components/view',
    'components/alert',
    'text!templates/join-apply.html',
    'requests'
],
function (view, alert, template, requests) {

    /*
    * 申请加入社区
    * 参数
    *   $el                 加载dom节点
    * show(opts)            显示申请加入窗口，opts={'forum_id': }
    */

    return view.extend({
        views: {},

        initialize: function (opts) {
            this.$el.html(_.template(template, {}));
            this.$inputBox = this.$el.find("textarea");
            this.views["alert"] = alert;
        },

        events: {
            'click [data-role="cancel-apply"]': 'close',
            'click [data-role="submit-apply"]': 'submitApply'
        },

        close: function () {
            this.$el.hide();
            $("body").removeClass("no-scroll");
        },

        show: function (opts) {
            this.forum_id = opts.forum_id;
            this.$el.show();
            $("body").addClass("no-scroll");
        },

        submitApply: function () {
            var that = this;
            var data = {"reason": this.$inputBox.val()};

            //$.ajax({
            //    url: "/club/apiv1/forums/" + this.forum_id + "/applicants",
            //    method: "POST",
            //    data: data,
            //    success: function (data) {
            //        that.$inputBox.val("");
            //        that.views["alert"].show("申请已提交，请耐心等待");
            //        that.close();
            //
            //    },
            //    error: function () {
            //        this.views["alert"].show("申请提交失败");
            //    }
            //});

            requests.postForumApp(
                {forum_id: this.forum_id},
                data,
                function (data) {
                    that.$inputBox.val("");
                    that.views["alert"].show("申请已提交，请耐心等待");
                    that.close();
                },
                function () {
                    this.views["alert"].show("申请提交失败");
                }
            )

        }
    });
});
