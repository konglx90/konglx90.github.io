define([
    'global',

    'controllers/forumIndexController',
    'controllers/forumInfoController',
    'controllers/topicIndexController',
    'controllers/commentIndexController',
    'controllers/userPageController',
    'controllers/rewardCenterController',
    'controllers/myRewardsController',
    'controllers/myNoticeController',
    'controllers/myMoneyController',
    'controllers/myDepositController',
    'controllers/withdrawPageController',
    'controllers/scoreExchangeController',
    'controllers/imChatController',
    'controllers/bindBankController',
    'controllers/imIndexController',
    'controllers/rewardTopicController'
], function (
    global,
    ForumIndex,
    ForumIndexInfo,
    TopicIndex,
    CommentIndex,
    userPage,
    rewardCenter,
    rewardList,
    noticeList,
    moneyList,
    depositList,
    withdrawPage,
    scoreExchange,
    imChat,
    bindBank,
    imSessions,
    rewardTopic
) {
    'use strict';

    return Backbone.Router.extend({
        routes: {
            "clubv2/forums/:forum_id": "forumIndex",
            "clubv2/forums/:forum_id/info": "forumIndexInfo",
            "clubv2/forums/:forum_id/score-exchange": "scoreExchange",
            
            "clubv2/comments/:comment_id": "commentIndex",
            "clubv2/topics/:topic_id": "topicIndex",
            "clubv2/users/:user_id": "userPage",
            
            "clubv2/me/reward-center": "rewardCenter",
            "clubv2/me/rewards-records": "rewardList",
            "clubv2/me/money-records": "moneyList",
            "clubv2/me/deposit-records": "depositList",
            "clubv2/me/notices": "noticeList",
            "clubv2/me/withdraw": "withdrawPage",
            "clubv2/me/bind-bank": "bindBank",
            
            "clubv2/im/sessions": "imSessions",
            "clubv2/im/users/:user_id": "imChat",
            "clubv2/topics/:topic_id/reward": "rewardTopic"
        },

        initialize: function () {
            console.log('routes init');
        },

        forumIndex: function (forum_id) {
            global.set({
                forum_id: forum_id
            });
            new ForumIndex({ forum_id: forum_id, el: "body"});
        },

        forumIndexInfo: function (forum_id) {
            global.set({
                forum_id: forum_id
            });
            new ForumIndexInfo({ forum_id: forum_id, el: "body"});
        },

        topicIndex: function (topic_id) {
            global.set({
                topic_id: topic_id
            });
            new TopicIndex({ topic_id: topic_id, el: "body"});
        },

        commentIndex: function (comment_id) {
            global.set({
                comment_id: comment_id
            });
            new CommentIndex({ comment_id: comment_id, el: "body"});
        },

        userPage: function(user_id) {
            new userPage({el: "body"})
        },
        rewardCenter: function() {
            new rewardCenter({el: "body"})
        },
        rewardList: function() {
            new rewardList({el: "body"})
        },
        noticeList: function () {
            new noticeList({el: "body"})
        },
        moneyList: function() {
            new moneyList({el: "body"})
        },
        depositList: function() {
            new depositList({el: "body"})
        },
        withdrawPage: function() {
            new withdrawPage({el: "body"})    
        },
        scoreExchange: function(forum_id) {
            new scoreExchange({forum_id: forum_id, el: "body"})
        },
        imChat: function() {
            new imChat({el: "body"});
        },
        bindBank: function(){
            new bindBank({el: "body"})
        },
        imSessions: function() {
            new imSessions({el: "body"})
        },
        rewardTopic: function () {
            new rewardTopic({el: "body"})
        }

    });
});
