'use strict';

let RedditClient = require('../../libs/social-media/reddit/reddit');

const REDDIT_LOGIN_URL = '/reddit-login';
const REDDIT_REDIRECT_PATH = '/reddit-redirect';
const REDDIT_CREATE_THREAD_PATH = '/reddit-create-thread'
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
      .then(() => { res.send('YOU WIN!'); })
      .catch((error) => { res.send(error); });
}

function postRedditThread(req, res) {
  RedditClient
    .postToReddit(req.session)
      .then((data) => res.send('WIN!' + data))
      .catch((error) => { res.send('LOSE!' + error)});
}

module.exports = function(router) {
  router.get(REDDIT_LOGIN_URL, redditLogin);
  router.get(REDDIT_REDIRECT_PATH, redditRetrieveAccessToken);
  router.get(REDDIT_CREATE_THREAD_PATH, postRedditThread);
}