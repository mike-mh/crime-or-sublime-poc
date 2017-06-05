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
            error: {
                message: "Session is already active sesison",
                name: "AlreadyActiveSessionError",
            },
        },
        InternalServerError: {
            error: {
                message: "Internal server error occured",
                name: "InternalServerError",
            },
        },
        InvalidCredentialsError: {
            error: {
                message: "Credentials provided are incorrect",
                name: "InvalidCredentialsError",
            },
        },
        InvalidParametersError: {
            error: {
                message: "Parameters provided are incorrect",
                name: "InvalidParametersError",
            },
        },
        NoActiveSessionError: {
            error: {
                message: "There is no active session",
                name: "NoActiveSessionError",
            },
        },
        SessionLockoutError: {
            error: {
                message: "You have tried to login over a thousand times... Nice try asshole.",
                name: "SessionLockoutError",
            },
        },
        TemporarySessionLockoutError: {
            error: {
                message: "You've been temporarly locked out of your account. Wait a few minutes and try again.",
                name: "TemporarySessionLockoutError",
            },
        },
    };

    constructor() {
        super();
        this.associatePathsWithMethodsAndParams([
            this.SESSION_CREATE_USER_PATH,
            this.SESSION_END_USER_PATH,
            this.SESSION_VERIFY_USER_PATH,
        ]);
    }
}
