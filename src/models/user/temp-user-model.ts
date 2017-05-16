import { Document, model, Model, Schema } from "mongoose";
import { PasswordHelper } from "./../../libs/authentication/password-helper";
import { RegistrationHelper } from "./../../libs/authentication/registration-helper";
import { CoSAbstractModel } from "./../cos-abstract-model";
import { StaticMethodTupleIndices } from "./../cos-model-constants";
import { UserModel } from "./user-model";

/**
 * Document implementation for TempUser.
 */
interface ITempUserModel extends Document {
    email: string;
    password: string;
    registrationKey: string;
    salt: string;
    username: string;
}

export class TempUserModel extends CoSAbstractModel {
    protected model: Model<ITempUserModel>;

    private readonly TEMP_USER_EXPIRATION_TIME: number = 60 * 60 * 60;

    constructor() {
        super("TempUser");
        this.generateSchema();
        this.generateModel();
    }

    /**
     * Register new user to DB.
     *
     * @param username - New username.
     * @param email - New email.
     * @param password - New password.
     *
     * @return - Void resolving promise.
     */
    public createTempUser(username: string, email: string, password: string): Promise<void> {

        let generatedSalt: string;
        let registrationKey: string;

        return this.emailAndUsernameAreUnique(username, email)
            .then(() => {
                return RegistrationHelper.generateRegistrationKey(
                    username,
                    email,
                );
            })
            .then((key) => {
                registrationKey = key;
            })
            .then(() => {
                return RegistrationHelper.generateSalt();
            })
            .then((salt) => {
                generatedSalt = salt;
                return PasswordHelper.hashPassword(password, salt);
            })
            .then((hashedPassword) => {
                return new (this.getModel())({
                    email,
                    password: hashedPassword,
                    registrationKey,
                    salt: generatedSalt,
                    username,
                }).save();

                /*                    let newUser = new TempUser({
                                        email: email,
                                        password: hashedPassword,
                                        registrationKey: registrationKey,
                                        salt: generatedSalt,
                                        username: username,
                                    });
                                    return newUser.save();*/
            })
            .then((model) => {

            });
        /* TO-DO: Implement emailer
        .then(() => {
            console.log('emailing');
            //authenticationEmailer.sendRegistrationEmail(email, username, registrationKey);
        });*/

    }

    /**
     * Register user credentials from TempUser to User. Remove the TempUser
     * document when finished.
     *
     * @param email - The email to be registered
     * @param registrationKey  - The registrationKey assigned to user.
     *
     * @return - Void resolving promise.
     */
    public registerUser(email: string, registrationKey: string): Promise<void> {

        return this.getModel()
            .find({ email, registrationKey })
            .then((users) => {
                if (users.length) {
                    return users.shift();
                }
                throw new Error("User does not exist");
            })
            .then((tempUser) => {
                console.log("Saving.");
                const newUser = new UserModel();
                return new (newUser.getModel())({
                    email: tempUser.email,
                    password: tempUser.password,
                    salt: tempUser.salt,
                    username: tempUser.username,
                }).save();
            })
            .then(() => {
                console.log("Removing.");
                return this.getModel()
                    .remove({ email, registrationKey });
            });

    }

    /**
     * Getter for the model.
     */
    public getModel(): Model<ITempUserModel> {
        return this.model;
    }

    /**
     * Generate the schema. See docs for more details.
     */
    protected generateSchema(): void {
        this.schema = new Schema(
            {
                createdAt: {
                    default: Date.now,
                    expires: this.TEMP_USER_EXPIRATION_TIME,
                    type: Date,
                },
                email: {
                    required: true,
                    type: String,
                    unique: true,
                },
                password: {
                    required: true,
                    type: String,
                },
                registrationKey: {
                    required: true,
                    type: String,
                    unique: true,
                },
                salt: {
                    required: true,
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
    }

    /**
     * Use this to ensure a username and email are unique.
     *
     * @param username - Username to check.
     * @param email - Email to check.
     *
     * @return - Promise resolves to boolean 'true'.
     */
    private emailAndUsernameAreUnique(username: string, email: string): Promise<boolean> {
        const User = new UserModel().getModel();
        return new Promise((resolve, reject) => {
            User.find({ $or: [{ email }, { username }] })
                .then((users) => {
                    if (users.length) {
                        reject("Username or email are already taken.");
                    }
                })
                .then(() => {
                    this.getModel()
                        .find({ $or: [{ email }, { username }] })
                        .then((users) => {
                            if (users.length) {
                                reject("Username or email are already taken.");
                            }
                            resolve(true);
                        });
                });
        });
    }

    /**
     * Get the user's salt.
     *
     * @param email - The email to query
     *
     * @return - Promise resolves to the salt associated with email
     */
    private getUserSalt(email: string) {
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

}
