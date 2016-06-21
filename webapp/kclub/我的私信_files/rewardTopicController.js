define([
    'global',
    'controllers/base' ,
    'components/alert',
    'components/promotion-panel',
    'components/join-apply'
], function (global, baseController, alert, panel, joinApply) {

    return baseController.extend({
        tagName: 'div',
        events:{
            'click .other-link' : 'otherMoney',
            'click .reward-pick' : 'pickMoney',
            'click .top-close': 'closeMoney',
            'click .submit-reward':'goPayment',
            'click .meto-reward': 'Reward',
            'click [data-role="join-forum"]': 'joinApply'
        },

        initialize: function (options) {
            this.views['joinApply'] = new joinApply({
                el: "#join-apply",
                context: this
            });
        },
        Reward:function(){
            this.testJoin(null, "打赏").then(function(){
                var topic_id = $('.all-reward-content').data("topic-id");
                window.location = "http://" + window.location.host + "/club/topic/" + topic_id + "/reward-page";
            });
        },
        joinApply: function (ev) {
            var that = this;
            global.auth(function(current_user) {
                that.getForum().then(function(forum) {
                    if (forum.howto_join == "100") {
                        that.joinForum().then(function() {
                            alert.show("已成功加入社区");
                        }).catch(function() {
                            if (forum.current_user && forum.current_user.is_blacklisted) {
                                alert.show("您已被拉入黑名单，无法加入该社区");
                            } else {
                                alert.show("加入失败");
                            }
                        });
                    }

                    else {
                        that.views["joinApply"].show({forum_id: forum._id});
                    }
                });
            });
        },
        getTopic: function() {
            var that = this;

            return new Promise(function(resolve, reject) {
                if (that.topic) {
                    resolve(that.topic);
                }
                else {
                    var topic = $('.reward-topic-container').data('topic');
                    that.topic = topic;
                    if (that.topic) {
                        return resolve(that.topic);
                    }
                    return reject(that.topic);
                }
            });
        },
        getForum: function() {
            var that = this;

            return new Promise(function(resolve, reject) {
                that.getTopic()
                .then(function(data) {
                    if (data.forum) {
                        return resolve(data.forum);
                    }
                    return reject(data.forum);
                })
                .catch(function(error) {
                    return reject(error);
                });
            });
        },
        joinForum: function() {
            var that = this;

            return new Promise(function(resolve, reject) {
                that.getForum().then(function(forum) {

                    $.post("/club/apiv1/forums/" + forum._id + "/users", {
                    }).success(function () {
                        forum.current_user = forum.current_user || {};
                        forum.current_user.is_subscriber = true;
                        $('[data-role="join-forum"]').html('已加入').attr('data-role', 'conf-quit-forum');

                        resolve();

                    }).error(function (e) {
                        if (e.responseJSON !== null && e.responseJSON.code == 20402) {
                            return resolve();
                        }
                        reject();
                    })
                });
            })
        },
        testJoin: function (ev, msg) {
            var that = this;
            return new Promise(function(resolve, reject) {
                global.auth(function(current_user) {
                    that.getForum().then(function(forum) {
                        if (!forum.current_user || !forum.current_user.is_subscriber) {
                            if (forum.howto_join == 100) {
                                that.joinForum().then(function() {
                                    resolve(forum);
                                }).catch(function(err) {
                                    console.log(err);
                                    panel.show({
                                        msg: "加入社区失败，您可能被本社区禁止",
                                        buttons: [{
                                            label: "关闭",
                                            role: "close"
                                        }]
                                    });
                                });
                            }
                            else {
                                panel.show({
                                    msg: "加入社区才能" + (msg || "回复"),
                                    buttons: [{
                                        label: "关闭",
                                        role: "close"
                                    }, {
                                        label: forum.howto_join == 100 ? "加入社区" : "申请加入",
                                        role: 'join-forum'
                                    }]
                                });
                                ev && ev.preventDefault();
                                reject && reject();
                            }
                        }
                        else {
                            resolve(forum);
                        }
                    });
                })
            });
        },
        pickMoney:function(ev){
            this.testJoin(null, "打赏").then(function(){
                var $tar = $(ev.target);
                $tar.toggleClass('cur');
                var oli = $tar.parent('li');
                oli.siblings().children().removeClass('cur');
                var om = parseFloat($tar.attr('value'));
                var sendData = {
                    'price': om*100
                }
                var topic_id = $('body').data('topic-id');
                var that = this;

                $.ajax({
                    type: "post",
                    url: "/club/apiv1/topics/" + topic_id + "/tips",
                    data: sendData,
                    success: function(data) {
                        window.location.href= '/shop/tip-pay/'+ data._id;
                    },
                    error: function(err) {
                        alert.show(err.responseJson.msg);
                    }
                });
            }).catch(function (err) {
                
            });

        },
        otherMoney: function () {
            $('.input-money').show();
        },
        closeMoney:function(){
            $('.input-money').hide();
        },
        goPayment:function(){
            this.testJoin(null, "打赏").then(function(){
                var value = parseFloat($('.input-kuang').val());
                if(value < 0.1 || value > 200){
                    alert.show("请输入0.1-200.0之间的金额");
                }
                else if( !/^[0-9]+(.[0-9]{1})?$/.test(value)){
                    alert.show("不支持分及以下的金额输入");
                }
                else {
                    var topic_id = $('body').data('topic-id');
                    var om = parseFloat($('.input-kuang').val());
                    var sendData = {
                        price: om*100
                    }
                    $.ajax({
                        type: "post",
                        url: "/club/apiv1/topics/" + topic_id + "/tips",
                        data: sendData,
                        success: function(data) {
                            window.location.href= '/shop/tip-pay/'+ data._id;
                        },
                        error: function(err) {
                            alert.show(err.responseJson.msg);
                        }
                    });
                }
            });

        },

    });
});
