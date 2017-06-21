/**
 * @author Michael Mitchell-Halter
 */

import { Router } from "express";
import { request } from "https";
import { GraffitiSubmitAPI } from "../../../../configurations/graffiti/graffiti-submit/graffiti-submit-api";
import { CoSServer } from "../../../cos-server";
import { CoSServerConstants } from "../../../cos-server-constants";
import { GraffitiModel } from "../../../models/graffiti/graffiti-model";
import { GraffitiSubmitRouter } from "./graffiti-submit-router";

describe("GraffitiSubmitRouter", () => {
    const graffitiSubmitAPI: GraffitiSubmitAPI = new GraffitiSubmitAPI();
    const graffitiSubmitRouter: any = new GraffitiSubmitRouter(Router());

    const req: any = {
        body: {},
        method: "get",
        params: {},
        session: {
            destroy: () => { return; },
        },
    };

    const res: any = {
        json: () => { return; },
    };

    it("should have a handler installed for the graffiti-submit-new-submission path", () => {
        const stacks = graffitiSubmitRouter.getRouter().stack.filter((layer: any) => {
            return layer.route.path === "/graffiti-submit-new-submission";
        });
        expect(stacks.length).toEqual(1, "URL was not stored to router correctly.");
    });

    it("should reject requests to submit graffiti without parameters", (done) => {
        req.method = "post";

        res.json = (response: any) => {
            expect(response.error.name).toEqual(graffitiSubmitAPI.responses.InvalidParametersError.error.name);
            // Reset response function
            res.json = () => { return; };
            done();
        };

        graffitiSubmitRouter.graffitiSubmitNewSubmission(req, res);
    });

    it("should reject requests to submit graffiti without an id in it's parameters", (done) => {
        req.method = "post";
        req.body = {
            latitude: 100,
            longitude: 100,
            recaptcha: "deadbeef",
        };

        res.json = (response: any) => {
            expect(response.error.name).toEqual(graffitiSubmitAPI.responses.InvalidParametersError.error.name);
            // Reset response function
            res.json = () => { return; };
            done();
        };

        graffitiSubmitRouter.graffitiSubmitNewSubmission(req, res);
    });

    it("should reject requests to submit graffiti without a latitude in it's parameters", (done) => {
        req.method = "post";
        req.body = {
            id: "deadbeef",
            longitude: 100,
            recaptcha: "deadbeef",
        };

        res.json = (response: any) => {
            expect(response.error.name).toEqual(graffitiSubmitAPI.responses.InvalidParametersError.error.name);
            // Reset response function
            res.json = () => { return; };
            done();
        };

        graffitiSubmitRouter.graffitiSubmitNewSubmission(req, res);
    });

    it("should reject requests to submit graffiti without a longitude in it's parameters", (done) => {
        req.method = "post";
        req.body = {
            id: "deadbeef",
            latitude: 100,
            recaptcha: "deadbeef",
        };

        res.json = (response: any) => {
            expect(response.error.name).toEqual(graffitiSubmitAPI.responses.InvalidParametersError.error.name);
            // Reset response function
            res.json = () => { return; };
            done();
        };

        graffitiSubmitRouter.graffitiSubmitNewSubmission(req, res);
    });

    it("should reject requests to submit graffiti without a recaptcha in it's parameters", (done) => {
        req.method = "post";
        req.body = {
            id: "deadbeef",
            latitude: 100,
            longitude: 100,
        };

        res.json = (response: any) => {
            expect(response.error.name).toEqual(graffitiSubmitAPI.responses.InvalidParametersError.error.name);
            // Reset response function
            res.json = () => { return; };
            done();
        };

        graffitiSubmitRouter.graffitiSubmitNewSubmission(req, res);
    });

    it("should reject requests to submit graffiti that aren't made with POST", (done) => {
        req.method = "get";
        req.body = {
            id: "deadbeef",
            latitude: 100,
            longitude: 100,
            recaptcha: "deadbeef",
        };

        res.json = (response: any) => {
            expect(response.error.name).toEqual(graffitiSubmitAPI.responses.InvalidParametersError.error.name);
            // Reset response function
            res.json = () => { return; };
            done();
        };

        graffitiSubmitRouter.graffitiSubmitNewSubmission(req, res);
    });

});
