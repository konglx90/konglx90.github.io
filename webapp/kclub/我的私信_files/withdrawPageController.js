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
        },
        events: function() {
            return _.extend(
                {},
                baseWithSidebar.prototype.events,
                {
                    'click .js-confirm': 'confirmWithdraw',
                    'click .js-withdraw-all': 'withdrawAll'
                }
            )
        },
        
        withdrawAll: function() {
            var balance = Number(this.$el.find('.js-balance').text());
            this.$el.find('.js-withdraw-num').val(balance);
        },

        confirmWithdraw: function() {
            var balance = Number(this.$el.find('.js-balance').text());
            var withdraw = Number(this.$el.find('.js-withdraw-num').val());
            if (withdraw < 1) {
                alert.show("每次最少提现1元");
            } else if (withdraw > balance) {
                alert.show("可提现余额不足");
            } else {
                var sendData = {
                    amount: balance * 100
                };
                requests.withdrawBalance(
                    {},
                    sendData,
                    function (data) {
                        alert.show("提现申请已提交，请等待银行处理");
                        window.location.href = "/club/me/deposit-records"
                    },
                    function() {
                        alert.show("提现失败，请稍后再试");
                    }
                )
            }
        }

    });

});
