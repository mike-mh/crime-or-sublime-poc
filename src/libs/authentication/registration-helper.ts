/**
 * @author Michael Mitchell-Halter
 */

import { pbkdf2 } from "crypto";
import "rxjs/add/observable/fromPromise";
import "rxjs/add/operator/mergeMap";
import { Observable } from "rxjs/Observable";
import { HashHelper } from "./hash-helper";

/**
 * This class offers utilities for registering users. Will likely be refactored
 * in the future as needs change.
 */
export class RegistrationHelper extends HashHelper {

    /**
     * Generates a registration key to be stored in a temporary user data
     * structure until user confirms their registration.
     *
     * @param username - Username given by user
     * @param email - Email given by user
     *
     * @return - Observable hashed registration key.
     */
    public static generateRegistrationKey(username: string, email: string): Observable<string> {

        return this.generateSalt().flatMap(
            (salt) => {
                const pepperedUsernameAndEmail = process.env.PEPPER_KEY + username + email;
                return this.generatePbkdf2Hash(pepperedUsernameAndEmail, salt);
            });
    }

    /**
     * This class should never be instantiated.
     */
    private constructor() {
        super();
    }
}
