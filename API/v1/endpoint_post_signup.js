// Signup user
// headers: {}
// params: {name:string, password:string}
// response: {success:bool, msg:string}

var User        = require('../../app/models/user');

module.exports = function(router, endpoints){
  endpoints.push({
    name:"signup",
    namespaced: true,
    method:"post",
    headers:"{}",
    params:"{name:string, password:string}",
    response:[
      "{success:bool, msg:string}"
    ]});

  router.post('/signup', function(req, res) {
    if (!req.body.name || !req.body.password) {
      res.json({success: false, msg: 'Please pass name and password.'});
    } else {
      var newUser = new User({
        name: req.body.name,
        password: req.body.password
      });
      // save the user
      newUser.save(function(err) {
        if (err) {
          return res.json({success: false, msg: 'Username already exists.'});
        }
        res.json({success: true, msg: 'Successful created new user.'});
      });
    }
  });
}
