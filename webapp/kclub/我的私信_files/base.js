define([
], function () {

  return Backbone.View.extend({

    views: {},

    initialize: function () {
    },

    destroy: function () {
      for (var n in this.views) {
        this.views[n].destroyView();
      }
      this.views={};
    },

    render: function () {
      for (var n in this.views) {
        this.views[n].render();
      }
    }

  });
});
