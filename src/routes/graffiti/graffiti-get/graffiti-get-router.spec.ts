/**
 * @author Michael Mitchell-Halter
 */

import { Router } from "express";
import { request } from "https";
import { GraffitiGetAPI } from "../../../../configurations/graffiti/graffiti-get/graffiti-get-api";
import { CoSServer } from "../../../cos-server";
import { CoSServerConstants } from "../../../cos-server-constants";
import { GraffitiModel } from "../../../models/graffiti/graffiti-model";
import { GraffitiGetRouter } from "./graffiti-get-router";

describe("GraffitiGetRouter", () => {
    const graffitiGetAPI: GraffitiGetAPI = new GraffitiGetAPI();
    const graffitiGetRouter: any = new GraffitiGetRouter(Router());

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

    it("should have a handler installed for the graffiti-get path", () => {
        const stacks = graffitiGetRouter.getRouter().stack.filter((layer: any) => {
            return layer.route.path === "/graffiti-get/:id";
        });
        expect(stacks.length).toEqual(1, "URL was not stored to router correctly.");
    });

    it("should have a handler installed for the register-user-submit path", () => {
        const stacks = graffitiGetRouter.getRouter().stack.filter((layer: any) => {
            return layer.route.path === "/graffiti-get-random";
        });
        expect(stacks.length).toEqual(1, "URL was not stored to router correctly.");
    });

    it("should reject requests for graffitis without an ID", (done) => {
        req.method = "get";

        res.json = (response: any) => {
            expect(response.error.name).toEqual(graffitiGetAPI.responses.InvalidParametersError.error.name);
            // Reset response function
            res.json = () => { return; };
            done();
        };

        graffitiGetRouter.graffitiGet(req, res);
    });

    it("should reject requests for graffitis with invalid ID formats", (done) => {
        req.method = "get";
        req.params = "!!!!!";

        res.json = (response: any) => {
            expect(response.error.name).toEqual(graffitiGetAPI.responses.InvalidParametersError.error.name);
            // Reset response function
            res.json = () => { return; };
            done();
        };

        graffitiGetRouter.graffitiGet(req, res);
    });

    it("should reject requests for a random graffiti if parameters are give", (done) => {
        req.method = "get";
        req.body = {
            fire: "inTheDisco",
        };

        res.json = (response: any) => {
            expect(response.error.name).toEqual(graffitiGetAPI.responses.InvalidParametersError.error.name);
            // Reset response function
            res.json = () => { return; };
            done();
        };

        graffitiGetRouter.graffitiGetRandom(req, res);
    });

});
