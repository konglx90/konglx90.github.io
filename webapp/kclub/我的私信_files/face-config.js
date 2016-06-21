define([
], function () {
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
            "regexp": "\\[([\\u4E00-\\u9FA5]+)\\]",
            "title":"默认",
            "text-disp":"[<%=face%>]"
        },
        "animate": {
            "path": "/clubv2/images/face/animate/",
            "regexp": "\\[[Dd]([\\u4E00-\\u9FA5]+)\\]",
            "title":"彼格梨",
            "text-disp":"[D<%=face%>]"
        }
    }

    var face_sort = {
        "default": ["微笑","大笑","阴险","猥琐","偷笑","大哭","快哭了","吐了","给跪","晕","亲亲","好色","抱抱","摸头","求你了","难过","生气","不服","愤怒","惊恐","抓狂","鄙视","流汗","白眼","帅气","淘气","卖萌","害羞","加油","屌爆了","闭嘴","求包养","惊讶","挖鼻孔","打死你"],
        "animate": ["摆手","抱娃娃","蹭","吃豆子","吃肉丸","吃手","打脸","顶屎","鬼脸","黄瓜","挥拳","酒瓶","扭","揉脸","揉眼睛","塞鼻子","数钱","妩媚","潇洒","羞涩","摇头","阴险","招客"]
    }

    var config_all = {
        dict: face_dict,
        config: face_config,
        sort: face_sort
    };

    return config_all;
});
