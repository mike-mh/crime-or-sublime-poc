import { CoSAPI } from "../../cos-api";

/**
 * Use this class to enforce the schema definitions assigned to session related
 * tasks.
 */
export class UserRegsiterAPI extends CoSAPI {

    public readonly USER_REGISTER_CONFIRM_PATH: string = "/user-register-confirm/:id/:key";
    public readonly USER_REGISTER_SUBMIT_PATH: string = "/user-register-submit";
    public readonly responses = {
        InternalServerError: {
            error: {
                message: "Internal server error occured",
                name: "InternalServerError",
            },
        },
        InvalidParametersError: {
            error: {
                message: "Parameters provided are incorrect",
                name: "InvalidParametersError",
            },
        },
        InvalidRegistrationError: {
            error: {
                message: "Data provided for registration is incorrect",
                name: "InvalidRegistrationError",
            },
        },
    };

    constructor() {
        super();
        this.associatePathsWithMethodsAndParams([
            this.USER_REGISTER_CONFIRM_PATH,
            this.USER_REGISTER_SUBMIT_PATH,
        ]);
    }

}
