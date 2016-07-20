// Add machine (debug)
// headers: {Authorization:token}
// params: {name:string, ip:string, lat:number, lng:number}
// response: {success:bool, msg:string}

var User        = require('../../app/models/user');
var Machine     = require('../../app/models/Machine');
var passport		= require('passport');
var jwt         = require('jwt-simple');
var config      = require('../../config/database');

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
    var token = getToken(req.headers);
    if (token) {
      if (!req.body.name || !req.body.ip || !req.body.lat || !req.body.lng) {
        res.json({success: false, msg: 'Please pass name, ip, lat, lng.'});
      } else {

        var decoded = jwt.decode(token, config.secret);
        User.findOne({
          name: decoded.name
        }, function(err, user) {
          if (err) throw err;

          if (!user) {
            return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
          } else {
            var newVM = new Machine({
              name: req.body.name,
              owner: user.id,
              ip: req.body.ip,
              lat: req.body.lat,
              lng: req.body.lng
            });
            // save the VM
            newVM.save(function(err) {
              if (err) {
                return res.json({success: false, msg: 'VM already exists.'});
              }
              res.json({success: true, msg: 'Successful created new VM.'});
            });
          }
        });
      }

    } else {
      return res.status(403).send({success: false, msg: 'No token provided.'});
    }
  });
}
function getToken(headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
}
