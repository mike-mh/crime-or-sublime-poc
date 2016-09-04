'use strict';

let RedditClient = require('../../libs/social-media/reddit/reddit');

const REDDIT_LOGIN_URL = '/reddit-login';
const REDDIT_REDIRECT_PATH = '/reddit-redirect';
const REDDIT_REDIRECT_URI = 'https://crime-or-sublime.herokuapp.com' +
                            REDDIT_REDIRECT_PATH;

function redditLogin(req, res) {
  let loginUrl = RedditClient.getRedditLoginUrl();
  res.redirect(loginUrl);
}

function redditRetrieveAccessToken(req, res) {
  let code = req.query.code;
  RedditClient
    .associateAccessTokenWithSession(code, req.session)
      .then(() => { res.send(req.session); })
      .catch((error) => { res.send(error); });
}

module.exports = function(router) {
  router.get(REDDIT_LOGIN_URL, redditLogin);
  router.get(REDDIT_REDIRECT_PATH, redditRetrieveAccessToken);
}