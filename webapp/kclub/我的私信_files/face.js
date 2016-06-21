define([
], function() {

    var face_dict = {
        "default": {
            "白眼": "baiyan.png",
            "抱抱": "baobao.png",
            "鄙视": "bishi.png",
            "闭嘴": "bizui.png",
            "不服": "bufu.png",
            "打死你": "dasini.png",
            "大哭": "daku.png",
            "大笑": "daxiao.png",
            "屌爆了": "diaobaole.png",

            "愤怒": "fennu.png",
            "给跪": "geigui.png",
            "害羞": "haixiu.png",
            "好色": "haose.png",
            "加油": "jiayou.png",
            "惊讶": "jingya.png",
            "快哭了": "kuaikule.png",
            "流汗": "liuhan.png",
            "卖萌": "maimeng.png",
            "摸头": "motou.png",
            "难过": "nanguo.png",
            "亲亲": "qinqin.png",
            "求包养": "qiubaoyang.png",
            "生气": "shengqi.png",
            "帅气": "shuaiqi.png",
            "淘气": "taoqi.png",
            "偷笑": "touxiao.png",
            "吐了": "tule.png",
            "挖鼻孔": "wabikong.png",
            "微笑": "weixiao.png",
            "猥琐": "weisuo.png",
            "晕": "yun.png",
            "阴险": "yinxian.png",
            "抓狂": "zhuakuang.png",
            "惊恐":"jingkong.png",
            "求你了":"qiunile.png"
        },
        "animate": {
            "摆手": "baishou.gif",
            "抱娃娃": "baowawa.gif",
            "蹭":"ceng.gif",
            "吃豆子":"chidouzi.gif",
            "吃肉丸":"chirouwan.gif",
            "吃手":"chishou.gif",
            "打脸":"dalian.gif",
            "顶屎":"dingshi.gif",
            "鬼脸":"guilian.gif",
            "黄瓜":"huanggua.gif",
            "挥拳":"huiquan.gif",
            "酒瓶":"jiuping.gif",
            "扭":"niu.gif",
            "揉脸":"roulian.gif",
            "揉眼睛":"rouyanjing.gif",
            "塞鼻子":"saibizi.gif",
            "数钱":"shuqian.gif",
            "妩媚":"wumei.gif",
            "潇洒":"xiaosa.gif",
            "羞涩":"xiuse.gif",
            "摇头":"yaotou.gif",
            "阴险":"yinxian.gif",
            "招客":"zhaoke.gif"
        }
    }

    var face_config = {
        "default": {
            "path": "/clubv2/images/face/default/",
            "regexp": "\\[([\\u4E00-\\u9FA5]{1,4})\\]"
        },
        "animate": {
            "path": "/clubv2/images/face/animate/",
            "regexp": "\\[[Dd]([\\u4E00-\\u9FA5]{1,4})\\]"
        }
    }

    var config = {
        dict: face_dict,
        config: face_config
    };

    var face_tool = {
        replaceFace: function (str, options) {
            var use_dict = ['default', 'animate'];
            if (options && options.use_dict) {
                use_dict = options.use_dict;
            }

            var rtstr = str.replace(/</ig, '&lt;')
                           .replace(/>/ig, '&gt;')
                           .replace(/\n/ig, '<br/>')
                           .replace(/\s/ig, '&nbsp;');

            use_dict.forEach(function (dict) {
                if (config.config[dict]) {
                    var cfg = config.config[dict];
                    var dc = config.dict[dict];
                    var regex = new RegExp(cfg.regexp, "g");
                    var regex2 = new RegExp(cfg.regexp);

                    rtstr = rtstr.replace(regex, function (w) {
                        try {
                            var ex = regex2.exec(w);

                            if (ex && ex[1]) {
                                var key = ex[1];
                                var face_img = dc[key];

                                if (face_img) {
                                    return "<img src='"+cfg.path + face_img+"' class='face "+dict+"' />";
                                }
                            }
                        } catch (e) {
                            console.log(e);
                        }

                        return w;
                    });
                }
            });

            console.log(str);
            console.log(rtstr);
            return rtstr;
        }
    }

    return face_tool;
});
