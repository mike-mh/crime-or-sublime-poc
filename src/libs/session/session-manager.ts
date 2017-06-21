/**
 * @author Michael Mitchell-Halter
 */

/**
 * @author Michael Mitchell-Halter
 */

import { RequestHandler } from "express";
import * as session from "express-session";
import { SessionOptions } from "express-session";
import * as mongoose from "mongoose";

/**
 * This class is responsible for managing all user sessions.
 */
export class SessionManager {
    /**
     * Basic getter for the session settings to initalize express with.
     *
     * @return - The session configuration.
     */
    public static getSessionConfiguration(): RequestHandler {
        return this.sessionConfiguration;
    }

    /**
     * This retrueves the session configuration to pass into the CoS express
     * application.
     */
    private static sessionConfiguration: RequestHandler = session({
        // Sessions should last for only one day.
        cookie: { maxAge: 1000 * 60 * 60 * 24, secure: false },
        resave: false,
        rolling: true,
        saveUninitialized: false,
        secret: process.env.COOKIE_SECRET,
        // Need to look into possibly replacing connect-mongo.
        store: new (require("connect-mongo")(session))({mongooseConnection: mongoose.connection}),
    });
}
