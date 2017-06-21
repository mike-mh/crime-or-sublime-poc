/**
 * @author Michael Mitchell-Halter
 */

import { pbkdf2, randomBytes } from "crypto";
import "rxjs/add/observable/fromPromise";
import { Observable } from "rxjs/Observable";
import { CoSServerConstants } from "./../../cos-server-constants";

/**
 * Use this class to hold common hasing functions used by other tools.
 */
export abstract class HashHelper {

    /**
     * Generates a random salt.
     *
     * @return - Observable to resolves to random salt or throws an error.
     */
    public static generateSalt(): Observable<string> {
        return Observable.fromPromise(
            new Promise((resolve, reject) => {
                randomBytes(
                    parseInt(process.env.SALT_LENGTH, 10),
                    (err, salt) => {
                        if (err) {
                            // Async calls must use reject. Can't use 'throw'.
                            reject(CoSServerConstants.SALT_GENERATION_ERROR);
                        }
                        resolve(salt.toString("hex"));
                    });
            }));
    }

    /**
     * Use this function to generate a pbkdf2 hash.
     *
     * @param input - The input to be hashed.
     * @param salt - The salt to be used for hashing.
     *
     * @return - Observable that resolves to generated hash or throws an
     *     error.
     */
    public static generatePbkdf2Hash(input: string, salt: string): Observable<string> {

        return Observable.fromPromise(
            new Promise((resolve, reject) => {
                pbkdf2(
                    input,
                    salt,
                    parseInt(process.env.TOTAL_PBKDF2_ITERATIONS, 10),
                    parseInt(process.env.PBKDF2_KEY_LENGTH, 10),
                    process.env.PBKDF2_HMAC,
                    (err, key) => {
                        if (err) {
                            reject(CoSServerConstants.PBKDF2_HASH_ERROR);
                        }
                        resolve(key.toString("hex"));
                    });
            }));
    }
}
