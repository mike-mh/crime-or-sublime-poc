'use strict';

let https = require('https');

const POSTMARK_URL = 'api.postmarkapp.com';
const POSTMARK_SEND_EMAIL_PATH = '/email';
const REGISTRATION_EMAIL_ADDRESS = 'registration@crimeorsublime.com';


function AuthenticationEmail() { }

/**
 * Use to send a registration email to a user after they have successfully
 * registered.
 * 
 * @param toEmail {string} - Destination email for registration URL
 * @param username {string} - The username selected by user. Required for
 *   registration URL.
 * @param registrationKey {string} - The registration key to use in URL to send
 *   to user for their verification
 * 
 * @return {Promise} - Promise resolves to error should one occur. Otherwise,
 *   simply resolves.
 */
function sendRegistrationEmail(toEmail, username, registrationKey) {
  console.log('Sending email');
  let options = {
    host: POSTMARK_URL,
    port: 443,
    path: POSTMARK_SEND_EMAIL_PATH,
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Postmark-Server-Token': process.env.POSTMARK_KEY
    }
  }

  let request = https.request(options, (response) => {
    response.on('data', (chunk) => {
      console.log(chunk);
    });
  });

  request.on('error', (error) => {
    console.log(error);
  });

  request.write(JSON.stringify({
    From: REGISTRATION_EMAIL_ADDRESS,
    To: toEmail,
    Subject: 'Welcome ' + username + '!',
    HtmlBody: '<h1>Hey ' + username + '!</h1><br>' +
     'Click here to officially register: ' +
     '<a href="https://crime-or-sublime.herokuapp.com/confirm-user-registration/' +
     username + '/' + registrationKey + '"/> REGISTER </a><br>' +
     '<p>Please don\'t respond to this email.</p>'
  }));

  request.end();
}

AuthenticationEmail.sendRegistrationEmail = sendRegistrationEmail;

module.exports = AuthenticationEmail;