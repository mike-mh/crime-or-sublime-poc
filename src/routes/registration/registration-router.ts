import { Request, Response, Router } from "express";
import { CoSAbstractRouteHandler } from "../cos-abstract-route-handler";
import { HTTPMethods } from "../cos-route-constants";

/**
 * This will handle all registration requests
 */
export class RegistrationRouter extends CoSAbstractRouteHandler {
    private static isInstantiated: boolean = false;

    /**
     * Initializes all handlers for registration requests and keeps singleton
     * pattern.
     */
    public constructor(protected router: Router) {
        super(router);
        if (RegistrationRouter.isInstantiated) {
            throw new Error("Profile router already instantiated");
        }

        this.stageRequestPathHandlerTuples();
        this.instalRequestHandlers();

        RegistrationRouter.isInstantiated = true;
    }

    /**
     * Stages handlers to be installed on router. Fill with more details after
     * it is known what handlers are going to do.
     */
    protected stageRequestPathHandlerTuples(): void {
        const handlerOne = (req: Request, res: Response) => { res.send("This is the registration page!"); };
        const handlerTwo = (req: Request, res: Response) => {
            const first = req.params.first;
            const second = req.params.second;
            res.send("Here's your data: " + first + " and " + second);
        };

        this.stageAsRequestHandeler(HTTPMethods.Get, ["/registration", handlerOne]);
        this.stageAsRequestHandeler(HTTPMethods.Get, ["/registration/:first/:second", handlerTwo]);
    }

}
