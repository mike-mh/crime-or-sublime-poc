import { Request, RequestHandler, Response, Router } from "express";
import { SessionAPI } from "./../../../configurations/session/session-api"; 
import { CoSServerConstants } from "./../../cos-server-constants";
import { UserModel } from "./../../models/user/user-model";
import { CoSAbstractRouteHandler } from "./../cos-abstract-route-handler";
/**
 * This will handle all login requests
 */
export class SessionRouter extends CoSAbstractRouteHandler {
    public static sessionAPI: SessionAPI = new SessionAPI();

    /**
     * Initializes all handlers for login requests.
     */
    public constructor(protected router: Router) {
        super(router);

        this.installRequestHandlers([
            ["post", SessionRouter.sessionAPI.SESSION_CREATE_USER_PATH, this.sessionCreateUser],
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
            res.json(SessionRouter.sessionAPI.responses.InvalidParametersError)
            return;
        }

        const email = req.body.identifier;
        const password = req.body.password;

        console.log(email);
        console.log(password);

        const User = new UserModel();
        User.authenticate(email, password)
            .then((messsage) => {
                if (req.session.email === email) {
                    res.json(SessionRouter.sessionAPI.responses.AlreadyActiveSessionError);
                    return;
                }
                req.session.email = email;
                res.json({ result: email });
            })
            .catch((err) => {
                console.log(err.message);
                if (!res.headersSent) {
                    if (err.code === CoSServerConstants.DATABASE_USER_DOES_NOT_EXIST_ERROR ||
                        err.code === CoSServerConstants.DATABASE_USER_INVALID_PASSWORD_ERROR) {
                        res.json(SessionRouter.sessionAPI.responses.InvalidCredentialsError);

                        return;
                    }

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
            res.json(SessionRouter.sessionAPI.responses.NoActiveSessionError);
            return;
        }

        if (!req.session.email) {
            res.json(SessionRouter.sessionAPI.responses.NoActiveSessionError);
            return;
        }

        new UserModel().checkUserExists(req.session.email)
            .then(() => {
                res.json({ result: req.session.email });
            })
            .catch((error) => {
                res.json(SessionRouter.sessionAPI.responses.InternalServerError);
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
            res.json(SessionRouter.sessionAPI.responses.NoActiveSessionError);
            return;
        }

        req.session.destroy((error) => {
            error ?
                res.json(SessionRouter.sessionAPI.responses.InternalServerError) :
                res.json({ result: "Session terminated" });
        });
    }
}
