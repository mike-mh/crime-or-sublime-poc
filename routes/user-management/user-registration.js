'use strict';

let validator = require('validator');
let path = require('path');
let bodyParser = require('body-parser');
let jsonParser = bodyParser.json();

let User = require('../../models/user');
let authenticationCtrl = require('../../libs/authentication/authentication');

const REGISTER_USER_URL = '/register-user';
const REGISTRATION_PAGE_URL = '/registration-page';

function registerUserCallback(req, res) {
  let mxResponse;
  let mxError;

  let params = req.body.params;
  console.log(req.body);

  if (params === undefined) {
    res.json({ error: { code: -500, message: 'No data received', id: 'id' } });
    return;
  }

  let email = params.email;
  let username = params.username;
  let password = params.password;

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

  console.log(email)

  // Verify email address
  if (!validator.isEmail(email)) {
    res.json({error: {message: 'AN ERROR: Invalid email address'}});
    return;
  }

  // Ensure username and email doesn't exist then register. A bit smelly and
  // could probably refactor
  let registrationPromise = User.registerUser(username, email, password);

  registrationPromise
    .then(() => res.json({message: 'success'}))
    .catch((err) => res.json({error: {message: 'AN ERROR: ' + err}}));
}

function getRegistrationPageCallback(req, res) {
  res.sendFile(path.join(__dirname + '/../../public/compiled_app/user-management/register-user/register-user.component.html'));
}

module.exports = function (router) {
  router.get(REGISTRATION_PAGE_URL, getRegistrationPageCallback);
  router.post(REGISTER_USER_URL, jsonParser, registerUserCallback);
}