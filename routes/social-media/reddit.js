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

module.exports = function(router) {
  router.get(REDDIT_LOGIN_URL, redditLogin);
}