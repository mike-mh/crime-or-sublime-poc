import { Request, RequestHandler, Response, Router } from "express";
import { SessionAPI } from "./../../../configurations/session/session-api"; 
import { UserModel } from "./../../models/user/user-model";
import { CoSAbstractRouteHandler } from "./../cos-abstract-route-handler";

/**
 * This will handle all login requests
 */
export class SessionRouter extends CoSAbstractRouteHandler {
    private static isInstantiated: boolean = false;
    public static sessionAPI: SessionAPI = new SessionAPI();

    /**
     * Initializes all handlers for login requests and keeps singleton pattern.
     */
    public constructor(protected router: Router) {
        super(router);
        if (SessionRouter.isInstantiated) {
            throw new Error("Session router already instantiated");
        }

        this.installRequestHandlers([
            ["post", SessionRouter.sessionAPI.SESSION_CREATE_USER_PATH, this.sessionCreateUser],
            ["get", SessionRouter.sessionAPI.SESSION_VERIFY_USER_PATH, this.sessionVerifyUser],
            ["get", SessionRouter.sessionAPI.SESSION_END_USER_PATH, this.sessionEndUser],
        ], SessionRouter.sessionAPI);

        SessionRouter.isInstantiated = true;
    }

    /**
     * Verifies with backend that credentials user submitted are correct.
     *
     * @param req - Incoming request
     * @param res - Server response
     */
    private sessionCreateUser(req: Request, res: Response): void {

        try {
            SessionRouter.sessionAPI.validateParams(SessionRouter.sessionAPI.SESSION_CREATE_USER_PATH, req.body, req.method);
        } catch (error) {
            res.json(SessionRouter.sessionAPI.responses.InvalidParameterError)
            return;
        }

        const email = req.body.email
        const password = req.body.password

        const User = new UserModel();
        User.authenticate(email, password)
            .then((messsage) => {
                if (req.session.email === email) {
                    res.json(SessionRouter.sessionAPI.responses.AlreadyActiveSession);
                    return;
                }
                req.session.email = email;
                res.json({ result: email });
            })
            .catch((err) => {
                if (!res.headersSent) {
                    res.json(SessionRouter.sessionAPI.responses.InternalServerError);
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
            res.json(SessionRouter.sessionAPI.responses.NoActiveSession);
            return;
        }

        new UserModel().checkUserExists(req.session.email)
            .then(() => {
                res.json({ result: req.session.email });
            })
            .catch((error) => {
                res.json(SessionRouter.sessionAPI.responses.UserNotFound);
            });

    }

    /**
     * Terminates the current session of a user.
     *
     * @param req - Client request
     * @param rest - Server response
     */
    private sessionEndUser = (req: Request, res: Response): void => {
        req.session.destroy((error) => {
            error ?
                res.json(SessionRouter.sessionAPI.responses.InternalServerError) :
                res.json({ result: "Session terminated" });
        });
    }
}
