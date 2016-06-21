define([
    'controllers/baseWithSidebar',
    'components/alert',
    'requests',
    'utils/kzscroller'
], function (baseWithSidebar, alert, requests, kzscroller) {

    return baseWithSidebar.extend({
        initialize: function(opts) {
            baseWithSidebar.prototype.initialize.apply(this);
            var that = this;
            that.forum_id = opts.forum_id;
        },
        events: function() {
            return _.extend(
                {},
                baseWithSidebar.prototype.events,
                {
                    'click .js-confirm': 'confirm'
                }
            )
        },

        confirm: function() {
            var total = parseInt(this.$el.find('.js-tatal').text());
            var exchange = this.$el.find('.js-score-num').val();
            if(!/^[1-9]\d*$/.test(exchange)){
                alert.show("积分兑换值需为正整数");
                return;
            }
            if (exchange > total) {
                alert.show("积分不足");
                return;
            }
            requests.scoreExchange(
                {forum_id: this.forum_id},
                {exchange: exchange},
                function () {
                    alert.show('兑换成功');
                    setTimeout(
                        window.location.reload(),
                        1000
                    )
                },
                function() {
                    alert.show("兑换失败");
                }
            )
        }

    });

});
