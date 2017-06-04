import { CoSServer } from "./cos-server";
import mongoose = require("mongoose");
import { SessionManager } from "./libs/session/session-manager";

/**
 * Should come back to this later as the application has more configurations
 * set. Right now all this can really test for is that all of the necessarry
 * steps for server initialization are executed but there should be more tests
 * later to confirm that the server has the proper configurations set.
 */
describe("CoSServer", () => {
    // Use any type to make private members visable.
    let cosServer: any;
    let mongooseSpy: jasmine.Spy;
    let methodSpy: jasmine.Spy;
    let socketListenerSpy: jasmine.Spy;

    beforeEach(() => {
        cosServer = new CoSServer();
    });

    it("should add session configurations to the express application", () => {
        cosServer.configureExpressApp();
        // Unfortunately, this is the tidiest way to get individual comoponents
        // of an Express application. It"s still posisble to test
        // configurations by ensuring that their pointer values are equal to
        // what is expected such as here.
        expect(cosServer.app._router.stack[2].handle).toEqual(SessionManager.getSessionConfiguration());
    });

    it("should initialize all static file serving route handlers", () => {
        methodSpy = spyOn(cosServer.router, "initializeStaticRoutes");
        cosServer.intializeMiddleware();
        expect(methodSpy).toHaveBeenCalledTimes(1);
    });

    it("should initialize all API route handlers", () => {
        methodSpy = spyOn(cosServer.router, "intializeRouteHandlers");
        cosServer.intializeMiddleware();
        expect(methodSpy).toHaveBeenCalledTimes(1);
    });

    it("should intialize all mongoose models", () => {
        methodSpy = spyOn(cosServer.modelInitializer, "initiaizeModels");
        cosServer.intializeMiddleware();
        expect(methodSpy).toHaveBeenCalledTimes(1);
    });

    it("should establish a connection to the database via mongoose after intializing", () => {
        mongooseSpy = spyOn(mongoose, "connect");
        mongooseSpy.and.returnValue(Promise.resolve());

        socketListenerSpy = spyOn(cosServer, "listenToSocket");
        socketListenerSpy.and.returnValue(undefined);

        cosServer.initializeServer();

        expect(mongooseSpy).toHaveBeenCalledTimes(1);
    });

    it("should configure the express app after connecting to database", (done) => {
        mongooseSpy = spyOn(mongoose, "connect");
        mongooseSpy.and.returnValue(Promise.resolve());

        socketListenerSpy = spyOn(cosServer, "listenToSocket");
        socketListenerSpy.and.returnValue(undefined);

        methodSpy = spyOn(cosServer, "configureExpressApp");

        cosServer.initializeServer();
        setTimeout(() => {
            expect(methodSpy).toHaveBeenCalledTimes(1);
            done();
        }, 500);
    });

    it("should intialize all middleware after connecting to database", (done) => {
        mongooseSpy = spyOn(mongoose, "connect");
        mongooseSpy.and.returnValue(Promise.resolve());

        socketListenerSpy = spyOn(cosServer, "listenToSocket");
        socketListenerSpy.and.returnValue(undefined);

        methodSpy = spyOn(cosServer, "intializeMiddleware");

        cosServer.initializeServer();

        setTimeout(() => {
            expect(methodSpy).toHaveBeenCalledTimes(1);
            done();
        }, 500);

    });
});
