import { Request, RequestHandler, Response, Router } from "express";
import { LoginRouter } from "./login/login-router";
import { ProfileRouter } from "./profile/profile-router";
import { RegistrationRouter } from "./registration/registration-router";
import { HTTPMethods, RequestPathTupleIndices, RouteConstants } from "./route-constants";
import { RouteHandler } from "./route-handler";

/**
 * Initializes all middleware for CoS. Installs all routes and handlers into
 * a single express router.
 */
export class CoSRouter {
    private router: Router;

    /**
     * Instantiates all routing classes which should install handlers
     * automatically
     */
    public constructor() {
        this.router = Router();
        const loginRouter = new LoginRouter(this.router);
        const profileRouter = new ProfileRouter(this.router);
        const registrationRouter = new RegistrationRouter(this.router);
    }

    /**
     * Simple getter method for router associated with class.
     */
    public getRouter() {
        return this.router;
    }
}
