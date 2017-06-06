import { Document, model, Model, Schema } from "mongoose";
import "rxjs/add/observable/fromPromise";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";
import { Observable } from "rxjs/Observable";
import { CoSServerConstants } from "./../../cos-server-constants";
import { PasswordHelper } from "./../../libs/authentication/password-helper";
import { CoSAbstractModel } from "./../cos-abstract-model";
import { IUserDocument, UserModelSchema } from "./../cos-model-constants";

/**
 * This model will hold the users information. It is responsible for holding
 * verification information as well as profile data (may want to think about
 * creating a model for user profiles instead).
 */
export class UserModel extends CoSAbstractModel {

    protected model: Model<IUserDocument>;

    constructor() {
        super("User");
        this.schema = UserModelSchema;
        this.generateModel();
    }

    /**
     * Simple getter for the model.
     *
     * @return - The mongoose user model object.
     */
    public getModel(): Model<IUserDocument> {
        return this.model;
    }

    /**
     * Authenticates user.
     *
     * @param email - Email of user to authenticate.
     * @param password - Password of user to authenticate
     *
     * @return - Void resolving promise.
     */
    public authenticate(email: string, password: string): Observable<void> {
        return this.checkUserExists(email)
            .flatMap(() => {
                return this.confirmPasswordsMatch(email, password);
            });
    }

    /**
     * Confirms that passwords match.
     *
     * @param email - Email of user logging in.
     * @param password - Hashed password.
     *
     * @return - Void resolving promise
     */
    public confirmPasswordsMatch(email: string, password: string): Observable<void> {
        return this.getUserSalt(email)
            .flatMap((salt) => {
                return PasswordHelper.hashPassword(password, salt);
            })
            .flatMap((hashedPassword) => {
                return this.getUserPassword(email)
                    .map((userPassword) => {
                        if (userPassword === hashedPassword) {
                            return;
                        }
                        throw CoSServerConstants.DATABASE_USER_INVALID_PASSWORD_ERROR;
                    });
            });
    }

    /**
     * Ensures an email exists in the database. May change to include usernames
     * as well in the future.
     *
     * @param email - Email given by user.
     *
     * @return - Void resolving promise
     */
    public checkUserExists(email: string): Observable<void> {
        return Observable.fromPromise(
            this.getModel()
                .find({ email })
                .then((users) => {
                    if (users.length) {
                        return;
                    }
                    throw CoSServerConstants.DATABASE_USER_DOES_NOT_EXIST_ERROR;
                }));
    }

    /**
     * Get the users password salt.
     *
     * @param email - The user's email.
     *
     * @return - Promise resolves to salt
     */
    private getUserSalt(email: string): Observable<string> {
        return Observable.fromPromise(
            new Promise((resolve, reject) => {
                this.getModel()
                    .find({ email }, { salt: 1 })
                    .then((users) => {
                        if (users.length) {
                            resolve(users.shift().salt);
                        }
                        reject(CoSServerConstants.DATABASE_USER_DOES_NOT_EXIST_ERROR);
                    })
                    .catch((error) => {
                            reject(CoSServerConstants.DATABASE_RETRIEVE_ERROR);
                    });
            }));
    }

    /**
     * Use this to retrieve a user password from the database using an
     * observable instead of a promise.
     *
     * @param email = The user's email
     *
     * @return - Observable that resolves to the targeted user document.
     */
    private getUserPassword(email: string): Observable<string> {
        return Observable.fromPromise(
            new Promise((resolve, reject) => {
                this.getModel()
                    .findOne({ email }, { password: 1 })
                    .then((user) => {
                        if (!user) {
                            reject(CoSServerConstants.DATABASE_USER_DOES_NOT_EXIST_ERROR);
                        }
                        resolve(user.password);
                    })
                    .catch((error) => {
                            reject(CoSServerConstants.DATABASE_RETRIEVE_ERROR);
                    });
            }));
    }

}
