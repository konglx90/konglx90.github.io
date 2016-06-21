define([
    'AVChatClient'
], function(AVChatClient) {

    var AVOSChat = function(user_id) {
        this.settings = {
            appId: "5g3r1dj73lub5zy2axg705xkkdvkfcbn4rs3ak2vhyl5w5or",
            peerId: user_id,
            auth: this.auth,
            groupAuth: this.groupAuth
        };
        console.log(this.settings);
        this.client = new AVChatClient(this.settings);
    };

    AVOSChat.prototype.make_client = function() {
        return new AVChatClient(this.settings);
    };

    AVOSChat.prototype.auth = function(peerId, watchingPeerIds){
        //console.log('auth:', peerId, watchingPeerIds);
        return new Promise(function(resolve, reject) {
            $.post('/club/apiv1/avos/chat/auth', {
                self_id: peerId,
                watch_ids: watchingPeerIds
            }).success(function (data) {
                //console.log(data.watch_ids)
                resolve({
                    n: data.nonce,
                    t: data.timestamp,
                    s: data.signature,
                    watchingPeerIds: data.watch_ids
                });
            }).error(function(err) {
                reject(err);
            });
        });
    };

    AVOSChat.prototype.groupAuth = function(peerId, groupId, action, groupPeerIds){
        return new Promise(function(resolve, reject) {
            $.post('/club/apiv1/avos/chat/group-auth', {
                self_id: peerId,
                group_id: groupId,
                action: action,
                watch_ids: groupPeerIds.join(',')
            }).success(function (data) {
                //console.log(data.watch_ids)
                resolve({
                    n: data.nonce,
                    t: data.timestamp,
                    s: data.signature,
                    watchingPeerIds: data.watch_ids
                });
            }).error(function(err) {
                reject(err);
            });
        });
    };

    AVOSChat.prototype.get_convid_and_signature = function(watch_ids) {
        //console.log('get_convid_and_signature', watch_ids);
        var that = this;
        return new Promise(function(resolve, reject) {
            $.post('/club/apiv1/avos/chat/sign', {
                'self_id': that.settings.peerId,
                'watch_ids': watch_ids,
            }).success(function (data) {
                //console.log(data);
                resolve(data);
            }).error(function(err) {
                reject(err);
            });
        });
    };

    AVOSChat.prototype.get_conv_history = function(watch_ids, timestamp) {
        var send_data = {'limit': 32};
        if (timestamp !== null && timestamp !== undefined) {
            send_data['timestamp'] = timestamp;
        }

        var that = this;
        return new Promise(function(resolve, reject) {
            that.get_convid_and_signature(watch_ids).then(function(opts) {
                send_data['convid'] = opts.convid;

                $.ajax({
                    type: 'GET',
                    url: 'https://leancloud.cn/1.1/rtm/messages/logs',
                    headers: {'X-AVOSCloud-Application-Id': that.settings.appId,
                              'X-AVOSCloud-Request-Sign': opts.signature},
                    data: send_data,
                    dateType: 'json'
                }).success(function(data) {
                    //console.log(data);
                    resolve(data);
                }).error(function(err) {
                    reject(err);
                });
            });
        });
    };

    AVOSChat.prototype.get_1v1_backup_history = function(user_id, timestamp) {
        var send_data = {'limit': 32};
        if (timestamp !== null && timestamp !== undefined) {
            send_data['timestamp'] = timestamp;
        }

        var that = this;
        return new Promise(function(resolve, reject) {

            $.ajax({
                type: 'GET',
                url: '/club/apiv1/im/users/' + user_id + '/messages',
                data: send_data,
                dateType: 'json'
            }).success(function(data) {
                console.log('backup msgs:', data);
                resolve(data);
            }).error(function(err) {
                reject(err);
            });
        });
    };

    AVOSChat.prototype.get_unread_count = function() {
        var that = this;
        return new Promise(function(resolve, reject) {
            that.get_convid_and_signature().then(function(opts) {
                $.ajax({
                    type: 'GET',
                    url: 'https://leancloud.cn/1.1/rtm/messages/unread/' + that.settings.peerId,
                    headers: {'X-AVOSCloud-Application-Id': that.settings.appId,
                              'X-AVOSCloud-Request-Sign': opts.signature},
                    data: {'_t': Date.now()},
                    dateType: 'json'
                }).success(function(data) {
                    //console.log(data);
                    resolve(data.count);
                }).error(function(err) {
                    reject(err);
                });
            });
        });
    };

    AVOSChat.prototype.listenTo = function(watch_ids) {
        this.watch_ids = watch_ids;
        this.client.watch(watch_ids);
    };

    AVOSChat.prototype.backup = function(user_id, message) {
        return new Promise(function(resolve, reject) {
            $.post('/club/apiv1/im/users/' + user_id, {
                message: message
            })
            .success(function(data) {
                resolve(data);
            })
            .error(function(err) {
                reject(err);
            })
        });
    };

    AVOSChat.prototype.get_1v1_session = function(user_id) {
        return new Promise(function(resolve, reject) {
            $.get('/club/apiv1/im/users/' + user_id, {
                '_t': Date.now()
            })
            .success(function(data) {
                resolve(data);
            })
            .error(function(err) {
                reject(err);
            })
        });
    };

    return AVOSChat;
});
