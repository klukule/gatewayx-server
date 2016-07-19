var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var passport		= require('passport');
var config      = require('./config/database');
var User        = require('./app/models/user');
var Machine     = require('./app/models/vm');
var port        = process.env.PORT || 8080;
var jwt         = require('jwt-simple');


var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', 'Accept, Accept-CH, Accept-Charset, Accept-Datetime, Accept-Encoding, Accept-Ext, Accept-Features, Accept-Language, Accept-Params, Accept-Ranges, Access-Control-Allow-Credentials, Access-Control-Allow-Headers, Access-Control-Allow-Methods, Access-Control-Allow-Origin, Access-Control-Expose-Headers, Access-Control-Max-Age, Access-Control-Request-Headers, Access-Control-Request-Method, Age, Allow, Alternates, Authentication-Info, Authorization, C-Ext, C-Man, C-Opt, C-PEP, C-PEP-Info, CONNECT, Cache-Control, Compliance, Connection, Content-Base, Content-Disposition, Content-Encoding, Content-ID, Content-Language, Content-Length, Content-Location, Content-MD5, Content-Range, Content-Script-Type, Content-Security-Policy, Content-Style-Type, Content-Transfer-Encoding, Content-Type, Content-Version, Cookie, Cost, DAV, DELETE, DNT, DPR, Date, Default-Style, Delta-Base, Depth, Derived-From, Destination, Differential-ID, Digest, ETag, Expect, Expires, Ext, From, GET, GetProfile, HEAD, HTTP-date, Host, IM, If, If-Match, If-Modified-Since, If-None-Match, If-Range, If-Unmodified-Since, Keep-Alive, Label, Last-Event-ID, Last-Modified, Link, Location, Lock-Token, MIME-Version, Man, Max-Forwards, Media-Range, Message-ID, Meter, Negotiate, Non-Compliance, OPTION, OPTIONS, OWS, Opt, Optional, Ordering-Type, Origin, Overwrite, P3P, PEP, PICS-Label, POST, PUT, Pep-Info, Permanent, Position, Pragma, ProfileObject, Protocol, Protocol-Query, Protocol-Request, Proxy-Authenticate, Proxy-Authentication-Info, Proxy-Authorization, Proxy-Features, Proxy-Instruction, Public, RWS, Range, Referer, Refresh, Resolution-Hint, Resolver-Location, Retry-After, Safe, Sec-Websocket-Extensions, Sec-Websocket-Key, Sec-Websocket-Origin, Sec-Websocket-Protocol, Sec-Websocket-Version, Security-Scheme, Server, Set-Cookie, Set-Cookie2, SetProfile, SoapAction, Status, Status-URI, Strict-Transport-Security, SubOK, Subst, Surrogate-Capability, Surrogate-Control, TCN, TE, TRACE, Timeout, Title, Trailer, Transfer-Encoding, UA-Color, UA-Media, UA-Pixels, UA-Resolution, UA-Windowpixels, URI, Upgrade, User-Agent, Variant-Vary, Vary, Version, Via, Viewport-Width, WWW-Authenticate, Want-Digest, Warning, Width, X-Content-Duration, X-Content-Security-Policy, X-Content-Type-Options, X-CustomHeader, X-DNSPrefetch-Control, X-Forwarded-For, X-Forwarded-Port, X-Forwarded-Proto, X-Frame-Options, X-Modified, X-OTHER, X-PING, X-PINGOTHER, X-Powered-By, X-Requested-With');
    next();
}
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(passport.initialize());
app.use(allowCrossDomain);



mongoose.connect(config.database);

require('./config/passport')(passport);

var router = express.Router( );

router.get( '/', function( req, res ) {
	res.json( { message: 'Welcome to GatewayX API v1!' } );
} );

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
router.post('/debugAdd', passport.authenticate('jwt', { session: false}), function(req, res) {
	var token = getToken(req.headers);
	if (token) {
		if (!req.body.name || !req.body.ip) {
			res.json({success: false, msg: 'Please pass name and password.'});
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

getToken = function (headers) {
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
};

app.use( '/api/v1', router );

app.listen( port );
console.log( 'GatewayX Server runnig on ' + port + '!' );
