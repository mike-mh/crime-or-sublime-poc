'use strict';

// This many iterations really slows down process...
let TOTAL_ITERATIONS = 100000;
let DIGEST = 'sha256'
let KEY_LENGTH = 256;
let SALT_LENGTH = 32;

let crypto = require('crypto');

/**
 * Hash a given password and execute operation with derived key. Also adds
 * pepper to the password before it is hashed. Uses PBKDF2.
 * 
 * @param password {string} - Password given by user
 * @param salt {string} - Salt associated with user
 * 
 * @return {promise} - Promise will resolve with either the hashed password or
 *   an error message.
 */
function hashPassword(password, salt) {
  let pepperedPassword = process.env.PEPPER_KEY + password;
  let hashPasswordPromise = new Promise((resolve, reject) => {
    crypto.pbkdf2(
      pepperedPassword,
      salt,
      TOTAL_ITERATIONS,
      KEY_LENGTH,
      DIGEST,
      (err, key) => {
        if (err) {
          reject(err);
        }
        resolve(key.toString('hex'));
      });
  });

  return hashPasswordPromise;
}

/**
 * Hash a given username and email into a unique registration key to use operation
 * confirm a user has received a registration email.
 * 
 * @param username {string} - Password given by user
 * @param email {string} - Password given by user
 * @param salt {string} - Salt associated with user
 * 
 * @return {promise} - Promise will resolve with either the hashed registration
 *   key or an error message.
 */
function hashNewUserRegistrationKey(username, email, salt) {
  let pepperedUsernameAndEmail = process.env.PEPPER_KEY + username + email;
  let hashRegistrationKeyPromise = new Promise((resolve, reject) => {
    crypto.pbkdf2(
      pepperedUsernameAndEmail,
      salt,
      TOTAL_ITERATIONS,
      KEY_LENGTH,
      DIGEST,
      (err, key) => {
        if (err) {
          reject(err);
        }
        resolve(key.toString('hex'));
      });
  });

  return hashRegistrationKeyPromise;
}


/**
 * Generate a new salt for a user.
 * 
 * @return {promise} - Promise will resolve with the generated salt or an error
 *   message.
 */
function generateSalt() {
  let saltPromise = new Promise((resolve, reject) => {
    crypto.randomBytes(
      SALT_LENGTH,
      (err, salt) => {
        if (err) {
          reject(err);
        }
        resolve(salt.toString('hex'));
      });
  });

  return saltPromise;
}

/**
 * Generates a registration key to be stored in temporary user which is then
 * sent to the user in a redirect email to confirm registration. Uses the users
 * username and email to generate a key and hashes using salt and pepper.
 * 
 * @param username {string} - Username given by user
 * @param email {string} - Email given by user
 * 
 * @return {Promise} - Resolves to error should one occur. Otherwise, simply
 *   resolves.
 */
function generateRegistrationKey(username, email) {
  let createRegistrationKeyPromise =
    generateSalt()
      .then((salt) => {
        return hashNewUserRegistrationKey(username, email, salt);
      });

  return createRegistrationKeyPromise;
}

module.exports.hashPassword = hashPassword;
module.exports.generateSalt = generateSalt;
module.exports.generateRegistrationKey = generateRegistrationKey;