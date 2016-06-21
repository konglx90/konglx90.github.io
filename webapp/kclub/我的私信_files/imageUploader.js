define([], function () {
    /**
     * 跨域异步post提交工具 使用Formdata,非iframe 提交
     * @exports utils/ifajaxh5
     * @version 1.0
     */

    var ifajax = function(_url){
        var data = new FormData();
        var obj ={};

        obj.appendInput = function (input_obj) {
            if (input_obj.files) {
                for (var i = 0; i < input_obj.files.length; i++) {
                    data.append(input_obj.name, input_obj.files[i]);
                }
            } else {
                data.append(input_obj.name, input_obj.value);
            }
            return this;
        };

        obj.submit = function (success,err) {
            var xhr = new XMLHttpRequest();
            var url = _url||"/club/apiv1/me/b64-upload";

            xhr.open("POST", url, true);
            xhr.setRequestHeader('Accept', '*/*');
            //xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=--------------------56423498738365');
            //
            xhr.onload = function () {
                if (xhr.status == 200) {
                    if (xhr.responseText) {
                        try {
                            //console.log(xhr);
                            var json = $.parseJSON($.trim(xhr.responseText));
                            success && success(json);
                        } catch (e) {
                            err && err("parse error", xhr.responseText);
                        }
                    }
                } else {
                    var message = xhr.responseText, code = xhr.status;
                    if (code === 413) {
                        message = "上传文件大小超过限制"
                    } else {
                        try {
                            var json = $.parseJSON(xhr.responseText);
                            message = json.message;
                            code = json.code;
                        } catch (e) {

                        }
                    }

                    err && err (code, message);
                }
            };
            xhr.send(data);
            return;
        }

        return obj;
    };

    return ifajax;
});

