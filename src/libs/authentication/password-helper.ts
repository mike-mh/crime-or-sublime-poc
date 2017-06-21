/**
 * @author Michael Mitchell-Halter
 */

import { pbkdf2 } from "crypto";
import "rxjs/add/observable/fromPromise";
import { Observable } from "rxjs/Observable";
import { HashHelper } from "./hash-helper";

/**
 * Password utility class. Use this for hashing.
 */
export class PasswordHelper extends HashHelper {

    /**
     * Use this method to hash string passwords.
     *
     * @param password - Password to hash
     * @param salt - Salt to hash with
     *
     * @return - Observable that resolves to the hashed password or to error.
     */
    public static hashPassword(password: string, salt: string): Observable<string> {
        return this.generatePbkdf2Hash(password, salt);
    }

    /**
     * This class should never be instantiated.
     */
    private constructor() {
        super();
    }
}
