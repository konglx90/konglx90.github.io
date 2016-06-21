define([
    'components/view'
], function (view) {

    /*
    * 弹出提醒窗口
    * show(msg)                     显示窗口,msg为窗口内容
    * showWaiting(msg)              显示等待窗口,msg默认为“发布中”
    * closeWaiting()                关闭窗口
    */

    var Alert = view.extend({
        views: {},

        initialize: function (opts) {
            this.$el = $("#ui-alert").size() > 0 ? $("#ui-alert") : $("<div id='ui-alert' class='ui-alert'></div>").appendTo("body");
            var that = this;
        },

        events: {
        },

        show: function (msg) {
            this.waiting = false;
            this.$el.html(msg);
            this.$el.show();
            var that = this;
            setTimeout(function () {
                that.$el.fadeOut();
            }, 1000);
        },

        showWaiting: function (msg) {
            var _msg =msg||"发布中";

            this.waiting = true;
            this.$el.html(""+_msg);
            this.$el.show();
        },

        closeWaiting: function () {
            this.waiting = false;
            this.$el.fadeOut();
        },

        closeWaitingNoFadeOut: function () {
            this.waiting = false;
        },

        isWaiting: function () {
            return !!this.waiting;
        }

    });

    return new Alert();
});
