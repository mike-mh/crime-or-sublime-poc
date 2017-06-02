import { json } from "body-parser";
import { IRouterMatcher, Request, RequestHandler, RequestParamHandler, Response, Router } from "express";
import { CoSAPI } from "../../configurations/cos-api";
import { CoSRouteConstants, RequestPathTupleIndices } from "./cos-route-constants";

/**
 * Super class for all classes responsible for installing handlers to
 * different routes depending on their function. For instance, a SessionRoute
 * class could extend this class and install all handlers to all routes
 * concerened with the function of logging in.
 *
 * Class should define all necessarry utility methods here leaving the
 * subclasses inheriting from it responsible for only creating the handlers and
 * calling those methods.
 */
export abstract class CoSAbstractRouteHandler {

    // Use this to store an array of pointers for the various router.METHOD()
    // functions. This is used as a work around for some of the restrictions
    // in Typescript.
    //
    // See the 'installRequestHandlers' method for a deeper understanding of
    // how this is used.
    protected routerRequestMatcherMap: {[method: string]: IRouterMatcher<Router>} = {};

    /**
     * Initializes memory for the methodPathRequestHandlerMap and
     * routerRequestMatcherMap arrays.
     *
     * @param router - The express router that is to have various handlers
     *     installed to by the subclasses of this class.
     */
    protected constructor(protected router: Router) {

        // Hard code this for now but see if there is a more elegent solution.
        this.routerRequestMatcherMap.get = router.get;
        this.routerRequestMatcherMap.put = router.put;
        this.routerRequestMatcherMap.post = router.post;
        this.routerRequestMatcherMap.delete = router.delete;
        this.routerRequestMatcherMap.patch = router.patch;
        this.routerRequestMatcherMap.options = router.options;
        this.routerRequestMatcherMap.head = router.head;
    }

    /**
     * Simple getter method for this classes associated express router.
     *
     * @return Router
     */
    public getRouter(): Router {
        return this.router;
    }

    /**
     * Installs all request handlers stored in methodPathRequestHandlerMap into
     * the express router and associating them with the proper HTTP method.
     */
    protected installRequestHandlers(requestPathHandlerTuples: Array<[string, string, RequestHandler]>, api: CoSAPI): void {
        // Verify that each meet constraints
        requestPathHandlerTuples.map((tuple) => {
            const method = tuple[RequestPathTupleIndices.Method];
            const path = tuple[RequestPathTupleIndices.Path];
            const handler = tuple[RequestPathTupleIndices.Handler];

            // Ensure the method is allowed to be installed.
            try {
                !api.isMethodAssigned(method, path)
            } catch (error) {
                throw error;
            }

            // Install the handler on the router.
            this.routerRequestMatcherMap[method].call(this.router, path, json(), handler);
        });
    }

}
