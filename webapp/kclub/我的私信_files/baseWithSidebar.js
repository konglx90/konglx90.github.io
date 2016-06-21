define([
    'global',
    'controllers/base' ,
    'components/alert',
    'components/SideBar',
], function (global, baseController, alert, SideBar) {

    return baseController.extend({
        events: {
            'click .js-sidebar': 'showSideBar',
            'click .js-back': 'goBack'
        },

        initialize: function (options) {
            var that = this;
            that.views["sidebar"] = new SideBar();
        },

        showSideBar: function() {
            var sidebar = this.views.sidebar;
            if (sidebar) {
                sidebar.show()
            }
        },
        goBack: function() {
            window.history.back();
        }

    });
});

