import { Request, Response, Router } from "express";
import { UserModel } from "./../../models/user/user-model";
import { CoSAbstractRouteHandler } from "./../cos-abstract-route-handler";
import { HTTPMethods } from "./../cos-route-constants";

/**
 * This will handle all login requests
 */
export class LoginRouter extends CoSAbstractRouteHandler {
    private static isInstantiated: boolean = false;
    private readonly LOGIN_PATH: string = "/submit-credentials";

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
     * Stages handlers to be installed on router.
     */
    protected stageRequestPathHandlerTuples(): void {
        this.stageAsRequestHandeler(HTTPMethods.Post, [this.LOGIN_PATH, this.submitLoginCredentials]);
    }

    /**
     * Verifies with backend that credentials user submitted are correct.
     *
     * @param req - Incoming request
     * @param res - Server response
     */
    private submitLoginCredentials(req: Request, res: Response): void {
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
                    res.json({error: {message: "User already logged in."}});
                    return;
                }
                req.session.email = email;
                res.json({ result: { email } });
            })
            .catch((err) => {
                if (!res.headersSent) {
                    // There is some strange bug here where the headers appear
                    // to change when a promise fails to resolve. Can send
                    // strings but need to investigate.
                    res.send("{ error: { message: " + err.message + " }}");
                }
            });
    }

}
