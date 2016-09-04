'use strict';

let OAuth2 = require('oauth').OAuth2;
let querystring = require('querystring');

const REDDIT_URL = 'https://www.reddit.com';

const REDDIT_AUTHORIZE_PATH = '/api/v1/authorize';
const REDDIT_ACCESS_TOKEN_PATH = '/api/v1/access_token';

const REDDIT_PERMISSIONS = ['submit', 'identity', 'history'];

const REDDIT_REDIRECT_URI = 'https://crime-or-sublime.herokuapp.com/reddit-redirect';

function RedditClient() { }

/**
 * Use this to generate the Reddit OAuth client.
 * access_token
 * 
 * @return { OAuth2 } - OAuth2 client configured for CoS.
 */
function generateRedditOAuthClient() {
  return new OAuth2(
    process.env.REDDIT_ID,
    process.env.REDDIT_SECRET,
    REDDIT_URL,
    REDDIT_AUTHORIZE_PATH,
    REDDIT_ACCESS_TOKEN_PATH,
    null
  );
}

/**
 * Use this function to generate the Reddit login URL.
 * 
 * @return {string} - Reddit login URL.
 */
function getRedditLoginUrl() {
  let client = generateRedditOAuthClient();
  let loginUrl = client
    .getAuthorizeUrl({
      redirect_uri: REDDIT_REDIRECT_URI,
      scope: REDDIT_PERMISSIONS,
      state: 'Need to figure out what this does'
  });

  return loginUrl;
}

RedditClient.getRedditLoginUrl = getRedditLoginUrl;
module.exports = RedditClient;