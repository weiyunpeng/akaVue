var messageList = [{
    code : 0,
    message : '正常'
}, {
    code : -1,
    message : '接口参数异常,请确认入参'
}, {
    code : -2,
    message : '接口解析异常'
}, {
    code : -3,
    message : 'DOM入参为空'
}, {
    code : -60,
    message : '数据库链接失败'
}, {
    code : -99,
    message : '您还没有登录'
}, {
    code : -98,
    message : '用户名或密码错误'
}, {
    code : -100,
    message : '对方系统接口连接异常,请稍后再试'
}, {
    code : -101,
    message : '对方系统接口连接异常,证书问题'
}];
/**
 * 查找消息对象通过code编码
 */
function findMessageObj (code) {
    for (var i = 0; i < messageList.length; i++) {
        var code_obj = messageList[i];
        if (code == code_obj.code) {
            return code_obj;
        }
    }
}

/**
 * 获取信息对象
 * @param {Object} code
 */
function getMessageObj (code) {
    var messageObj = findMessageObj(code);
    var robj = {
        code : code,
        message : messageObj.message
    };
    return robj;
}

function getMessage (code) {
    var messageObj = findMessageObj(code);
    return messageObj.message;
}

// 导出消息对象列表
exports.messageList = messageList;
// 导出获取消息对象
exports.getMessageObj = getMessageObj;
exports.getMessage = getMessage;

