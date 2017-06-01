import { Document, model, Model, Schema } from "mongoose";

/**
 * Use this as the template to generate all mongoose models for the app.
 * Contains all utility methods to allow for actual classes to install all
 * methods and statics to their models as needed.
 */
export abstract class CoSAbstractModel {
    protected modelName: string;
    protected schema: Schema;
    protected abstract model: Model<Document>;

    constructor(modelName: string) {
        this.modelName = modelName;
    }

    /**
     * Simple getter for the model object. Needs to be abstract to account
     * for different interfaces for each model.
     */
    public abstract getModel(): Model<Document>;

    /**
     * Generates the model to be used by the inheriting class. First tries to
     * call it by name alone but if it doesn't exist compiles it instead.
     *
     * TO-DO: See if this can be done without a try/catch clause.
     */
    protected generateModel(): void {
        try {
            this.model = model(this.modelName);
        } catch (error) {
            this.model = model(this.modelName, this.schema);
        }
    }
}
