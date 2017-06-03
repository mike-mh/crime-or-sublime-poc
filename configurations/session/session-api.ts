import { CoSAPI } from "../cos-api";

/**
 * Use this class to enforce the schema definitions assigned to session related
 * tasks.
 */
export class SessionAPI extends CoSAPI {

    // Use these to allow easy access from other classes.
    public readonly SESSION_CREATE_USER_PATH: string = "/session-create-user";
    public readonly SESSION_END_USER_PATH: string = "/session-end-user";
    public readonly SESSION_VERIFY_USER_PATH: string = "/session-verify-user";
    public readonly responses = {
        AlreadyActiveSessionError: {
            name: "AlreadyActiveSessionError",
            message: "Session is already active sesison",
        },
        InvalidCredentialsError: {
            name: "InvalidCredentialsError",
            message: "Credentials provided are incorrect",
        },
        InvalidParametersError: {
            name: "InvalidParametersError",
            message: "Parameters provided are incorrect",
        },
        InternalServerError: {
            name: "InternalServerError",
            message: "Internal server error occured",
        },
        NoActiveSessionError: {
            name: "NoActiveSessionError",
            message: "There is no active session",
        },
        SessionLockoutError: {
            name: "SessionLockoutError",
            message: "You have tried to login over a thousand times... Nice try asshole.",
        }

    }

    constructor() {
        super();
        this.associatePathsWithMethodsAndParams([
            this.SESSION_CREATE_USER_PATH,
            this.SESSION_END_USER_PATH,
            this.SESSION_VERIFY_USER_PATH,
        ]);
    }
}
