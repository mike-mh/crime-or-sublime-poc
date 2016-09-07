'use strict';

let OAuth2 = require('oauth').OAuth2;
let querystring = require('querystring');

const REDDIT_URL = 'https://www.reddit.com';
const REDDIT_OAUTH_URL = 'https://oauth.reddit.com';

const REDDIT_AUTHORIZE_PATH = '/api/v1/authorize';
const REDDIT_ACCESS_TOKEN_PATH = '/api/v1/access_token';
const REDDIT_SUBMIT_PATH = '/api/submit';

// Reddit doens't play well with multiple URL params with the same name. Just
// keep all permissions in string seperated by commas to avoid this problem.
const REDDIT_PERMISSIONS = 'submit,identity,history';

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
 * To get access_token from Reddit a 'Basic Authorization' header is needed
 * before a token will be granted. This function generates an OAuth2 client
 * that makes use of this header.
 * 
 * More details can be found here:
 * https://tools.ietf.org/html/rfc2617
 * 
 * @return { OAuth2 } - OAuth2 client configured for CoS with Basic Auth.
 */
function generateRedditOAuthClientWithBasicAuth() {
  let encodedAuthToken =
    new Buffer(process.env.REDDIT_ID + ':' + process.env.REDDIT_SECRET)
      .toString('base64');

  let authorizationValue = 'Basic ' + encodedAuthToken;

  let basicAuthHeader = {
    Authorization: authorizationValue
  };

  return new OAuth2(
    process.env.REDDIT_ID,
    process.env.REDDIT_SECRET,
    REDDIT_URL,
    REDDIT_AUTHORIZE_PATH,
    REDDIT_ACCESS_TOKEN_PATH,
    basicAuthHeader
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
      duration: 'permanent'
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
  let client = generateRedditOAuthClientWithBasicAuth();  

  let getAccessTokenPromise = new Promise((resolve, reject) => {
    client.getOAuthAccessToken(
      code,
      {
        redirect_uri: REDDIT_REDIRECT_URI,
        grant_type: 'authorization_code'
      },
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

/**
 * Use this function to generate a thread on Reddit. Unsure if underscore in
 * '_request' is meant to signify that the method is supposed to be private
 * but will consider making a pull request to their library to change that...
 * although a public version of that method would probably do the exact same
 * thing.
 * 
 * @param session {object} - Session associated with user.
 * 
 * @return {Promise} - Promise resolves to error message should one occur._customHeaders
 *   Otherwise simply resolves.
 */
function postToReddit(session) {
  let client = generateRedditOAuthClient();
  client.setAuthMethod('bearer');

  // It's a bit smelly to do it this way but library doesn't support a basic
  // post method yet.
  let postObject = {
    title: 'Hello Reddit',
    text: 'Yay yay yay yay yay',
    sr: 'devdogfood',
    kind: 'self'
  }

  let postBody = querystring.stringify(postObject);
  let submitRedditThreadPromise = new Promise((resolve, reject) => {
    client._request(
      'POST',
      REDDIT_OAUTH_URL + REDDIT_SUBMIT_PATH,
      {Authorization: client.buildAuthHeader(session.redditAccessToken)},
      postBody,
      null,
      (error, data) => {
        console.log(session.redditAccessToken);
        console.log(client.buildAuthHeader(session.redditAccessToken));
        console.log(postBody);
        if (error) {
          reject(error);
        }
        resolve(data);
      });
  });

  return submitRedditThreadPromise;
}

RedditClient.getRedditLoginUrl = getRedditLoginUrl;
RedditClient
  .associateAccessTokenWithSession = associateAccessTokenWithSession;
RedditClient.postToReddit = postToReddit;

module.exports = RedditClient;