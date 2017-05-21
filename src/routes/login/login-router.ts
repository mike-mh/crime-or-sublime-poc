import { Request, Response, Router } from "express";
import { UserModel } from "./../../models/user/user-model";
import { CoSAbstractRouteHandler } from "./../cos-abstract-route-handler";
import { HTTPMethods } from "./../cos-route-constants";

/**
 * This will handle all login requests
 */
export class LoginRouter extends CoSAbstractRouteHandler {
    private static isInstantiated: boolean = false;

    /**
     * Initializes all handlers for login requests and keeps singleton pattern.
     */
    public constructor(protected router: Router) {
        super(router);
        if (LoginRouter.isInstantiated) {
            throw new Error("Login router already instantiated");
        }

        this.stageRequestPathHandlerTuples();
        this.installRequestHandlers();

        LoginRouter.isInstantiated = true;
    }

    /**
     * Stages handlers to be installed on router. Fill with more details after
     * it is known what handlers are going to do.
     */
    protected stageRequestPathHandlerTuples(): void {

        /**
         * Makes all necessary calls to models to verify user login.
         *
         * @param req - Incoming request
         * @param res - Server response
         */
        const submitLoginCredentials = (req: Request, res: Response) => {
            const params = req.body.params;

            if (params === undefined) {
                res.json({ error: { code: -500, message: "No data received", id: "id" } });
                return;
            }

            const email = params.email;
            const password = params.password;

            // Ensure parameters are set
            if (!email) {
                res.json({ error: { code: -500, message: "Need an email", id: "id" } });
                return;
            }

            if (!password) {
                res.json({ error: { code: -500, message: "No password received", id: "id" } });
                return;
            }

            const User = new UserModel();
            User.authenticate(email, password)
                .then((messsage) => {
                    if (req.session.email === email) {
                        throw new Error("User already logged in.");
                    }
                    req.session.email = email;
                    res.json({ result: { email } });
                })
                .catch((err) => {
                    res.json({ error: err });
                });
        };

        this.stageAsRequestHandeler(HTTPMethods.Post, ["/submit-credentials", submitLoginCredentials]);
    }

}
