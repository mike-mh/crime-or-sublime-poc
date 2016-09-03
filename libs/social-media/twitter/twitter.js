'use strict';

let https = require('https');
let OAuth = require('oauth').OAuth;
let url = require('url');
let bodyParser = require('body-parser')
let jsonParser = bodyParser.json();

const TWITTER_REQUEST_TOKEN_URL =
  'https://api.twitter.com/oauth/request_token';
const TWITTER_ACCESS_TOKEN_URL =
  'https://api.twitter.com/oauth/access_token';
const TWITTER_VERIFY_CREDENTIALS_URL =
  'https://api.twitter.com/1.1/account/verify_credentials.json';
const TWITTER_UPLOAD_MEDIA_URL =
  'https://upload.twitter.com/1.1/media/upload.json';
const TWITTER_UPDATE_URL =
  'https://api.twitter.com/1.1/statuses/update.json';


const COS_URL = 'https://crime-or-sublime.herokuapp.com';
const OAUTH_REDIRECT_PATH = '/twitter-redirect';
const OAUTH_VERSION = '1.0';
const REDIRECT_URL = COS_URL + OAUTH_REDIRECT_PATH;
const ENCRYPTION_ALGORITHIM = 'HMAC-SHA1';


function twitterClient() { }

/**
 * Generates the OAuth client from OAuth library
 * 
 * @return {OAuth} - OAuth object with all needed Twitter configurations
 */
function generateTwitterOAuthClient() {
  return new OAuth(
    TWITTER_REQUEST_TOKEN_URL,
    TWITTER_ACCESS_TOKEN_URL,
    process.env.TWITTER_ID,
    process.env.TWITTER_SECRET,
    OAUTH_VERSION,
    REDIRECT_URL,
    ENCRYPTION_ALGORITHIM
  );
}

/**
 * Use this to associate the OAuth request tokens with a user before they
 * login.
 * 
 * @param session {objec} - Session associated with user
 * 
 * @return {Promise} - Promise resolves to 
 */
function associateRequestTokensWithSession(session) {
  let client = generateTwitterOAuthClient();

  let getRequestTokensPromise = new Promise((resolve, reject) => {
    client.getOAuthRequestToken((error, oauthToken, oauthTokenSecret, results) => {
      if (error) {
        reject(error);
      } else {
        session.twitterOAuthRequestToken = oauthToken;
        session.twitterOAuthRequestTokenSecret = oauthTokenSecret;
        resolve(1);
      }
    });
  });

  return getRequestTokensPromise;
}

/**
 * Use this funciton to associate access tokens to a user session.
 * 
 * @param oAuthVerifier {string} - Verifier returned by Twitter server.
 * @param session {object} - Session associated with user
 * 
 * @return {Promise} - Rejects with an error message if function is unable oauth
 *   get an access token. Otherwise resolves.
 */
function associateAccessTokensWithSession(oAuthVerifier, session) {
  let client = generateTwitterOAuthClient();

  let getAccessTokensPromise = new Promise((resolve, reject) => {
    client.getOAuthAccessToken(
      session.twitterOAuthRequestToken,
      session.twitterOAuthRequestTokenSecret,
      oAuthVerifier,
      (error, oauthAccessToken, oauthAccessTokenSecret, results) => {
        if (error) {
          reject(error);
        }

        session.twitterOAuthAccessToken = oauthAccessToken;
        session.twitterOAuthAccessTokenSecret = oauthAccessTokenSecret;

        let validationPromise = validateCredentials(oAuthVerifier, session);

        validationPromise
          .then(() => { resolve(1); })
          .catch((error) => { reject(error) });
      });
  });
}

/**
 * Use this function to verify credentials associated with a user.
 * 
 * @param oAuthVerified {string} - Verifier received from Twitter
 * 
 * @return {Promise} - Promise resolves to error should one occur. Otherwise,
 *   validation was successful.
 */
function validateCredentials(oAuthVerifier, session) {
  let client = generateTwitterOAuthClient();

  let validationPromise = new Promise((resolve, reject) => {
    client.get(
      TWITTER_VERIFY_CREDENTIALS_URL,
      session.twitterOAuthAccessToken,
      session.twitterOAuthAccessTokenSecret,
      (error, data, response) => {
        if (error) {
          reject(error)
        } else {
          resolve(1);
        }
      });
  });
}

/**
 * Uploads a graffiti image to a twitter account
 * 
 * @param imageUrl {string} - URL to graffiti image on imgur
 * @param session {object} - Session associated with request
 * 
 * @return {Promise} - Promise resolves to Twitter 'media_id' on success
 *   otherwise an error message
 */
function uploadImage(imageUrl, session) {
  let client = generateTwitterOAuthClient();  // The OAuth client
  let imageBinary;                            // Contains image binary
  let totalBytesInImage;                      // Total bytes image holds
  let mediaId;                                // media_id assigned by Twitter
  let retrieveImagePromise;                   // Makes HTTPS request for image
  let initializeUploadPromise;                // Initialize upload to Twitter
  let uploadDataPromise;                      // Uploads binary to Twitter
  let finalizeUploadPromise;                  // Finalizes upload to Twitter
  let urlObject = url.parse(imageUrl);        // URL object parsed from string

  retrieveImagePromise = (resolve, reject) => {
    // Use this to store data retrieved from request. Concat it later into a
    // single buffer with all the data.
    let chunkArray = [];
    let options = {
      host: urlObject.host,
      port: 443,
      path: urlObject.pathname,
      method: 'GET',
    };

    let request = https.request(options, (response) => {
      response.on('data', (chunk) => {
        chunkArray.push(chunk);
      });

      response.on('end', () => {
        totalBytesInImage = chunkArray.reduce(
          (sum, chunk) => { return sum + chunk.length }, 0);
        imageBinary = Buffer.concat(chunkArray);
        resolve(1);
      });
    });

    request.on('error', (error) => { reject(error) });
    request.end();
  };

  initializeUploadPromise = (resolve, reject) => {
    client.post(
      TWITTER_UPLOAD_MEDIA_URL,
      session.twitterOAuthAccessToken,
      session.twitterOAuthAccessTokenSecret,
      {
        command: 'INIT',
        total_bytes: totalBytesInImage,
        media_type: 'image/jpeg',
      },
      (error, data) => {
        if (error) {
          reject(error);
        }

        mediaId = JSON.parse(data).media_id_string;
        console.log(mediaId);
        console.log(totalBytesInImage.toString());
        console.log('RESOLVED ' + JSON.stringify(data));
        resolve(1);
      });
  };

  uploadDataPromise = (resolve, reject) => {
    client.post(
      TWITTER_UPLOAD_MEDIA_URL,
      session.twitterOAuthAccessToken,
      session.twitterOAuthAccessTokenSecret,
      {
        command: 'APPEND',
        media_id: mediaId,
        media_type: 'image/jpeg',
        media_data: imageBinary.toString('base64'),
        segment_index: '0'
      },
      'multipart/form-data',
      (error, data) => {
        if (error) {
          reject(error);
        }
        resolve(1);
      });
  };

  finalizeUploadPromise = (resolve, reject) => {
    client.post(
      TWITTER_UPLOAD_MEDIA_URL,
      session.twitterOAuthAccessToken,
      session.twitterOAuthAccessTokenSecret,
      {
        command: 'FINALIZE',
        media_id: mediaId,
      },
      (error, data) => {
        if (error) {
          reject(error);
        }
        resolve(mediaId);
      });
  };

  return new Promise(retrieveImagePromise)
    .then(() => { return new Promise(initializeUploadPromise); })
    .then(() => { return new Promise(uploadDataPromise); })
    .then(() => { return new Promise(finalizeUploadPromise); });
}

/**
 * Makes a tweet to the users account with the provided graffiti image and
 * text.
 * 
 * TO-DO: Include lat and long for geo-points
 * 
 * @param tweetText {string} - Text to be tweeted with image
 * @param imageUrl {string} - URL of image
 * @param sesssion {object} - Session associated with request
 * 
 * @return {promise} - If promise fails to resolve an error message is
 *   generated.
 */
function makeTweetWithImage(tweetText, imageUrl, session) {
  console.log('READYING REQUEST');
  let client = generateTwitterOAuthClient();
  let uploadImagePromise = uploadImage(imageUrl, session);
  // This value is resolved with the upload promise
  let mediaId;
  let tweetPromise = (resolve, reject) => {
    console.log('POSTING STATUS');
    console.log(mediaId);
    client.post(
      TWITTER_UPDATE_URL,
      session.twitterOAuthAccessToken,
      session.twitterOAuthAccessTokenSecret,
      {
        'status': tweetText,
        'media_ids': mediaId
      },
      (error, data) => {
        if (error) {
          reject(error)
        }
        console.log('RESOLVED ' + JSON.stringify(data));
        resolve(1);
      });
  };

  return uploadImagePromise
    .then((retrievedId) => { mediaId = retrievedId; })
    .then(() => { return new Promise(tweetPromise); });
}

twitterClient.makeTweetWithImage = makeTweetWithImage;
twitterClient.associateRequestTokensWithSession = associateRequestTokensWithSession;
twitterClient.associateAccessTokensWithSession = associateAccessTokensWithSession;

module.exports = twitterClient;