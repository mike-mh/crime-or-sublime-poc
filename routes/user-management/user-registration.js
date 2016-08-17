'use strict';

let path = require('path');
let bodyParser = require('body-parser');
let jsonParser = bodyParser.json();

let User = require('../../models/user');
let authenticationCtrl = require('../../controllers/authentication');

const REGISTER_USER_URL = '/register-user';
const REGISTRATION_PAGE_URL = '/registration-page';

function registerUserCallback(req, res) {
  let params = req.body.params;

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

  // TO-DO: Email validation goes here.

  // Ensure username and email doesn't exist then register. A bit smelly and
  // could probably refactor
  let registrationPromise = User.registerUser(username, email, password);

  registrationPromise
    .then(() => res.json({message: 'success'}))
    .catch((err) => res.send('AN ERROR: ' + err + '\n'))
    //.error((err) => res.send('A special error: ' + err))


/*  User.find({ $or: [{ email: email }, { userName: username }] }, (err, user) => {
    if (err) {
      res.json({ error: { code: -500, message: 'Could not check email was unique', id: 'id' } });
    }

    if (user.length) {
      res.json({ error: { code: -500, message: 'That email or username is taken', id: 'id' } });
    }
    else {
      let saltPromise = authenticationCtrl.generateSalt(password);
      saltPromise
        .then((salt) => {
          //ok
          let encryptPasswordPromise = authenticationCtrl.hashPassword(password, salt);
          encryptPasswordPromise
            .then((hashedPassword) => {
              var newUser = new User({
                userName: username,
                email: email,
                password: hashedPassword,
                salt: salt
              })
              newUser.save((err, user) => {
                if (err) {
                  res.json({ error: { code: -500, message: 'Error saving user..', id: 'id' } });
                  console.log(err);
                }

                else {
                  res.json({ message: 'success' });
                }
              })
            })
            .catch((err) => { res.json({ error: { code: -500, message: 'Error saving user.', id: 'id' } });
            console.log(err)});

          //ok
        })
        .catch((err) => { res.json({ error: { code: -500, message: 'Failed to save user.', id: 'id' } }); });
    }
  });*/

  //  let test = new User({ userName: username, email: email, });

  //  test.save((err) => { if (err) { console.log(err); } });

  //  console.log(test);

  /*  User.find({}, (err, users) => {
      if (err) {
        console.log('Error: ' + err);
        res.send(err);
      }
  
      console.log(users);
      res.send(users);
    });*/
}

function getRegistrationPageCallback(req, res) {

}

module.exports = function (router) {
  router.get(REGISTRATION_PAGE_URL, getRegistrationPageCallback);
  router.post(REGISTER_USER_URL, jsonParser, registerUserCallback);
}