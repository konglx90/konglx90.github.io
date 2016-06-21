define([
    'controllers/baseWithSidebar',
    'components/alert',
    'views/toolbar',
    'utils/chat',
    'text!templates/im-index.html',

    'utils/momentTool'
], function (baseWithSidebar ,alert, Toolbar, AVOSChat, tpl_session) {

    return baseWithSidebar.extend({
        tagName: 'div',

        initialize: function (options) {

            baseWithSidebar.prototype.initialize.apply(this);

            var that = this;
            alert.showWaiting('加载中...');
            $('html').css('height', '100%');

            this.current_user = JSON.parse($('#_current_user').val());
            this.self_id = this.current_user._id;

            try {
                this.avoschat = new AVOSChat(this.self_id);
            } catch (e) {
                alert.show('加载失败, 手机可能不被支持');
                return;
            }

            that.listenChats().then(function (data) {
                alert.closeWaiting();
            });

            setInterval(function() {
                that.$el.find('.im-index .item').each(function() {
                    var $this = $(this);
                    var timestamp = $this.data('timestamp');
                    if (timestamp) {
                        $this.find('.last-message-time').html(moment(timestamp).fromNow());
                    }
                });
            }, 30000);

        },

        listenChats: function () {
            var that = this;

            this.avoschat.client.on('close', function (data) {
                alert.showWaiting("重新连接...");

                that.listenChats().then(function (data) {
                    alert.closeWaiting();
                }, function (err) {
                    alert.show('连接失败，请刷新');
                });
            });

            return new Promise(function (resolve, reject) {
                that.avoschat.client.open().then(function (data) {
                    //console.log('avos opened:', data);
                    that.avoschat.client.on('message', function (data) {
                        that.updateSession(data);
                    });
                    resolve();
                }, function (err) {
                    reject(err);
                });
            });
        },

        updateSession: function (msg) {
            var session_list = this.$el.find('.im-index')
                , msg_from = msg.from ? msg.from : msg.fromPeerId
                , msg_data = msg.data ? msg.data : msg.msg
                , msg_time = msg.timestamp;

            try {
                msg_data = JSON.parse(msg_data);
            } catch (e) {
                console.log('msg decode err:', e);
                return;
            }

            if (msg_from == this.current_user._id) {
                return;
            }

            var session = session_list.find('[data-user="'+msg_from+'"]');

            if (session) {
                session.data('timestamp', msg_time);
                session.find('.last-message-time').html(moment(msg_time).fromNow());
                session.find('.last-message').addClass('unread');

                if (msg_data.type == 1) {
                    session.find('.last-message').html(msg_data.content);
                }
                else if (msg_data.type == 2) {
                    session.find('.last-message').html('[图片]');
                }
                else {
                }

                session.remove();
                session_list.prepend(session);
            }

            else {
                this.avoschat.get_1v1_session(msg_from).then(function(data) {
                    data.last_message = msg_data;
                    data.last_message_time = msg_time;
                    session_list.prepend(_.template(tpl_session)({session: data, unread: true}));
                });
            }
        }
    });
});
