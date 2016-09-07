'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;
let authentication = require('../libs/authentication/authentication');
let authenticationEmailer = require('../libs/authentication/authentication-emailer');
let User = require('./user');

// This is set for one hour. Could change in the future.
const TEMP_USER_EXPIRATION_TIME = 60 * 60 * 60;

let tempUserSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true
    },
    username: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
    registrationKey: {
      type: String,
      required: true,
      unique: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: TEMP_USER_EXPIRATION_TIME
    }
  },
  {
    minimize: false
  });

/**
 * Use this function to ensure the username and email a user passed in are
 * unique.
 * 
 * @param username {string} - Username  given by user.
 * @param email {string} - Email given by user.
 * 
 * @return {promise} - Promise resolves to true if username and email are
 *   unique is otherwise rejected.
 */
function emailAndUsernameAreUnique(username, email) {
  let tempUser = this;

  return new Promise((resolve, reject) => {
    User
      .find({ $or: [{ email: email }, { username: username }] })
      .then((users) => {
        if (users.length > 0) {
          reject('Username or email are already taken.');
        }
      })
      .then(() => {
        tempUser
          .find({ $or: [{ email: email }, { username: username }] })
          .then((users) => {
            if (users.length > 0) {
              reject('Username or email are already taken.');
            }
            resolve(1);
          })
      })
  });
}

/**
 * Get the users password salt.
 * 
 * @param email {string} - The users email.
 * 
 * @return {Promise} - Promise resolves to the salt associated with the user or
 *   error message should one occur.
 */
function getUserSalt(email) {
  return new Promise((resolve, reject) => {
    this
      .find({ email: email }, { salt: 1 })
      .then((users) => {
        if (users.length > 0) {
          resolve(users[0].salt);
        }
        reject('User does not exist');
      })
      .catch((err) => {
        reject('Error occured looking for salt');
      });
  });
}

/**
 * Register user to DB. Adds username, password and salt.
 * 
 * @param username {string} - Username  given by user.
 * @param email {string} - Email given by user.
 * @param password {string} - Password given by user.
 * 
 * @return {Promise} - Promise resolves with the success flag otherwise
 *   resolves to an error.
 */
function createTempUser(username, email, password) {

  let generatedSalt;
  let registrationKey;

  let chainedRegistrationPromise =
    this.emailAndUsernameAreUnique(username, email)
      .then(() => {
        return authentication.generateRegistrationKey(
          username,
          email
        );
      })
      .then((key) => {
        registrationKey = key;
      })
      .then(() => {
        return authentication.generateSalt();
      })
      .then((salt) => {
        generatedSalt = salt;
        return authentication.hashPassword(password, salt);
      })
      .then((hashedPassword) => {
        let newUser = new TempUser({
          username: username,
          email: email,
          password: hashedPassword,
          salt: generatedSalt,
          registrationKey: registrationKey
        });
        console.log('saving');
        return newUser.save();
      })
      .then(() => {
        console.log('emailing');
        authenticationEmailer.sendRegistrationEmail(email, username, registrationKey);
      });

  return chainedRegistrationPromise;
}

/**
 * Register user credentials from TempUser to User. Remove the TempUser
 * document when finished. This executes after user clicks the registartion
 * link in their email.
 * 
 * @param username {string} - The username of user to be registered
 * @param registrationKey {string} - The registrationKey assigned to user.
 *   Becomes useless after the user is registered.
 * 
 * @return {Promise} - Promise resolves with the success flag otherwise
 *   resolves to an error.
 */
function registerUser(username, registrationKey) {

  let chainedRegistrationPromise = this
    .find({ username: username, registrationKey: registrationKey })
    .then((users) => {
      console.log('here');
      console.log(users)
      if (users.length > 0) {
        return users[0];
      }
      throw new Error('User does not exist');
    })
    .then((tempUser) => {
      console.log(JSON.stringify(tempUser));
      console.log('here');
      let newUser = new User({
        username: tempUser.username,
        email: tempUser.email,
        password: tempUser.password,
        salt: tempUser.salt
      });

      return newUser.save();
    })
    .then(() => {
      this
        .remove({ username: username, registrationKey: registrationKey });
    });

  return chainedRegistrationPromise;
}


tempUserSchema.statics.emailAndUsernameAreUnique = emailAndUsernameAreUnique;
tempUserSchema.statics.createTempUser = createTempUser;
tempUserSchema.statics.registerUser = registerUser;
tempUserSchema.statics.getUserSalt = getUserSalt;

let TempUser = mongoose.model('TempUser', tempUserSchema);

module.exports = TempUser;

