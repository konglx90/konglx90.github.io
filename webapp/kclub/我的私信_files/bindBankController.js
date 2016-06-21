define([
    'global',
    'controllers/base' ,
    'components/alert',
    'requests'
], function (global, baseController, alert, requests) {

    return baseController.extend({
        tagName: 'div',
        events:{
                'click .show-bank':"showBank",
                'click .bank-choose' :"chooseBank",
                'blur [data-role="card"]':"confirmCard",
                'blur [data-role="name"]':"confirmName",
                'keyup .ipt-short':"confirmCode",
                'click .getnum':"getCode",
                'click .sub' : "subBind"
        },

        initialize: function (options) {
            var that = this;
            var BANKS = [{
                name: '中国银行',
                value: '中国银行',
                cur: false,
                icon: 'bank_zg'
            },{
                name: '中国工商银行',
                value: '中国工商银行',
                cur: false,
                icon: 'bank_zggs'
            },{
                name: '中国农业银行',
                value: '中国农业银行',
                cur: false,
                icon: 'bank_zgny'
            },{
                name: '中国建设银行',
                value: '中国建设银行',
                cur: false,
                icon: 'bank_zgjs'
            },{
                name: '招商银行',
                value: '招商银行',
                cur: false,
                icon: 'bank_zs'
            },{
                name: '广东发展银行',
                value: '广东发展银行',
                cur: false,
                icon: 'bank_gf'
            },{
                name: '中信银行',
                value: '中信银行',
                cur: false,
                icon: 'bank_zx'
            },{
                name: '中国民生银行',
                value: '中国民生银行',
                cur: false,
                icon: 'bank_ms'
            },{
                name: '交通银行',
                value: '交通银行',
                cur: false,
                icon: 'bank_jt'
            }];
            var html = "<ul>";
            for(var i=0;i<BANKS.length;i++){
                html+="<li data-role='" + BANKS[i].name +"'>"+BANKS[i].name+"</li>";
            }
            html+="</ul>";
            this.$el.find('.bank-choose').append(html);
            
            this.$el.on("click", function (ev) {
                if ($(ev.target).is("#bank-backdrop")) {
                    that.hideBank();
                }
            });
        },

        showBank:function(){
          $(".bind-bank-backdrop").show();
        },

        hideBank:function(){
            $(".bind-bank-backdrop").hide();
        },

        chooseBank:function(ev){
            var $el = $(ev.target).closest("li");
            $el.addClass('right-bank');
            $el.siblings().removeClass('right-bank')
            var value = $el.data("role");
            this.hideBank();
            $(".bank-ipt").html(value);

        },

        confirmCard :function(){
            var cardnum = $('[data-role="card"]').val();
            if(!/^[\d]{12,19}$/.test(cardnum) || cardnum == '' ){
                alert.show("卡号格式不正确");
            }
        },

        confirmName:function(){
            var cardname = $('[data-role="name"]').val();
            if(cardname == '' ){
                alert.show("姓名不能为空");
            }
        },

        getCode:function(){
            var phonenum = $('[data-role="phone"]').val();
            if(!/^1\d{10}$/.test(phonenum) || phonenum == '' ){
                alert.show("手机号填写不正确");
            }else{
                var site_id = global.current_user.site_id;
                // $.ajax({
                //     url: '/shop/api/sites/' + site_id + '/sms',
                //     type: 'post',
                //     data: {mobile: phonenum},
                //     success: function(json){
                //         $el=$('.getnum');
                //         $el.attr("disabled", true);
                //         var sec = 60;
                //         $el.html(sec + '秒后重新获取');
                //         var t = setInterval(function(){
                //             if(sec == 0){
                //                 $el.html('获取验证码');
                //                 $el.attr("disabled", false);
                //                 clearInterval(t);
                //                 return false;
                //             }
                //             sec--;
                //             var str = sec + '秒后重新获取';
                //             $el.html(str);
                //         },1000)
                //     },
                //     error: function(data){
                //         if (data && data.msg) {
                //             alert.show(data.msg);
                //         }
                //         else {
                //            alert.show("获取验证码失败，请稍后重试");
                //         }
                //     }
                // });
                requests.getSms(
                    {site_id: site_id},
                    {mobile: phonenum},
                    function(data){
                        $el = $('.getnum');
                        $el.attr("disabled", true);
                        var sec = 60;
                        $el.html(sec + '秒后重新获取');
                        var t = setInterval(function(){
                            if(sec == 0){
                                $el.html('获取验证码');
                                $el.attr("disabled", false);
                                clearInterval(t);
                                return false;
                            }
                            sec--;
                            var str = sec + '秒后重新获取';
                            $el.html(str);
                        },1000)
                    },
                    function(data){
                        if (data && data.msg) {
                            alert.show(data.msg);
                        }
                        else {
                           alert.show("获取验证码失败，请稍后重试");
                        }
                    }
                )
            }
        },

        confirmCode:function(){
            var vcode = $('[data-role="vcode"]').val();
            if(vcode == '' ){
                alert.show("验证码不能为空")
            }else{
                $('.sub').addClass('sub-bind');
            }
        },

        subBind:function(){

            var banktype = $('.bank-ipt').html();
            var cardnum = $('[data-role="card"]').val();
            var cardname = $('[data-role="name"]').val();
            var phonenum = $('[data-role="phone"]').val();
            var vcode = $('[data-role="vcode"]').val();
            if(banktype == ''){
                alert.show("未选择银行");
            } else if(!/^[\d]{12,19}$/.test(cardnum) || cardnum == ''){
                alert.show("卡号格式不正确");
            }else if(cardname == ''){
                alert.show("请输入姓名");
            }else{
                var sendData={
                    'card':cardnum,
                    'name':cardname,
                    'bank':banktype,
                    'mobile':phonenum,
                    'vcode':vcode
                }

              // $.ajax({
              //     url: '/shop/api/me/wallet',
              //     type: 'post',
              //     data: sendData,
              //     success: function(json){
              //         alert.show("绑定成功");
              //         window.location.href="/club/me/my-bank";
              //     },
              //     error: function(err) {
              //         alert.show(err.responseJSON.msg);
              //     }
              // });
                requests.bindBank(
                    {},
                    sendData,
                    function(){
                        alert.show("绑定成功");
                        window.location.href="/club/me/my-bank";
                    },
                    function(err){
                        alert.show(err.responseJSON.msg);
                    }
                )
            }
        }

    });
});
