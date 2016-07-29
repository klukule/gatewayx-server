var config      = require('../../config/database');
/*var Plan        = require('../../app/models/Plan');
var Isp        = require('../../app/models/ISP');

exports.GetFreeIP = function (planID) {
  Plan.findOne({
    _id: planID
  },function(err,plan){
    Isp.findOne({
      _id: plan.isp
    },function(err, isp){

    });
  });
};

function IpStringToNum(string) {
  var splited = string.split(".");
  var oc4 = Number((splited[3]<<24))>>>0;
  var oc3 = Number((splited[2]<<16));
  var oc2 = Number((splited[1]<<8));
  var oc1 = Number(splited[0]);
  return oc4 + oc3 + oc2 + oc1;
}*/
