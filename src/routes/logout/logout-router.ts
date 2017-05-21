import { Request, Response, Router } from "express";
import { UserModel } from "./../../models/user/user-model";
import { CoSAbstractRouteHandler } from "./../cos-abstract-route-handler";
import { HTTPMethods } from "./../cos-route-constants";

/**
 * Really simple class for log out. May fuse it with other classes later but
 * giving it its own class for now in case logout will be given more
 * responsibilities than ending a user session.
 */
export class LogoutRouter extends CoSAbstractRouteHandler {
    private static isInstantiated: boolean = false;

    /**
     * Initializes all handlers for logout requests and keeps singleton pattern.
     */
    public constructor(protected router: Router) {
        super(router);
        if (LogoutRouter.isInstantiated) {
            throw new Error("Login router already instantiated");
        }

        this.stageRequestPathHandlerTuples();
        this.installRequestHandlers();

        LogoutRouter.isInstantiated = true;
    }

    protected stageRequestPathHandlerTuples(): void {
        /**
         * Terminates the current session of a user.
         */
        const logUserOut = (req: Request, res: Response) => {
            req.session.destroy((error) => {
                error ?
                    res.json({error: {message: "Error occured deleting session."}}) :
                    res.json({result: {}});
            });
        };

        this.stageAsRequestHandeler(HTTPMethods.Get, [ "/logout", logUserOut]);
    }
}