'use strict';

let https = require('https');
let querystring = require('querystring');

function ReCaptchaClient() { }

const RECAPTCHA_VERIFY_URL = 'www.google.com';
const RECAPTCHA_VERIFY_PATH = '/recaptcha/api/siteverify';

/**
 * This issues the reCaptcha request and verifies that user completed the
 * reCaptcha task correctly.
 * 
 * @param recaptchaResponse {string} - Response from reCaptcha server.
 * 
 * @return {Promise} - Resolves to error should any occur. Otherwise simply
 *   resolves.
 */
function verifyRecaptchaSuccess(recaptchaResponse) {
  let responseData = '';
  let requestParams = querystring.stringify({
    secret: process.env.RECAPTCHA_SECRET,
    response: recaptchaResponse
  });

  let options = {
    host: RECAPTCHA_VERIFY_URL,
    port: 443,
    path: RECAPTCHA_VERIFY_PATH + '?' + requestParams,
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }

  let reCaptchaVerificationPromise = new Promise((resolve, reject) => {

    let request = https.request(options, (response) => {
      response.on('data', (chunk) => {
        console.log(chunk);
        responseData += chunk;
      });

      response.on('end', () => {
        console.log(responseData);
        let responseJson = JSON.parse(responseData);
        if (responseJson.success) {
          resolve(1);
        }
        console.log(recaptchaResponse);
        reject('Failed to verify user.');
      });
    });

    request.on('error', (error) => {
      reject(error);
    });

    request.end();

  });

  return reCaptchaVerificationPromise;
}

ReCaptchaClient.verifyRecaptchaSuccess = verifyRecaptchaSuccess;

module.exports = ReCaptchaClient;