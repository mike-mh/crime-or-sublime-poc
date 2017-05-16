import { IRouterMatcher, Request, RequestHandler, RequestParamHandler, Response, Router } from "express";
import { CoSRouteConstants, HTTPMethods, RequestPathTupleIndices } from "./cos-route-constants";

/**
 * Super class for all classes responsible for installing handlers to
 * different routes depending on their function. For instance, a LoginRoute
 * class could extend this class and install all handlers to all routes
 * concerened with the function of logging in. This class should never need to
 * be instantiated outside of a subclasses constructor.
 *
 * Class should define all necessarry utility methods here leaving the
 * subclasses inheriting from it responsible for only creating the handlers and
 * for the proper paths and installing them to the router using the utility
 * methods already written in this class.
 */
export abstract class CoSAbstractRouteHandler {
    // 2D array to associate parameters to be passed into the router.METHOD()
    // method specified by the express router according to their assigned HTTP
    // method. The index of the outer array is the assigned HTTP method and the
    // value of which can be found in the HTTPMethods enum.
    protected methodPathRequestHandlerMap: Array<Array<[string, RequestHandler]>> = [];

    // Use this to store an array of pointers for the various router.METHOD()
    // functions. This is used as a work around for some of the restrictions
    // in Typescript and to be more in keeping with OOP purity. The indexes of
    // the array are based on the HTTPMethods enum.
    //
    // See the 'initializeRequestHandler' method for a deeper understanding of
    // how this is used.
    protected routerRequestMatcherMap: Array<IRouterMatcher<Router>> = [];

    // TO-DO: Unsure if parameters will be heavily used but if so, this should
    //        be worked in to make it easy to install their handling in a
    //        fashion similar to how handler's are installed.
    protected requestParamHandlerMap: { [param: string]: RequestParamHandler[] };

    /**
     * Initializes memory for the methodPathRequestHandlerMap and
     * routerRequestMatcherMap arrays.
     *
     * @param router - The express router that is to have various handlers
     *     installed to by the subclasses of this class.
     */
    protected constructor(protected router: Router) {
        for (const method in HTTPMethods) {
            if (HTTPMethods.hasOwnProperty(method)) {
                this.methodPathRequestHandlerMap[method] = [];
            }
        }

        // TO-DO: Hard code this for now but see if these can be added in using
        //        the loop above.
        this.routerRequestMatcherMap[HTTPMethods.Get] = router.get;
        this.routerRequestMatcherMap[HTTPMethods.Put] = router.put;
        this.routerRequestMatcherMap[HTTPMethods.Post] = router.post;
        this.routerRequestMatcherMap[HTTPMethods.Delete] = router.delete;
        this.routerRequestMatcherMap[HTTPMethods.Patch] = router.patch;
        this.routerRequestMatcherMap[HTTPMethods.Options] = router.options;
        this.routerRequestMatcherMap[HTTPMethods.Head] = router.head;
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
     * Associates a tuple containing a path and request handler to the class'
     * methodPathRequestHandlerMap at the method specified in this function to
     * be installed later.
     *
     * @param method - The HTTP method to be associated with the given path and
     *    handler, i.e. making it so that once installed the handler will only
     *    activate if the given HTTP method is used to call it.
     * @param requestPathHandlerTuple - Tuple containing the path and handler
     *    to be used by the express router once it is installed.
     */
    protected stageAsRequestHandeler(method: HTTPMethods, requestPathHandlerTuple: [string, RequestHandler]): void {
        if (!(method in HTTPMethods)) {
            throw new Error("Invalid HTTP method given: " + method);
        }

        this.methodPathRequestHandlerMap[method].push(requestPathHandlerTuple);
    }

    /**
     * Installs all request handlers stored in methodPathRequestHandlerMap into
     * the express router and associating them with the proper HTTP method.
     */
    protected instalRequestHandlers(): void {
        for (const method in HTTPMethods) {
            if (HTTPMethods.hasOwnProperty(method)) {
                for (const tuple of this.methodPathRequestHandlerMap[method]) {
                    const path = tuple[RequestPathTupleIndices.Path];
                    const handler = tuple[RequestPathTupleIndices.Handler];
                    this.routerRequestMatcherMap[method].call(this.router, path, handler);
                }
            }
        }
    }

    /**
     * Method used to generate all handlers and associate them to their proper
     * paths in a tuple to be staged. Will be unique for each subclass.
     */
    protected abstract stageRequestPathHandlerTuples(): void;
}
