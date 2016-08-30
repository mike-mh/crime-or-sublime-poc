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
 * TO-DO: Iterations seem to slow this significantly. It's an issue that
 *        should be dealt with.
 * 
 * @param password {string} - Password given by user
 * @param salt {string} - Salt associated with user
 * 
 * @return {promise} - Promise will resolve with either they hashed password or
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
 * Generate a new salt for a user.
 * 
 * @param username {string} - The username input by the user.
 * @param password {string} - The password input by the user.
 * 
 * @return {promise} - Promise will resolve with the generated salt or an error
 *   message.
 */
function generateSalt(password) {
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

/*let sampleSalt = 'b399b21eb38b0a6250e68f03b3994708';

let saltPromise = generateSalt('foobar');

saltPromise
  .then((value) => console.log('Here is the salt: ' + value))
  .catch((error) => console.log('An error occured: ' + error));


let hashPromise = hashPassword('foobar', sampleSalt);

hashPromise
  .then((value) => console.log('Here is the hash: ' + value))
  .catch((error) => console.log('An error occured: ' + error));
*/
module.exports.hashPassword = hashPassword;
module.exports.generateSalt = generateSalt;
