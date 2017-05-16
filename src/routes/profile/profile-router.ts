import { Request, Response, Router } from "express";
import { CoSAbstractRouteHandler } from "../cos-abstract-route-handler";
import { HTTPMethods } from "../cos-route-constants";

/**
 * This will handle all profile requests
 */
export class ProfileRouter extends CoSAbstractRouteHandler {
    private static isInstantiated: boolean = false;

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
        const handlerOne = (req: Request, res: Response) => { res.send("This is the profile page!"); };
        const handlerTwo = (req: Request, res: Response) => {
            const secret = req.params.secret;
            res.send("Here's your secret: " + secret);
        };

        this.stageAsRequestHandeler(HTTPMethods.Get, ["/profile", handlerOne]);
        this.stageAsRequestHandeler(HTTPMethods.Get, ["/profile/:secret", handlerTwo]);
    }

}
