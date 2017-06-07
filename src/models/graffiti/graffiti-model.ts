import { Document, model, Model, Schema } from "mongoose";
import "rxjs/add/observable/fromPromise";
import { Observable } from "rxjs/Observable";
import { CoSServerConstants, CRIME, CrimeOrSublimeRaitng, SUBLIME } from "./../../cos-server-constants";
import { CoSAbstractModel } from "./../cos-abstract-model";
import { GraffitiModelSchema, IGraffitiDocument } from "./../cos-model-constants";

export class GraffitiModel extends CoSAbstractModel {
    protected model: Model<IGraffitiDocument>;

    constructor() {
        super("Graffiti");
        this.schema = GraffitiModelSchema;
        this.generateModel();
    }

    public getModel(): Model<Document> {
        return this.model;
    }

    /**
     * Retreives graffiti based on a given URL.
     *
     * @param url - URL of the graffiti to query.
     *
     * @return - Observable resolving to graffiti document.
     */
    public getGraffiti(url: string): Observable<IGraffitiDocument> {
        return Observable.fromPromise(new Promise((resolve, reject) => {
            this.getModel().findOne({ url })
                .then((graffiti) => {
                    if (!graffiti) {
                        reject(CoSServerConstants.DATABASE_GRAFFITI_DOES_NOT_EXIST);
                    }
                    resolve(graffiti);
                })
                .catch((error) => {
                    reject(CoSServerConstants.DATABASE_RETRIEVE_ERROR);
                });
        }));
    }

    /**
     * Retreives a random graffiti from the database.
     *
     * @return - Observable resolving to graffiti document.
     */
    public getRandomGraffiti(): Observable<IGraffitiDocument> {
        return Observable.fromPromise(new Promise((resolve, reject) => {
            this.getModel()
                .count({}, (error, count) => {
                    if (error) {
                        reject(CoSServerConstants.DATABASE_RETRIEVE_ERROR);
                    }
                    const random = Math.floor(Math.random() * count);
                    this.getModel().findOne()
                        .skip(random)
                        .then((graffiti) => {
                            if (!graffiti) {
                                reject(CoSServerConstants.DATABASE_RETRIEVE_ERROR);
                            }
                            resolve(graffiti);
                        })
                        .catch(() => {
                            reject(CoSServerConstants.DATABASE_RETRIEVE_ERROR);
                        });

                });
        }));
    }

    /**
     * Add a rating to a graffiti document.
     *
     * @param url - The URL of the graffiti
     * @param rating - The rating to assign to the graffiti
     *
     * @return - A void resolving Observable.
     */
    public addRating(url: string, rating: CrimeOrSublimeRaitng): Observable<void> {
        const newRating = (rating === SUBLIME) ?
            { sublime: 1 } :
            { crime: 1 };

        return Observable.fromPromise(
            new Promise((resolve, reject) => {
                this.getModel().update({ url }, { $inc: newRating },
                    (error, graffiti) => {
                        if (error || !graffiti) {
                            reject(CoSServerConstants.DATABASE_GRAFFITI_UPDATE_ERROR);
                        }
                        resolve();
                    });
            }).then(() => {
                return;
            }));
    }

    /**
     * Change a rating in a graffiti document.
     *
     * @param url - The URL of the graffiti
     * @param rating - The rating to change to. E.g. a rating of 'CRIME'
     *     decrements the 'sublime' property of a graffiti and increments the
     *     'crime' property.
     *
     * @return - A void resolving Observable.
     */
    public changeRating(url: string, rating: CrimeOrSublimeRaitng): Observable<void> {

        // Use this toggle so that both the crime and sublime values can be
        // updated simultaneously.
        const update = (rating === SUBLIME) ? 1 : -1;

        return Observable.fromPromise(
            new Promise((resolve, reject) => {
                this.getModel().update(
                    { url },
                    { $inc: { crime: -1 * update, sublime: update } },
                    (error, graffiti) => {
                        if (error || !graffiti) {
                            reject(CoSServerConstants.DATABASE_GRAFFITI_UPDATE_ERROR);
                        }
                        resolve();
                    });
            }).then(() => {
                return;
            }));
    }

}
