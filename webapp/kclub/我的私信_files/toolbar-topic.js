define([
    'views/toolbar'
], function (view) {

    return view.extend({

        initialize: function (opts) {
            this.display = 'topic';
            if (opts.display) {
                this.display = opts.display;
            }
            view.prototype.initialize.apply(this,arguments);
        },

        events: $.extend(view.prototype.events, {
            'click [data-role="reply"]': "reply"
        }),

        reply: function () {
            this.context.showReply();
        }

    });
});
