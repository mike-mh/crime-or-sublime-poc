/**
 * @author Michael Mitchell-Halter
 */

import { Document, model, Model, Schema } from "mongoose";
import "rxjs/add/observable/fromPromise";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";
import { Observable } from "rxjs/Observable";
import { CoSServerConstants } from "./../../cos-server-constants";
import { CoSAbstractModel } from "./../cos-abstract-model";
import { IGraffitiDocument, ITempGraffitiDocument, TempGraffitiModelSchema } from "./../cos-model-constants";
import { GraffitiModel } from "./graffiti-model";

/**
 * Use this model to store newly submitted user graffiti until they are approved
 * to be posted to the website.
 */
export class TempGraffitiModel extends CoSAbstractModel {
    protected model: Model<ITempGraffitiDocument>;

    constructor() {
        super("TempGraffiti");
        this.schema = TempGraffitiModelSchema;

        this.generateModel();
    }

    public getModel(): Model<ITempGraffitiDocument> {
        return this.model;
    }

    /**
     * Use this to save a new temporary graffiti document to the datavase until
     * it has been approved for posting.
     *
     * TO-DO: Will implement features to to attribute posts to users and
     *        associate graffiti with artists.
     *
     * @param url - The URL of the graffiti
     * @param latitude - The latitude of the graffiti
     * @param longitude - The longitude of the graffiti
     *
     * @returns - Void resolving observable
     */
    public commitTempGraffitiData(url: string, latitude: number, longitude: number): Observable<Document> {
        return this.ensureGraffitiIsUnique(url)
            .flatMap(() => {
                return this.saveDocument({
                    url,
                    latitude,
                    longitude,
                });

            });
    }

    /**
     * Use this to move a temporary graffiti from the TempGraffiti collection
     * to the normal Graffiti Collection and make it public.
     *
     * TO-DO: Will implement features to to attribute posts to users and
     *        associate graffiti with artists.
     *
     * @param url - The URL of the graffiti
     * @param latitude - The latitude of the graffiti
     * @param longitude - The longitude of the graffiti
     *
     * @returns - Void resolving observable
     */
    public commitGraffitiData(url: string, latitude: number, longitude: number): Observable<IGraffitiDocument> {
        const graffitiModel = new GraffitiModel();

        return Observable.fromPromise(
            new (graffitiModel.getModel())({
                url,
                latitude,
                longitude,
            }).save((error) => {
                if (error) {
                    throw CoSServerConstants.DATABASE_SAVE_ERROR;
                }
            }));
    }

    private ensureGraffitiIsUnique(url: string): Observable<void> {
        const graffitiModel: GraffitiModel = new GraffitiModel();

        return this.getDocuments({ url })
            .flatMap((tempDocuments: ITempGraffitiDocument[]) => {
                if (tempDocuments.shift()) {
                    throw CoSServerConstants.DATABASE_GRAFFITI_ALREADY_REGISTERED_ERROR;
                }
                return graffitiModel.getDocuments({ url });
            })
            .map((graffitiDocuments: IGraffitiDocument[]) => {
                if (graffitiDocuments.shift()) {
                    throw CoSServerConstants.DATABASE_GRAFFITI_ALREADY_REGISTERED_ERROR;
                }
            });

    }
}
