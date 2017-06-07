import { Document, model, Model, Schema } from "mongoose";
import "rxjs/add/observable/fromPromise";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";
import { Observable } from "rxjs/Observable";
import { CoSServerConstants, CrimeOrSublimeRaitng } from "./../../cos-server-constants";
import { PasswordHelper } from "./../../libs/authentication/password-helper";
import { CoSAbstractModel } from "./../cos-abstract-model";
import { IGraffitiDocument, IUserDocument, UserModelSchema } from "./../cos-model-constants";
import { GraffitiModel } from "./../graffiti/graffiti-model";
import { UserGraffitiRatingModel } from "./user-graffiti-rating/user-graffiti-rating-model";

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
     * Use this to assign a rating to a graffiti for a user. It does this by
     * updating the graffiti rating document associated with that graffiti in
     * the user's ratings list otherwise creates a new rating document.
     *
     * @param email - The email of the user
     * @param url - The URL of the rated graffiti
     * @param rating - The rating to assign to the graffiti.
     *
     * @return - Void resolving obersvable
     */
    public rateGraffiti(email: string, url: string, rating: CrimeOrSublimeRaitng): Observable<void> {
        const graffitiModel = new GraffitiModel();
        const userGraffitiRatingModel = new UserGraffitiRatingModel();

        return Observable.fromPromise(
            this.getModel().findOne({ email }))
            .flatMap((user) => {
                if (!user) {
                    throw CoSServerConstants.DATABASE_USER_DOES_NOT_EXIST_ERROR;
                }

                return Observable.fromPromise(graffitiModel.getModel().findOne({ url }))
                    .flatMap((graffiti) => {
                        if (!graffiti) {
                            throw CoSServerConstants.DATABASE_GRAFFITI_DOES_NOT_EXIST;
                        }

                        const userRatings = user.ratings.filter((storedRating) => {
                            return (storedRating.graffitiUrl === url);
                        });

                        if (userRatings.length) {
                            const userRating = userRatings.shift();
                            if (userRating.rating === rating) {
                                throw CoSServerConstants.USER_DOUBLE_RATE_ERROR;
                            }

                            return this.updateRating(email, url, rating).flatMap(() => {
                                return graffitiModel.changeRating(url, rating);
                            });
                        }

                        return this.addNewRating(email, url, rating).flatMap(() => {
                            return graffitiModel.addRating(url, rating);
                        });

                    });
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

    /**
     * Use this method to create a new rating to insert into a user document's
     * array of ratings
     *
     * @param user - The user model to have new rating inserted to.
     * @param graffitiUrl - The url of the graffiti to associate with the rating.
     * @param rating - The rating assoicated with the document.
     *
     * @return - A void resolving observable.
     */
    private addNewRating(
        email: string,
        graffitiUrl: string,
        rating: CrimeOrSublimeRaitng): Observable<void> {

        return Observable.fromPromise(
            new Promise((resolve, reject) => {
                this.getModel().findOneAndUpdate(
                    { email, "ratings.graffitiUrl": { $ne: graffitiUrl } },
                    { $push: { ratings: { email, rating, graffitiUrl } } },
                    (error, user) => {
                        if (error || !user) {
                            reject(CoSServerConstants.DATABASE_RATING_UPDATE_ERROR);
                        }

                        resolve();
                    });
            }).then(() => {
                return;
            }));
    }

    /**
     * Use this method to create a new rating to insert into a user document's
     * array of ratings.
     *
     * @param user - The user model to have new rating inserted to.
     * @param graffitiID - The id of the graffiti to associate with the rating.
     * @param rating - The new rating to be associated with the graffiti.
     *
     * @return - A void resolving observable.
     */
    private updateRating(
        email: string,
        graffitiUrl: string,
        rating: CrimeOrSublimeRaitng): Observable<void> {

        return Observable.fromPromise(
            new Promise((resolve, reject) => {
                this.getModel().findOneAndUpdate({ email, "ratings.graffitiUrl": graffitiUrl }, {
                    $set: {
                        "ratings.$.rating": rating,
                    },
                },
                    (error, user) => {
                        if (error || !user) {
                            reject(CoSServerConstants.DATABASE_RETRIEVE_ERROR);
                        }

                        resolve();
                    });
            }).then(() => {
                return;
            }));
    }

}
