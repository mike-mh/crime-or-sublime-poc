import { Document, Model, Schema } from "mongoose";
import { CoSAbstractModel } from "./cos-abstract-model";

describe("CoSAbstractModel", () => {
    class SampleModel extends CoSAbstractModel {
        protected model: Model<Document>;

        constructor() {
            super("Sample");
        }

        /**
         * Don't need to implement these. Only needed to make this class to
         * instantiate for testing.
         */
        public getModel(): Model<Document> {
            throw new Error("Method not implemented.");
        }
    }

    let sampleModel: any;

    sampleModel = new SampleModel();
    sampleModel.schema = new Schema({});

    // Old error occured that when someone instantiated the model class,
    // mongoose may have had the model already registered to it and issuing
    // calls to get the model when it already has a schema assigned causes
    // errors. These tests should ensure they don't occur.
    it("generating a model without a schema should not cause an error.", () => {
        try {
            sampleModel.generateModel();
        } catch(error) {
            expect(error).toBeFalsy();
        }
    });

    it("generating a model with a schema should not cause an error.", () => {

        try {
            sampleModel.generateModel();
        } catch(error) {
            expect(error).toBeFalsy();
        }
    });
});

/**
 * There's no testable functionality for the model initalizer but that will
 * probably change in the future.
 */
