'use strict';

let TwitterClient = require('../../libs/social-media/twitter/twitter');

let bodyParser = require('body-parser')
let jsonParser = bodyParser.json();

const COS_URL = "https://crime-or-sublime.herokuapp.com"

const TWITTER_VALIDATION_URL = 'https://twitter.com/oauth/authorize?oauth_token=';

const TWITTER_LOGIN_PATH = '/twitter-login'
const TWITTER_REDIRECT_PATH = '/twitter-redirect';
const TWEET_IMAGE_PATH = '/tweet-image';

function twitterLogin(req, res) {
  TwitterClient
    .associateRequestTokensWithSession(req.session)
      .then(() => {
        res.redirect(
          TWITTER_VALIDATION_URL + req.session.twitterOAuthRequestToken);
      })
      .catch((error) => {
        res.send(error)
      });
}

function getRedirectTokens(req, res) {
  let oAuthVerifier = req.query.oauth_verifier;
  TwitterClient
    .associateAccessTokensWithSession(oAuthVerifier, req.session)
      .then(() => {
        res.send("OH YEAH!");
      })
      .catch((error) => { res.send(error) })
}

function tweetImage(req, res) {
  TwitterClient
    .makeTweetWithImage(
      'I hope this works too', 
      'https://i.imgur.com/Y9rP9eks.jpg',
       req.session)
        .then(() => { res.send('OH YEAH!'); })
        .catch((error) => { res.send('ERROR' + error); });
}


module.exports = function (router) {
  router.get(TWITTER_LOGIN_PATH, twitterLogin);
  router.get(TWITTER_REDIRECT_PATH, getRedirectTokens);
  router.get(TWEET_IMAGE_PATH, tweetImage);
}

