import { pbkdf2, randomBytes } from "crypto";

/**
 * Password utility class. Use this for all hashing.
 */
export class PasswordHelper {

    /**
     * Use this method to hash string passwords.
     *
     * @param password - Password to hash
     * @param salt - Salt to hash with
     *
     * @return - Promise that will resolve with the hashed password.
     */
    public static hashPassword(password: string, salt: string): Promise<string> {
        const pepperedPassword = process.env.PEPPER_KEY + password;
        const hashPasswordPromise = new Promise((resolve, reject) => {
            pbkdf2(
                pepperedPassword,
                salt,
                parseInt(process.env.TOTAL_PBKDF2_ITERATIONS, 10),
                parseInt(process.env.PBKDF2_KEY_LENGTH, 10),
                process.env.PBKDF2_HMAC,
                (err, key) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(key.toString("hex"));
                });
        });

        return hashPasswordPromise;
    }

    /**
     * Generates a random salt.
     *
     * @return - Promise that will resolve to random salt.
     */
    public static generateSalt(): Promise<string> {
        process.stdout.write(process.env.SALT_LENGTH + "\n");
        const saltPromise = new Promise((resolve, reject) => {
            randomBytes(
                parseInt(process.env.SALT_LENGTH, 10),
                (err, salt) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(salt.toString("hex"));
                });
        });

        return saltPromise;
    }

    /**
     * This class should never be instantiated.
     */
    private constructor() {
        return;
    }
}
