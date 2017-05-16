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

    // Need to store these as tuples containing the method and its name
    protected methods: Array<[string, (... parameters: any[]) => void]> = [];
    protected staticMethods: Array<[string, (... parameters: any[]) => void]> = [];

    constructor(modelName: string) {
        this.modelName = modelName;
    }

    /**
     * Simple getter for the model object. Needs to be abstract to account
     * for different interfaces for each model.
     */
    public abstract getModel(): Model<Document>;

    /**
     * Generates the model to be used by the inheriting class.
     */
    protected generateModel(): void {
        try {
            this.model = model(this.modelName);
        } catch(error) {
            this.model = model(this.modelName, this.schema);
        }
    }

    /**
     * Utility method to isntall a static to the model.
     *
     * @param name - The name of the static method
     * @param staticMethod - The function to be installed as the static method
     */
    protected installStaticMethod(name: string, staticMethod: (... parameters: any[]) => void) {
        this.schema.statics[name] = staticMethod;
    }

    /**
     * Utility method to install a static to the model.
     *
     * @param name - The name of the method
     * @param method - The function to be installed as the method
     */
    protected installMethod(name: string, method: (... parameters: any[]) => void) {
        this.schema.methods[name] = method;
    }

    /**
     * Unique to each subclass. Needed to generate the appropriate schemas.
     */
    protected abstract generateSchema(): void;

    /**
     * Generates the static methods
     */
    protected abstract generateStaticMethods(): void;

    /**
     * Generates the methods
     */
    protected abstract generateMethods(): void;

}
