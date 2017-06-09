import { Router } from "express";
import { request } from "https";
import { UserRateAPI } from "../../../../configurations/user/user-rate/user-rate-api";
import { CoSServer } from "../../../cos-server";
import { CoSServerConstants } from "../../../cos-server-constants";
import { UserRateRouter } from "./user-rate-router";

describe("UserRateRouter", () => {
    const userRateAPI: UserRateAPI = new UserRateAPI();
    const userRateRouter: any = new UserRateRouter(Router());

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

    it("should have a handler installed for the user-rate path", () => {
        const stacks = userRateRouter.getRouter().stack.filter((layer: any) => {
            return layer.route.path === "/user-rate";
        });
        expect(stacks.length).toEqual(1, "URL was not stored to router correctly.");
    });

    it("should reject requests to rate graffitis without parameters", (done) => {
        req.method = "post";

        req.body = {};

        res.json = (response: any) => {
            expect(response.error.name).toEqual(userRateAPI.responses.InvalidParametersError.error.name);
            // Reset response function
            res.json = () => { return; };
            done();
        };

        userRateRouter.userRate(req, res);
    });

    it("should reject requests to rate graffitis without a graffiti ID", (done) => {
        req.method = "post";

        req.body = {
            rating: false,
        };

        res.json = (response: any) => {
            expect(response.error.name).toEqual(userRateAPI.responses.InvalidParametersError.error.name);
            // Reset response function
            res.json = () => { return; };
            done();
        };

        userRateRouter.userRate(req, res);
    });

    it("should reject requests to rate graffitis without a rating", (done) => {
        req.method = "post";

        req.body = {
            id: "abcd",
        };

        res.json = (response: any) => {
            expect(response.error.name).toEqual(userRateAPI.responses.InvalidParametersError.error.name);
            // Reset response function
            res.json = () => { return; };
            done();
        };

        userRateRouter.userRate(req, res);
    });

    it("should reject requests to rate graffitis with an invalid ID", (done) => {
        req.method = "post";

        req.body = {
            id: "abcd!!",
            rating: false,
        };

        res.json = (response: any) => {
            expect(response.error.name).toEqual(userRateAPI.responses.InvalidParametersError.error.name);
            // Reset response function
            res.json = () => { return; };
            done();
        };

        userRateRouter.userRate(req, res);
    });

    it("should reject requests to rate graffitis with an invalid rating", (done) => {
        req.method = "post";

        req.body = {
            id: "abcd!!",
            rating: [],
        };

        res.json = (response: any) => {
            expect(response.error.name).toEqual(userRateAPI.responses.InvalidParametersError.error.name);
            // Reset response function
            res.json = () => { return; };
            done();
        };

        userRateRouter.userRate(req, res);
    });

    it("should reject requests to rate graffitis when there is no active session on request", (done) => {
        req.method = "post";

        req.body = {
            id: "abcd",
            rating: true,
        };

        res.json = (response: any) => {
            expect(response.error.name).toEqual(userRateAPI.responses.NoActiveSessionError.error.name);
            // Reset response function
            res.json = () => { return; };
            done();
        };

        userRateRouter.userRate(req, res);
    });

});
