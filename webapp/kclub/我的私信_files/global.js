define([
    'utils/chat',
], function (AVOSChat) {

    var global = {};

    global._settings = {};
    global.env = 'ordinary';  // ordinary, wx, kzapp

    global.is_wx_ready = function(){
        return global.env == 'wx';
    };

    global.is_weixin = /micromessenger/ig.test(window.navigator.userAgent);
    global.is_qq = /QQ/g.test(window.navigator.userAgent);
    global.is_apple = /AppleWebKit/ig.test(window.navigator.userAgent);
    global.is_ios = /iPad|iPhone/ig.test(window.navigator.userAgent);
    global.is_mobile = /Android|iPad|iPhone|iPod/ig.test(window.navigator.userAgent);
    global.is_kzapp_android = /KuaiZhanAndroidWrapper/ig.test(window.navigator.userAgent);//android app
    global.is_kzapp_ios = /KuaiZhaniOSSite/ig.test(window.navigator.userAgent);//ios app

    //当前站点版app的ios版本,主要用于维护kzjssdk.js,方便新社区的代码,在旧app里被访问
    if(global.is_kzapp_android){
        var matchs = window.navigator.userAgent.match(/.*(KuaiZhanAndroidWrapper)\/((1\.[3-9])|[2-9])+/);
        if(matchs){
            global.env = 'kzapp';
            global.current_kzapp_android_version = matchs[3];
        } else {
            global.current_kzapp_android_version = "1.2";
        }
    } else if (global.is_kzapp_ios){
        var matchs = window.navigator.userAgent.match(/.*(KuaiZhaniOSSite)\/((1\.[3-9])|[2-9])+/);
        if(matchs){
            global.env = 'kzapp';
            global.current_kzapp_ios_version = matchs[3];
        } else {
            global.current_kzapp_ios_version = "1.2";
        }
    }

    global._current_user_loaded = false;
    global.current_user = null;

    global.auth = function (callback) {
        global.get_current_user().then(function(current_user) {
            callback && callback(current_user);
        }).catch(function(err) {
            global.jump_to_login();
        });
    };

    global.set = function (obj) {
        global._settings = $.extend(global._settings, obj);
    };

    global.jump_to_login = function() {
        console.log('jump_to_login');
        window.location = '/club/apiv1/me/login?callback=' + window.encodeURIComponent(window.location);
    };

    global.jump_to_kz_login = function() {
        console.log('jump_to_kz_login');
        window.location = '/club/apiv1/me/kz-login?wx_auto_jump=true&callback=' + window.encodeURIComponent(window.location);
    };

    global.jump_to_passport_login = function() {
        console.log('jump_to_passport_login');
        window.location = '/passport/main/login?site_id=' + SOHUZ.page.site_id + '&callback=' + window.encodeURIComponent(window.location);
    };

    global.get_current_user = function () {
        return new Promise(function(resolve, reject) {

            if (global._current_user_loaded) {
                if (global.current_user) {
                    return resolve(global.current_user);
                }
                else {
                    return reject('hello');
                }
            }
            else {
                var _current_user_val = $('#_current_user').val();
                if (_current_user_val) {
                    var current_user_g = JSON.parse(_current_user_val);
                    global._current_user_loaded = true;
                    global.current_user = current_user_g;
                    resolve(global.current_user);
                }
                else {
                    return reject('hello');
                }
            }
        });
    };

    global.getNoticeCount = function (callback) {
        return new Promise(function (resolve, reject) {

            if (typeof(global.notice_count) !== "undefined"
                && typeof(global.notice_count) !== null
                && typeof(global.notice_count) > 0
                ) {
                resolve(global.notice_count);
                return;
            }

            $.ajax({
                type: 'GET',
                url: '/apiv1/me/notices-count',
                data: {'_t': Date.now()},
                dateType: 'json'
            })
            .success(function (count) {
                global.notice_count = count;
                resolve(global.notice_count);
            })
            .error(function () {
                global.notice_count = 0;
                resolve(global.notice_count);
            });
        });
    };


    global.getTipNoticeCount = function (callback) {
        return new Promise(function (resolve, reject) {

            if (typeof(global.tip_count) !== "undefined"
                && typeof(global.tip_count) !== null
                && typeof(global.tip_count) > 0
                ) {
                resolve(global.tip_count);
                return;
            }

            $.ajax({
                type: 'GET',
                url: '/club/apiv1/me/tip-notices-count',
                data: {'_t': Date.now()},
                dateType: 'json'
            })
            .success(function (count) {
                global.tip_count = count;
                resolve(global.tip_count);
            })
            .error(function () {
                global.tip_count = 0;
                resolve(global.tip_count);
            });
        });
    };

    global.get_avoschat = function () {
        return new Promise(function (resolve, reject) {
            global.get_current_user().then(function(current_user) {
                if (!global.avoschat) {
                    global.avoschat = new AVOSChat(current_user._id);
                }
                resolve(global.avoschat);
            }).catch(function(){
                reject();
            });
        });
    };

    global.getUnreadChatsCount = function () {
        if (typeof(global.unreadChatsCount) !== "undefined"
            && typeof(global.unreadChatsCount) !== null
            && typeof(global.unreadChatsCount) > 0
            ) {
            callback(global.unreadChatsCount);
            return;
        }

        return new Promise(function (resolve, reject) {
            global.get_avoschat()
                .then(function (avoschat) {
                    return avoschat.get_unread_count();
                })
                .then(function (count) {
                    global.unreadChatsCount = count;
                    resolve(global.unreadChatsCount);
                })
                .catch(function (err) {
                    global.unreadChatsCount = 0;
                    resolve(global.unreadChatsCount);
                });
        });
    };

    global.hasApp = function(site_id) {
        return new Promise(function(resolve, reject) {
            $.ajax({
                type: 'GET',
                dataType: 'jsonp',
                url: 'http://app.kuaizhan.com/app/' + site_id + '/comm_app?callback=?'
            })
            .success(function(data) {
                if (data && !data.code && data.data && !global.is_ios) {
                    return resolve(data.data);
                }
                return reject();
            })
            .error(function() {
                reject();
            });
        });
    };

    window.global = global;

    return global;
});
