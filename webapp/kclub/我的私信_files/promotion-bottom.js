define([
    'components/view',
    'text!templates/promotion-bottom.html'
], function (view, template) {

    /*
    * 参加活动按钮
    * 参数
    *   $el                 加载dom节点
    *   context             上下文
    */

    return view.extend({
        display: "normal",

        views: {},

        initialize: function (opts) {
            var that = this;

            this.context = opts.context;
        },

        events: {
            'click .close': 'close'
        },

        add: function(options) {
            var that = this;

            var elem = $(_.template(template)(options));
            if (elem.length <= 0) {
                return;
            }

            this.$el.find('.floater').append(elem);
            elem.on('click', function(ev) {
                if ($(ev.target).data('role') == 'close') {
                    that.close(elem);
                }
                else if (elem.data('href') !== undefined && elem.data('href') !== null) {
                    window.location.href = elem.data('href');
                }
                else if (elem.data('role') == 'click') {
                    options.onclick(ev);
                }
            });

            this.$el.height(this.$el.find('.floater').height());
        },

        close: function(elem) {
            elem.hide();
            this.$el.height(this.$el.find('.floater').height());
        }

    });
});
