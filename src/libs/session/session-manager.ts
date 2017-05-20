import { RequestHandler } from "express";
import * as session from "express-session";
import { SessionOptions } from "express-session";
import * as mongoose from "mongoose";

/**
 * This class is responsible for managing all user sessions.
 * 
 * TO-DO: Look for alternatives to connect-mongo
 */
export class SessionManager {
    private static sessionConfiguration: RequestHandler = session({
        cookie: { maxAge: 86400000, secure: false },
        resave: false,
        rolling: true,
        saveUninitialized: false,
        secret: process.env.COOKIE_SECRET,
        store: new (require('connect-mongo')(session))({mongooseConnection: mongoose.connection}),
    });

    /**
     * Basic getter for the session settings to initalize express with.
     * 
     * @return - The session configuration.
     */
    public static getSessionConfiguration(): RequestHandler {
        return this.sessionConfiguration;
    }
}