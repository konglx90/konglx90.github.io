define(['backbone'], function (Backbone) {
    return Backbone.View.extend({
        destroyView: function () {
            this.undelegateEvents();
            this.$el.html("");
        },
        render: function () {

        }
    });
});
