import { Router } from "express";
import { request } from "https";
import { UserRegsiterAPI } from "../../../../configurations/user/user-register/user-register-api";
import { CoSServerConstants } from "../../../cos-server-constants";
import { PasswordHelper } from "../../../libs/authentication/password-helper";
import { ReCaptchaHelper } from "../../../libs/authentication/recaptcha-helper";
import { TempUserModel } from "../../../models/user/temp-user-model";
import { UserModel } from "../../../models/user/user-model";
import { CoSServer } from "../../../cos-server";
import { UserRegisterRouter } from "./user-register-router";


describe("UserRegisterRouter", () => {
    let reCaptchaSpy: jasmine.Spy;

    let registerUserRouter: any = new UserRegisterRouter(Router());
    let sessionAPI: UserRegsiterAPI = new UserRegsiterAPI();

    let userModel = new UserModel();
    let tempUserModel = new TempUserModel();

    // Use spoofed res and req objects to make calls to the backend instead of
    // launching HTTP calls at the server itself. It's a cool idea for later
    // and it should be done when the time is right.
    let req: any = {
        params: {},
        body: {},
        method: "get",
        session: {
            destroy: () => { },
        },
    };

    let res: any = {
        json: () => { },
    };

    afterAll((done) => {
        tempUserModel.getModel().remove({
            email: "beh@beh.com",
        })
            .then(() => { })
            .catch((error) => { console.log(error) });

        userModel.getModel().remove({
            email: "beh@beh.com",
        })
            .then(() => { done(); })
            .catch((error) => { console.log(error) });

    });


    it("should have a handler installed for the register-user-confirm path", () => {
        let found = false;
        registerUserRouter.getRouter().stack.map((layer: any) => {
            if (layer.route.path === "/user-register-confirm/:id/:key") {
                expect(found).toBe(false);
                found = true;
            }
        });

        expect(found).toBe(true);
    });

    it("should have a handler installed for the register-user-submit path", () => {
        let found = false;
        registerUserRouter.getRouter().stack.map((layer: any) => {
            if (layer.route.path === "/user-register-submit") {
                expect(found).toBe(false);
                found = true;
            }
        });

        expect(found).toBe(true);
    });

    it("should reject new submissions without parameters", (done) => {
        req.method = "post"
        res.json = (res: any) => {
            expect(res.error.name).toEqual(sessionAPI.responses.InvalidParametersError.error.name);
            // Reset response function
            res.json = () => { };
            done();
        };

        registerUserRouter.userRegisterSubmit(req, res);
    });

    it("should reject new submissions with invalid parameters", (done) => {
        req.method = "post";

        req.body.username = "canada";
        req.body.email = "beh";
        req.body.password = "canadian";
        req.body.captcha = "ahctpac";

        res.json = (res: any) => {
            expect(res.error.name).toEqual(sessionAPI.responses.InvalidParametersError.error.name);
            // Reset response function
            res.json = () => { };
            done();
        };

        registerUserRouter.userRegisterSubmit(req, res);
    });

    /*
       This is a good test to write, but unfortunately there's no way to include
       error codes when throwing an error with jasmine so there's no way for the
       router to determine that the error was actually a reCaptcha error.
    
        it("should reject new submissions with invalid reCaptcha responses", () => {
            reCaptchaSpy = spyOn(ReCaptchaHelper, "verifyRecaptchaSuccess");
            reCaptchaSpy.and.throwError(CoSServerConstants.RECAPTCHA_RESPONSE_FAILURE.message);
        });
    */

    it("should reject activating new accounts with invalid keys", (done) => {
        req.method = "get";

        req.params.id = "testing";
        req.params.key = "feebdaed";

        req.session.save = () => { };

        res.json = (res: any) => {
            expect(res.error.name).toEqual(sessionAPI.responses.InvalidRegistrationError.error.name);
            // Reset response function
            res.json = () => { };
            done();
        };

        registerUserRouter.userRegisterConfirm(req, res);
    });

    /**
     * TO-DO: Add tests for physical insertion of documents into the data base.
     */
});