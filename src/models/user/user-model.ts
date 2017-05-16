import { Document, Model, Schema } from "mongoose";
import { PasswordHelper } from "./../../libs/authentication/password-helper";
import { CoSAbstractModel } from "./../cos-abstract-model";
import { StaticMethodTupleIndices } from "./../cos-model-constants";

/**
 * Document implementation fro User.
 */
interface IUserDocument extends Document {
    createdAt: Date;
    email: string;
    favourites: [Schema.Types.ObjectId];
    password: string;
    salt: string;
    username: string;
}

/**
 * This model will hold the users information. It is responsible for holding
 * verification information as well as profile data (may want to think about
 * creating a model for user profiles instead).
 */
export class UserModel extends CoSAbstractModel {

    protected model: Model<IUserDocument>;

    constructor() {
        super("user");
        this.generateSchema();
        this.generateStaticMethods();

        for (const index in this.staticMethods) {
            if (this.staticMethods[index]) {
                const methodTuple = this.staticMethods[index];
                this.installStaticMethod(methodTuple[StaticMethodTupleIndices.Name],
                    methodTuple[StaticMethodTupleIndices.Method]);
            }
        }

        this.generateModel();
    }

    /**
     * Simple getter for the model.
     *
     * @return - The mongoose user model object.
     */
    public getModel(): Model<IUserDocument> {
        throw new Error("Method not implemented.");
    }

    /**
     * User schema information can be found in documentation.
     */
    protected generateSchema(): void {
        this.schema = new Schema(
            {
                createdAt: {
                    default: Date.now,
                    type: Date,
                },
                email: {
                    required: true,
                    type: String,
                    unique: true,
                },
                favourites: [Schema.Types.ObjectId],
                password: {
                    required: true,
                    select: false,
                    type: String,
                },
                salt: {
                    required: true,
                    select: false,
                    type: String,
                },
                username: {
                    required: true,
                    type: String,
                    unique: true,
                },
            },
            {
                minimize: false,
            });

        return;
    }

    /**
     * Generate all static methods for the model and stage them into the
     * staticMethods array.
     */
    protected generateStaticMethods(): void {

        /**
         * Authenticates user.
         *
         * @param email - User email
         * @param password - User password
         *
         * @return - Promise that resolves to boolean value 'true'. Should
         *     consider changing this.
         */
        const authenticate = (email: string, password: string) => {
            return this.checkUserExists(email)
                .then(() => {
                    return this.confirmPasswordsMatch(email, password);
                });

        };

        this.staticMethods.push(["authenticate", authenticate]);
    }

    /**
     * This class doesn't have any methods right now. Do nothing.
     */
    protected generateMethods(): void {
        return;
    }

    /**
     * Get the users password salt.
     *
     * @param email {string} - The user's email.
     *
     * @return - Promise resolves to salt
     */
    private getUserSalt(email: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.getModel()
                .find({ email }, { salt: 1 })
                .then((users) => {
                    if (users.length) {
                        resolve(users.shift().salt);
                    }
                    reject("User does not exist");
                })
                .catch((err) => {
                    reject("Error occured looking for salt");
                });
        });
    }

    /**
     * Ensures an email exists in the database. May change to include usernames
     * as well in the future.
     *
     * @param email - Email given by user.
     *
     * @return - Promise resolves with boolean 'true'
     */
    private checkUserExists(email: string) {
        return new Promise((resolve, reject) => {
            this.getModel()
                .find({ email })
                .then((users) => {
                    if (users.length > 0) {
                        resolve(true);
                    }
                    reject("User does not exist");
                })
                .catch((err) => {
                    reject("Error occured looking through usernames and emails.");
                });
        });
    }

    /**
     * Confirms that passwords match. Assumes email is correct (should change this)
     *
     * @param email - Email of user logging in.
     * @param password - Hashed password.
     *
     * @return - Promise resolves to boolean value 'true' if passwords
     *     match. Should consider changing this.
     */
    private confirmPasswordsMatch = (email: string, password: string) => {
        return new Promise((resolve, reject) => {
            this.getUserSalt(email)
                .then((salt) => {
                    return PasswordHelper.hashPassword(password, salt);
                })
                .then((hashedPassword) => {
                    return this.getModel()
                        .find({ email }, { password: 1 })
                        .then((users) => {
                            if (users.shift().password === hashedPassword) {
                                resolve(true);
                            }
                            reject("Passwords do not match");
                        });
                })
                .catch((err) => {
                    reject("Error occured looking in database");
                });
        });
    }
}
