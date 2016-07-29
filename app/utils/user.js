var jwt         = require('jwt-simple');
var config      = require('../../config/database');
var User        = require('../../app/models/User');

exports.IsUserAuthenticated = function (headers, callback) {
  var token = getToken(headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      name: decoded.name
    }, function(err, user) {
      if (err) throw err;
      if (!user) {
        callback({success: false, msg: 'Authentication failed. User not found.'}, null);
      } else {
        callback({success: true, msg: ""},user);
      }
    });
  }else{
    callback({success: false, msg: 'No token provided.'}, null);
  }
};

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
