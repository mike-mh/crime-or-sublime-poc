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
                name: "AlreadyActiveSessionError",
                message: "Session is already active sesison",
            }
        },
        InvalidCredentialsError: {
            error: {
                name: "InvalidCredentialsError",
                message: "Credentials provided are incorrect",
            }
        },
        InvalidParametersError: {
            error: {
                name: "InvalidParametersError",
                message: "Parameters provided are incorrect",
            }
        },
        InternalServerError: {
            error: {
                name: "InternalServerError",
                message: "Internal server error occured",
            }
        },
        NoActiveSessionError: {
            error: {
                name: "NoActiveSessionError",
                message: "There is no active session",
            }
        },
        SessionLockoutError: {
            error: {
                name: "SessionLockoutError",
                message: "You have tried to login over a thousand times... Nice try asshole.",
            }
        },
        TemporarySessionLockoutError: {
            error: {
                name: "TemporarySessionLockoutError",
                message: "You've been temporarly locked out of your account. Wait a few minutes and try again.",
            }
        },
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
