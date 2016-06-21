require.config({
    paths: {
        text: "../bower_components/requirejs-text/text",
        wxsdk: "http://res.wx.qq.com/open/js/jweixin-1.0.0",
        kuaivote_portal: "http://pfile.kuaizhan.com/files/kuaivote/latest_version/components/kuaivote-multi/portal",
        requests: "./requests",
        components: "./components",
        templates: "./templates",
        views: "./views"
    }
});


define("jquery", [], function () {
    return window.jQuery;
});
define("zepto", [], function () {
    return window.jQuery;
});
define("moment", [], function (moment) {
    return moment;
});
define("backbone", [], function () {
    return window.Backbone;
});
define("underscore", [], function () {
    return window._;
});
define("mustache", [], function (Mustache) {
    return Mustache;
});
define("promise", [], function () {
    return window.Promise;
});
define("AVChatClient", [], function () {
    return window.AVChatClient;
});
define("jade", [], function () {
    return window.jade;
});


// extends anmate css to jQuery
$.fn.extend({
    animateCss: function (animationName, cb) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        $(this).addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
            if (cb) {
                cb()
            }
        });
    }
});


require([
    "jquery",
    'moment',
    "backbone",
    'underscore',
    'mustache',
    'promise',
    'AVChatClient',

    'routes'
], function ($, moment, Backbone, _, Mustache, Promise, AVChatClient, Routes) {
    "use strict";

    var App = function () {
        this._global = {};
        this.routes = new Routes();
    };

    App.prototype.start = function () {
        Backbone.history.start({pushState: true, root: "/"});
        return this;
    };

    return new App().start();
});
