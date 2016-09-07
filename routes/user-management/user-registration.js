'use strict';

let validator = require('validator');
let path = require('path');
let bodyParser = require('body-parser');
let jsonParser = bodyParser.json();

let User = require('../../models/user');
let TempUser = require('../../models/temp-user');
let ReCaptchaClient = require('../../libs/authentication/recaptcha');

const REGISTER_USER_PATH = '/register-user';
const CONFIRM_USER_REGISTRATION_PATH =
  '/confirm-user-registration/:username/:registrationKey';

function registerUserCallback(req, res) {

  let params = req.body.params;
  console.log(req.body);

  if (params === undefined) {
    res.json({ error: { code: -500, message: 'No data received', id: 'id' } });
    return;
  }

  let email = params.email;
  let username = params.username;
  let password = params.password;
  let reCaptchaResponse = params.reCaptchaResponse;

  if (!email) {
    res.json({ error: { code: -500, message: 'No email given', id: 'id' } });
    return;
  }

  else if (!username) {
    res.json({ error: { code: -500, message: 'No username received', id: 'id' } });
    return;
  }

  else if (!password) {
    res.json({ error: { code: -500, message: 'No password given', id: 'id' } });
    return;
  }

  else if (!reCaptchaResponse) {
    res.json({ error: { code: -500, message: 'No reCAPTCHA response given', id: 'id' } });
    return;
  }

  // Verify email address
  if (!validator.isEmail(email)) {
    res.json({error: {message: 'AN ERROR: Invalid email address'}});
    return;
  }


  // Verify that user completed the recaptcha successfully then register.
  let verificationPromise =
    ReCaptchaClient
      .verifyRecaptchaSuccess(reCaptchaResponse)
        .then(() => {
          console.log('OUT!');
          return TempUser.createTempUser(username, email, password);
        });

  verificationPromise
    .then(() => res.json({message: 'success'}))
    .catch((err) => res.json({error: {message: 'AN ERROR: ' + err}}));
}

function confirmUserRegistration(req, res) {
  let username = req.params.username;
  let registrationKey = req.params.registrationKey;

  let registrationPromise = TempUser.registerUser(username, registrationKey);

  registrationPromise
    .then(() => {res.redirect('https://crime-or-sublime.herokuapp.com')})
    .catch((error) => {res.json({error: error})});
}

module.exports = function (router) {
  router.post(REGISTER_USER_PATH, jsonParser, registerUserCallback);
  router.get(CONFIRM_USER_REGISTRATION_PATH, confirmUserRegistration)
}