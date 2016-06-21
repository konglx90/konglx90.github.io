define(['zepto','http://bus.kuaizhan.com/bus.min.js','http://kzcdn.itc.cn/res/ui/js/lib/mustache.js'], function ($,sdk,mustache) {
        'use strict';

        var pageY = function(elem) {
            var p = 0;
            // 累加每一个父元素的偏移量
            while ( elem ) {
                // 增加偏移量
                p += elem.offsetTop;
                // 遍历下一个父元素
                elem = elem.offsetParent;
            }
            return p;
        };

        var checkMobile  = function(that) {
            var str = $(that).val();
            var re = /^1\d{10}$/;
            if (str != "") {
                if (!re.test(str)) {
                    $(that).focus();
                    $(that).addClass('input-error');
                } else if (re.test(str) ) {
                    $(that).removeClass('input-error');
                }
            } else{
                $(that).removeClass('input-error');
            }
        };

        var checkEmail = function (that) {
            var str = $(that).val();
            var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
            if (str != "") {
                if (!re.test(str)) {
                    $(that).focus();
                    $(that).addClss('input-error');
                } else if (re.test(str) || str == "") {
                    $(that).removeClass('input-error');
                }
            } else{
                $(that).removeClass('input-error');
            }
        };
        
        var list_vote_html = "<div class='list-vote-client' style='display: {{list-display}};'>\
                                    <div class='list-vote-info'>\
                                        <div class='vote-caption'>{{list_vote_caption}}</div>\
                                        {{#show_sign_interval}}<div  class='time-interval text-align-left'>报名时间：{{sign_interval}}</div> {{/show_sign_interval}}\
                                        {{#show_time_interval}}<div  class='time-interval text-align-left'>投票时间：{{time_interval}}</div> {{/show_time_interval}}\
                                        {{#show_time_to_close}}<div class='time-to-close text-align-left'>距活动结束还有：\
                                            <span class='day'></span>\
                                            <span class='hour'></span>\
                                            <span class='minute'></span>\
                                            <span class='second'></span>\
                                            </div> \
                                        {{/show_time_to_close}}\
                                        {{#show_vote_limit}}<div class='vote-limit text-align-left'>活动规则：{{vote_limit}}</div>{{/show_vote_limit}} \
                                        {{#show_select_limit}}<div class='vote-limit text-align-left'>选票规则：{{select_limit}}</div>{{/show_select_limit}} \
                                    </div>\
                                    {{#show_vote_stat}}\
                                        <div class='vote-stat'>\
                                            <div class='vote-data-left'>\
                                                <div class='text-align-center'>参与选手</div> \
                                                <div class='vote-count '>{{vote_count}}</div> \
                                            </div>\
                                            <div class='vote-data-center'>\
                                                <div class='text-align-center'>累计投票</div>\
                                                <div class='total-vote-time'>{{total_vote_time}}</div>\
                                            </div>\
                                            <div class='vote-data-right'>\
                                                <div class='text-align-center'>累计访问</div>\
                                                <div class='total-visit-time kz-f-c-t'>{{total_visit_time}}</div>\
                                            </div>\
                                        </div>\
                                    {{/show_vote_stat}} \
                                    {{#show_sign}}\
                                        <div class='vote-sign-div mod-button {{#__theme_class__}} {{__theme_class__}}{{/__theme_class__}}'>\
                                            <a href='javascript:;' class='vote-sign {{btn_shape}} {{btn_color}} '>\
                                                    {{#icon}}<i class='font-ico' style='line-height:{{btn_height}};'>{{icon}}</i>{{/icon}}\
                                                 <span class='button-vote-span'>{{sign_button_text}}</span> \
                                            </a>\
                                        </div>\
                                        <div class='sign-info' style='display:none'></div>\
                                    {{/show_sign}}\
                                    <div class='list-vote-option'>\
                                        {{#order_list_client}}\
                                            <div class='one-vote'>\
                                                <div class='vote-id-div'>\
                                                    <input type='checkbox' name='choose_vote' id='{{vote_id}}' value='{{vote_id}}'/>\
                                                    <label class='list-vote-label-style' for='{{vote_id}}'>{{uname}} {{#isDes}}: {{/isDes}}</label>\
                                                </div>\
                                                <div class='vote-desc-div'>\
                                                    <a class='vote-desc' {{#isUrl}}href='{{url}}'{{/isUrl}} >{{desc}}</a>\
                                                </div>    \
                                            </div>\
                                        {{/order_list_client}}\
                                        <div class='mod-button {{#__theme_class__}} {{__theme_class__}}{{/__theme_class__}}' style='text-align:center;{{#align}}text-align:{{align}}{{/align}}''>\
                                            <a href='javascript:;' class='list-vote-button {{btn_shape}} {{btn_color}}' style='width:100%;margin-top:6px;{{#btn_width}}width:{{btn_width}};{{/btn_width}}{{#btn_height}} height:{{btn_height}};{{/btn_height}}{{#btn_height}}line-height:{{btn_height}};{{/btn_height}}'>\
                                                {{#icon_data}}<i class='font-ico' style='line-height:{{btn_height}};'>{{icon}}</i>{{/icon_data}}\
                                                <span class='button-vote-span'>{{button_text}}</span> \
                                            </a>\
                                        </div>\
                                    </div>\
                                    <div class='list-vote-result'>\
                                    </div>\
                            </div>";
        var pk_vote_html = "<div class='pk-vote-client' style='display: {{pk-display}};'>\
                                <div class='vote-info'>\
                                    <div class='vote-caption'>{{pk_vote_caption}}</div>\
                                    {{#show_time_interval}}<div  class='time-interval text-align-left'>投票时间：{{time_interval}}</div> {{/show_time_interval}}\
                                    {{#show_time_to_close}}<div class='time-to-close text-align-left'>距活动结束还有：\
                                        <span class='day'></span>\
                                        <span class='hour'></span>\
                                        <span class='minute'></span>\
                                        <span class='second'></span>\
                                        </div> \
                                    {{/show_time_to_close}}\
                                    {{#show_vote_limit}}<div class='vote-limit text-align-left'>活动规则：{{vote_limit}}</div>{{/show_vote_limit}} \
                                </div>\
                                {{#show_vote_stat}}\
                                    <div class='vote-stat'>\
                                        <div class='vote-data-left'>\
                                            <div class='text-align-center'>参与选手</div> \
                                            <div class='vote-count '>{{vote_count}}</div> \
                                        </div>\
                                        <div class='vote-data-center'>\
                                            <div class='text-align-center'>累计投票</div>\
                                            <div class='total-vote-time'>{{total_vote_time}}</div>\
                                        </div>\
                                        <div class='vote-data-right'>\
                                            <div class='text-align-center'>累计访问</div>\
                                            <div class='total-visit-time kz-f-c-t'>{{total_visit_time}}</div>\
                                        </div>\
                                    </div>\
                                {{/show_vote_stat}} \
                                <div class='pk-vote-style'>\
                                    <a href='javascript:;' class='btn-vote pk-left-button' data-vote_id={{pk_left_vote_id}}><span class='button-vote-span'>{{pk_left_vote}}</span></a>\
                                    <div class='pk-vote-image'><img src='http://pic.kuaizhan.com/g2/M00/32/6E/wKjmqlYV3IqACMOnAAAKm3TJuKw6021930/imageView/v1/thumbnail/640x0'></div>\
                                    <a href='javascript:;' class='btn-vote pk-right-button' data-vote_id={{pk_right_vote_id}}><span class='button-vote-span'>{{pk_right_vote}}</span></a>\
                                </div>\
                                <div class='pk-result'>\
                                    <div class='pk-result-options'>\
                                        <a href='javascript:;' class='pk-left-result' data-vote_id={{pk_left_vote_id}}><span class='button-vote-span'>{{pk_left_vote}}</span></a>\
                                        <div class='pk-vote-image'><img src='http://pic.kuaizhan.com/g2/M01/32/52/CgpQVFYV3IuAQcKFAAAKsNAdWqw8315214/imageView/v1/thumbnail/640x0'></div>\
                                        <a href='javascript:;' class='pk-right-result' data-vote_id={{pk_right_vote_id}}><span class='button-vote-span'>{{pk_right_vote}}</span></a>\
                                    </div>\
                                </div>\
                            </div>";
        var auto_vote_html ="<div class='auto-vote-client'>\
                                <div class='vote-info'>\
                                    <div class='vote-caption'>{{auto_vote_caption}}</div> \
                                    {{#show_sign_interval}}<div  class='time-interval text-align-left'>报名时间：{{sign_interval}}</div> {{/show_sign_interval}}\
                                    {{#show_time_interval}}<div  class='time-interval text-align-left'>投票时间：{{time_interval}}</div> {{/show_time_interval}}\
                                    {{#show_time_to_close}}\
                                    <div class='time-to-close text-align-left'>距活动结束还有：\
                                        <span class='day'></span>\
                                        <span class='hour'></span>\
                                        <span class='minute'></span>\
                                        <span class='second'></span>\
                                    </div> \
                                    {{/show_time_to_close}}\
                                    {{#show_vote_limit}}<div class='vote-limit text-align-left'>活动规则：{{vote_limit}}</div>{{/show_vote_limit}} \
                                    {{#auto_vote_search}}\
                                    <div class='vote-search'>\
                                        <input class='vote-search-input' placeholder='请输入投票项名称或者编号' value='{{vote_search}}'></input>\
                                        <img src='http://pic.kuaizhan.com/g1/M01/8D/22/wKjmqVcd0ieAOzqdAAADIEdQEeU7035742' class='vote-search-img'></img>    \
                                    </div>\
                                    {{/auto_vote_search}} \
                                </div>\
                                {{#show_vote_stat}}\
                                    <div class='vote-stat'>\
                                        <div class='vote-data-left'>\
                                            <div class='text-align-center'>参与选手</div> \
                                            <div class='vote-count '>{{vote_count}}</div> \
                                        </div>\
                                        <div class='vote-data-center'>\
                                            <div class='text-align-center'>累计投票</div>\
                                            <div class='total-vote-time'>{{total_vote_time}}</div>\
                                        </div>\
                                        <div class='vote-data-right'>\
                                            <div class='text-align-center'>累计访问</div>\
                                            <div class='total-visit-time kz-f-c-t'>{{total_visit_time}}</div>\
                                        </div>\
                                    </div>\
                                {{/show_vote_stat}} \
                                {{#show_sign}}\
                                    <div class='vote-sign-div mod-button {{#__theme_class__}} {{__theme_class__}}{{/__theme_class__}}'>\
                                        <a href='javascript:;' class='vote-sign {{btn_shape}} {{btn_color}} '>\
                                                {{#icon}}<i class='font-ico' style='line-height:{{btn_height}};'>{{icon}}</i>{{/icon}}\
                                             <span class='button-vote-span'>{{sign_button_text}}</span> \
                                        </a>\
                                    </div>\
                                    <div class='sign-info' style='display:none'></div>\
                                {{/show_sign}}\
                                <div class='vote-list-left'>\
                                    {{#auto_list_left}}\
                                        <div class='one-vote'>\
                                            {{#number}}\
                                                <div class='vote-index-div kz-b-c-t {{^pic}}vote-index-without-pic{{/pic}}'>\
                                                    <span class='index-number'>{{number}}</span>\
                                                    <span class='index-span'>号</span>\
                                                </div>\
                                            {{/number}}\
                                            {{#pic}}<div class='pic' style='display:{{pic_display}}'><a {{#isUrl}}href='{{url}}' {{/isUrl}} > <img class='vote-img' src='{{pic}}'/></a> </div>{{/pic}}\
                                            <div  class='vote-uname {{^pic}}vote-uname-without-pic{{/pic}}' >{{uname}}</div>  \
                                            {{#desc}}<div  class='vote-desc' >{{desc}}</div>{{/desc}}  \
                                            <div  class='vote-score-uid'>\
                                                <span class='score'>{{score}}</span>  \
                                                <span class='text' >票</span>\
                                            </div>\
                                            <div style='clear:both'></div>\
                                            <div class='mod-button {{#__theme_class__}} {{__theme_class__}}{{/__theme_class__}}'>\
                                                <a href='javascript:;' class='btn-vote {{btn_shape}} {{btn_color}} ' data-vote_id='{{vote_id}}' style='width:100%;margin-top:6px;{{#btn_width}}width:{{btn_width}};{{/btn_width}} {{#btn_height}}height:{{btn_height}};{{/btn_height}}{{#btn_height}}line-height:{{btn_height}};{{/btn_height}}'>\
                                                    {{#icon_data}}<i class='font-ico' style='line-height:{{btn_height}};'>{{icon}}</i>{{/icon_data}}\
                                                    <span class='button-vote-span'>{{button_text}}</span> \
                                                </a>\
                                            </div>\
                                        </div>\
                                    {{/auto_list_left}}\
                                </div>\
                                <div class='vote-list-right'>\
                                {{#auto_list_right}}\
                                    <div class='one-vote'>\
                                        {{#number}}\
                                            <div class='vote-index-div kz-b-c-t {{^pic}}vote-index-without-pic{{/pic}}'>\
                                                <span class='index-number'>{{number}}</span>\
                                                <span class='index-span'>号</span>\
                                            </div>\
                                        {{/number}}\
                                        {{#pic}}<div class='pic' style='display:{{pic_display}}'> <a {{#isUrl}}href='{{url}}'{{/isUrl}} ><img class='vote-img' src='{{pic}}'/></a></div>{{/pic}}\
                                        <div  class='vote-uname {{^pic}}vote-uname-without-pic{{/pic}}' >{{uname}}</div>  \
                                        {{#desc}}<div  class='vote-desc' >{{desc}}</div>{{/desc}}  \
                                        <div  class='vote-score-uid'>\
                                            <span class='score'>{{score}}</span>  \
                                            <span class='text' >票</span>\
                                        </div>\
                                        <div style='clear:both'></div>\
                                        <div class='mod-button {{#__theme_class__}} {{__theme_class__}}{{/__theme_class__}}'>\
                                            <a href='javascript:;' class='btn-vote {{btn_shape}} {{btn_color}}' data-vote_id='{{vote_id}}' style='width:100%;margin-top:6px;{{#btn_width}}width:{{btn_width}}; {{/btn_width}}{{#btn_height}}height:{{btn_height}};{{/btn_height}}{{#btn_height}}line-height:{{btn_height}};{{/btn_height}}'>\
                                                {{#icon_data}}<i class='font-ico' style='line-height:{{btn_height}};'>{{icon}}</i>{{/icon_data}}\
                                                <span class='button-vote-span'>{{button_text}}</span> \
                                            </a>\
                                        </div>    \
                                    </div>\
                                {{/auto_list_right}}\
                                </div>\
                            </div> ";

        var multi_vote_result = "{{#render_data}}\
                                    <div class='multi-result-info'>\
                                        <div style='float: left'>{{uname}}</div>\
                                        <div style='float: right'>\
                                            <span class='score-span'>{{score}}票</span>\
                                            <span class='percentage-span'>{{percentage}}%</span>\
                                        </div>\
                                    </div>\
                                    <div class='multi-result-show'>\
                                        <span style='border-radius: 3px;display: block; width: {{percentage}}%; height: 5px; background: {{color}}'></span>\
                                    </div>\
                                {{/render_data}}";

        var pk_vote_result = "<div style='width: 100%;height: 8px;'>\
                                  <div style='height:8px;width: {{left_percentage}}%;background:#da243d;float:left;border-radius: 3px 0px 0px 3px;'></div>\
                                  <div style='height:8px;width: {{right_percentage}}%;background: #0091e0;float:right;border-radius: 0px 3px 3px 0px;'></div>\
                              </div>\
                              <div style='width: 100%;height: 30px;'>\
                                  <span class='pk-vote-score' style='float:left;'>{{left_score}}票</span>\
                                  <span class='pk-vote-score' style='float: right;'>{{right_score}}票</span>\
                              </div>";

        var alert_content = "<div class='kuaivote-multi-white-content-small'>\
                                <div class='info-div'>\
                                    <div class='vote-msg-div'></div>\
                                    <div class='vote-button-div mod-button'>\
                                        <a class='confirm-msg-btn' >确定 </a> \
                                        <a class='confirm-msg-btn jump-button'></a>\
                                    </div>  \
                                </div> \
                            </div>";

        var fade_content = "<div class='kuaivote-multi-black-overlay' > </div>";

        var vote_with_captcha_div = "<div class='captcha-vote-div'>\
                                        <div class='info-div'>\
                                            <span>请输入验证码后投票</span>\
                                        </div>\
                                        <span class='captcha-error-info'>验证码错误</span>\
                                        <div class='captcha-div'>\
                                            <input class='chatcha-value'/>\
                                            <img class='captcha-img' {{#captcha_url}}src='{{captcha_url}}'{{/captcha_url}}/>\
                                            <div class='loading-div'>\
                                                <img class='loading' src='http://pic.kuaizhan.com/g1/M00/50/C9/CgpQU1Z89TaATFelAAAcpteNePg4702004'/>\
                                            </div>    \
                                            <br/>\
                                            <a href='javascript:;' class='change-captcha kz-f-c-t'>看不清，换一张</a>\
                                        </div>\
                                        <div class='captcha-vote kz-b-c-t' data-captcha_id='{{captcha_id}}' data-type='{{type}}' data-vote_id='{{vote_id}}' data-activity_id='{{activity_id}}'>\
                                            <span class='button-vote-span'>确认投票</span>\
                                        </div>\
                                    </div>";

        var my_DatePicker = function (options) {
            var defaults = {
                YearSelector: "#sel_year",
                MonthSelector: "#sel_month",
                DaySelector: "#sel_day",
                FirstText: "--",
                FirstValue: 0
            };
            var opts = $.extend({}, defaults, options);
            var $YearSelector = $(opts.YearSelector);
            var $MonthSelector = $(opts.MonthSelector);
            var $DaySelector = $(opts.DaySelector);
            var FirstText = opts.FirstText;
            var FirstValue = opts.FirstValue;

            // 初始化
            var str = "<option value=\"" + FirstValue + "\">"+FirstText+"</option>";
            $YearSelector.html(str);
            $MonthSelector.html(str);
            $DaySelector.html(str);

            // 年份列表
            var yearNow = new Date().getFullYear();
            var yearSel = $YearSelector.attr("rel");
            for (var i = yearNow; i >= 1900; i--) {
                var sed = yearSel==i?"selected":"";
                var yearStr = "<option value=\"" + i + "\" " + sed+">"+i+"</option>";
                $YearSelector.append(yearStr);
            }

            // 月份列表
            var monthSel = $MonthSelector.attr("rel");
            for (var i = 1; i <= 12; i++) {
                var sed = monthSel==i?"selected":"";
                var monthStr = "<option value=\"" + i + "\" "+sed+">"+i+"</option>";
                $MonthSelector.append(monthStr);
            }

            // 日列表(仅当选择了年月)
            function BuildDay() {
                if ($YearSelector.val() == 0 || $MonthSelector.val() == 0) {
                    // 未选择年份或者月份
                    $DaySelector.html(str);
                } else {
                    $DaySelector.html(str);
                    var year = parseInt($YearSelector.val());
                    var month = parseInt($MonthSelector.val());
                    var dayCount = 0;
                    switch (month) {
                        case 1:
                        case 3:
                        case 5:
                        case 7:
                        case 8:
                        case 10:
                        case 12:
                            dayCount = 31;
                            break;
                        case 4:
                        case 6:
                        case 9:
                        case 11:
                            dayCount = 30;
                            break;
                        case 2:
                            dayCount = 28;
                            if ((year % 4 == 0) && (year % 100 != 0) || (year % 400 == 0)) {
                                dayCount = 29;
                            }
                            break;
                        default:
                            break;
                    }

                    var daySel = $DaySelector.attr("rel");
                    for (var i = 1; i <= dayCount; i++) {
                        var sed = daySel==i?"selected":"";
                        var dayStr = "<option value=\"" + i + "\" "+sed+">" + i + "</option>";
                        $DaySelector.append(dayStr);
                    }
                }
            }
            $MonthSelector.change(function () {
                BuildDay();
            });
            $YearSelector.change(function () {
                BuildDay();
            });
            if ($DaySelector.attr("rel")!="") {
                BuildDay();
            }
        };// End ms_DatePicker

        var ms = {
            init:function(obj,args) {
                return (function() {
                    ms.fillHtml(obj,args);
                    ms.bindEvent(obj,args);
                })();
            },
            fillHtml:function(obj,args) {
                return (function() {
                    obj.empty();

                    if (args.current > 1) {
                        obj.append('<a href="javascript:;" class="prevPage"><</a>');
                    } else{
                        if (obj.find('.prevPage').length!=0) {
                            obj.remove('.prevPage');
                        }
                        obj.append('<span class="disabled"><</span>');
                    }

                    if (args.current != 1 && args.current >= 4 && args.pageCount != 4) {
                        obj.append('<a href="javascript:;" class="tcdNumber">'+1+'</a>');
                    }
                    if (args.current-2 > 2 && args.current <= args.pageCount && args.pageCount > 5) {
                        obj.append('<span>...</span>');
                    }
                    var start = args.current -2,end = args.current+2;
                    if ((start > 1 && args.current < 4)||args.current == 1) {
                        end++;
                    }
                    if (args.current > args.pageCount-4 && args.current >= args.pageCount) {
                        start--;
                    }
                    for (;start <= end; start++) {
                        if (start <= args.pageCount && start >= 1) {
                            if (start != args.current) {
                                obj.append('<a href="javascript:;" class="tcdNumber">'+ start +'</a>');
                            } else{
                                obj.append('<span class="current">'+ start +'</span>');
                            }
                        }
                    }
                    if (args.current + 2 < args.pageCount - 1 && args.current >= 1 && args.pageCount > 5) {
                        obj.append('<span>...</span>');
                    }
                    if (args.current != args.pageCount && args.current < args.pageCount -2  && args.pageCount != 4) {
                        obj.append('<a href="javascript:;" class="tcdNumber">'+args.pageCount+'</a>');
                    }
                    if (args.current < args.pageCount) {
                        obj.append('<a href="javascript:;" class="nextPage">></a>');
                    } else{
                        if (obj.find('.nextPage').length!=0) {
                            obj.remove('.nextPage');
                        }
                        obj.append('<span class="disabled">></span>');
                    }
                })();
            },
            bindEvent:function(obj,args) {
                return (function() {
                    obj.on("click","a.tcdNumber",function() {
                        var current = parseInt($(this).text());
                        ms.fillHtml(obj,{"current":current,"pageCount":args.pageCount});
                        if (typeof(args.backFn)=="function") {
                            args.backFn(current);
                        }
                    });
                    obj.on("click","a.prevPage",function() {
                        var current = parseInt(obj.children("span.current").text());
                        ms.fillHtml(obj,{"current":current-1,"pageCount":args.pageCount});
                        if (typeof(args.backFn)=="function") {
                            args.backFn(current-1);
                        }
                    });
                    obj.on("click","a.nextPage",function() {
                        var current = parseInt(obj.children("span.current").text());
                        ms.fillHtml(obj,{"current":current+1,"pageCount":args.pageCount});
                        if (typeof(args.backFn)=="function") {
                            args.backFn(current+1);
                        }
                    });
                })();
            }
        };

        $.fn.createPage = function(options) {
            var args = $.extend({
                pageCount : 10,
                current : 1,
                backFn : function() {}
            },options);
            ms.init(this,args);
        };

        //测试环境和线上环境识别
        if (location.host.match(/t1.com/)) {
            var LOGIN_URL = 'http://passport.t1.com/main/login?site_id=';
        } else {
            var LOGIN_URL = 'http://passport.kuaizhan.com/main/login?site_id=';
        }

        var getUser = function() {
            location.href = LOGIN_URL + SOHUZ.page.site_id + '&callback=' + encodeURIComponent(window.location.href);
        };

        //初始化组件类，参数为组件配置，如果组件第一次创建，将传递空配置，如果组件为已经创建到视图窗口，重新加载，将传递已保存的配置
        return {
            //输出到发布页面，当用户正式发布后，调用此函数创建视图。
            //点击投票按钮，将数据库中对应记录+1
            onAfterRender: function (el, window, document) {

                var colors = ["#da243d","#eb891a","#f7dc4a","#68b92e","#00923f","#0094b2","#1a93de","#005ca1","#29166f","#801d77"];
                var success_info ="投票成功！";
                var day_empty_info = "您今天的票已经投完了，请明天再来吧！";
                var all_empty_info = "您的票已经投完！";
                var vote_not_exist_info = "投票项不存在！";
                var activity_not_exist_info = "投票活动不存在！";
                var activity_not_open_info = "投票活动尚未开始！";
                var activity_finish_info = "投票活动已经结束！";
                var activity_suspend_info = "投票活动暂时停止！";
                var forbid_multi_to_one = "对当前投票项只能投一票";
                var server_error = "当前投票太密集,请稍后再试";
                var vote_auto_index_show = 0;//默认不显示编号

                var align = $(el).attr('text-align');
                var site_id = SOHUZ.page.site_id;
                var list_display = $(el).find('.vote-data').data('list_display');
                var pk_display = $(el).find('.vote-data').data('pk_display');
                var auto_display = $(el).find('.vote-data').data('auto_display');
                var select_vote_type = $(el).find('.vote-data').data('select_vote_type');
                var list_select_num_type = $(el).find('.vote-data').data('list_select_num_type');
                var vote_length_most = $(el).find('.vote-data').data('list-select-length-most') ? $(el).find('.vote-data').data('list-select-length-most') : $(el).find('.vote-data').data('list-select-length');
                var vote_length_least = $(el).find('.vote-data').data('list-select-length-least') ? $(el).find('.vote-data').data('list-select-length-least') : 1;
                var list_collection_name = $(el).find('.vote-data').data('list_collection_name');
                var list_vote_caption = $(el).find('.vote-data').data('list_vote_caption');
                var list_select_length = $(el).find('.vote-data').data('list_select_length');
                var list_collection_id = $(el).find('.vote-data').attr('data-list_collection_id');
                var pk_collection_name = $(el).find('.vote-data').data('pk_collection_name');
                var pk_vote_caption = $(el).find('.vote-data').data('pk_vote_caption');
                var pk_collection_id = $(el).find('.vote-data').attr('data-pk_collection_id');
                var auto_vote_caption = $(el).find('.vote-data').data('auto_vote_caption');
                var auto_collection_id = $(el).find('.vote-data').attr('data-auto_collection_id');
                var auto_vote_split = $(el).find('.vote-data').data('auto_vote_split');
                var auto_vote_search = $(el).find('.vote-data').data('auto_vote_search');
                var auto_vote_per_num = $(el).find('.vote-data').data('auto_vote_per_num');

                var show_time_interval = $(el).find('.vote-data').data('show_time_interval');
                var show_sign_interval = $(el).find('.vote-data').data('show_sign_interval');
                var show_time_to_close = $(el).find('.vote-data').data('show_time_to_close');
                var show_vote_stat = $(el).find('.vote-data').data('show_vote_stat');
                var show_vote_limit = $(el).find('.vote-data').data('show_vote_limit');
                var show_select_limit = $(el).find('.vote-data').data('show_select_limit');
                var show_sign_edit = $(el).find('.vote-data').data('show_sign');
                var select_limit = $(el).find('.vote-data').data('select_limit');
                var __theme_class__ = $(el).find('.vote-data').data('__theme_class__');
                var sign_button_text_origin = $(el).find('.vote-data').data('sign_button_text_input') ? $(el).find('.vote-data').data('sign_button_text_input') : "我要报名";
                var sign_button_text = "";
                var show_sign = false;

                var button_text_origin= $(el).find('.btn-vote .button-vote-span').text() ? $(el).find('.btn-vote .button-vote-span').text() : "投我一票";
                var button_text = "";
                var font_ico = $(el).find('.btn-vote .font-ico').html();


                var sort_type_1 = $(el).find('.vote-data').data('sort_type_1');
                var sort_type_2 = $(el).find('.vote-data').data('sort_type_2');
                var sort_type_3 = $(el).find('.vote-data').data('sort_type_3');
                var sort_type_4 = $(el).find('.vote-data').data('sort_type_4');

                var vote_count =  $(el).find('.vote-data').data('vote_count');
                var total_vote_time = 0;
                var total_visit_time = 0;
                var time_interval = "";
                var sign_interval = "";
                var vote_limit = "";
                var pos_tag;
                var end_time = "";
                var start_time ="";

                var show_sign_info = "";
                var marketing_info = "";
                var sign_auto_pass = 0;

                var app_id = "55d45b2dde0f01bf5ba98dcf";
                var app_key = "cfc512b85b45e1d5fa3120167430ab489344881c";
                var bus = BUS(app_id, app_key);
                var votes_collection = bus.Collection('votes');
                var activities_collection = bus.Collection('activities');
                var sign_collection = bus.Collection('sign_info');
                var f_size = 10  * 1024 * 1024;
                var collection_id = "";
                var is_weixin = /micromessenger/ig.test(window.navigator.userAgent);
                var desc_length_limit = 100;

                var marketing_href = "";
                var marketing_slogen = "";
                var marketing_type = "";
                var key_word = "投票";
                var $alert_div,$fade_div,$captcha_vote_div;

                if (select_vote_type == 2) {
                    collection_id = list_collection_id;
                } else if (select_vote_type == 3) {
                    collection_id = pk_collection_id;
                } else if (select_vote_type == 4) {
                    collection_id = auto_collection_id;
                }

                var btn_class = $(el).find('.btn-vote').attr('class').split(" ");
                var btn_shape = btn_class[1];
                var btn_color = btn_class[2];

                var btn_style = $(el).find('.btn-vote').attr('style').split(";");
                var btn_width = "";
                var btn_height = "";
                if (btn_style.length == 4) {
                    btn_width = btn_style[0].split(":")[1];
                    btn_height = btn_style[1].split(":")[1];
                }

                if (list_select_num_type == "radio") {
                    vote_length_most = 1;
                    vote_length_least = 1;
                }

                if ($(el).find(".kuaivote-multi-white-content-small").size()>0) {
                    $alert_div = $(el).find(".kuaivote-multi-white-content-small");
                    $fade_div = $(el).find(".kuaivote-multi-black-overlay");
                    $captcha_vote_div = $(el).find(".captcha-vote-div");
                } else {
                    $alert_div = $(alert_content);
                    $fade_div = $(fade_content);
                    $captcha_vote_div = $(vote_with_captcha_div);
                    $(el).append($alert_div);
                    $(el).append($fade_div);
                    $(el).append($captcha_vote_div);
                    $alert_div.find(".info-div .confirm-msg-btn").click(function() {
                        close_div();
                    });
                    $fade_div.click(function() {
                        close_div();
                    });

                    $alert_div.delegate(".info-div .jump-button","click",function() {
                        var url = $(this).data("href");
                        if (marketing_type == "积分领取") {
                            bus.Func('add_score').post({activity_id:collection_id, site_id:site_id}).then(function(result) {
                                if (result.ok == 1) {
                                    $(".vote-success").html("恭喜获得" + marketing_href + "积分");
                                    $(".vote-success").show();
                                    setTimeout(
                                        function () {
                                            $(".vote-success").hide();
                                        }, 1000);
                                    close_div();
                                    if (kaq) {
                                        kaq('create', site_id);
                                        kaq('send', 'event', 'system_plugin', 'get_score', 'kuaivote', 1);
                                    }
                                } else{
                                    if (result.err_code ==1) {
                                        alert_div(".vote-msg-div","未登录,领取积分失败",0)
                                    }
                                }
                            },function() {
                                alert_div(".vote-msg-div","领取积分失败",0)
                            });

                        } else if (marketing_type == "自定义链接") {
                            if (kaq) {
                                kaq('create', site_id);
                                kaq('send', 'event', 'system_plugin', 'jump_url', 'kuaivote', 1);
                            }
                            window.location.href = url;
                        } else if (marketing_type == "会员卡领取") {
                            if (kaq) {
                                kaq('create', site_id);
                                kaq('send', 'event', 'system_plugin', 'get_card', 'kuaivote', 1);
                            }
                            window.location.href = url;
                        } else if (marketing_type == "优惠券领取") {
                            if (kaq) {
                                kaq('create', site_id);
                                kaq('send', 'event', 'system_plugin', 'get_coupon', 'kuaivote', 1);
                            }
                            window.location.href = url;
                        }
                    });
                };

                var captcha_vote = function(captcha_id, captcha_url, vote_id, activity_id, type, show) {
                    $captcha_vote_div.find(".captcha-vote").attr("data-captcha_id", captcha_id);
                    $captcha_vote_div.find(".captcha-vote").attr("data-vote_id", JSON.stringify(vote_id));
                    $captcha_vote_div.find(".captcha-vote").attr("data-activity_id", activity_id);
                    $captcha_vote_div.find(".captcha-vote").attr("data-type", type);
                    $captcha_vote_div.find(".captcha-img").attr("src", captcha_url);
                    if (show && $captcha_vote_div.find(".chatcha-value").val()) {
                        $captcha_vote_div.find(".captcha-error-info").show();
                    } else {
                        $captcha_vote_div.find(".captcha-error-info").hide();
                    }
                    $captcha_vote_div.find(".chatcha-value").val("");
                    $captcha_vote_div.show();
                    $fade_div.show();
                    var dialog_width = $captcha_vote_div.width();
                    var dialog_height = $captcha_vote_div.height();
                    var margin_left = "-" + dialog_width / 2 + "px";
                    var margin_top = "-" + dialog_height / 2 + "px";
                    $captcha_vote_div.css("margin-top", margin_top);
                    $captcha_vote_div.css("margin-left", margin_left);
                };

                var alert_div = function(pos,msg,tag) {
                    $alert_div.find(pos).html(msg);
                    if (pos == ".vote-msg-div") {
                        $alert_div.find(".info-div").show();

                        if (marketing_slogen && tag == 1) {
                            $alert_div.find(".info-div .vote-button-div").show();
                            $alert_div.find(".info-div .jump-button").show();
                            $alert_div.find(".info-div .jump-button").html(marketing_slogen);
                            $alert_div.find(".info-div .jump-button").data("href",marketing_href)
                        } else if (marketing_slogen && tag == 0) {
                            $alert_div.find(".info-div .vote-button-div").show();
                            $alert_div.find(".info-div .jump-button").hide();
                        } else if ( !marketing_slogen && tag != -1) {
                            $alert_div.find(".info-div .vote-button-div").show();
                            $alert_div.find(".info-div .jump-button").hide();
                        }  else if ( tag == -1) {
                            $alert_div.addClass("kuaivote-multi-white-content-weixin");
                            $alert_div.find(".info-div").addClass("info-div-padding");
                            $alert_div.find(".info-div .vote-button-div").hide();
                        }
                    }
                    $alert_div.show();
                    $fade_div.show();
                    var dialog_width = $alert_div.width();
                    var dialog_height = $alert_div.height();
                    var margin_left = "-" + dialog_width / 2 + "px";
                    var margin_top = "-" + dialog_height / 2 + "px";
                    $alert_div.css("margin-top", margin_top);
                    $alert_div.css("margin-left", margin_left);
                };

                var close_div = function() {
                    $alert_div.css('display', 'none');
                    $fade_div.css('display', 'none');
                    $captcha_vote_div.css('display', 'none');
                };
                $(el).find('.confirm-msg-btn').addClass(btn_color);

                try {
                    if (typeof kaq !== 'undefined') {
                        kaq('create', site_id);
                        kaq('send', 'event', 'kuaivote', 'pageview', 'kuaivote-multi', 1);
                        $.ajax({
                            url: "http://pv.kuaizhan.com/newInc?traceId=kuaivote&traceKey="+collection_id,
                            type: "GET",
                            success: function () {
                            }
                        })
                    }
                    activities_collection.create_query().find_by_id(collection_id).then(function (document) {
                        if (document && document.get("remove_tag") != 1) {
                            if (document.get('success_info') != null) {
                                success_info = document.get('success_info');
                                day_empty_info = document.get('day_empty_info');
                                all_empty_info = document.get('all_empty_info');
                                vote_not_exist_info = document.get('vote_not_exist_info');
                                activity_not_exist_info = document.get('activity_not_exist_info');
                                activity_not_open_info = document.get('activity_not_open_info');
                                activity_finish_info = document.get('activity_finish_info');
                                activity_suspend_info = document.get('activity_suspend_info');
                            }

                            if (document.get('pos') != null) {
                                pos_tag = document.get('pos');
                            }
                            if (document.get('sign_auto_pass')) {
                                sign_auto_pass = 1;
                            }
                            if (document.get('limit_type') == 1) {
                                vote_limit = "每人每天可投" + document.get('limit_count') + '票';
                            } else if (document.get('limit_type') == 2) {
                                vote_limit = "每人总共可投" + document.get('limit_count') + '票';
                            }
                            if (document.get("vote_auto_index_show") == 1 && document.get("vote_auto_index_open") == 1) {
                                vote_auto_index_show = 1;
                            }
                            if (document.get('show_sign_info') && document.get('sign_open_tag') && show_sign_edit) {
                                show_sign = true;
                            }
                            if (document.get('key_word')) {
                                key_word = document.get('key_word');
                            }
                            var sign_time_start = new Date();
                            var sign_time_end = new Date();
                            var now = new Date();

                            if (document.get('vote_time_start') && document.get('vote_time_end')) {
                                start_time = document.get('vote_time_start');
                                end_time = document.get('vote_time_end');
                            } else {
                                start_time = document.get('time_start')+ " "+ document.get('hour_start') + ":"+document.get('minute_start') + ":00";
                                end_time = document.get('time_end')+ " "+ document.get('hour_end') + ":"+document.get('minute_end') + ":00";
                            }
                            var vote_time_start = getDateFromIphone(start_time);
                            var vote_time_end = getDateFromIphone(end_time);
                            time_interval = getFormatedDate(vote_time_start,"/") + " ~ " + getFormatedDate(vote_time_end,"/");

                            if (document.get('sign_time_start') && document.get('sign_time_end')) {
                                sign_time_start = getDateFromIphone(document.get('sign_time_start'));
                                sign_time_end = getDateFromIphone(document.get('sign_time_end'));
                                sign_interval = getFormatedDate(sign_time_start,"/") + " ~ " + getFormatedDate(sign_time_end,"/");
                            } else {
                                sign_interval = time_interval;
                                sign_time_start = vote_time_start;
                                sign_time_end = vote_time_end;
                            }

                            if (now < vote_time_start) {
                                button_text = "投票未开始";
                            } else if (now > vote_time_end) {
                                button_text = "投票已结束";
                            } else {
                                button_text = button_text_origin;
                            }

                            if (now < sign_time_start) {
                                sign_button_text = "报名未开始"
                            } else if (now > sign_time_end) {
                                sign_button_text = "报名已结束"
                            } else {
                                sign_button_text = sign_button_text_origin;
                            }

                            show_sign_info = document.get("show_sign_info");
                            marketing_info = document.get("marketing_info");
                            if (marketing_info) {
                                var marketing_infos = marketing_info.split(";");
                                marketing_type = marketing_infos[0];
                                if (marketing_type == "自定义链接") {
                                    var info = JSON.parse(marketing_infos[1]);
                                    marketing_href = info.link;
                                } else if (marketing_type == "会员卡领取") {
                                    marketing_href = "http://" + window.location.host + "/fp/crm/card-pub/" + marketing_infos[1];
                                } else if (marketing_type == "优惠券领取") {
                                    marketing_href = "http://" + window.location.host + "/fp/crm/coupon-pub/" + marketing_infos[1];
                                } else {
                                    marketing_href = marketing_infos[1];
                                }
                                marketing_slogen = marketing_infos[2];
                            }
                            get_data(1, collection_id);
                            if (auto_vote_split && select_vote_type == 4) {
                                var votes_query = votes_collection.create_query();
                                if (sort_type_1) {
                                    votes_query.equal("activity_id", collection_id).desc("_id");
                                } else if (sort_type_2) {
                                    votes_query.equal("activity_id", collection_id).desc("score");
                                } else if (sort_type_3) {
                                    votes_query.equal("activity_id", collection_id).asc("pos");
                                } else if (sort_type_4) {
                                    votes_query.equal("activity_id", collection_id).asc("number");
                                } else{
                                    votes_query.equal("activity_id", collection_id).desc("_id");
                                }
                                votes_query.not_equal("pass", -1).equal("remove_tag", 0);
                                votes_query.count().then(function (data) {
                                    if (data) {
                                        vote_count = data.count;
                                        var pageCount = Math.ceil(vote_count / auto_vote_per_num);
                                        $(el).find(".js-put-paging").createPage({
                                            pageCount: pageCount,
                                            current: 1,
                                            backFn: function (p) {
                                                get_data(p, collection_id);
                                            }
                                        });
                                    }
                                })
                            }
                        }
                    }, function () {
                        alert_div(".vote-msg-div",server_error,0);
                    });
                }catch(e) {
                    alert_div(".vote-msg-div",server_error,0);
                }


                $(el).delegate('.list-vote-client input[name=choose_vote]',"change",function() {
                    var selected = $(el).find('.list-vote-client input[name=choose_vote]:checked');
                    if (selected.length >= parseInt(vote_length_most) ) {
                        var not_check = $(el).find('.list-vote-client input[name=choose_vote]:not(:checked)');
                        not_check.attr("disabled","disabled");
                        not_check.next().css("color","#ccc");
                    } else{
                        $(el).find('.list-vote-client input[name=choose_vote][disabled]').removeAttr("disabled");
                        $(el).find('.list-vote-client label').css("color","#333");
                    }
                });

                $(el).delegate('.list-vote-button','click',function() {
                    var ids = [];
                    var activity_id = list_collection_id;
                    $(el).find('.list-vote-client input[name=choose_vote]:checked').each(function(index,item) {
                        ids.push({vote_id:$(item).val()});
                    });

                    if (ids.length<1) {
                        alert_div(".vote-msg-div","请选择投票项",0);
                        return ;
                    }
                    if (ids.length>vote_length_most) {
                        alert_div(".vote-msg-div","最多只能选"+vote_length_most+"项",0);
                        return ;
                    }
                    if (ids.length<vote_length_least) {
                        alert_div(".vote-msg-div","至少选"+vote_length_least+"项",0);
                        return ;
                    }
                    if (kaq) {
                        kaq('create', site_id);
                        kaq('send', 'event', 'system_plugin', 'click', 'kuaivote', 1);
                    }
                    multi_vote(activity_id, ids, "", "");
                });

                $(el).delegate('.btn-vote','click',function() {
                    var vote_id = $(this).attr('data-vote_id');
                    if (kaq) {
                        kaq('create', site_id);
                        kaq('send', 'event', 'system_plugin', 'click', 'kuaivote', 1);
                    }
                    single_vote(collection_id, vote_id, "", "");
                });

                $(el).delegate(".change-captcha",'click',function() {
                    var that = $(this).parents(".captcha-vote-div").find(".captcha-vote");
                    $(this).parents(".captcha-vote-div").find(".loading-div").css("display","inline-block");
                    $(this).parents(".captcha-vote-div").find(".captcha-img").hide();
                    change_captcha(that);
                });

                $(el).delegate(".captcha-img",'click',function() {
                    var that = $(this).parents(".captcha-vote-div").find(".captcha-vote");
                    $(this).parents(".captcha-vote-div").find(".loading-div").css("display","inline-block");
                    $(this).parents(".captcha-vote-div").find(".captcha-img").hide();
                    change_captcha(that);
                });

                $(el).delegate(".captcha-vote",'click',function() {
                    var vote_id = JSON.parse($(this).attr('data-vote_id'));
                    var activity_id = $(this).attr('data-activity_id');
                    var type = $(this).attr("data-type");
                    var captcha_id = $(this).attr("data-captcha_id");
                    var captcha_value = $(el).find(".chatcha-value").val();
                    if (captcha_value && captcha_id) {
                        if (type == "single_vote") {
                            close_div();
                            single_vote(activity_id, vote_id, captcha_value, captcha_id);
                        } else if (type == "multi_vote") {
                            close_div();
                            multi_vote(activity_id, vote_id, captcha_value, captcha_id);
                        }
                    } else {
                        $(this).parents(".captcha-vote-div").find(".chatcha-value").focus();
                    }
                });

                $(el).delegate('.vote-search-img','click',function() {
                    var search_vote_input = $(el).find(".vote-search-input").val();
                    if (search_vote_input) {
                        var votes_query = votes_collection.create_query();
                        try {
                            localStorage["vote_search_" + collection_id] = search_vote_input;
                        } catch (error) {
                        }
                        var regrx = new RegExp(search_vote_input);
                        votes_query.equal("activity_id", collection_id).equal("remove_tag", 0).not_equal("pass", -1);
                        votes_query.exec().then(function (documents) {
                            if (documents) {
                                var hit_documtents = [];
                                for (var i=0; i<documents.length; i++) {
                                    var document = documents[i];
                                    if (regrx.test(document.get("number")) || regrx.test(document.get("uname"))) {
                                        hit_documtents.push(document);
                                    }
                                }
                                render_data(1,hit_documtents);
                            }
                        });
                    } else{
                        get_data(1, collection_id);
                    }
                });

                $(el).delegate(".vote-sign",'click',function() {
                    $.ajax({
                        url:"/club/apiv1/me",
                        type:"GET",
                        success:function() {
                            if ($(el).find(".sign-info").html()=="") {
                                var info_content = "";
                                for (var name in  show_sign_info) {
                                    var infos = show_sign_info[name];
                                    var column = infos.column;
                                    if (column == "pic") {
                                        info_content = info_content + "<div class='one-info " + column + "' style='margin-top: 75px;'><span class='item'>*" + name + "</span> <div class='file'><span class='add'>+</span> <span class='loading' style='display: none'></span><input  class='js-input-info' type='file' placeholder='"+name+"*' accept='image/*' multiple='multiple'> </input> </div><span class='span-info'>*选择小于5M的图片上传</span></div>";
                                    } else if (column == "sex") {
                                        info_content = info_content + "<div class='one-info " + column + "'><span class='item'>*" + name + "</span><input class='js-input-info', name ='select-sex' type='radio', value='男' id='select-male'/> <label style='margin-right: 45px' for='select-male' > 男</label> <input class='js-input-info " + column + "', name ='select-sex' type='radio', value='女' id='select-female' /> <label for='select-female'> 女</label> </div>";
                                    } else if (column == "birth") {
                                        info_content = info_content + "<div class='one-info " + column + "'><span class='item'>*" + name + "</span><select class='js-input-info input-info sel_year' style='width:22%' rel='2000'> </select> 年 <select class='input-info sel_month' style='width:17%' rel='2'> </select> 月 <select class='input-info sel_day' style='width:17%' rel='14'> </select> 日</div>";
                                    } else if (column == "desc") {
                                        info_content = info_content + "<div class='one-info " + column + "'><textarea rows='3'  class='js-input-info textarea-info'  placeholder='"+name+"*'></textarea></div>";
                                    }
                                    else {
                                        info_content = info_content + "<div class='one-info " + column + "'><input  class='js-input-info input-info'  placeholder='"+name+"*'> </input></div>";
                                    }
                                }
                                info_content = info_content +
                                    "<div class='mod-button " + __theme_class__ + "' style='text-align: center;padding: 5% 0% 1% 0%;'>\
                                        <a class='confirm-msg-btn submit  "+btn_shape+" " +btn_color+" ' value='确定' >提交报名 </a> \
                                        <a class='confirm-msg-btn cancel-btn "+btn_shape+" "+btn_color+" ' value='取消' style='margin-left:5%;'>取  消 </a> \
                                    </div>";
                                $(el).find(".sign-info").html(info_content);
                                $(el).find(".sign-info").show();
                                $(el).find(".vote-sign-div").hide();
                                my_DatePicker({
                                    YearSelector: ".sel_year",
                                    MonthSelector: ".sel_month",
                                    DaySelector: ".sel_day"
                                });

                                //上传图片文件到服务器，需要检查图片类型以及大小
                                $(el).delegate(".sign-info .pic .js-input-info","change",function() {
                                    $(this).parents(".file").find(".loading").show();
                                    $(this).parents(".file").css("background-color","#dddddd");
                                    $(this).parents(".file").find(".add").hide();
                                    var files = this.files;
                                    var that = this;
                                    if (files.length)
                                    {
                                        var file = files[0];
                                        var name = file.name;
                                        var size = file.size;
                                        var type = file.type;
                                        if (!/(gif|jpg|jpeg|bmp|png)$/.test(type)) {
                                            alert_div(".vote-msg-div","请上传JPEG,PNG,GIF,BMP格式的图片",0);
                                            $(that).focus();
                                            $(that).addClass('input-error');
                                            return false;
                                        } else{
                                            if (size > f_size) {
                                                alert_div(".vote-msg-div","请上传5M以内的图片",0);
                                                $(that).focus();
                                                $(that).addClass('input-error');
                                                return false;
                                            }
                                        }
                                        var FR = new FileReader();
                                        FR.onload = function() {
                                            compressImg(this.result, 600,type, function (file_base64) {//压缩完成后执行的callback
                                                file_base64 = file_base64.substr(22);
                                                var formdata = new FormData();
                                                formdata.append("filename", name);
                                                formdata.append("filebody", file_base64);
                                                formdata.append("content_type", type);
                                                var xhr = new XMLHttpRequest();
                                                var url = "/club/apiv1/me/b64-upload";
                                                xhr.open("POST", url, true);
                                                xhr.setRequestHeader('Accept', '*/*');
                                                xhr.onload = function () {
                                                    if (xhr.status == 200) {
                                                        if (xhr.responseText) {
                                                            try {
                                                                var json = $.parseJSON($.trim(xhr.responseText));
                                                                $(that).parents(".file").find(".loading").hide();
                                                                $(that).parents(".file").find(".add").show();
                                                                $(that).data("return-url",json.data);
                                                                $(that).parent(".file").css('background-image',  "url('"+json.data+"')");
                                                                $(that).parent(".file").css('background-repeat', 'no-repeat');
                                                                $(that).parent(".file").css('background-size',  "100% 100%");
                                                                $(that).parent(".file").css('-moz-background-size','100% 100%');
                                                                $(that).parent(".file").css('-webkit-background-size','100% 100%');
                                                                $(that).parent(".file").css('border','0px');
                                                            } catch (e) {
                                                                $(that).focus();
                                                                $(that).addClass('input-error');
                                                            }
                                                        }
                                                    } else {
                                                        $(that).parents(".file").focus();
                                                        $(that).parents(".file").css(' border',' 1px solid red');
                                                    }
                                                };
                                                xhr.onerror = function() {
                                                    $(that).parents(".file").focus();
                                                    $(that).parents(".file").css(' border',' 1px solid red');
                                                };
                                                xhr.send(formdata);

                                            });
                                        };
                                        FR.readAsDataURL(file);
                                    }
                                });
                                $(el).delegate(".sign-info .js-input-info","blur",function() {
                                    var name = $(this).attr("placeholder") ? $(this).attr("placeholder") : $(this).parent('.one-info').find('span').html();
                                    var class_info = $(this).parents('.one-info').attr('class').split(" ");
                                    var type = class_info[1];
                                    var value = $(this).val();
                                    if ( type == "phone") {
                                        checkMobile(this);
                                    } else if ( type == "email") {
                                        checkEmail(this);
                                    } else if ( type == "age") {
                                        if (isNaN(value)) {
                                            $(this).focus();
                                            $(this).addClass('input-error');
                                        } else{
                                            $(this).removeClass('input-error');
                                        }
                                    } else if (type == "desc") {
                                        if (value.length>desc_length_limit) {
                                            $(this).focus();
                                            $(this).addClass('input-error');
                                            alert_div(".vote-msg-div","描述的长度不得超过"+desc_length_limit+"个字符",0);
                                        }
                                    }
                                });

                                $(el).delegate(".sign-info [name='select-sex']","click",function() {

                                    $(this).parents(".one-info").css(' border',' 0px');
                                });
                                $(el).delegate('.sign-info .submit','click',function() {
                                    //提交报名信息
                                    if ($alert_div.find('.sign-info').html()!="") {
                                        var upload_data = {};
                                        var upload_tag = true;
                                        upload_data.activity_id = collection_id ;
                                        if (sign_auto_pass == 1) {
                                            upload_data.pass = 1;
                                        } else {
                                            upload_data.pass = 0;
                                        }
                                        upload_data.remove_tag = 0;
                                        $(el).find('.sign-info .js-input-info').each(function() {
                                            var name = $(this).attr("placeholder")?$(this).attr("placeholder"):$(this).parent('.one-info').find('span').html();
                                            var class_info = $(this).parents('.one-info').attr('class').split(" ");
                                            var type = class_info[1];
                                            var type = class_info[1];
                                            var value = "";
                                            if ( type == "pic") {
                                                value = $(this).data("return-url");
                                            } else if (type == "sex") {
                                                value = $(el).find("input[name='select-sex']:checked").val();
                                            } else if (type == "birth") {
                                                var year = $(el).find(".sel_year").val();
                                                var month = $(el).find(".sel_month").val();
                                                var day = $(el).find(".sel_day").val();
                                                value = year+month+day;
                                            } else {
                                                value = $(this).val();
                                            }
                                            if (!value) {
                                                $(this).focus();
                                                $(this).addClass('input-error');
                                                if ( type == "pic") {
                                                    $(this).parents(".file").focus();
                                                    $(this).parents(".file").css(' border',' 1px solid red');
                                                } else if (type == "sex") {
                                                    $(this).parents(".one-info").focus();
                                                    $(this).parents(".one-info").css(' border',' 1px solid red');
                                                }
                                                upload_tag = false;
                                                return false;
                                            }
                                            upload_data[type] = value;
                                        });
                                        if (upload_tag) {
                                            sign_collection.create_obj(upload_data).save().then(function () {
                                                $(el).find(".sign-info").hide();
                                                $(el).find(".vote-sign-div").show();
                                                if (sign_auto_pass == 1) {
                                                    alert_div(".vote-msg-div", "报名成功,刷新即可看到投票项",0);
                                                } else {
                                                    alert_div(".vote-msg-div", "报名成功,管理员审核后即可参与投票",0);
                                                }

                                                if (kaq) {
                                                    kaq('create', site_id);
                                                    kaq('send', 'event', 'system_plugin', 'sign', 'kuaivote', 1);
                                                }
                                            }, function (error) {
                                                if (error.err_code == 1) {
                                                    alert_div(".vote-msg-div", "报名未开始", 0);
                                                } else if (error.err_code == 2) {
                                                    alert_div(".vote-msg-div", "报名已结束", 0);
                                                } else {
                                                    alert_div(".vote-msg-div", "报名失败", 0);
                                                }
                                            });
                                        }
                                    }
                                });
                                $(el).delegate(".sign-info .cancel-btn","click",function() {
                                    $(el).find(".sign-info").hide();
                                    $(el).find(".vote-sign-div").show();
                                });

                            } else{
                                if ($(el).find(".sign-info").css("display")=="none") {
                                    $(el).find(".sign-info").css("display","block");
                                    $(el).find(".vote-sign-div").hide();
                                }
                            }
                        },
                        error:function() {
                            getUser();
                        }
                    });
                });

                var get_data = function(page,select_collection_id) {

                    var votes_query = votes_collection.create_query();
                    if (sort_type_1) {
                        votes_query.equal("activity_id", select_collection_id).desc("_id");
                    } else if (sort_type_2) {
                        votes_query.equal("activity_id", select_collection_id).desc("score");
                    } else if (sort_type_3) {
                        votes_query.equal("activity_id", select_collection_id).asc("pos");
                    } else if (sort_type_4) {
                        votes_query.equal("activity_id", select_collection_id).asc("number");
                    } else{
                        votes_query.equal("activity_id", select_collection_id).desc("_id");
                    }
                    votes_query.equal("remove_tag", 0).not_equal("pass",-1);
                    if (select_vote_type == 4 && auto_vote_split == 1) {
                        var skip = (page-1) * auto_vote_per_num;
                        votes_query.skip(skip).limit(auto_vote_per_num)
                    }
                    votes_query.exec().then(function(document) {
                        if (document) {
                            render_data(page,document);
                        }
                    });
                };

                var single_vote = function(activity_id, vote_id, captcha_value, captcha_id) {
                    bus.Func('votes').post({
                        activity_id: activity_id,
                        site_id: site_id,
                        vote_id: vote_id,
                        captcha_value:captcha_value,
                        captcha_id:captcha_id
                    }).then(function (result) {
                        var show_result = false;
                        if (result.err_code) {
                            show_result = handle_error(result, vote_id, activity_id, "single_vote");
                        } else {
                            alert_div(".vote-msg-div", "投票成功", 1);
                            show_result = true;
                        }
                        if (show_result) {
                            if (select_vote_type == 4 && !result.err_code) {
                                var old_score = $(el).find("[data-vote_id='"+vote_id+"']").parents('.one-vote').find('.score').html();
                                var new_score = parseInt(old_score) + 1;
                                $(el).find("[data-vote_id='"+vote_id+"']").parents('.one-vote').find('.score').html(new_score + '');
                            } else if (select_vote_type == 3) {
                                var parent_div = $(el).find("[data-vote_id='"+vote_id+"']").parent(".pk-vote-style");
                                var pk_left_id = parent_div.find(".pk-left-button").attr('data-vote_id');
                                var pk_right_id = parent_div.find(".pk-right-button").attr('data-vote_id');
                                var query = bus.Collection('votes').create_query();
                                query.equal('activity_id', activity_id).desc('score');
                                query.exec().then(function (data) {
                                    var sum = data[0].get('score') + data[1].get('score');
                                    sum = sum == 0 ? 1 : sum;
                                    var render_data = {};
                                    data.forEach(function (item) {
                                        if (pk_left_id != undefined) {
                                            if (item.get("_id") == pk_left_id) {
                                                render_data.left_score = item.get('score');
                                                render_data.left_percentage = Math.round((render_data.left_score / sum) * 100).toFixed(0);
                                            } else {
                                                render_data.right_score = item.get('score');
                                            }
                                        }
                                        if (pk_right_id != undefined) {
                                            if (item.get("_id") == pk_right_id) {
                                                render_data.right_score = item.get('score');
                                            } else {
                                                render_data.left_score = item.get('score');
                                                render_data.left_percentage = Math.round((render_data.left_score / sum) * 100).toFixed(0);
                                            }
                                        }
                                    });
                                    render_data.right_percentage = 100 - render_data.left_percentage;
                                    $(el).find('.pk-result').append(mustache.render(pk_vote_result, render_data));
                                    $(el).find('.pk-result').show();
                                    $(el).find('.pk-vote-style').hide();

                                }, function () {
                                    alert_div(".vote-msg-div", server_error, 0);
                                });
                            }
                        }
                    }, function () {
                        alert_div(".vote-msg-div", server_error, 0)
                    });

                };

                var multi_vote = function(activity_id, ids, captcha_value, captcha_id) {
                    var data = ids[0].vote_id;
                    for (var i= 1,len=ids.length;i<len;i++) {
                        data = data + "," + ids[i].vote_id;
                    }
                    bus.Func('multivotes').post({
                        activity_id: activity_id,
                        site_id: site_id,
                        data: data,
                        captcha_value:captcha_value,
                        captcha_id:captcha_id
                        }
                    ).then(function (result) {
                        //当活动结束或者投票用完之后，设置标志位，是否显示投票结果
                        var show_result = false;
                        if (result.err_code) {
                            show_result = handle_error(result, ids, activity_id, "multi_vote");
                        } else {
                            alert_div(".vote-msg-div", success_info, 1);
                            show_result = true;
                        }
                        if (show_result) {
                            // 处理投票后的内容
                            var query = bus.Collection('votes').create_query();
                            query.equal('activity_id', activity_id).desc('score');
                            query.exec().then(function (data) {
                                var vote_result = [];
                                var sum = 0;
                                data.forEach(function (item) {
                                    vote_result.push({
                                        uname: item.get('uname'),
                                        score: item.get('score')
                                    });
                                    sum += item.get('score');
                                });
                                sum = sum == 0 ? 1 : sum;
                                var color_position = 0;
                                var render_data = [];
                                vote_result.forEach(function (item) {
                                    var percentage = Math.round((item.score / sum) * 100).toFixed(0);
                                    var temp_data = {};
                                    temp_data.score = item.score;
                                    temp_data.percentage = percentage;
                                    temp_data.color = colors[color_position % 10];
                                    temp_data.uname = item.uname;
                                    render_data.push(temp_data);
                                    ++color_position;
                                });
                                $(el).find(".list-vote-result").append(mustache.render(multi_vote_result,{render_data:render_data}));
                                $(el).find(".list-vote-option").css('display', 'none');
                                $(el).find(".list-vote-result").css('display', 'block');
                            });
                        }
                    }, function () {
                        alert_div(".vote-msg-div", server_error, 0);
                    });
                };

                var render_data = function(page,document) {
                    $(el).find('.vote-content').empty();
                    total_vote_time = 0;
                    var new_data_odd = [];
                    var new_data_even = [];
                    var new_data_list = [];
                    var new_data_pk = {};
                    for (var i = 0, len = document.length; i < len ; i++) {
                        var document_data = document[i].toJSON();
                        total_vote_time += document_data['score'];
                        var one_data = {};
                        var icon_data = {};
                        one_data.vote_id = document_data['_id'];
                        if (vote_auto_index_show == 1) {
                            one_data.number = document_data['number'];
                        }
                        one_data.uname = document_data['uname'];
                        if (document_data['desc']) {
                            one_data.desc = document_data['desc'].toString().replace(/\n/g, "<br>");
                        }
                        one_data.url = document_data['url'];
                        one_data.pic = document_data['pic'];
                        if (one_data.pic != undefined && one_data.pic != "") {
                            one_data.pic_display = "block";
                        } else {
                            one_data.pic_display = "none";
                        }
                        if (one_data.desc)
                            one_data.isDes = true;
                        if (document_data['url'] && (document_data['show_link'] == null || document_data['show_link'] == true))
                            one_data.isUrl = true;
                        one_data.score = parseInt(document_data['score']);
                        one_data.btn_shape = btn_shape;
                        one_data.btn_color = btn_color;
                        one_data.btn_width = btn_width;
                        one_data.btn_height = btn_height;
                        one_data.button_text = button_text;

                        if (font_ico) {
                            icon_data.icon = font_ico;
                            icon_data.btn_height = btn_height;
                            one_data.icon_data = icon_data;
                        }

                        if (sort_type_3) {
                            if (document_data['locate'] == undefined && i % 2 == 0 || document_data['locate'] == 1) {
                                new_data_even.push(one_data);
                            }
                            if (document_data['locate'] == undefined && i % 2 != 0 || document_data['locate'] == 2) {
                                new_data_odd.push(one_data);
                            }
                        } else {
                            if (i % 2 == 0) {
                                new_data_even.push(one_data);
                            } else {
                                new_data_odd.push(one_data);
                            }
                        }
                        new_data_list.push(one_data);

                        if (document_data['index'] == "正方:") {
                            new_data_pk['pk_left_vote'] = document_data.uname;
                            new_data_pk['pk_left_vote_id'] = document_data._id;
                        }
                        if (document_data['index'] == "反方:") {
                            new_data_pk['pk_right_vote'] = document_data.uname;
                            new_data_pk['pk_right_vote_id'] = document_data._id;
                        }

                    }

                    if (select_vote_type == 2) {
                        var final_data = {};
                        var icon_data = {};
                        final_data.list_vote_caption = list_vote_caption;
                        final_data.order_list_client = new_data_list;
                        final_data.btn_shape = btn_shape;
                        final_data.btn_color = btn_color;
                        final_data.btn_width = btn_width;
                        final_data.btn_height = btn_height;
                        final_data.button_text = button_text;
                        final_data.sign_button_text = sign_button_text;
                        final_data.vote_limit = vote_limit;
                        final_data.time_interval = time_interval;
                        final_data.sign_interval = sign_interval;
                        final_data.vote_count = vote_count;
                        final_data.total_vote_time = total_vote_time;
                        final_data.total_visit_time = total_visit_time;
                        final_data.show_time_interval = show_time_interval;
                        final_data.show_sign_interval = show_sign_interval;
                        final_data.show_time_to_close = show_time_to_close;
                        final_data.show_vote_stat = show_vote_stat;
                        final_data.show_vote_limit = show_vote_limit;
                        final_data.show_sign = show_sign;
                        final_data.show_select_limit = show_select_limit;
                        final_data.select_limit = select_limit;
                        final_data.__theme_class__ = __theme_class__;
                        if (font_ico) {
                            icon_data.icon = font_ico;
                            icon_data.btn_height = btn_height;
                            final_data.icon_data = icon_data;
                        }
                        if (align) {
                            final_data.align = align;
                        }
                        $(el).find('.vote-content').append(mustache.render(list_vote_html,final_data));
                    } else if (select_vote_type == 3) {
                        new_data_pk.vote_limit = vote_limit;
                        new_data_pk.time_interval = time_interval;
                        new_data_pk.sign_interval = sign_interval;
                        new_data_pk.vote_count = vote_count;
                        new_data_pk.total_vote_time = total_vote_time;
                        new_data_pk.total_visit_time = total_visit_time;
                        new_data_pk.show_time_interval = show_time_interval;
                        new_data_pk.show_sign_interval = show_sign_interval;
                        new_data_pk.show_time_to_close = show_time_to_close;
                        new_data_pk.show_vote_stat = show_vote_stat;
                        new_data_pk.show_vote_limit = show_vote_limit;
                        new_data_pk.show_sign = show_sign;
                        new_data_pk.pk_vote_caption = pk_vote_caption;
                        $(el).find('.vote-content').append(mustache.render(pk_vote_html,new_data_pk));

                    } else if (select_vote_type == 4) {
                        var final_data = {};
                        var icon_data = {};
                        final_data.auto_vote_search = auto_vote_search;
                        final_data.auto_vote_caption = auto_vote_caption;
                        final_data.auto_list_left = new_data_even;
                        final_data.auto_list_right = new_data_odd;
                        final_data.sign_button_text = sign_button_text;
                        final_data.btn_shape = btn_shape;
                        final_data.btn_color = btn_color;
                        final_data.btn_width = btn_width;
                        final_data.btn_height = btn_height;

                        final_data.vote_limit = vote_limit;
                        final_data.time_interval = time_interval;
                        final_data.sign_interval = sign_interval;
                        final_data.vote_count = vote_count;
                        final_data.total_vote_time = total_vote_time;
                        final_data.total_visit_time = total_visit_time;
                        final_data.show_time_interval = show_time_interval;
                        final_data.show_sign_interval = show_sign_interval;
                        final_data.show_time_to_close = show_time_to_close;
                        final_data.show_vote_stat = show_vote_stat;
                        final_data.show_vote_limit = show_vote_limit;
                        final_data.show_sign = show_sign;
                        final_data.__theme_class__ = __theme_class__;
                        if (font_ico) {
                            icon_data.icon = font_ico;
                            icon_data.btn_height = btn_height;
                        }
                        final_data.icon_data = icon_data;
                        try {
                            if (localStorage["vote_search_" + collection_id]) {
                                final_data.vote_search = localStorage["vote_search_" + collection_id];
                            }
                        } catch (error) {
                        }

                        $(el).find('.vote-content').append(mustache.render(auto_vote_html,final_data));
                    }
                    getPageViewCount(collection_id);

                    var day = $(el).find('.time-to-close .day');
                    var hour = $(el).find('.time-to-close .hour');
                    var minute = $(el).find('.time-to-close .minute');
                    var second = $(el).find('.time-to-close .second');
                    var arr = end_time.split(/[- :]/);
                    var EndTime = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
                    var NowTime = new Date();
                    var t = EndTime.getTime() - NowTime.getTime();
                    if (t<0) {
                        $(el).find('.time-to-close').html("距活动结束还有：活动已结束");
                    } else {
                        if (end_time) {
                            setInterval(
                                function () {
                                    var arr = end_time.split(/[- :]/);
                                    var EndTime = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
                                    var NowTime = new Date();
                                    var t = EndTime.getTime() - NowTime.getTime();

                                    var d = parseInt(t / 1000 / 60 / 60 / 24);
                                    var h = parseInt(t / 1000 / 60 / 60 % 24);
                                    var m = parseInt(t / 1000 / 60 % 60);
                                    var s = parseInt(t / 1000 % 60);

                                    day.html(d + "天");
                                    hour.html(h + "时");
                                    minute.html(m + "分");
                                    second.html(s + "秒");
                                }, 1000);
                        }
                    }
                };

                var handle_error = function(result, vote_id, activity_id, type) {
                    switch (result.err_code) {
                        case 1://未登录
                            getUser();
                            return false;
                            break;
                        case 2://活动不存在
                            alert_div(".vote-msg-div",result.message,0);
                            return false;
                            break;
                        case 3://投票项不存在
                            alert_div(".vote-msg-div",result.message,0);
                            return false;
                            break;
                        case 5://票投完了
                            alert_div(".vote-msg-div",result.message,0);
                            return true;
                            break;
                        case 7://活动未开始
                            alert_div(".vote-msg-div",result.message,0);
                            return false;
                            break;
                        case 8://活动已结束
                            alert_div(".vote-msg-div",result.message,0);
                            return true;
                            break;
                        case 9://活动暂停
                            alert_div(".vote-msg-div",result.message,0);
                            return true;
                            break;
                        case 10://不能对同一个投票项投多票
                            alert_div(".vote-msg-div",forbid_multi_to_one,0);
                            return false;
                            break;
                        case 11://未关注公众号
                            var qrcode_url = result.qrcode_url;
                            var qrcode;
                            if (is_weixin) {
                                qrcode = "<div class='qrcode-div'><img class='qrcode-img' src='"+qrcode_url+"'></img></div><div class='info-vote-div-one'>长按后<span class='red-bold-one'>识别二维码</span>完成投票</div><div class='info-vote-div-two'>识别后请<span class='red-bold-two'>回复\""+ key_word+"\"</div>";
                            } else {
                                qrcode = "<div class='qrcode-div'><img class='qrcode-img' src='"+qrcode_url+"'></img></div><div class='info-vote-div-one'>请<span class='red-bold-one'>保存二维码</span>图片</div><div class='info-vote-div-two'>用微信识别后<span class='red-bold-two'>回复\""+key_word+"\"</div>";
                            }
                            alert_div(".vote-msg-div",qrcode,-1);
                            return false;
                        case 12://输入验证码
                        case 13://输入验证码
                            captcha_vote(result.captcha_id, result.url, vote_id, activity_id, type, true);
                            return false;
                        case 14://输入验证码
                            captcha_vote(result.captcha_id, result.url, vote_id, activity_id, type, false);
                            return false;
                    }
                };

                var compressImg = function compressImg(imgData,maxHeight,type,onCompress) {
                    if (!imgData)return;
                    onCompress = onCompress || function() {};
                    maxHeight = maxHeight || 200;//默认最大高度200px
                    var canvas = document.createElement('canvas');
                    var img = new Image();
                    img.onload = function() {

                        if (img.height > maxHeight) {//按最大高度等比缩放
                            canvas.width = img.width * (maxHeight / img.height);
                            canvas.height = maxHeight;
                        } else {
                            canvas.width = img.width;
                            canvas.height = img.height;
                        }
                        var ctx = canvas.getContext("2d");
                        ctx.clearRect(0, 0, canvas.width, canvas.height); // canvas清屏
                        //重置canvans宽高
                        ctx.drawImage(img, 0, 0,canvas.width,canvas.height); // 将图像绘制到canvas上
                        onCompress(canvas.toDataURL(type));//必须等压缩完才读取canvas值，否则canvas内容是黑帆布
                    };
                    // 记住必须先绑定事件，才能设置src属性，否则img没内容可以画到canvas
                    img.src = imgData;
                };

                var getDateFromIphone = function getDateFromIphone(date) {
                    var arr = date.split(/[- :]/);
                    return new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
                };


                var getPageViewCount = function(activity_id) {

                    if (show_vote_stat) {
                        bus.Func('get_vote_pageview').get({
                            activity_id: activity_id
                        }).then(function (data) {
                            var total_visit_time =  0;
                            if (data.success == 1 && data.result.pvSum) {
                                total_visit_time = data.result.pvSum;
                                data.result.vote_count && (vote_count = data.result.vote_count);
                                data.result.total_count && (total_vote_time = data.result.total_count);
                            }
                            $(el).find('.vote-content .total-visit-time').html(total_visit_time);
                            vote_count && $(el).find('.vote-content .vote-count').html(vote_count);
                            total_vote_time && $(el).find('.vote-content .total-vote-time').html(total_vote_time);
                        }, function (error) {

                        })
                    }
                };

                var getFormatedDate = function(date, seperator) {
                    var month = date.getMonth() + 1;
                    return date.getFullYear() + seperator + month + seperator + date.getDate();
                };


                var change_captcha = function(that) {
                    var vote_id = JSON.parse($(that).attr('data-vote_id'));
                    var activity_id = $(that).attr('data-activity_id');
                    var type = $(that).attr("data-type");
                    bus.Func('change_captcha').post({},{
                        activity_id: activity_id,
                        vote_id: vote_id,
                        site_id: site_id
                    }).then(function (result) {
                        $(that).parents(".captcha-vote-div").find(".loading-div").hide();
                        $(that).parents(".captcha-vote-div").find(".captcha-img").attr("src","");
                        $(that).parents(".captcha-vote-div").find(".captcha-img").show();
                        captcha_vote(result.captcha_id, result.url, vote_id, activity_id, type, false);
                    },function() {
                        alert_div(".vote-msg-div",server_error,0);
                    });
                };
            }
        }
    }
);