import { RequestHandler, Router } from "express";
import { CoSAPI } from "../../configurations/cos-api";
import { CoSAbstractRouteHandler } from "./cos-abstract-route-handler";
import { CoSRouter } from "./cos-router";
import { CoSRouteConstants } from "./cos-route-constants";

/**
 * Should come back to this later to find a more robust way of ensuring
 * that all non-static file serving routes are installed to the router
 * correctly. The actual installation of the route handler to the router is the
 * responsibility of the route handler class itself but it would be a good idea
 * to come up with a way to ensure that all necessarry route handlers are
 * instantiated and installed.
 */
describe("CoSRouter", () => {
    let cosRouter: CoSRouter;
    let staticRoutes = CoSRouteConstants.COS_CLIENT_PATHS;

    beforeEach(() => {
        cosRouter = new CoSRouter();
    });

    it("should install a single route for all file serving routes on an express router", () => {
        cosRouter.initializeStaticRoutes();

        staticRoutes.map((route) => {
            let found = false;
            cosRouter.getRouter().stack.map((layer) => {
                if (layer.route.path === route) {
                    // If this triggered, a duplicate exists in the static paths.
                    expect(found).toBe(false);
                    found = true;
                }
            })
            expect(found).toBe(true);
        });
    });
});

describe("CoSAbstractRouteHandler", () => {
    class SampleRouteHandler extends CoSAbstractRouteHandler {
        constructor(router: Router) {
            super(router);
        }
    }

    class SampleAPI extends CoSAPI {

    }

    let sampleRouteHandler: any;

    const sampleRouter: Router = Router();
    const sampleAPI: any = new SampleAPI();
    // Don't need this to do anything. Just need a pointer to test against.
    const sampleHandler: RequestHandler = () => { };

    // Configure this with any paths from the API you wish.
    const routesToTest: string[] = [
        "/session-create-user",
        "/user-register-confirm/:id/:key"
    ];

    beforeEach(() => {
        sampleRouteHandler = new SampleRouteHandler(sampleRouter);
        sampleAPI.associatePathsWithMethodsAndParams(routesToTest);
    });

    // This is a bit confusing but this was put in as a work around to mapping
    // callbacks to different HTTP methods on the router. The method
    // implemented uses a map of pointers to each method on the router and
    // installs individual callback functions to those methods based on a
    // parameter passed into the 'installRequestHandlers' method. See this
    // method for a better understanding of this process.
    it("should map all request maps to the router correctly", () => {
        expect(sampleRouteHandler.routerRequestMatcherMap.get)
            .toEqual(sampleRouter.get);
        expect(sampleRouteHandler.routerRequestMatcherMap.put)
            .toEqual(sampleRouter.put);
        expect(sampleRouteHandler.routerRequestMatcherMap.post)
            .toEqual(sampleRouter.post);
        expect(sampleRouteHandler.routerRequestMatcherMap.delete)
            .toEqual(sampleRouter.delete);
        expect(sampleRouteHandler.routerRequestMatcherMap.patch)
            .toEqual(sampleRouter.patch);
        expect(sampleRouteHandler.routerRequestMatcherMap.options)
            .toEqual(sampleRouter.options);
        expect(sampleRouteHandler.routerRequestMatcherMap.head)
            .toEqual(sampleRouter.head);
    });

    it("should reject to install handlers that do not exist on the schema", () => {
        try {
            sampleRouteHandler.installRequestHandlers([
                ["get", "/raboof", sampleHandler]
            ], sampleAPI);
        } catch (error) {
            expect(error.name).toEqual(sampleAPI.PATH_ERROR);
        }
    });

    it("should reject to install handlers that are assigned to an HTTP method not in their schema", () => {
        try {
            sampleRouteHandler.installRequestHandlers([
                ["get", "/session-create-user", sampleHandler]
            ], sampleAPI);
        } catch (error) {
            expect(error.name).toEqual(sampleAPI.METHOD_ERROR);
        }
    });

    it("should install all properly provided routes to the express router.", () => {
        try {
            sampleRouteHandler.installRequestHandlers([
                ["post", "/session-create-user", sampleHandler],
                ["get", "/user-register-confirm/:id/:key", sampleHandler]
            ], sampleAPI);
        } catch (error) {
            expect(true).toEqual(false);
        }

        sampleRouter.stack.map((layer) => {
            let found = false;
            routesToTest.map((path) => {
                if (path === layer.route.path) {
                    // If this triggered, a duplicate exists in the paths.
                    expect(found).toBe(false);
                    found = true;
                }
            })
            expect(found).toBe(true);
        });
    });

});