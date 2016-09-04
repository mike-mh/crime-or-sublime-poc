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
      state: 'Need to figure out what this does',
      response_type: 'code',
      duration: 'temporary'
  });

  return loginUrl;
}

/**
 * Use this function to associate the access_token with the current session.
 * 
 * @param code {string} - Code retrieved from Reddit server after login.
 * @param session {object} - Session associated with user.
 * 
 * @return {Promise} - Promise resolves to error if one occurs. Otherwise,
 *   simply resolves.
 */
function associateAccessTokenWithSession(code, session) {
  let client = generateRedditOAuthClient();
    let getAccessTokenPromise = new Promise((resolve, reject) => {
    client.getOAuthAccessToken(
      code,
      { redirect_uri: REDDIT_REDIRECT_URI },
      (error, accessToken, refreshToken, results) => {
        if (error || results.error) {
          reject(error || results.error);
        }

        session.redditAccessToken = accessToken;
        session.redditRefreshToken = refreshToken;

        resolve(1);
      }
    );
  });

  return getAccessTokenPromise;
}

RedditClient.getRedditLoginUrl = getRedditLoginUrl;
RedditClient
  .associateAccessTokenWithSession = associateAccessTokenWithSession;

module.exports = RedditClient;