import { CoSAPI } from "../../cos-api";

/**
 * Use this class to enforce the schema definitions assigned to session related
 * tasks.
 */
export class UserRegsiterAPI extends CoSAPI {

    public readonly USER_REGISTER_CONFIRM_PATH: string = "/user-register-confirm/:id/:key";
    public readonly USER_REGISTER_SUBMIT_PATH: string = "/user-register-submit";
    public readonly responses = {
        InvalidParametersError: {
            error: {
                name: "InvalidParametersError",
                message: "Parameters provided are incorrect"
            }
        },
        InvalidRegistrationError: {
            error: {
                name: "InvalidRegistrationError",
                message: "Data provided for registration is incorrect"
            }
        },
        InternalServerError: {
            error: {
                name: "InternalServerError",
                message: "Internal server error occured"
            }
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
