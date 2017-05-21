import * as express from "express";
import { Express, Response, Router } from "express";
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
    private readonly APP_LOCATION: string = __dirname + "public/index.html";

    /**
     * Initializes the router and express application.
     */
    public constructor() {
        this.app = express();
        this.router = new CoSRouter();
    }

    /**
     * Initializes the server to run forever on port 8000, initializes
     * middleware and database.
     */
    public initalizeServer(): void {
        mongoose.Promise = global.Promise;
        mongoose.connect("mongodb://localhost/cos")
            .then(() => {
                this.configureExpressApp();
                this.intializeMiddleware();
                this.app.use("/", this.router.getRouter());
                this.app.listen(8000, () => {
                    process.stdout.write("Server initialized\n");
                });

            }, (error) => {
                process.stderr.write("MongoDB connection error. Please make sure MongoDB is running.\n");
            });
    }

    /**
     * Configures the express application.
     */
    private configureExpressApp(): void {
        this.app.use(SessionManager.getSessionConfiguration());
        this.app.use(express.static("dist/public", {
            setHeaders: (res: Response) => {
                res.setHeader("Content-Type", "application/json");
            },
        }));
    }

    /**
     * Use this to initialize the middleware including routes and mongoose
     * models.
     */
    private intializeMiddleware(): void {
        this.router.initializeStaticRoutes();
        this.router.intializeRouteHandlers();
        const modelInitializer = new CoSModelInitializer();
        modelInitializer.initiaizeModels();

    }
}
