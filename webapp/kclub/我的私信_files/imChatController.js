define([
    'global',
    'controllers/base' ,
    'text!templates/im-chat.ejs',
    // 'views/im-input',
    // 'views/toolbar-im',
    // 'views/quick-button',
    'components/alert',
    'utils/chat',
    'components/topic-reply',
    'utils/wx',
    'utils/face'
// ], function (global, baseController, ImInput, Toolbar, QuickButton, alert, AVOSChat, FaceTool) {
], function (global, baseController, tpl_im_chat, alert, AVOSChat, topicReply, wx, faceTool) {

    return baseController.extend({
        tagName: 'div',
        template: _.template(tpl_im_chat),
        initialize: function (options) {
            var that = this;
            alert.showWaiting('连接中...');
            $('html').height('100%');
            $('body').height('100%');
            window.location.hash = "";
            
            var init_data = JSON.parse(window.init_data);
            this.user = init_data.im_user;
            this.current_user = JSON.parse($('#_current_user').val());
            this.self_id = this.current_user._id;
            this.watch_ids = this.user._id;
            
            try {
                this.avoschat = new AVOSChat(this.self_id);
            } catch (e) {
                alert.show('出错, 手机可能不被支持');
                return;
            }
            
            this.loadChats().done(function (data) {

                that.listenChats().then(function (data) {
                    alert.closeWaiting();

                    that.auto_scrolling = true;
                    that.scrollToBottom();

                    $('.main-content').scroll(function () {
                        var height = $('.main-content').height() + $('.main-content').scrollTop();
                        if (height >= $('.messages').height()) {
                            that.auto_scrolling = true;
                        }
                        else {
                            that.auto_scrolling = false;
                        }
                    });
                });
            });

            this.views["topicReply"] = new topicReply({
                el: ".topic-replay-container",
                max_images: 5,
                config: {
                    enable_audio: false,
                    enable_video: false,
                    enable_add_tag: false,
                    title: false,
                    pub_tag: false,
                    pub_loc: false
                },
                submit_func: function(data){that.submitReply(data)}
            });

            //判断是非为weixin环境
            if (global.is_weixin) {
                wx.config_post(
                    function(wxsdk, wxdata){
                        global.env = 'wx';
                        var img = forum.avatar || "http://club.kuaizhan.com/club/images/face/default-avatar.png";
                        var title = forum.title;
                        var desc = forum.desc;
                        wx.config_share(title, desc, img, window.location.href);
                    },
                    function(){},
                    null);
            }

        },
        
        events: {
            'click .js-send-msg': 'showInput'
        },

        scrollToBottom: function () {
            $("html,body").animate({ scrollTop: $('.messages').height() }, "slow");
        },

        showInput: function () {
            var that = this;
            this.views['topicReply'].show({
                pub_type: 'pub_topic',
                placeholder: '发点什么吧...',
                forum_id: null,
                // pub_succ_cb : _.bind(that._pub_succ_cb, that)
            });
        },
        
        loadChats: function (timestamp) {
            var that = this;
            return new Promise(function (resolve, reject) {
                that.avoschat.get_conv_history(that.watch_ids, timestamp).done(function (data) {
                    //console.log('loadChats:', that.watch_ids, timestamp, data)
                    for (var i = data.length - 1; i >= 0; i--) {
                        //console.log('message:', data[i]);
                        that.appendMessage(data[i]);
                    }
                    resolve();
                });
            });
        },

        appendMessage: function (msg) {
            var $msg_list = this.$el.find('.messages');
            var msg_time = msg.timestamp;
            var msg_data = msg.data || msg.msg;
            msg_data = JSON.parse(msg_data);
            var type = msg_data.type;
            
            if (!$msg_list.data('last_timestamp') || msg_time - $msg_list.data('last_timestamp') >= 300000) {
                $msg_list.data('last_timestamp', msg_time);
                $msg_list.append(this.template({time_assist: true,
                                                time: moment(msg_time).format('MM-DD HH:mm')}));
            }
            
                    
            var html  = this.template({time_assist: false,
                                       msg: msg,
                                       me: this.current_user,
                                       other: this.user,
                                       is_me: msg.from === this.self_id,
                                       content: type === 1 ? faceTool.replaceFace(msg_data.content) : msg_data.content,
                                       type: type});
            $msg_list.append(html);

            if (this.auto_scrolling) {
                this.scrollToBottom();
            }
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
                        that.appendMessage(data);
                    });
                    that.avoschat.listenTo(that.watch_ids);
                    resolve();
                }, function (err) {
                    reject(err);
                });
            });
        },

        submitReply: function(data) {
            var that = this;
            var pics = data.attachment_urls || [];
            var text = data.content || '';
            
            pics.forEach(function(pic) {
                var msg_data = JSON.stringify({type: 2, content: pic})
                  , timestamp = Date.now();

                that.avoschat.client.send(
                    msg_data,
                    that.watch_ids,
                    false
                ).then(function(data) {
                    that.appendMessage({from: that.self_id, data: msg_data, timestamp: timestamp, status: 'sent', status_timestamp: Date.now()})
                    Promise.resolve(that.avoschat.backup(that.watch_ids, msg_data))
                    alert.show('发送成功');
                    setTimeout(
                        function(){
                            that.views["topicReply"].back()
                        },
                        1000
                    )
                }, function(err) {
                    that.appendMessage({from: that.self_id, data: msg_data, timestamp: timestamp, status: 'failed', status_timestamp: Date.now()});
                    alert.show('发送失败');
                });
            });

            if (text && text.length > 0) {
                var msg_data = JSON.stringify({type: 1, content: text})
                  , timestamp = Date.now();

                that.avoschat.client.send(
                    msg_data,
                    that.watch_ids,
                    false
                ).then(function(data) {
                    that.appendMessage({from: that.self_id, data: msg_data, timestamp: timestamp, status_timestamp: Date.now()});
                    Promise.resolve(that.avoschat.backup(that.watch_ids, msg_data));
                    alert.show('发送成功');
                    setTimeout(
                        function(){
                            that.views["topicReply"].back()
                        },
                        1000
                    )
                }, function(err) {
                    that.appendMessage({from: that.self_id, data: msg_data, timestamp: timestamp, status_timestamp: Date.now()});
                    alert.show('发送失败');
                });
            }
        }
        
    });
});
