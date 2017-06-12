import mongoose = require("mongoose");
import { Document } from "mongoose";
import { Observable } from "rxjs/Observable";
import { CoSServerConstants } from "../../cos-server-constants";
import { GraffitiModel } from "./graffiti-model";

describe("GraffitiModel", () => {
    const graffitiModel: any = new GraffitiModel();

    beforeAll((done) => {
        graffitiModel.saveDocument({
            latitude: 1,
            longitude: 2,
            url: "raboogs",
        }).subscribe(done);
    });

    afterAll((done) => {
        graffitiModel.removeDocuments({
            latitude: 1,
            longitude: 2,
            url: "raboogs",
        }).subscribe(done);
    });

    it("should not be able to get a graffiti that doesn't exist", (done) => {
        graffitiModel.getGraffiti("raboozz")
            .subscribe(
            (document: any) => {
                expect(true).toBe(false, "Was able to retrieve non-existant graffiti");
                done();
            },
            (error: any) => {
                expect(error.code).toBe(CoSServerConstants.DATABASE_NO_DOCUMENTS_FOUND.code, "Wrong error code.");
                done();
            });
    });

    it("should not be able to get a graffiti", (done) => {
        graffitiModel.getGraffiti("raboogs")
            .subscribe(
            (document: any) => {
                expect(document.url).toBe("raboogs", "Wrong graffiti was retrieved");
                done();
            },
            (error: any) => {
                expect(true).toBe(false, "Error occured retrieving graffiti");
                done();
            });
    });

    it("should be able to add a crime rating to a graffiti", (done) => {
        const crime = 0;
        graffitiModel.addRating("raboogs", false)
            .flatMap(() => {
                return graffitiModel.getDocument({ url: "raboogs" });
            }).subscribe(
            (document: any) => {
                expect(document.crime).toEqual(crime + 1, "Added incorrect score to graffiti crime rating.");
                done();
            },
            () => {
                expect(true).toBe(false, "Error occured during rating.");
                done();
            });
    });

    it("should be able to add a sublime rating to a graffiti", (done) => {
        const sublime = 0;
        graffitiModel.addRating("raboogs", true)
            .flatMap(() => {
                return graffitiModel.getDocument({ url: "raboogs" });
            }).subscribe(
            (document: any) => {
                expect(document.sublime).toEqual(sublime + 1, "Added incorrect score to graffiti sublime rating.");
                done();
            },
            () => {
                expect(true).toBe(false, "Error occured during rating.");
                done();
            });
    });

    it("should be able to change a sublime rating to a crime rating", (done) => {
        const crime = 1;
        const sublime = 1;
        graffitiModel.changeRating("raboogs", false)
            .flatMap(() => {
                return graffitiModel.getDocument({ url: "raboogs" });
            }).subscribe(
            (document: any) => {
                expect(document.sublime).toEqual(sublime - 1, "Added incorrect score to graffiti sublime rating.");
                expect(document.crime).toEqual(crime + 1, "Added incorrect score to graffiti crime rating.");
                done();
            },
            () => {
                expect(true).toBe(false, "Error occured during rating.");
                done();
            });
    });

    it("should be able to change a crime rating to a sublime rating", (done) => {
        const crime = 2;
        const sublime = 0;
        graffitiModel.changeRating("raboogs", true)
            .flatMap(() => {
                return graffitiModel.getDocument({ url: "raboogs" });
            }).subscribe(
            (document: any) => {
                expect(document.sublime).toEqual(sublime + 1, "Added incorrect score to graffiti sublime rating.");
                expect(document.crime).toEqual(crime - 1, "Added incorrect score to graffiti crime rating.");
                done();
            },
            () => {
                expect(true).toBe(false, "Error occured during rating.");
                done();
            });
    });

});
