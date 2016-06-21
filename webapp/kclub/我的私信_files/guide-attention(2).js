define(["jade"],function(jade){

return function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (config, is_wx) {
buf.push("<div class=\"guide-attention\"><img" + (jade.attr("src", config.account_avatar, true, false)) + " class=\"avatar\"/><span class=\"name\">" + (jade.escape(null == (jade_interp = config.title) ? "" : jade_interp)) + "</span><button class=\"btn js-attention\">" + (jade.escape(null == (jade_interp = "关注") ? "" : jade_interp)) + "</button><i class=\"close k-i-add js-close\"></i></div><div class=\"guide-attention--backdrop\"><div class=\"qr-content\"><img" + (jade.attr("src", config.account_qr_code, true, false)) + " class=\"qr-code\"/><div class=\"desc\">" + (jade.escape(null == (jade_interp = is_wx ? "长按识别二维码" : "请保存二维码图片, 用微信识别") ? "" : jade_interp)) + "</div></div></div>");}.call(this,"config" in locals_for_with?locals_for_with.config:typeof config!=="undefined"?config:undefined,"is_wx" in locals_for_with?locals_for_with.is_wx:typeof is_wx!=="undefined"?is_wx:undefined));;return buf.join("");
};

});
