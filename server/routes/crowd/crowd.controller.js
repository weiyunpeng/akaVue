var MAIN = require('./../../main');
var co = require('co');
var mongoose = MAIN.mongoose;
var Crowd = mongoose.model('Crowd');
var Appinfo = mongoose.model('Appinfo');


exports.get_appinfo = function (req, res) {
  var params = MAIN.getParams(req);
  var crowd_id = params.crowd_id;
  var people_id = params.people_id;
  co(function* () {
    var appinfo = yield Appinfo.find({})
    return appinfo
  }).then(function(appinfo){
      //ajax请求获取
        MAIN.ajaxCall(params, req, res, {
            option: {
            url: MAIN.serverUrl + '/Info/get_appinfo',
            type: 'get',
            qs: {
                    app_id: MAIN.APP_ID,
                    app_key: MAIN.APP_KEY,
                    crowd_id: crowd_id,
                    people_id: people_id,
                }
            },
            success: function (ajaxdata) {
                if(!ajaxdata.crowd){
                    ajaxdata.crowd = []
                }
                if(appinfo&&appinfo[0] != undefined){
                    //说明数据库中已经存在信息，做更新操作
                    var pid = appinfo[0]._id;
                    Appinfo.findByIdAndUpdateAsync(pid,ajaxdata).then(function (data) {
                        console.log(ajaxdata);
                        return MAIN.responseEnd(res, ajaxdata)
                    }).catch(function (err) {
                        return MAIN.responseEnd(res, err)
                    });
                }else{
                    //说明数据库中不存在信息，创建数据库
                    Appinfo.createAsync(ajaxdata).then(function (data) {
                        return MAIN.responseEnd(res, data)
                    }).catch(function (err) {
                        return MAIN.responseEnd(res, err)
                    });
                }
            }
        })
  })
}

exports.addCrowd = function (req, res) {
  var params = MAIN.getParams(req);
  co(function* () {
      function hello(){
        return Promise.resolve({a:'haha'})
    }
    function hello2(){
        return Promise.resolve('jay');
    }
    var hel = yield hello();
    var res = yield hello2();
    return hel
  }).then(function (value) {
      console.log(value);
      MAIN.responseEnd(res, value)
  }, function (err) {
    console.error(err.stack);
  });
};
