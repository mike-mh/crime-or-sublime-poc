/**
 * @author Michael Mitchell-Halter
 */

import { Document, model, Model, Schema } from "mongoose";
import { CoSServerConstants } from "./../../../cos-server-constants";
import { CoSAbstractModel } from "./../../cos-abstract-model";
import { IUserGraffitiRatingDocument, UserGraffitiRatingModelSchema } from "./../../cos-model-constants";

export class UserGraffitiRatingModel extends CoSAbstractModel {
    protected model: Model<Document>;

    constructor() {
        super("UserGraffitiRating");
        this.schema = UserGraffitiRatingModelSchema;
        this.generateModel();
    }

    public getModel(): Model<Document> {
        return this.model;
    }
}
