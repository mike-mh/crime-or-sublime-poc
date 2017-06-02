import { pbkdf2, randomBytes } from "crypto";
import { CoSServerConstants } from "./../../cos-server-constants";

/**
 * Use this class to hold common hasing functions used by other tools.
 */
export abstract class HashHelper {

    /**
     * Generates a random salt.
     *
     * @return - Promise that will resolve to random salt.
     */
    public static generateSalt(): Promise<string> {
        const saltPromise = new Promise((resolve, reject) => {
            randomBytes(
                parseInt(process.env.SALT_LENGTH, 10),
                (err, salt) => {
                    if (err) {
                        // Async calls must use reject. Can't use 'throw'.
                        reject(CoSServerConstants.SALT_GENERATION_ERROR);
                    }
                    resolve(salt.toString("hex"));
                });
        });

        return saltPromise;
    }

    /**
     * Use this function to generate a pbkdf2 hash.
     *
     * @param input - The input to be hashed.
     * @param salt - The salt to be used for hashing.
     *
     * @return - Promise that resolves to the new hash value
     */
    public static generatePbkdf2Hash(input: string, salt: string): Promise<string> {

        return new Promise((resolve, reject) => {
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
        });
    }
}
