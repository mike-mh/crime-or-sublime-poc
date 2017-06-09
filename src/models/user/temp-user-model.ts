import { Document, model, Model, Schema } from "mongoose";
import "rxjs/add/observable/fromPromise";
import "rxjs/add/operator/mergeMap";
import { Observable } from "rxjs/Observable";
import { CoSServerConstants } from "./../../cos-server-constants";
import { AuthenticationEmailer } from "./../../libs/authentication/authentication-emailer";
import { PasswordHelper } from "./../../libs/authentication/password-helper";
import { RegistrationHelper } from "./../../libs/authentication/registration-helper";
import { CoSAbstractModel } from "./../cos-abstract-model";
import { ITempUserDocument, IUserDocument, TempUserModelSchema } from "./../cos-model-constants";
import { UserModel } from "./user-model";

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
     * Getter for the model.
     */
    public getModel(): Model<ITempUserDocument> {
        return this.model;
    }

    /**
     * Register new user to DB.
     *
     * @param username - New username.
     * @param email - New email.
     * @param password - New password.
     *
     * @return - Resolving Observable that chains any occuring errors.
     */
    public createTempUser(username: string, email: string, password: string): Observable<void> {

        return this.emailAndUsernameAreUnique(username, email)
            .flatMap(() => {
                return RegistrationHelper.generateRegistrationKey(username, email);
            })
            .flatMap((key: string) => {
                return PasswordHelper.generateSalt().flatMap((salt) => {
                    return PasswordHelper.hashPassword(password, salt).flatMap((hashedPassword: string) => {
                        return this.saveDocument({
                            email,
                            password: hashedPassword,
                            registrationKey: key,
                            salt,
                            username,
                        }).flatMap(() => {
                            return AuthenticationEmailer
                                .sendAuthenticationEmail(email, username, key);
                        });
                    });
                });
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
    public registerUser(username: string, registrationKey: string): Observable<void> {

        return this.getDocument({ username, registrationKey })
            .flatMap((tempUser: ITempUserDocument) => {
                return this.commitUserData(
                    tempUser.email,
                    tempUser.password,
                    tempUser.salt,
                    tempUser.username);
            })
            .flatMap(() => {
                return this.removeDocuments({ username, registrationKey });
            });

    }

    /**
     * Use this to ensure a username and email are unique.
     *
     * @param username - Username to check.
     * @param email - Email to check.
     *
     * @return - Observable that that triggers error if it occurs. Otherwise
     *     just resolves.
     */
    private emailAndUsernameAreUnique(username: string, email: string): Observable<void> {
        const userModel = new UserModel();

        return this.getDocuments({ $or: [{ email }, { username }] })
            .flatMap((tempDocuments: ITempUserDocument[]) => {
                if (tempDocuments.shift()) {
                    throw CoSServerConstants.DATABASE_USER_IDENTIFIER_TAKEN_ERROR;
                }

                return userModel.getDocuments({ $or: [{ email }, { username }] })
                    .map((userDocuments: IUserDocument[]) => {
                        if (userDocuments.shift()) {
                            throw CoSServerConstants.DATABASE_USER_IDENTIFIER_TAKEN_ERROR;
                        }
                    });
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
     * @return - Observable that resolves to the user document.
     */
    private commitUserData(
        email: string,
        password: string,
        salt: string,
        username: string): Observable<IUserDocument> {
        const user = new UserModel();

        return Observable.fromPromise(
            new (user.getModel())({
                email,
                lastLogin: new Date(),
                password,
                salt,
                username,
            }).save((error) => {
                if (error) {
                    throw CoSServerConstants.DATABASE_SAVE_ERROR;
                }
            }));

    }
}
