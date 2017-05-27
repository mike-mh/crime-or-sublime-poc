import { Request, Response, Router } from "express";
import { UserModel } from "../../models/user/user-model";
import { CoSAbstractRouteHandler } from "../cos-abstract-route-handler";
import { HTTPMethods } from "../cos-route-constants";

/**
 * This will handle all profile requests
 */
export class ProfileRouter extends CoSAbstractRouteHandler {
    private static isInstantiated: boolean = false;
    private readonly GET_USER_PATH: string = "/get-user";

    /**
     * Initializes all handlers for profile requests and keeps singleton pattern.
     */
    public constructor(protected router: Router) {
        super(router);
        if (ProfileRouter.isInstantiated) {
            throw new Error("Profile router already instantiated");
        }

        this.stageRequestPathHandlerTuples();
        this.installRequestHandlers();

        ProfileRouter.isInstantiated = true;
    }

    /**
     * Stages handlers to be installed on router. Fill with more details after
     * it is known what handlers are going to do.
     */
    protected stageRequestPathHandlerTuples(): void {
        this.stageAsRequestHandeler(HTTPMethods.Get, [this.GET_USER_PATH, this.getUser]);
    }

    /**
     * Use this to get user information.
     *
     * @param req - Incoming request
     * @param res - Server response
     */
    private getUser(req: Request, res: Response): void {
        if (!req.session.email) {
            res.json({ error: { code: -500, message: "User not found.", id: "id" } });
            return;
        }

        new UserModel().checkUserExists(req.session.email)
            .then(() => {
                res.json({ result: { email: req.session.email } });
            })
            .catch((error) => {
                res.json({ error: { message: "Invalid session." }});
            });

    }
}
