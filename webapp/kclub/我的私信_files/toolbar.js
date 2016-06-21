define([
    'global',
    'views/view',
    'components/alert',
    'components/SideBar',
    'text!templates/toolbar.html'
], function (global, view, alert, SideBar, template) {

    return view.extend({
        display: "normal",

        initialize: function (opts) {
            var that = this;

            this.display = opts.display || this.display;
            this.context = opts.context;
            this.back_text = opts.back_text;
            this.back_link = opts.back_link;
            this.back_func = opts.back_func;
            this.forum_id = opts.forum_id;

            this.$el.html(_.template(template)({back_text: this.back_text, back_link: this.back_link, display: this.display, forum_id: this.forum_id}));

            this.initNotice(!opts.not_notice_chats);

            this.views["alert"] = alert;
            this.views["sidebar"] = new SideBar();

            if (opts.evts) {
                _.map(opts.evts, function(callback, eventdef) {
                    if (!callback || !eventdef || eventdef.indexOf(' ') === -1) {
                        return;
                    }

                    var event_name = eventdef.substr(0, eventdef.indexOf(' '));
                    var select = eventdef.substr(event_name.length + 1);

                    that.$el.find(select).on(event_name, function(ev) {
                        callback && callback(ev);
                    });
                });
            }
            
        },

        views: {},

        events: {
            'click [data-role="back"]': 'back',
            'click [data-role="back-text"]':'back',
            'click [ data-role="user-sidebar"]': 'showSidebar'
        },

        initNotice: function (notice_chats) {
            var that = this;

            global.get_current_user().then(function (current_user) {
                global.getNoticeCount().then(function (count) {
                    if (count > 0) {
                        that.$el.find("[data-role='user-sidebar']").addClass('active');
                    }
                });

                global.getTipNoticeCount().then(function(count) {
                    if (count > 0) {
                        that.$el.find("[data-role='user-sidebar']").addClass('active');
                    }
                });

                if (notice_chats) {
                    global.getUnreadChatsCount().then(function (count) {
                        if (count > 0) {
                            that.$el.find("[data-role='user-sidebar']").addClass('active');
                        }
                    });
                }
            })
        },

        activeNotice: function () {
            this.$el.find("[data-role='user-sidebar']").addClass('active');
        },

        back: function (ev) {
            if ($(ev.target).closest("a").attr("href")) {
                return;
            }
            if (this.back_func) {
                this.back_func(ev);
            }
            else {
                ev.stopPropagation();
                window.history.back();
                ev.preventDefault();
            }
        },

        showSidebar: function () {
            this.views["sidebar"].show();
        }

    });
});
