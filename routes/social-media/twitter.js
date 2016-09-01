'use strict';

let http = require('http');
let OAuth = require('oauth').OAuth;
let url = require('url');
let bodyParser = require('body-parser');
let jsonParser = bodyParser.json();

const GET_OAUTH_PARAMS_URL = '/retrieve_twitter_token';

const TWITTER_REQUEST_TOKEN_URL = 'https://api.twitter.com/oauth/request_token';
const TWITTER_ACCESS_TOKEN_URL = 'https://api.twitter.com/oauth/access_token';
const OAUTH_VERSION = '1.0';
const REDIRECT_URL = 'https://crime-or-sublime.herokuapp.com' + GET_OAUTH_PARAMS_URL;
const ENCRYPTION_ALGORITHIM = 'HMAC-SHA1';



function tieAccessTokenToSession(req, res) {
  // TO-DO. Verify that the attributed email is correct.
  req.session.twitterOAuthToken = req.query.oauth_token;
  req.session.twitterOAuthVerifier = req.query.oauth_verifier;

  res.redirect('/');
}

module.exports = function(router)
{
  router.get(GET_OAUTH_PARAMS_URL, tieAccessTokenToSession);
}

/*
let oa = new OAuth(
    TWITTER_REQUEST_TOKEN_URL,
    TWITTER_ACCESS_TOKEN_URL,
    process.env.TWITTER_ID,
    process.env.TWITTER_SECRET,
    OAUTH_VERSION,
    REDIRECT_URL,
    ENCRYPTION_ALGORITHIM
);

http.createServer(function (request, response) {
    oa.getOAuthRequestToken(function (error, oAuthToken, oAuthTokenSecret, results) {
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