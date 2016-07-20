// Authenticate user
// headers: {}
// params: {name:string, password:string}
// response: {success:bool == false, msg:string}
//           {success:bool == true, token:string}

var User        = require('../../app/models/user');
var passport		= require('passport');
var jwt         = require('jwt-simple');
var config      = require('../../config/database');

module.exports = function(router, endpoints){
  endpoints.push({
    name:"authenticate",
    namespaced: true,
    method:"post",
    headers:"{}",
    params:"{name:string, password:string}",
    response:[
      "{success:bool == false, msg:string}","{success:bool == true, token:string}"
    ]
  });

  router.post('/authenticate', function(req, res) {
  	User.findOne({
  		name: req.body.name
  	}, function(err, user) {
  		if (err) throw err;

  		if (!user) {
  			res.send({success: false, msg: 'Authentication failed. User not found.'});
  		} else {
  			// check if password matches
  			user.comparePassword(req.body.password, function (err, isMatch) {
  				if (isMatch && !err) {
  					// if user is found and password is right create a token
  					var token = jwt.encode(user, config.secret);
  					// return the information including token as JSON
  					res.json({success: true, token: 'JWT ' + token});
  				} else {
  					res.send({success: false, msg: 'Authentication failed. Wrong password.'});
  				}
  			});
  		}
  	});
  });
}
