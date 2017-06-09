import { connect, Document, Model, Schema } from "mongoose";
import mongoose = require("mongoose");
import { Observable } from "rxjs/Observable";
import { CoSServerConstants } from "../cos-server-constants";
import { CoSAbstractModel } from "./cos-abstract-model";

// Need to establish a connection to MongoDB.
beforeAll((done) => {
    mongoose.Promise = global.Promise;
    connect("mongodb://localhost/cos").then(done);
});

describe("CoSAbstractModel", () => {
    interface ISampleDocument extends Document {
        sampleString: string;
        sampleNumberArray: number[];
        sampleOptionalNumber?: number;

    }

    class SampleModel extends CoSAbstractModel {
        protected model: Model<ISampleDocument>;

        constructor() {
            super("Sample");
            this.schema = new Schema({
                sampleNumberArray: {
                    default: [1, 2, 4],
                    required: true,
                    type: [Number],
                },
                sampleOptionalNumber: {
                    type: Number,
                },
                sampleString: {
                    required: true,
                    type: String,
                },
            });

            this.generateModel();
        }

        public getModel(): Model<ISampleDocument> {
            return this.model;
        }
    }

    let sampleModel: any;

    sampleModel = new SampleModel();

    beforeAll((done) => {
        new (sampleModel.getModel())({
            sampleString: "stringDude",
        }).save((error: string, document: Document) => {
            if (error) {
                throw new Error(error);
            }

            done();
        });
    });

    afterAll((done) => {
        sampleModel.getModel().remove({}, (error: string) => {
            if (error) {
                throw new Error(error);
            }

            done();
        });
    });

    // Old error occured that when someone instantiated the model class,
    // mongoose may have had the model already registered to it and issuing
    // calls to get the model when it already has a schema assigned causes
    // errors. These tests should ensure they don't occur.
    it("generating a model without a schema should not cause an error.", () => {
        try {
            sampleModel.generateModel();
        } catch (error) {
            expect(error).toBeFalsy();
        }
    });

    it("generating a model with a schema should not cause an error.", () => {

        try {
            sampleModel.generateModel();
        } catch (error) {
            expect(error).toBeFalsy();
        }
    });

    it("should be able to save documents", (done) => {
        sampleModel.saveDocument({
            sampleString: "new",
        }).subscribe(
            (document: ISampleDocument) => {
                expect(document.sampleString).toEqual("new");
                done();
            },
            (error: Error) => {
                throw error;
            });
    });

    it("should be able to detect errors when saving a document fails", (done) => {
        sampleModel.saveDocument({}).subscribe(
            (document: ISampleDocument) => {
                expect(true).toBe(false, "Was able to save a document that violated a schema");
                done();
            },
            (error: any) => {
                expect(error.code).toEqual(CoSServerConstants.DATABASE_SAVE_ERROR.code,
                    "Incorrect error code returned.");
                done();
            });
    });

    it("should be able to get a document", (done) => {
        sampleModel.getDocument({
            sampleString: "stringDude",
        }).subscribe(
            (document: ISampleDocument) => {
                expect(document.sampleString).toEqual("stringDude", "Incorrect data retrieved.");
                done();
            },
            (error: any) => {
                throw error;
            });
    });

    it("should be able to detect when getting a document fails", (done) => {
        sampleModel.getDocument({
            sampleString: "bananaBread",
        }).subscribe(
            (document: ISampleDocument) => {
                expect(true).toBe(false, "Was able to retrieve non-existant data.");
                done();
            },
            (error: any) => {
                expect(error.code).toEqual(CoSServerConstants.DATABASE_NO_DOCUMENTS_FOUND.code,
                    "Incorrect error returned");
                done();
            });
    });

    it("should be able to get several documents", (done) => {
        sampleModel.getDocuments({
            sampleString: "stringDude",
        }).subscribe(
            (documents: ISampleDocument[]) => {
                const document = documents.shift();
                expect(document.sampleString).toEqual("stringDude", "Incorrect data retrieved.");
                done();
            },
            (error: any) => {
                throw error;
            });
    });

    it("should be able to find and update documents", (done) => {
        sampleModel.findAndUpdateDocuments({
            sampleString: "stringDude",
        }, { sampleString: "dudeString" }).subscribe(
            (result: any) => {
                expect(result.nModified).toEqual(1, "Unable to modify documents.");
                done();
            },
            (error: any) => {
                throw error;
            });
    });

    it("should be able to remove documents", (done) => {
        sampleModel.removeDocuments({
            sampleString: "new",
        }).subscribe(
            () => {
                sampleModel.getModel().find({ sampleString: "new" }, (error: string, documents: Document[]) => {
                    if (error) {
                        throw error;
                    }

                    expect(documents.shift()).toBeFalsy("Document was not removed.");
                    done();
                });
            },
            (error: any) => {
                throw error;
            });

    });

});
