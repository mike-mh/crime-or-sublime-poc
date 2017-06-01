import { Document, model, Model, Schema } from "mongoose";
import { CoSServerConstants } from "./../../cos-server-constants";
import { AuthenticationEmailer } from "./../../libs/authentication/authentication-emailer";
import { PasswordHelper } from "./../../libs/authentication/password-helper";
import { RegistrationHelper } from "./../../libs/authentication/registration-helper";
import { CoSAbstractModel } from "./../cos-abstract-model";
import { TempUserModelSchema } from "./../cos-model-constants";
import { UserModel, IUserDocument } from "./user-model";

/**
 * Document implementation for TempUser.
 */
interface ITempUserDocument extends Document {
    email: string;
    password: string;
    registrationKey: string;
    salt: string;
    username: string;
}

export class TempUserModel extends CoSAbstractModel {
    protected model: Model<ITempUserDocument>;

    // Temporary users only exist for about an hour.
    private readonly TEMP_USER_EXPIRATION_TIME: number = 60 * 60;

    constructor() {
        super("TempUser");
        this.schema = TempUserModelSchema;
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
                return PasswordHelper.generateSalt();
            })
            .then((salt) => {
                generatedSalt = salt;
                return PasswordHelper.hashPassword(password, salt);
            })
            .then((hashedPassword) => {
                return this.commitTempUserData(
                    email,
                    hashedPassword,
                    registrationKey,
                    generatedSalt,
                    username
                );
            })
            .then((model) => {
                return AuthenticationEmailer.sendAuthenticationEmail(email, username, registrationKey);
            });
    }

    /**
     * Getter for the model.
     */
    public getModel(): Model<ITempUserDocument> {
        return this.model;
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

                throw CoSServerConstants.DATABASE_USER_REGISTRATION_CONFIRMATION_ERROR;
            })
            .then((tempUser) => {
                const newUser = new UserModel();
                return this.commitUserData(
                    newUser,
                    tempUser.email,
                    tempUser.password,
                    tempUser.salt,
                    tempUser.username
                );
            })
            .then(() => {
                return this.getModel()
                    .remove({ username, registrationKey }, (error) => {
                        if (error) {
                            throw CoSServerConstants.DATABASE_DELETION_ERROR;
                        }
                    });
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
                    throw CoSServerConstants.DATABASE_USER_IDENTIFIER_TAKEN_ERROR;
                }

                // Need to check that another user hasn't submitted a new
                // account for registration with provided credentials.
                return this.getModel()
                    .find({ $or: [{ email }, { username }] });
            })
            .then((users) => {
                if (users.length) {
                    throw CoSServerConstants.DATABASE_USER_IDENTIFIER_TAKEN_ERROR;
                }
            });
    }

    /**
     * Use this function to save temp user data to the database.
     * 
     * @param email - The email of the user to save.
     * @param hashedPassword - The hashed password of the user to save.
     * @param registrationKey - The registration key of the user to save.
     * @param salt - The salt of the user to save.
     * @param username - The username of the user to save.
     * 
     * @return - Promise that resolves to the data saved.
     */
    private commitTempUserData(
        email: string,
        password: string,
        registrationKey: string,
        salt: string,
        username: string): Promise<ITempUserDocument> {

        return new (this.getModel())(
            {
                email,
                password,
                registrationKey,
                salt,
                username,
            }).save((error) => {
                if (error) {
                    throw CoSServerConstants.DATABASE_SAVE_ERROR;
                }
            });
    }

    /**
     * Use this function to save permenant user data to the database. This is
     * usually called after a user confirms their registration.
     * 
     * @param email - The email of the user to save.
     * @param hashedPassword - The hashed password of the user to save.
     * @param registrationKey - The registration key of the user to save.
     * @param salt - The salt of the user to save.
     * @param username - The username of the user to save.
     * 
     * @return - Promise that resolves to the data saved.
     */
    private commitUserData(
        user: UserModel,
        email: string,
        password: string,
        salt: string,
        username: string): Promise<IUserDocument> {

        return new (user.getModel())(
            {
                email,
                lastLogin: new Date(),
                password,
                salt,
                username,
            }).save((error) => {
                if (error) {
                    throw CoSServerConstants.DATABASE_SAVE_ERROR;
                }
            });

    }
}
