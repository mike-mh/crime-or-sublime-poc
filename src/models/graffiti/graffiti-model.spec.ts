import mongoose = require("mongoose");
import { Document } from "mongoose";
import { Observable } from "rxjs/Observable";
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
