import * as express from "express";
import { Express, Router } from "express";
import * as mongoose from "mongoose";
import { CoSModelInitializer } from "./models/cos-model-initializer";
import { CoSRouter } from "./routes/cos-router";

// For testing
import { UserModel } from "./models/user/user-model";
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
                tempUser.createTempUser("abcdefgh", "abcde@abcde.com", "falootin")
                    .then(() => {
                        // Need to get the registration key for testing.
                        return new Promise((resolve, reject) => {
                            tempUser.getModel()
                                .find({ email: "abcde@abcde.com" })
                                .then((users) => {
                                    if (users.length) {
                                        resolve(users.shift().registrationKey);
                                    }
                                    reject(new Error("User does not exist"));
                                })
                        });
                    })
                    .then((registrationKey: string) => {
                        // Register the user
                        let tempUser = new TempUserModel();
                        return tempUser.registerUser("abcde@abcde.com", registrationKey);
                    })
                    .then(() => {
                        let user = new UserModel();
                        console.log("Let's try authenticating...");
                        return user.authenticate("abcde@abcde.com", "falootin");
                    })
                    .then(() => {
                        console.log("Oh my God... You win dawg!");
                        console.log("Now let's try giving a shit password.");
                        let user = new UserModel();
                        return user.authenticate("abcde@abcde.com", "faootin");
                    })
                    .catch((err) => {
                        console.log(err);
                    });

            }, (error) => {
                process.stderr.write("MongoDB connection error. Please make sure MongoDB is running.\n");
            });


        this.router.intializeRouteHandlers();

        this.app.use("/", this.router.getRouter());
        this.app.listen(8000, () => { process.stdout.write("Serevr initialized\n"); });
    }
}
