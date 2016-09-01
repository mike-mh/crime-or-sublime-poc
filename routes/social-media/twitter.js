'use strict';

let http = require('http');
let https = require('https');
let OAuth = require('oauth').OAuth;
let url = require('url');
let bodyParser = require('body-parser')
let jsonParser = bodyParser.json();

const GET_OAUTH_PARAMS_URL = '/retrieve_twitter_token';

const TWITTER_REQUEST_TOKEN_URL = 'https://api.twitter.com/oauth/request_token';
const TWITTER_ACCESS_TOKEN_URL = 'https://api.twitter.com/oauth/access_token';
const OAUTH_VERSION = '1.0';
const REDIRECT_URL = 'https://crime-or-sublime.herokuapp.com' + GET_OAUTH_PARAMS_URL;
const ENCRYPTION_ALGORITHIM = 'HMAC-SHA1';

//const TWITTER_POST_TEST

function generateOAuthClient() {
  return new OAuth(
    TWITTER_REQUEST_TOKEN_URL,
    TWITTER_ACCESS_TOKEN_URL,
    process.env.TWITTER_ID,
    process.env.TWITTER_SECRET,
    OAUTH_VERSION,
    REDIRECT_URL,
    ENCRYPTION_ALGORITHIM
	);
}

function tieAccessTokenToSession(req, res) {
	// TO-DO. Verify that the attributed email is correct.
	//req.session.twitterOAuthToken = req.query.oauth_token;
	//req.session.twitterOAuthVerifier = req.query.oauth_verifier;
	generateOAuthClient().getOAuthAccessToken(
		req.session.twitterOAuthRequestToken,
		req.session.twitterOAuthRequestTokenSecret,
		req.query.oauth_verifier,
		(error, oauthAccessToken, oauthAccessTokenSecret, results) => {
			if (error) {
				res.send("Error getting OAuth access token : " + req.session.twitterOAuthRequestToken + " " + req.session.twitterOAuthRequestTokenSecret + " " + req.query.oauth_verifier + " " + JSON.stringify(req.session));
			} else {
				req.session.twitterOAuthAccessToken = oauthAccessToken;
				req.session.twitterOAuthAccessTokenSecret = oauthAccessTokenSecret;
				// Right here is where we would write out some nice user stuff
				generateOAuthClient().get(
					"http://twitter.com/account/verify_credentials.json",
					req.session.twitterOAuthAccessToken,
					req.session.twitterOAuthAccessTokenSecret,
					(error, data, response) => {
						if (error) {
							res.send("Error getting twitter screen name : ");
						} else {
							req.session.twitterScreenName = data["screen_name"];
							res.send('You are signed in: ' + req.session.twitterScreenName)
						}
					}
				);

				//    res.redirect('/');
			}
		}
	);
}

module.exports = function (router) {
	router.get(GET_OAUTH_PARAMS_URL, tieAccessTokenToSession);
	router.get('/test', (req, res) => {
		generateOAuthClient().getOAuthRequestToken(function (error, oauthToken, oauthTokenSecret, results) {
			if (error) {
				res.send("Error getting OAuth request token : ");
			} else {
				req.session.twitterOAuthRequestToken = oauthToken;
				req.session.twitterOAuthRequestTokenSecret = oauthTokenSecret;
				res.redirect("https://twitter.com/oauth/authorize?oauth_token=" + req.session.twitterOAuthRequestToken);
				console.log(JSON.stringify(req.session));
			}
		});
	});
}

/*

let express = require('express');
let app = express()
let sessionConfiguration = require('../../libs/session/session');
app.use(sessionConfiguration);

app.listen(3000, function () {
	console.log('Server running on port 3000');
});

/*

let oa2 = new OAuth(
    TWITTER_REQUEST_TOKEN_URL,
    TWITTER_ACCESS_TOKEN_URL,
    process.env.TWITTER_ID,
    process.env.TWITTER_SECRET,
    OAUTH_VERSION,
    REDIRECT_URL,
    ENCRYPTION_ALGORITHIM
);

oa2.getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret, results){
    if (error) {
      res.send("Error getting OAuth request token : " + sys.inspect(error), 500);
    } else {  
      req.session.oauthRequestToken = oauthToken;
      req.session.oauthRequestTokenSecret = oauthTokenSecret;
      res.redirect("https://twitter.com/oauth/authorize?oauth_token="+req.session.oauthRequestToken);      
    }

});

http.createServer(function (request, response) {
    oa2.getOAuthRequestToken(function (error, oAuthToken, oAuthTokenSecret, results) {
        var urlObj = url.parse(request.url, true);
        var authURL = 'https://twitter.com/' +
            'oauth/authenticate?oauth_token=' + oAuthToken;
        console.log('THE TOKEN!');
        console.log(oAuthToken);
        response.writeHead(302, {
            'Location': 'https://api.twitter.com/oauth/authenticate?oauth_token=' + oAuthToken
            //add other headers here...
        });
        response.end();
    });

}).listen(3000);
*/