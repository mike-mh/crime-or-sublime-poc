import { Request, Response, Router } from "express";
import { CoSAbstractRouteHandler } from "../cos-abstract-route-handler";
import { HTTPMethods } from "../cos-route-constants";

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
        this.instalRequestHandlers();

        LoginRouter.isInstantiated = true;
    }

    /**
     * Stages handlers to be installed on router. Fill with more details after
     * it is known what handlers are going to do.
     */
    protected stageRequestPathHandlerTuples(): void {
        const handlerOne = (req: Request, res: Response) => { res.send("This is the login page!"); };
        const handlerTwo = (req: Request, res: Response) => {
            const id = req.params.id;
            res.send("Here's your id: " + id);
        };

        this.stageAsRequestHandeler(HTTPMethods.Get, ["/login", handlerOne]);
        this.stageAsRequestHandeler(HTTPMethods.Get, ["/login/:id", handlerTwo]);
    }

}
