var express     = require('express');
var router      = express.Router();

var versions    = [];

function API(){
  router.get( '/', function( req, res ) {
    res.json( { kind: "APIVersions", versions : versions } );
  } );
};

API.prototype.Router = router;

API.prototype.Register = function (api) {
  versions.push(api.Name);
  router.use("/"+api.Name, api.Router);
};


module.exports = new API();
