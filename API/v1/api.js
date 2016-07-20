var express     = require('express');
var router      = express.Router();

var endpoints    = [];

var name = "v1";

function API(){
  router.get( '/', function( req, res ) {
    res.json( { kind: "APIEndpointList", groupVersion: name, endpoints : endpoints } );
  } );

  require("./endpoint_post_signup")(router,endpoints);
  require("./endpoint_post_addmachine")(router,endpoints); //Debug
  require("./endpoint_post_authenticate")(router,endpoints);
  require("./endpoint_get_machines")(router,endpoints);

  endpoints.sort(function(a,b) {
    var x = a.name.toLowerCase();
    var y = b.name.toLowerCase();
    return x < y ? -1 : x > y ? 1 : 0;
  });
};

API.prototype.Router = router;
API.prototype.Name = name;

module.exports = new API();
