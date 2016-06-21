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
            //滚动加载
            that.loading = false;
            that.limit = opts.limit || 20;
            var item_count = this.$el.find('.tbl-tr').length;
            
            if (item_count === 0) {
                that.$el.find('.rewards-tbl').append('<div class="default">~~(>_<)~~ 您还不是金主，快去打赏帖子吧</div>');
            }

            if (item_count >= this.limit / 2) {
                kzscroller.check_and_register('rewards_list', that, function(){
                    that.loadMore();
                });
            }

        },
        loadMore: function () {
            var that = this;
            this.loading = true;
            alert.showWaiting("话题加载中...");
            
            var item_count = that.$el.find('.tbl-tr').length;

            var sendData = {
                offset: item_count,
                limit: that.limit
            };
            
            requests.getPaidTips(
                null,
                sendData,
                function (data) {
                    alert.closeWaiting();
                    that.loading = false;
                    that.$el.find('.rewards-tbl').append(data);
                    var new_item_count = that.$el.find('.tbl-tr').length;
                    if (new_item_count - item_count < that.limit / 2 ) {
                        kzscroller.remove('rewards_list');
                        that.$el.find('.rewards-tbl').append('<div class="default">╮(╯﹏╰）╭ 已经到底了, 不要再拉啦</div>');
                    }
                    
                },
                function () {
                    alert.show("加载失败");
                }
            )
        }
    });

});
