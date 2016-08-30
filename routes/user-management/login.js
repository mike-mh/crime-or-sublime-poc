'use strict';
//var models = require('../../models/index');
let User = require('../../models/user');
let path = require('path');
let bodyParser = require('body-parser');
let jsonParser = bodyParser.json();

const LOGIN_PAGE_URL = '/login';
const LOGIN_SUBMISSION_URL = '/submit-credentials';

function getLoginPageCallback(req, res)
{
  res.sendFile(path.join(__dirname + '/../../public/compiled_app/user-management/login/login.component.html'));
  console.log(req.session);
}

function submitLoginCredentials(req, res)
{
  let params = req.body.params;

  if (params === undefined) {
    res.json({ error: { code: -500, message: 'No data received', id: 'id' } });
    return;
  }

  let email = params.email;
  let password = params.password;

  // Ensure parameters are set
  if (!email)
  {
    res.json({ error: { code: -500, message: 'Need an email', id: 'id' } });
    return;
  }

  if (!password)
  {
    res.json({ error: { code: -500, message: 'No password received', id: 'id' } });
    return;
  }

  let verificationPromise =
    User.authenticate(email, password)
      .then((messsage) => {
        req.session.email = email;
        res.json({message: 'success'});
      })
      .catch((err) => {res.send('AN ERROR: ' + err + '\n')});
}

module.exports = function(router)
{
  router.get(LOGIN_PAGE_URL, getLoginPageCallback);
  router.post(LOGIN_SUBMISSION_URL, jsonParser, submitLoginCredentials);
}