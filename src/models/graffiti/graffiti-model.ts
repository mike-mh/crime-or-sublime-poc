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
        return this.getDocument(url);
    }

    /**
     * Retreives a random graffiti from the database.
     *
     * @return - Observable resolving to graffiti document.
     */
    public getRandomGraffiti(): Observable<IGraffitiDocument> {
        return this.getCount({})
            .flatMap((count: number) => {
                const random = Math.floor(Math.random() * count);

                return Observable.create((observer: any) => {
                    this.getModel().findOne()
                        .skip(random)
                        .then((graffiti) => {
                            if (!graffiti) {
                                observer.error(CoSServerConstants.DATABASE_RETRIEVE_ERROR);
                            }
                            observer.next(graffiti);
                        })
                        .catch(() => {
                            observer.error(CoSServerConstants.DATABASE_RETRIEVE_ERROR);
                        });
                });
            });
    }

    /**
     * Add a rating to a graffiti document.
     *
     * @param url - The URL of the graffiti
     * @param rating - The rating to assign to the graffiti
     *
     * @return - Observable that resolves to meta data of updated graffiti.
     */
    public addRating(url: string, rating: CrimeOrSublimeRaitng): Observable<any> {
        const newRating = (rating === SUBLIME) ?
            { sublime: 1 } :
            { crime: 1 };

        return this.findAndUpdateDocuments({ url }, { $inc: newRating });
    }

    /**
     * Change a rating in a graffiti document.
     *
     * @param url - The URL of the graffiti
     * @param rating - The rating to change to. E.g. a rating of 'CRIME'
     *     decrements the 'sublime' property of a graffiti and increments the
     *     'crime' property.
     *
     * @return - Observable that resolves to meta data of updated graffiti.
     */
    public changeRating(url: string, rating: CrimeOrSublimeRaitng): Observable<any> {

        // Use this toggle so that both the crime and sublime values can be
        // updated simultaneously.
        const update = (rating === SUBLIME) ? 1 : -1;

        return this.findAndUpdateDocuments( { url }, { $inc: { crime: -1 * update, sublime: update } });
    }

}
