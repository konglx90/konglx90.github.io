define(["jade"],function(jade){

return function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (user) {
buf.push("<div class=\"side-bar side-bar--animate\"><div class=\"header\"><div class=\"user-info\">");
if ( user)
{
buf.push("<img" + (jade.attr("src", user.avatar.mid || '/clubv2/images/default-avatar.png', true, false)) + " class=\"avatar\"/><div class=\"content\">");
if ( user.score_info || user.grade_info)
{
buf.push("<div class=\"top\"><span class=\"nick\">" + (jade.escape(null == (jade_interp = user.nick) ? "" : jade_interp)) + "</span>");
if ( user.score_grade_on)
{
buf.push("<span" + (jade.cls(['level','user-rank-' + user.grade_info.level.rank], [null,true])) + "></span>");
}
if ( user.is_forum_manager)
{
buf.push("<span class=\"tag\">" + (jade.escape(null == (jade_interp = '管理员') ? "" : jade_interp)) + "</span>");
}
else if ( user.is_forum_owner)
{
buf.push("<span class=\"tag\">" + (jade.escape(null == (jade_interp = '站长') ? "" : jade_interp)) + "</span>");
}
else if ( user.groups.length > 0)
{
buf.push("<span class=\"tag\">" + (jade.escape(null == (jade_interp = user.groups[0]) ? "" : jade_interp)) + "</span>");
}
buf.push("</div><div class=\"bottom\">");
if ( user.score_info)
{
buf.push("<span class=\"score\">积分 " + (jade.escape((jade_interp = user.score_info.total || 0) == null ? '' : jade_interp)) + "</span>");
}
if ( user.grade_info)
{
buf.push("<span class=\"grade\">经验值 " + (jade.escape((jade_interp = user.grade_info.total || 0) == null ? '' : jade_interp)) + "</span>");
}
buf.push("</div>");
}
else
{
buf.push("<span class=\"nick\">" + (jade.escape(null == (jade_interp = user.nick) ? "" : jade_interp)));
if ( user.score_grade_on)
{
buf.push("<span" + (jade.cls(['level','user-rank-' + user.grade_info.level.rank], [null,true])) + "></span>");
}
if ( user.is_forum_manager)
{
buf.push("<span class=\"tag\">" + (jade.escape(null == (jade_interp = '管理员') ? "" : jade_interp)) + "</span>");
}
else if ( user.is_forum_owner)
{
buf.push("<span class=\"tag\">" + (jade.escape(null == (jade_interp = '站长') ? "" : jade_interp)) + "</span>");
}
else if ( user.groups.length > 0)
{
buf.push("<span class=\"tag\">" + (jade.escape(null == (jade_interp = user.groups[0]) ? "" : jade_interp)) + "</span>");
}
buf.push("</span>");
}
buf.push("</div>");
}
else
{
buf.push("<img src=\"\" class=\"avatar\"/><span class=\"default-content\">登录账号</span>");
}
buf.push("</div></div><div class=\"link-table\"><a href=\"/clubv2/froums/\" class=\"link\"><i class=\"icon\"></i><span class=\"link-name\">首页</span></a><a href=\"/clubv2/froums/\" class=\"link\"><i class=\"icon\"></i><span class=\"link-name\">提醒</span></a><a href=\"/clubv2/froums/\" class=\"link\"><i class=\"icon\"></i><span class=\"link-name\">赏金</span></a><a href=\"/clubv2/froums/\" class=\"link\"><i class=\"icon\"></i><span class=\"link-name\">私信</span>");
if ( user['msg-count'])
{
buf.push("<i class=\"msg-num\">" + (jade.escape(null == (jade_interp = user['msg-count']) ? "" : jade_interp)) + "</i>");
}
buf.push("</a></div>");
if ( user && user.is_sing_open)
{
if ( !user.has_signed)
{
buf.push("<button class=\"sign-btn js-sign\">马上签到</button>");
}
else
{
buf.push("<button class=\"sign-btn\">已签到</button>");
}
}
buf.push("</div><div class=\"side-bar--backdrop side-bar--animate\"></div>");}.call(this,"user" in locals_for_with?locals_for_with.user:typeof user!=="undefined"?user:undefined));;return buf.join("");
};

});
