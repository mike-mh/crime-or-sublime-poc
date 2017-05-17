import { Document, model, Model, Schema } from "mongoose";
import { AuthenticationEmailer } from "./../../libs/authentication/authentication-emailer";
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
            })
            .then((model) => {
                return AuthenticationEmailer.sendAuthenticationEmail(email, username, registrationKey);
            });
    }

    /**
     * Register user credentials from TempUser to User. Remove the TempUser
     * document when finished.
     *
     * @param username - The username to be registered
     * @param registrationKey  - The registrationKey assigned to user.
     *
     * @return - Void resolving promise.
     */
    public registerUser(username: string, registrationKey: string): Promise<void> {

        return this.getModel()
            .find({ username, registrationKey })
            .then((users) => {
                if (users.length) {
                    return users.shift();
                }
                throw new Error("User does not exist");
            })
            .then((tempUser) => {
                const newUser = new UserModel();
                return new (newUser.getModel())({
                    email: tempUser.email,
                    password: tempUser.password,
                    salt: tempUser.salt,
                    username: tempUser.username,
                }).save();
            })
            .then(() => {
                return this.getModel()
                    .remove({ username, registrationKey });
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
     * @return - Void resolving promise. Throws error if username or email are
     *     taken.
     */
    private emailAndUsernameAreUnique(username: string, email: string): Promise<void> {
        return new UserModel().getModel()
            .find({ $or: [{ email }, { username }] })
            .then((users) => {
                if (users.length) {
                    throw new Error("Username or email are already taken.");
                }

                return this.getModel()
                    .find({ $or: [{ email }, { username }] });
            })
            .then((users) => {
                if (users.length) {
                    throw new Error("Username or email are already taken.");
                }
            });
    }

    /**
     * Get the user's salt.
     *
     * @param email - The email to query
     *
     * @return - Promise resolves to the salt associated with email
     */
    private getUserSalt(email: string): Promise<string> {
        return this.getModel()
            .find({ email }, { salt: 1 })
            .then((users) => {
                if (users.length) {
                    return users.shift().salt;
                }
                throw new Error("User does not exist.");
            });
    }

}
