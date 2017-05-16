import * as express from "express";
import { Express, Router } from "express";
import * as mongoose from "mongoose";
import { CoSModelInitializer } from "./models/cos-model-initializer";
import { CoSRouter } from "./routes/cos-router";

// For testing
import { TempUserModel } from "./models/user/temp-user-model";

/**
 * The main server for CoS. Make all calls to intialize components of backend
 * including the database and middleware.
 */
export class CoSServer {
    private app: Express;
    private router: CoSRouter;

    /**
     * Initializes the router and express application.
     */
    public constructor() {
        // Just set in constructor for now
        this.router = new CoSRouter();
        this.app = express();
    }

    /**
     * Initializes the server to run forever on port 8000, initializes
     * middleware and database.
     */
    public initalizeServer(): void {
        (<any>mongoose).Promise = global.Promise;
        mongoose.connect("localhost:27017")
            .then(() => {
                process.stdout.write("You is connected baby!\n");
                const modelInitializer = new CoSModelInitializer();
                modelInitializer.initiaizeModels();

                const tempUser = new TempUserModel();
                console.log("Making the call...");
                tempUser.createTempUser("abcdef", "abcd@abc.com", "falootin")
                    .then(() => {
                        console.log("You win!");
                    })
                    .catch((err) => {
                        console.log(err.message);
                    });

            }, (error) => {
                process.stderr.write("MongoDB connection error. Please make sure MongoDB is running.\n");
            });


        this.router.intializeRouteHandlers();

        this.app.use("/", this.router.getRouter());
        this.app.listen(8000, () => { process.stdout.write("Serevr initialized\n"); });
    }
}
