import * as express from "express";
import { Express, Response, Router } from "express";
import { Server } from "http";
import mongoose = require("mongoose");
import { SessionManager } from "./libs/session/session-manager";
import { CoSRouter } from "./routes/cos-router";

// These are temporary
import { GraffitiModel } from "./models/graffiti/graffiti-model";
import { UserModel } from "./models/user/user-model";

/**
 * The main server for CoS. Make all calls to intialize components of backend
 * including the database and middleware.
 */
export class CoSServer {
    private app: Express;
    private router: CoSRouter;

    /**
     * Initializes the router and express application. Create as a singleton
     * to guarentee that the server only has a single running instance.
     */
    public constructor() {
        this.app = express();
        this.router = new CoSRouter();
        mongoose.Promise = global.Promise;
    }

    /**
     * Initializes the server to run forever on port 8000, initializes
     * middleware and database.
     */
    public initializeServer(): void {
        mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/cos")
            .then(() => {
                this.configureExpressApp();
                this.intializeMiddleware();
                this.app.use("/", this.router.getRouter());
                this.listenToSocket(process.env.PORT || 8000);

            }, (error) => {
                process.stderr.write("MongoDB connection error.\n");
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
