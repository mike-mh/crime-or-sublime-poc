import { pbkdf2 } from "crypto";
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
     * @return - Promise that will resolve with the hashed password.
     */
    public static hashPassword(password: string, salt: string): Promise<string> {
        return this.generatePbkdf2Hash(password, salt);
    }

    /**
     * This class should never be instantiated.
     */
    private constructor() {
        super();
    }
}
