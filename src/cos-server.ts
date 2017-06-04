import * as express from "express";
import { Express, Response, Router } from "express";
import { Server } from "http";
import mongoose = require("mongoose");
import { SessionManager } from "./libs/session/session-manager";
import { CoSModelInitializer } from "./models/cos-model-initializer";
import { CoSRouter } from "./routes/cos-router";

/**
 * The main server for CoS. Make all calls to intialize components of backend
 * including the database and middleware.
 */
export class CoSServer {
    private app: Express;
    private router: CoSRouter;
    private modelInitializer: CoSModelInitializer;

    /**
     * Initializes the router and express application. Create as a singleton
     * to guarentee that the server only has a single running instance.
     */
    public constructor() {
        this.app = express();
        this.router = new CoSRouter();
        this.modelInitializer = new CoSModelInitializer();
        mongoose.Promise = global.Promise;
    }

    /**
     * Initializes the server to run forever on port 8000, initializes
     * middleware and database.
     */
    public initializeServer(): void {
        mongoose.connect("mongodb://localhost/cos")
            .then(() => {
                this.configureExpressApp();
                this.intializeMiddleware();
                this.app.use("/", this.router.getRouter());
                this.listenToSocket(8000);
            }, (error) => {
                process.stderr.write("MongoDB connection error. Please make sure MongoDB is running.\n");
            });
    }

    /**
     * Configures the express application.
     */
    private configureExpressApp(): void {
        this.app.use(SessionManager.getSessionConfiguration());
        this.app.use(express.static("dist/public"));
    }

    /**
     * Use this to initialize the middleware including routes and mongoose
     * models.
     */
    private intializeMiddleware(): void {
        this.router.initializeStaticRoutes();
        this.router.intializeRouteHandlers();
        this.modelInitializer.initiaizeModels();
    }

    /**
     * Listens to specified socket.
     *
     * @param socket - The socket to listen to.
     */
    private listenToSocket(socket: (string | number)): Server {
        return this.app.listen(8000, () => {
            process.stdout.write("Server initialized\n");
        });
    }
}
