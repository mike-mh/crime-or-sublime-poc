import { Router } from "express";
import { request } from "https";
import { SessionAPI } from "./../../../configurations/session/session-api";
import { UserModel } from "../../models/user/user-model";
import { CoSServer } from "../../cos-server";
import { SessionRouter } from "./session-router";

describe("SessionRouter", () => {
    let sessionRouter: any = new SessionRouter(Router());
    let sessionAPI: SessionAPI = new SessionAPI();

    let userModel = new UserModel();

    // Use spoofed res and req objects to make calls to the backend instead of
    // launching HTTP calls at the server itself. It's a cool idea for later
    // and it should be done when the time is right.
    let req: any = {
        body: {},
        method: "get",
        session: {
            destroy: () => { },
        },
    };

    let res: any = {
        json: () => { },
    };

    // Spoof a user in the database.
    beforeAll((done) => {
        new (userModel.getModel())({
            email: "test@test.com",
            lastLogin: new Date(),
            password: "password",
            salt: "deadbeef",
            username: "testing",
        }).save()
            .then(() => { done(); })
    });

    afterAll((done) => {
        userModel.getModel().remove({
            email: "test@test.com",
        })
            .then(() => { done(); })
            .catch((error) => { console.log(error) })

    });

    it("should install a handler for the session-create-user path", () => {
        let found = false;
        sessionRouter.getRouter().stack.map((layer: any) => {
            if (layer.route.path === "/session-create-user") {
                expect(found).toBe(false);
                found = true;
            }
        });

        expect(found).toBe(true);
    });

    it("should install a handler for the session-end-user path", () => {
        let found = false;
        sessionRouter.getRouter().stack.map((layer: any) => {
            if (layer.route.path === "/session-end-user") {
                expect(found).toBe(false);
                found = true;
            }
        });

        expect(found).toBe(true);
    });

    it("should install a handler for the session-verify-user path", () => {
        let found = false;
        sessionRouter.getRouter().stack.map((layer: any) => {
            if (layer.route.path === "/session-verify-user") {
                expect(found).toBe(false);
                found = true;
            }
        });

        expect(found).toBe(true);
    });

    it("handler for session-create-user should respond with an error when parameters are missing", (done) => {
        req.method = "post"
        res.json = (res: any) => {
            expect(res.error.name).toEqual(sessionAPI.responses.InvalidParametersError.error.name);
            // Reset response function
            res.json = () => { };
            done();
        };

        sessionRouter.sessionCreateUser(req, res);
    });

    it("handler for session-create-user should respond with an error when invalid parameters are given", (done) => {
        req.body.identifier = "test@test.com";

        res.json = (res: any) => {
            expect(res.error.name).toEqual(sessionAPI.responses.InvalidParametersError.error.name);
            // Reset parameters
            res.json = () => { };
            req.body.identifier = null;

            done();
        };

        sessionRouter.sessionCreateUser(req, res);

    });

    it("handler for session-create-user should respond with an error when credentials are invalid", (done) => {
        req.body.identifier = "test@test.com";
        req.body.password = "raboofing";

        res.json = (res: any) => {
            expect(res.error.name).toEqual(sessionAPI.responses.InvalidCredentialsError.error.name);
            // Reset parameters
            res.json = () => { };
            req.body.identifier = null;
            req.body.password = null;

            done();
        };

        sessionRouter.sessionCreateUser(req, res);

    });

    it("handler for session-verify-user should respond with an error when there is no active session", (done) => {
        req.method = "get";

        res.json = (res: any) => {
            expect(res.error.name).toEqual(sessionAPI.responses.NoActiveSessionError.error.name);
            // Reset parameters
            res.json = () => { };

            done();
        };

        sessionRouter.sessionVerifyUser(req, res);

    });

    it("handler for session-create-user should respond with success message when credentials are valid", (done) => {
        req.method = "get";
        req.session.email = "test@test.com"
        req.session.password = "password"

        res.json = (res: any) => {
            expect(res.result).toEqual(req.session.email);
            // Reset parameters
            res.json = () => { };

            done();
        };

        sessionRouter.sessionVerifyUser(req, res);
    });

    it("handler for session-verify-user should respond with success message when there is an active session", (done) => {
        req.method = "get";
        req.session.email = "test@test.com"

        res.json = (res: any) => {
            expect(res.result).toEqual(req.session.email);
            // Reset parameters
            res.json = () => { };

            done();
        };

        sessionRouter.sessionVerifyUser(req, res);
    });

});