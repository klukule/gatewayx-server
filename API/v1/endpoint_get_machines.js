// Get machines
// headers: {Authorization:token}
// params: {}
// response: {success:bool == false, msg:string}
//           {success:bool == true, machines:[{_id:string, name:string, owner:string, ip:string, lat:number, lng:number,  __v:number}]}

var User        = require('../../app/models/user');
var Machine     = require('../../app/models/Machine');
var passport		= require('passport');
var jwt         = require('jwt-simple');
var config      = require('../../config/database');

module.exports = function(router, endpoints){
  endpoints.push({
    name:"machines",
    namespaced: true,
    method:"get",
    headers:"{Authorization:string}",
    params:"{}",
    response:[
      "{success:bool == false, msg:string}",
      "{success:bool == true, machines:[{_id:string, name:string, owner:string, ip:string, lat:number, lng:number,  __v:number}]}"
    ]
  });

  router.get('/machines', passport.authenticate('jwt', { session: false}), function(req, res) {
  	var token = getToken(req.headers);
  	if (token) {
  		var decoded = jwt.decode(token, config.secret);
  		User.findOne({
  			name: decoded.name
  		}, function(err, user) {
  			if (err) throw err;

  			if (!user) {
  				return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
  			} else {
  				Machine.find({
  					owner: user.id
  				},function(err,vm){
  					res.json({success: true, machines: vm});
  				});
  			}
  		});
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
