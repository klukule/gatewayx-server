// Add machine (debug)
// headers: {Authorization:token}
// params: {name:string, ip:string, lat:number, lng:number}
// response: {success:bool, msg:string}

var Machine     = require('../../app/models/Machine');

var UserUtils     = require('../../app/utils/User');
var ISPUtils     = require('../../app/utils/ISP');
var passport		= require('passport');


module.exports = function(router, endpoints){
  endpoints.push({
    name:"addmachine",
    namespaced: true,
    method:"post",
    headers:"{Authorization:string}",
    params:"{name:string, ip:string, lat:string, lng:string}",
    response:[
      "{success:bool, msg:string}"
    ]
  });

  router.post('/addmachine', passport.authenticate('jwt', { session: false}), function(req, res) {
    UserUtils.IsUserAuthenticated(req.headers,function(status,user){
      if(status.success){
        var machine = new Machine({
          owner: user.id,
          name: req.body.name,
          hardware: req.body.hardware,
          lat: req.body.lat,
          lng: req.body.lng
        });

        machine.save(function(err){
          if(err){
            return res.json({success: false, msg: 'VM already exists.'});
          }
          return res.json({success: true, msg: 'Successful created new VM.'});
        })

      }else{
        return res.status(403).send(status.msg);
      }
    });
  });
};
