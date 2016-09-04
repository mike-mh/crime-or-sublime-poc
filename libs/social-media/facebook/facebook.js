'use strict';

let OAuth2 = require('oauth').OAuth2;
let querystring = require('querystring');
let express = require('express');
let app = express();

const FACEBOOK_REDIRECT_URI =
  'https://crime-or-sublime.herokuapp.com/fb-redirect';

const FACEBOOK_URL = 'https://www.facebook.com';
const FACEBOOK_GRAPH_URL = 'https://graph.facebook.com';
const FACEBOOK_AUTHROIZE_PATH = 'dialog/oauth';
const FACEBOOK_ACCESS_TOKEN_PATH = 'v2.7/oauth/access_token';

const COS_PERMISSION_SCOPES = ['public_profile', 'email', 'publish_actions'];

function facebookClient() { }

// Unfortuantely, Facebook has two different domains for their authorization
// and acess token URLs. Use two different clients for each situation.
function generateFBLoginOAuthClient() {
  return new OAuth2(
    process.env.FACEBOOK_ID,
    process.env.FACEBOOK_SECRET,
    FACEBOOK_URL,
    FACEBOOK_AUTHROIZE_PATH,
    null,
    null
  );
}

function generateFBRequestTokenOAuthClient() {
  return new OAuth2(
    process.env.FACEBOOK_ID,
    process.env.FACEBOOK_SECRET,
    FACEBOOK_GRAPH_URL,
    null,
    FACEBOOK_ACCESS_TOKEN_PATH,
    null
  );
}

/**
 * This function generates the authorization URL to redirect user to Facebbok
 * login.
 * 
 * @return {string} - The facebook login URL.
 */
function getFacebookLoginUrl() {
  let client = generateFBLoginOAuthClient();
  let loginUrl = client
    .getAuthorizeUrl({
      redirect_uri: FACEBOOK_REDIRECT_URI,
      scope: COS_PERMISSION_SCOPES,
      state: 'Need to see what this does'
    });

  return loginUrl;
}

/**
 * This function associates the access_token with the user's session.
 * 
 * @param code {string} - The code returned from the Facebook server
 * @param session {object} - Session associated with user
 * 
 * @return {Promise} - Rejects itself if an error occurs, simple resolves
 *   otherwise.
 */
function associateRequestTokenWithSession(code, session) {
  let client = new generateFBRequestTokenOAuthClient();
  console.log('HERE');
  let getRequestTokenPromise = new Promise((resolve, reject) => {
    client.getOAuthAccessToken(
      code,
      { redirect_uri: FACEBOOK_REDIRECT_URI },
      (error, accessToken, refreshToken, results) => {
  console.log('HERE');
        if (error || results.error) {
  console.log('ERROR');
          reject(error || results.error);
        }

  console.log('NO ERROR');
        session.facebookAccessToken = accessToken;
        session.facebookRefreshToken = refreshToken;

        resolve(1);
      }
    );
  });

  return getRequestTokenPromise;
}

facebookClient.getFacebookLoginUrl = getFacebookLoginUrl;
facebookClient.associateRequestTokenWithSession =
  associateRequestTokenWithSession;

module.exports = facebookClient;