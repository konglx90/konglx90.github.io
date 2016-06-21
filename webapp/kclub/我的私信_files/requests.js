define([], function(){
    /* 所有网络请求放在此处 返回promise 对象
    * function({url 参数}, {data 参数}, success_callback, err_callback)
    *
    */

    function ajaxRequest(url, method, data, succ_cb, err_cb) {
        $.ajax({
            url: url,
            method: method,
            data: data,
            success: succ_cb,
            error: err_cb
        })
    }

    return {

        /*  Topic 相关
        *   getTopic
        *   modifyTopic
        *   getForumTopics
        *   upVoteTopic
        *   downVoteTopic
        *   topicTestReply
        *   topicPartIn
        *   topicWithdraw
        *   getTopicComments
        *   getTopicCommentsV2
        *   stickTopic
        *   unstickTopic
        *   starTopic
        *   unstarTopic
        *   hideTopic
        *   reportTopic
        * */

        getTopic: function(params, data, succ_cb, err_cb) {
            succ_cb = succ_cb || function(){};
            err_cb = err_cb || function(){};

            $.ajax({
                url: "/club/apiv1/topics/" + params.topic_id,
                method: 'GET',
                success: succ_cb,
                error: err_cb
            })
        },

        getTopicHtml: function(params, data, succ_cb, err_cb) {
            succ_cb = succ_cb || function(){};
            err_cb = err_cb || function(){};

            $.ajax({
                url: "/clubv2/api/topics/" + params.topic_id,
                method: 'GET',
                success: succ_cb,
                error: err_cb
            })
        },

        modifyTopic: function(params, data, succ_cb, err_cb) {
            succ_cb = succ_cb || function(){};
            err_cb = err_cb || function(){};

            $.ajax({
                url: "/club/apiv1/topics/" + params.topic_id,
                method: 'POST',
                success: succ_cb,
                error: err_cb
            })
        },

        getForumTopics: function(params, data, succ_cb, err_cb) {
            $.ajax({
                url: "/clubv2/api/forums/" + params.forum_id + "/topics",
                method: 'GET',
                data: data,
                success: succ_cb,
                error: err_cb
            })
        },

        pubTopic: function(params, data, succ_cb, err_cb) {
            data = data || {};
            $.ajax({
                url: "/club/apiv1/forums/" + params.forum_id + "/topics",
                method: 'POST',
                data: data,
                success: succ_cb,
                error: err_cb
            })
        },

        upVoteTopic: function(params, data, succ_cb, err_cb) {
            succ_cb = succ_cb || function(){};
            err_cb = err_cb || function(){};
            $.ajax({
                url: "/club/apiv1/topics/" + params.topic_id + "/upvotes",
                method: 'POST',
                success: succ_cb,
                error: err_cb
            })
        },

        downVoteTopic: function(params, data, succ_cb, err_cb) {
            succ_cb = succ_cb || function(){};
            err_cb = err_cb || function(){};
            $.ajax({
                url: "/club/apiv1/topics/" + params.topic_id + "/upvotes",
                method: 'DELETE',
                success: succ_cb,
                error: err_cb
            })
        },

        topicTestReply: function(params, data, succ_cb, err_cb) {
            succ_cb = succ_cb || function(){};
            err_cb = err_cb || function(){};
            $.ajax({
                url: "/club/apiv1/topics/" + params.topic_id + "/test-reply",
                method: 'GET',
                success: succ_cb,
                error: err_cb
            })
        },

        topicPartIn: function(params, data, succ_cb, err_cb) {
            data = data || {};
            succ_cb = succ_cb || function(){};
            err_cb = err_cb || function(){};
            $.ajax({
                url: "/club/apiv1/topics/" + params.topic_id + "/participations",
                method: 'POST',
                success: succ_cb,
                error: err_cb
            })
        },

        topicWithdraw: function(params, data, succ_cb, err_cb) {
            data = data || {};
            succ_cb = succ_cb || function(){};
            err_cb = err_cb || function(){};
            $.ajax({
                url: "/club/apiv1/topics/" + params.topic_id + "/participations",
                method: 'DELETE',
                success: succ_cb,
                error: err_cb
            })
        },

        getTopicComments: function(params, data, succ_cb, err_cb) {
            data = data || {};
            succ_cb = succ_cb || function(){};
            err_cb = err_cb || function(){};
            $.ajax({
                url: "/club/api/topics/" + params.topic_id + "/comments",
                method: 'GET',
                data: data,
                success: succ_cb,
                error: err_cb
            })
        },

        replyComments: function(params, data, succ_cb, err_cb) {
            data = data || {};
            succ_cb = succ_cb || function(){};
            err_cb = err_cb || function(){};
            $.ajax({
                url: "/club/apiv1/topics/" + params.topic_id + "/comments",
                method: "POST",
                data: data,
                success: succ_cb,
                error: err_cb
            })
        },

        getTopicCommentsV2: function(params, data, succ_cb, err_cb) {
            data = data || {};
            succ_cb = succ_cb || function(){};
            err_cb = err_cb || function(){};

            $.ajax({
                url: "/clubv2/api/topics/" + params.topic_id + "/comments",
                method: 'GET',
                data: data,
                success: succ_cb,
                error: err_cb
            })
        },

        stickTopic: function(params, data, succ_cb, err_cb) {
            succ_cb = succ_cb || function(){};
            err_cb = err_cb || function(){};

            $.ajax({
                url: "/club/apiv1/topics/" + params.topic_id + "/sticking",
                method: 'POST',
                success: succ_cb,
                error: err_cb
            })
        },
        unstickTopic: function(params, data, succ_cb, err_cb) {
            succ_cb = succ_cb || function(){};
            err_cb = err_cb || function(){};

            $.ajax({
                url: "/club/apiv1/topics/" + params.topic_id + "/sticking",
                method: 'DELETE',
                success: succ_cb,
                error: err_cb
            })
        },

        starTopic: function(params, data, succ_cb, err_cb) {
            succ_cb = succ_cb || function(){};
            err_cb = err_cb || function(){};

            $.ajax({
                url: "/club/apiv1/topics/" + params.topic_id + "/starring",
                method: 'POST',
                success: succ_cb,
                error: err_cb
            })
        },

        unstarTopic: function(params, data, succ_cb, err_cb) {
            succ_cb = succ_cb || function(){};
            err_cb = err_cb || function(){};

            $.ajax({
                url: "/club/apiv1/topics/" + params.topic_id + "/starring",
                method: 'DELETE',
                success: succ_cb,
                error: err_cb
            })
        },

        hideTopic: function(params, data, succ_cb, err_cb) {
            succ_cb = succ_cb || function(){};
            err_cb = err_cb || function(){};

            $.ajax({
                url: "/club/apiv1/topics/" + params.topic_id + "/hide",
                method: 'POST',
                success: succ_cb,
                error: err_cb
            })
        },

        reportTopic: function(params, data, succ_cb, err_cb) {
            succ_cb = succ_cb || function(){};
            err_cb = err_cb || function(){};

            $.ajax({
                url: "/club/apiv1/topics/" + params.topic_id + "/reports",
                method: 'POST',
                success: succ_cb,
                error: err_cb
            })
        },




        /* forum 相关
        * joinCommunity
        * outCommunity
        * upVoteComment
        * getForumFollow
        * setForumAdmin
        * unsetForumAdmin
        * blacklistForumUser
        * unblacklistForumUser
        * getForumTags
        * */

        joinCommunityDirect: function(params, data, succ_cb, err_cb) {
            $.ajax({
                url: "/club/apiv1/forums/" + params.forum_id + "/users",
                method: 'POST',
                success: succ_cb,
                error: err_cb
            })
        },

        outCommunity: function(params, data, succ_cb, err_cb) {
            $.ajax({
                url: "/club/apiv1/forums/" + params.forum_id + "/users",
                method: 'DELETE',
                success: succ_cb,
                error: err_cb
            })
        },

        getForumFollow: function(params, data, succ_cb, err_cb) {
            succ_cb = succ_cb || function(){};
            err_cb = err_cb || function(){};
            $.ajax({
                url: "/club/apiv1/forums/" + params.forum_id + "/official-account-followed",
                method: 'GET',
                success: succ_cb,
                error: err_cb
            })
        },

        setForumAdmin: function(params, data, succ_cb, err_cb) {
            succ_cb = succ_cb || function(){};
            err_cb = err_cb || function(){};
            $.ajax({
                url: "/club/apiv1/forums/" + params.forum_id + "/admins/" + params.user_id,
                method: 'POST',
                success: succ_cb,
                error: err_cb
            })
        },

        unsetForumAdmin: function(params, data, succ_cb, err_cb) {
           succ_cb = succ_cb || function(){};
           err_cb = err_cb || function(){};
           $.ajax({
               url: "/club/apiv1/forums/" + params.forum_id + "/admins/" + params.user_id,
               method: 'DELETE',
               success: succ_cb,
               error: err_cb
           })
        },

        blacklistForumUser: function(params, data, succ_cb, err_cb) {
            succ_cb = succ_cb || function(){};
            err_cb = err_cb || function(){};
            $.ajax({
                url: "/club/apiv1/forums/" + params.forum_id + "/blacklist/" + params.user_id,
                method: 'POST',
                success: succ_cb,
                error: err_cb
            })
        },

        unblacklistForumUser: function(params, data, succ_cb, err_cb) {
            succ_cb = succ_cb || function(){};
            err_cb = err_cb || function(){};
            $.ajax({
                url: "/club/apiv1/forums/" + params.forum_id + "/blacklist/" + params.user_id,
                method: 'DELETE',
                success: succ_cb,
                error: err_cb
            })
        },

        getForumTags: function(params, data, succ_cb, err_cb) {
            succ_cb = succ_cb || function(){};
            err_cb = err_cb || function(){};

            $.ajax({
                url: "/club/apiv1/forums/" + params.forum_id + "/tags",
                method: 'GET',
                success: succ_cb,
                error: err_cb
            })
        },

        getForumGroups: function(params, data, succ_cb, err_cb) {
            succ_cb = succ_cb || function(){};
            err_cb = err_cb || function(){};

            $.ajax({
                url: "/club/apiv1/forums/" + params.forum_id + "/site-groups",
                method: 'GET',
                data: data,
                success: succ_cb,
                error: err_cb
            })
        },


        /* 用户相关
        * getSiteGroups
        * getMyGroups
        * changeMyGroups
        * banningUser
        * unbanningUser
        * banningUserPUT
        * delReply
        * delConfirm
        * upVoteComment
        * downVoteComment
        * */
        getSiteGroups: function(params, data, succ_cb, err_cb) {
            data = data || {};
            succ_cb = succ_cb || function(){};
            err_cb = err_cb || function(){};
            $.ajax({
                url: '/club/apiv1/sites/' + params.site_id + '/groups',
                method: 'GET',
                data: data,
                success: succ_cb,
                error: err_cb
            })

        },

        getMyGroups: function(params, data, succ_cb, err_cb) {
            data = data || {};
            succ_cb = succ_cb || function(){};
            err_cb = err_cb || function(){};
            $.ajax({
                url: '/club/apiv1/sites/' + params.site_id + '/me/groups',
                method: 'GET',
                success: succ_cb,
                error: err_cb
            })
        },

        changeMyGroups: function(params, data, succ_cb, err_cb) {
            data = data || {};
            succ_cb = succ_cb || function(){};
            err_cb = err_cb || function(){};
            $.ajax({
                url: "/club/apiv1/sites/" + params.site_id + "/me/groups",
                method: 'POST',
                success: succ_cb,
                error: err_cb
            })
        },

        banningUser: function(params, data, succ_cb, err_cb) {
            succ_cb = succ_cb || function(){};
            err_cb = err_cb || function(){};

            $.ajax({
                url: "/club/apiv1/forums/" + params.forum_id + "/banning/" + params.user_id,
                method: 'POST',
                data: data,
                success: succ_cb,
                error: err_cb
            })
        },

        unbanningUser: function(params, data, succ_cb, err_cb) {
            succ_cb = succ_cb || function(){};
            err_cb = err_cb || function(){};

            $.ajax({
                url: "/club/apiv1/forums/" + params.forum_id + "/banning/" + params.user_id,
                method: 'DELETE',
                data: data,
                success: succ_cb,
                error: err_cb
            })
        },

        delReply: function(params, data, succ_cb, err_cb) {
            succ_cb = succ_cb || function(){};
            err_cb = err_cb || function(){};

            $.ajax({
                url: "/club/apiv1/comments/" + params.reply_id,
                method: 'DELETE',
                success: succ_cb,
                error: err_cb
            })
        },

        delConfirm: function(params, data, succ_cb, err_cb) {
            succ_cb = succ_cb || function(){};
            err_cb = err_cb || function(){};

            $.ajax({
                url: "/club/apiv1/topics/" + params.topic_id,
                method: 'DELETE',
                success: succ_cb,
                error: err_cb
            })
        },

        upVoteComment: function(params, data, succ_cb, err_cb) {
            succ_cb = succ_cb || function(){};
            err_cb = err_cb || function(){};
            $.ajax({
                url: "/club/apiv1/comments/" + params.comment_id + "/upvotes",
                method: 'POST',
                success: succ_cb,
                error: err_cb
            })
        },

        downVoteComment: function(params, data, succ_cb, err_cb) {
            succ_cb = succ_cb || function(){};
            err_cb = err_cb || function(){};
            $.ajax({
                url: "/club/apiv1/comments/" + params.comment_id + "/upvotes",
                method: 'DELETE',
                success: succ_cb,
                error: err_cb
            })
        },

        /* media相关 */
        wxUploadMedia: function(params, data, succ_cb, err_cb) {
            succ_cb = succ_cb || function(){};
            err_cb = err_cb || function(){};
            $.ajax({
                url: "/club/apiv1/wx/media/download",
                method: 'POST',
                data: data,
                success: succ_cb,
                error: err_cb
            })
        },


        /* 管理员 处理申请/退出 社区 */
        // 当前用户申请加入
        postForumApp: function(params, data, succ_cb, err_cb) {
            succ_cb = succ_cb || function(){};
            err_cb = err_cb || function(){};
            $.ajax({
                url: "/club/apiv1/forums/" + params.forum_id + "/applicants",
                method: 'POST',
                data: data,
                success: succ_cb,
                error: err_cb
            })
        },

        // 管理员 拒绝用户申请
        rejectApplication: function(params, data, succ_cb, err_cb) {
            succ_cb = succ_cb || function(){};
            err_cb = err_cb || function(){};
            $.ajax({
                url: "/club/apiv1/forums/" + params.forum_id + "/applicants/" + params.user_id,
                method: 'DELETE',
                success: succ_cb,
                error: err_cb
            })
        },

        // 管理员同意申请
        acceptApplication: function(params, data, succ_cb, err_cb) {
            succ_cb = succ_cb || function(){};
            err_cb = err_cb || function(){};

            $.ajax({
               url: "/club/apiv1/forums/" + params.forum_id + "/applicants/" + params.user_id,
               method: 'PUT',
               success: succ_cb,
               error: err_cb
            })
        },

        kickOutUser: function(params, data, succ_cb, err_cb) {
            succ_cb = succ_cb || function(){};
            err_cb = err_cb || function(){};

            $.ajax({
                url: "/club/apiv1/forums/" + params.forum_id + "/users/" + params.user_id,
                method: 'DELETE',
                success: succ_cb,
                error: err_cb
            })
        },


        getUserInfo: function(params, data, succ_cb, err_cb) {
            succ_cb = succ_cb || function(){};
            err_cb = err_cb || function(){};

            $.ajax({
                url: "/club/apiv1/users/" + params.user_id,
                method: 'GET',
                data: data,
                success: succ_cb,
                error: err_cb
            })
        },

        changeUserGroup: function(params, data, succ_cb, err_cb) {
            succ_cb = succ_cb || function(){};
            err_cb = err_cb || function(){};

            $.ajax({
                url: "/club/apiv1/sites/" + params.site_id + "/users/" + params.user_id + '/groups',
                method: "POST",
                data: data,
                success: succ_cb,
                error: err_cb
            })
        },
        
        
        /* 
        * 赏金相关
        * */
        getPaidTips: function(params, data, succ_cb, err_cb) {
            succ_cb = succ_cb || function(){};
            err_cb = err_cb || function(){};
            $.ajax({
                url: "/clubv2/api/me/paid-topic-tips",
                type: 'GET',
                data: data,
                success: succ_cb,
                error: err_cb
            });
        },
        
        getReceivedTips: function(params, data, succ_cb, err_cb) {
           succ_cb = succ_cb || function(){};
           err_cb = err_cb || function(){};
           $.ajax({
               url: "/clubv2/api/me/received-topic-tips",
               type: 'GET',
               data: data,
               success: succ_cb,
               error: err_cb
           });
        },

        withdrawBalance: function(params, data, succ_cb, err_cb) {
            succ_cb = succ_cb || function(){};
            err_cb = err_cb || function(){};
            $.ajax({
                url: "/shop/api/me/wallet/withdrawal",
                type: 'POST',
                data: data,
                success: succ_cb,
                error: err_cb
            })
        },

        /* 其他 */

        guideAttention: function(params, data, succ_cb, err_cb){
            succ_cb = succ_cb || function(){};
            err_cb = err_cb || function(){};
            $.ajax({
                url: '/club/apiv1/forums/' + params.forum_id + '/official-account-rule',
                type: 'GET',
                success: succ_cb,
                error: err_cb
            })
        },

        signIn: function(params, data, succ_cb, err_cb) {
            succ_cb = succ_cb || function(){};
            err_cb = err_cb || function(){};
            $.ajax({
                url: "/club/apiv1/score/score_signal",
                type: 'POST',
                data: data,
                success: succ_cb,
                error: err_cb
            })
        },
        
        scoreExchange: function(params, data, succ_cb, err_cb) {
            succ_cb = succ_cb || function(){};
            err_cb = err_cb || function(){};
            $.ajax({
                url: "/club/apiv1/forums/" + params.forum_id + "/score-exchange",
                type: 'POST',
                data: data,
                success: succ_cb,
                error: err_cb
            })
        },

        //获取验证码
        getSms: function (params, data, succ_cb, err_cb) {
            succ_cb = succ_cb || function () {};
            err_cb = err_cb || function () {};
            $.ajax({
                url: "/shop/api/sites/"  + params.site_id + "/sms",
                type: "POST",
                data: data,
                success: succ_cb,
                error: err_cb
            })
        },

        //绑定银行卡
        bindBank: function(params, data, succ_cb, err_cb){
            succ_cb = succ_cb || function () {};
            err_cb = err_cb || function () {};
            $.ajax({
                url: '/shop/api/me/wallet',
                type: 'post',
                data: data,
                success: succ_cb,
                error: err_cb
            });
        }
    }

});