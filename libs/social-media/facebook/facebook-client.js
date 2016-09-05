'use strict';

let OAuth2 = require('oauth').OAuth2;
let querystring = require('querystring');

const FACEBOOK_REDIRECT_URI =
  'https://crime-or-sublime.herokuapp.com/fb-redirect';

const FACEBOOK_URL = 'https://www.facebook.com';
const FACEBOOK_GRAPH_URL = 'https://graph.facebook.com';
const FACEBOOK_AUTHROIZE_PATH = '/dialog/oauth';
const FACEBOOK_ACCESS_TOKEN_PATH = '/v2.7/oauth/access_token';
const FACEBOOK_SHARE_PATH = '/dialog/share';

const COS_PERMISSION_SCOPES = ['public_profile', 'email', 'publish_actions'];

function FacebookClient() { }

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
function associateAccessTokenWithSession(code, session) {
  let client = new generateFBRequestTokenOAuthClient();
  let getAccessTokenPromise = new Promise((resolve, reject) => {
    client.getOAuthAccessToken(
      code,
      { redirect_uri: FACEBOOK_REDIRECT_URI },
      (error, accessToken, refreshToken, results) => {
        if (error || results.error) {
          reject(error || results.error);
        }

        session.facebookAccessToken = accessToken;
        session.facebookRefreshToken = refreshToken;

        resolve(1);
      }
    );
  });

  return getAccessTokenPromise;
}

/**
 * Use this function to generate a URL to allow a user to share the page og a
 * certain graffiti.
 * 
 * TO-DO: Still need to work in 'likes' and other actions after app is approved
 *        by Facebook. Also, this is preliminary. Should have more functionlity
 *        soon.
 * 
 * @return {string} - URL for user to share image and login if necessarry.
 */
function generateShareUrl() {
  let shareParams = {
    app_id: '1111086175633223',
    display: 'popup',
    redirect_uri: 'https://crime-or-sublime.herokuapp.com',
    href: 'https://crime-or-sublime.herokuapp.com'    
  };

  let shareUrl = FACEBOOK_URL +
                 FACEBOOK_SHARE_PATH + '?' +
                 querystring.stringify(shareParams);
  
  return shareUrl;
}

FacebookClient.getFacebookLoginUrl = getFacebookLoginUrl;
FacebookClient.generateShareUrl = generateShareUrl;
FacebookClient.associateAccessTokenWithSession =
  associateAccessTokenWithSession;

module.exports = FacebookClient;