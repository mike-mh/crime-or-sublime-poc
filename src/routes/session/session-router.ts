import { NextFunction, Request, RequestHandler, Response, Router } from "express";
import { model } from "mongoose";
import { SessionAPI } from "./../../../configurations/session/session-api";
import { CoSServerConstants } from "./../../cos-server-constants";
import { ReCaptchaHelper } from "./../../libs/authentication/recaptcha-helper";
import { UserModel } from "./../../models/user/user-model";
import { CoSAbstractRouteHandler } from "./../cos-abstract-route-handler";
/**
 * This will handle all login requests
 */
export class SessionRouter extends CoSAbstractRouteHandler {
    private static sessionAPI: SessionAPI = new SessionAPI();
    private static responses: any = SessionRouter.sessionAPI.responses;

    /**
     * Initializes all handlers for login requests.
     */
    public constructor(protected router: Router) {
        super(router);

        this.installRequestHandlers([
            ["post", SessionRouter.sessionAPI.SESSION_CREATE_USER_PATH,
                this.sessionLockout(),
                this.sessionCreateUser],
            ["get", SessionRouter.sessionAPI.SESSION_VERIFY_USER_PATH, this.sessionVerifyUser],
            ["get", SessionRouter.sessionAPI.SESSION_END_USER_PATH, this.sessionEndUser],
        ], SessionRouter.sessionAPI);

    }

    /**
     * Verifies with backend that credentials user submitted are correct.
     *
     * @param req - Incoming request
     * @param res - Server response
     */
    private sessionCreateUser(req: Request, res: Response): void {
        try {
            SessionRouter.sessionAPI.validateParams(
                SessionRouter.sessionAPI.SESSION_CREATE_USER_PATH, req.body, req.method);
        } catch (error) {
            console.log(error.message);
            res.json(SessionRouter.responses.InvalidParametersError);
            return;
        }

        const email = req.body.identifier;
        const password = req.body.password;

        const User = new UserModel();
        User.authenticate(email, password)
            .then((messsage) => {
                if (req.session.email === email) {
                    res.json(SessionRouter.responses.AlreadyActiveSessionError);
                    return;
                }
                req.session.email = email;
                res.json({ result: email });
            })
            .catch((err) => {
                if (!res.headersSent) {
                    if (err.code === CoSServerConstants.DATABASE_USER_DOES_NOT_EXIST_ERROR.code ||
                        err.code === CoSServerConstants.DATABASE_USER_INVALID_PASSWORD_ERROR.code) {
                        res.json(SessionRouter.responses.InvalidCredentialsError);

                        return;
                    }

                    res.json(SessionRouter.responses.InternalServerError);
                }
            });
    }

    /**
     * Use this to verify session is valid.
     *
     * @param req - Incoming request
     * @param res - Server response
     */
    private sessionVerifyUser(req: Request, res: Response): void {
        if (!req.session.email) {
            res.json(SessionRouter.responses.NoActiveSessionError);
            return;
        }

        if (!req.session.email) {
            res.json(SessionRouter.responses.NoActiveSessionError);
            return;
        }

        new UserModel().checkUserExists(req.session.email)
            .then(() => {
                res.json({ result: req.session.email });
            })
            .catch((error) => {
                res.json(SessionRouter.responses.InternalServerError);
            });

    }

    /**
     * Terminates the current session of a user.
     *
     * @param req - Client request
     * @param rest - Server response
     */
    private sessionEndUser = (req: Request, res: Response): void => {
        if (!req.session.email) {
            res.json(SessionRouter.responses.NoActiveSessionError);
            return;
        }

        req.session.destroy((error) => {
            error ?
                res.json(SessionRouter.responses.InternalServerError) :
                res.json({ result: "Session terminated" });
        });
    }

    /**
     * This handler forces a day long lock out of users who make invalid login
     * requests 1000 times or more in succession. Lockout lasts for 25 hours
     * before reset.
     * 
     * @return - Express brute configuration to create the lockout.
     */
    private sessionLockout(): RequestHandler {
        const ExpressBrute = require('express-brute');
        const MongooseStore = require('express-brute-mongoose');
        const bruteForceSchema = require('express-brute-mongoose/dist/schema');

        const bruteForceModel = model("BruteForce", bruteForceSchema);
        const store = new MongooseStore(bruteForceModel);

        const bruteForce = new ExpressBrute(store, {
            freeRetries: 2,
            attachResetToRequest: false,
            refreshTimeoutOnRequest: false,
            minWait: 25 * 60 * 60 * 1000,
            maxWait: 25 * 60 * 60 * 1000,
            lifetime: 24 * 60 * 60,
            failCallback: this.sessionLockoutHandler,
            handleStoreError: this.handleMiddlewareError,
        });

        return bruteForce.prevent;
    }

    /**
     * This function handles sessionLockout callbacks.
     * 
     * @param req - Client request
     * @param res - Server response
     * @param next - Express next function
     */
    private sessionLockoutHandler(req: Request, res: Response, next: NextFunction): void {
        res.json(SessionRouter.responses.SessionLockoutError);
    }

}
