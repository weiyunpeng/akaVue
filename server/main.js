//直接引入date的prototype
require('./util/date.prototype');
//直接引入字符串的prototype
require('./util/string.prototype.js');
//引入message信息
var message = require('./util/message.js');
var request = require('request');
var path = require("path");
var fs = require("fs");
//从message对象里面导出
exports.getMessageObj = message.getMessageObj;
//导出message字符串，通过名称
exports.getMessage = message.getMessage;
/**
 * 测试方式输出到控制台
 * @param {Object} response Response对象
 * @param {Object} result 返回前端结果
 */
function responseStub(Response, fileName) {
    var dir = path.join(__dirname, fileName);
    Response.setHeader("Content-Type", "text/html; charset=utf-8");
    fs.readFile(dir, function (err, data) {
        if (err)
            throw err;
        Response.end(data);
    });
}
exports.responseStub = responseStub;
/**
 * 输出到控制台
 * @param {Object} response Response对象
 * @param {Object} result 返回前端结果
 */
function responseEnd(response, result) {
    var html;
    if (typeof (result) == "object") {
        response.setHeader("Content-Type", "application/json; charset=utf-8");
        //增加error对象判断，要不然error对象stringify转换后会是{}
        if (result.data) {
            //说明是正常的结果
        } else {
            //没有说明有问题,error的原型可能有多级比如 new EvalError()是继承new Error()
            if (result.__proto__ === Error.prototype || result.__proto__.__proto__ && result.__proto__.__proto__ === Error.prototype) {
                errLog.error(result.stack);
                result = {
                    status: -1,
                    message: result.message
                };
            }
        }
        html = JSON.stringify(result);
    } else if (result && result.length > 0) {
        //输出html代码
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        html = result
    } else {
        //防止一些接口异常直接返回空，导致前端ajax出现判断异常，没有在model.ajax里面捕获
        response.setHeader("Content-Type", "application/json; charset=utf-8");
        //返回解析异常
        html = JSON.stringify(getMessageObj(-2));
    }
    response.end(html);
};
exports.responseEnd = responseEnd;

/**
 *服务器地址以及配置
 */
exports.serverUrl = "http://api.eyekey.com";
exports.APP_ID = "58444d8725f44375b6ff710172a83d12"
exports.APP_KEY = "909615ad47ed407ab13eb97935461a00"

exports.headers = {
    "Content-Type": "text/html",
    "User-Agent": "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; WOW64; Trident/4.0; QQDownload 766; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET4.0C; .NET4.0E)",
    "Accept-Encoding": "gzip"
    // "Cookie": "JSESSIONID=abcnPxcKif8sQ6SqIGu7u",
}
/**
 * 模拟Ajax请求
 */
function ajaxCall(Param, Request, Response, extObj) {
    function encodeObj(Param) {
        for (var name in Param) {
            var value = Param[name];
            Param[name] = encodeURIComponent(value);
        }
        return Param;
    };
    var option = {
        method: "post",
        jar: "true",
        Cookie: "true",
        Enctype: "application/x-www-form-urlencoded",
        Charset: "utf-8"
    };
    if (extObj.option.type == 'get') {
        extObj.option.type = undefined;
        option.method = 'get';
        option.Enctype = undefined;
        option.Params = encodeObj(extObj.option.data);
        //把之前临时定义的data设置未定义
        extObj.option.data = undefined;
    } else {
        //post提交
        option.Body = extObj.option.data;
        //把之前临时定义的data设置未定义
        extObj.option.data = undefined;
    }
    option = extend(option, extObj.option);
    //把之前临时定义的data设置未定义
    option.data = undefined;
    request = extend(request, request.post);
    request(option, function (err, res, ajaxdata) {
        if (err) {
            //服务器级别的错误
            var t_msg = '';
            try {
                t_msg = JSON.stringify(err);
            } catch (e) {
                t_msg = err;
            }
            var reErr = {
                status: 9999,
                message: t_msg
            }
            if (extObj.error) {
                //如果有定义捕获异常，就返回异常信息回调
                extObj.error(reErr, res, ajaxdata);
            } else {
                //没有对异常捕获的话，默认返回
                responseEnd(Response, reErr);
            }
        } else {
            //正常返回
            if (typeof (ajaxdata) != "object") {
                //变成json格式
                try {
                    ajaxdata = JSON.parse(ajaxdata);
                } catch (e) {
                    console.log(e.stack);
                }
            }
            if(ajaxdata.res_code == 1067){
                //说明未检测到人脸
                Response.setHeader("Content-Type", "application/json; charset=utf-8");
                Response.end(JSON.stringify(ajaxdata.message));
            }else if(ajaxdata.res_code == 1011){
                Response.setHeader("Content-Type", "application/json; charset=utf-8");
                Response.end(JSON.stringify(ajaxdata.message));
            }else if(ajaxdata.res_code == 0000){
                extObj.success(ajaxdata);
            }else{
                extObj.success(ajaxdata);
            }
        }
    })
}
exports.ajaxCall = ajaxCall;


function extend(target, /*optional*/ source, /*optional*/ deep) {
    /*
     * @param {Object} target 目标对象。
     * @param {Object} source 源对象。
     * @param {boolean} deep 是否复制(继承)对象中的对象。
     * @returns {Object} 返回继承了source对象属性的新对象。
     */
    target = target || {};
    var sType = typeof source,
        i = 1,
        options;
    if (sType === 'undefined' || sType === 'boolean') {
        deep = sType === 'boolean' ? source : false;
        source = target;
        target = this;
    }
    if (typeof source !== 'object' && Object.prototype.toString.call(source) !== '[object Function]')
        source = {};
    while (i <= 2) {
        options = i === 1 ? target : source;
        if (options != null) {
            for (var name in options) {
                var src = target[name],
                    copy = options[name];
                if (target === copy)
                    continue;
                if (deep && copy && typeof copy === 'object' && !copy.nodeType)
                    target[name] = this.extend(src || (copy.length != null ? [] : {}), copy, deep);
                else if (copy !== undefined)
                    target[name] = copy;
            }
        }
        i++;
    }
    return target;
}

/**
 * 获取request的get和post请求
 * @param Request
 * @returns {{}}
 */
exports.getParams=function(Param){
    var params=extend( Param.body,Param.query,false);
    return params;
}