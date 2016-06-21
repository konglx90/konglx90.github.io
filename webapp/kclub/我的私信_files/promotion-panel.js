define([
    'components/view'
], function (view) {

    /*
    * 弹出确认选择框
    * show(opts)                    显示弹框，opts={‘msg', 'buttons':[{'label','role' }]}
    */

    var Panel = view.extend({
        views: {},

        initialize: function (opts) {
            this.$el = $("#ui-panel").size() > 0 ? $("#ui-panel") : $("<div id='ui-panel' class='ui-promo-panel'><div class='panel-middle'><div class='content'></div><div class='buttons'></div></div></div>").appendTo("body");
            this.$content = this.$el.find(".content");
            this.$buttons = this.$el.find(".buttons");

        },

        events: {
            "click [data-role]": 'close'
        },

        close: function () {
            this.$el.hide();
        },

        show: function (opts) {
            this.$content.html(opts.msg);
            var buttons = "";
            var that = this;
            var btn_cls = 'btn-' + opts.buttons.length;
            opts.buttons.forEach(function (o) {
                buttons += "<button class='" + btn_cls + "' data-role='" + o.role + "'>" + o.label + "</button>";
                if (o.click) {
                    that.$el.undelegate("[data-role='" + o.role + "']", "click").delegate("[data-role='" + o.role + "']", "click", function (ev) {
                        o.click(ev)
                    });
                }
            });
            this.delegateEvents();
            this.$buttons.html(buttons);
            this.$el.show();
        }
    });

    return new Panel();
});
