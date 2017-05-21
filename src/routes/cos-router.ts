import { Request, RequestHandler, Response, Router } from "express";
import { CoSAbstractRouteHandler } from "./cos-abstract-route-handler";
import { CoSRouteConstants, HTTPMethods, RequestPathTupleIndices } from "./cos-route-constants";
import { LoginRouter } from "./login/login-router";
import { LogoutRouter } from "./logout/logout-router";
import { ProfileRouter } from "./profile/profile-router";
import { RegistrationRouter } from "./registration/registration-router";

/**
 * Initializes all middleware for CoS. Installs all routes and handlers into
 * a single express router.
 */
export class CoSRouter {
    private router: Router;
    private routeHandlers: CoSAbstractRouteHandler[] = [];

    /**
     * Instantiates the router
     */
    public constructor() {
        this.router = Router();
    }

    /**
     * Initializes all routehandlers for CoS and installs them to router.
     */
     public intializeRouteHandlers(): void {
         this.routeHandlers.push(new LoginRouter(this.router));
         this.routeHandlers.push(new LogoutRouter(this.router));
         this.routeHandlers.push(new ProfileRouter(this.router));
         this.routeHandlers.push(new RegistrationRouter(this.router));
     }

    /**
     * Simple getter method for router associated with class.
     */
    public getRouter() {
        return this.router;
    }
}
