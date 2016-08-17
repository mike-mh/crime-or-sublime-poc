'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;
let authenticationCtrl = require('../controllers/authentication');

let userSchema = new Schema(
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
    favourites: [ObjectId],
    password: {
      type: String,
      required: true,
      select: false,
    },
    salt: {
      type: String,
      required: true,
      select: false
    },
    createdAt: {
      type: Date,
      default: Date.now
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
function emailAndUsernameAreUnique(username, email)
{
  return new Promise((resolve, reject) => {
    this
      .find({ $or: [{ email: email }, { username: username }] })
      .then((users) => {
        if (users.length > 0) {
          reject('Username or email are already taken.');
        }
        resolve(true);
      })
      .catch((err) => {
        reject('Error occured looking through usernames and emails.')});
  });
}

/**
 * Ensures that the username or email passed in by the user exist in the
 * database. One of the parameters can be undefined.
 * 
 * @param username {string} - Username  given by user.
 * @param email {string} - Email given by user.
 * 
 * @return {Promise} - Promise resolves with the success flag otherwise
 *   resolves to an error.
 */
function checkUserExists(email)
{
  return new Promise((resolve, reject) => {
    this
      .find({ email: email })
      .then((users) => {
        if (users.length > 0) {
          resolve(true);
        }
        reject('User does not exist');
      })
      .catch((err) => {
        reject('Error occured looking through usernames and emails.')});
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
function getUserSalt(email)
{
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
 * Confirms that passwords match. Assumes email is correct (should change this)
 * 
 * @param email {string} - Email of user logging in.
 * @param hashedPassword {string} 
 * 
 * @return {Promise} - Promise resolves to success flag if given password
 *   matches that which is hashed in the database otherwise resolves to error.
 */
function confirmPasswordsMatch(email, password)
{
  return new Promise((resolve, reject) => {
    this.getUserSalt(email)
      .then((salt) => {
        return authenticationCtrl.hashPassword(password, salt)
      })
      .then((hashedPassword) => {
        return this.find({ email: email }, {password: 1})
          .then((users) => {
            if (users[0].password === hashedPassword) {
              resolve(true);
            }
            reject('Passwords do not match');
          });
      })
      .catch((err) => {
        reject('Error occured looking in database');
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
function registerUser(username, email, password) {
  // When a promise is undefined, the function ends.

  let generatedSalt = '';

  let chainedRegistrationPromise =
    this.emailAndUsernameAreUnique(username, email)
      .then(() => {
        return authenticationCtrl.generateSalt(password);
      })
      .then((salt) => {
        generatedSalt = salt;
        return authenticationCtrl.hashPassword(password, salt);
      })
      .then((hashedPassword) => {
        let newUser = new User({
          username: username,
          email: email,
          password: hashedPassword,
          salt: generatedSalt
        });

        return newUser.save();
      })

      return chainedRegistrationPromise;
}

/**
 * Authenticates user.
 * 
 * @param email {string} - Email given by user.
 * 
 * @return {Promise} - Promise that resolves to the success flag or the error
 *   if one arised
 */
function authenticate(email, password) {
  /* Sanity check */
  let chainedAuthenticationPromise =
    this.checkUserExists(email)
    .then(() => {
      return this.confirmPasswordsMatch(email, password);
    });

    return chainedAuthenticationPromise;
}

userSchema.statics.emailAndUsernameAreUnique = emailAndUsernameAreUnique;
userSchema.statics.registerUser = registerUser;
userSchema.statics.authenticate = authenticate;
userSchema.statics.checkUserExists = checkUserExists;
userSchema.statics.getUserSalt = getUserSalt;
userSchema.statics.confirmPasswordsMatch = confirmPasswordsMatch;

let User = mongoose.model('User', userSchema);

module.exports = User;