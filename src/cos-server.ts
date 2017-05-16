import * as express from "express";
import { Express, Router } from "express";
import * as mongoose from "mongoose";
import { CoSModelInitializer } from "./models/cos-model-initializer";
import { CoSRouter } from "./routes/cos-router";

// This is just for testing.
import { PasswordHelper } from "./libs/authentication/password-helper";
import { RegistrationHelper } from "./libs/authentication/registration-helper";

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
        mongoose.connect("localhost:27017")
            .then(() => {
                process.stdout.write("You is connected baby!\n");
            }, (error) => {
                process.stderr.write("MongoDB connection error. Please make sure MongoDB is running.\n");
            });

        const modelInitializer = new CoSModelInitializer();
        modelInitializer.initiaizeModels();

        // Test
        PasswordHelper.generateSalt()
            .then((salt) => {
                process.stdout.write("PW helper salt:" + salt + "\n");
                PasswordHelper.generatePbkdf2Hash('monkeytacos', salt)
                    .then((hash) => {
                        process.stdout.write("monkeytacos and salt hash:" + hash + "\n");
                    });
            });
        RegistrationHelper.generateRegistrationKey("monkeytacos", "monkey@monkey.com")
            .then((hash) => {
                process.stdout.write("monkeytacos and monkey@monkey.com hash:" + hash + "\n");
            });

        this.router.intializeRouteHandlers();

        this.app.use("/", this.router.getRouter());
        this.app.listen(8000, () => { process.stdout.write("Serevr initialized\n"); });
    }
}
