import { CoSAPI } from "../../cos-api";

/**
 * Use this class to enforce the schema definitions assigned to session related
 * tasks.
 */
export class UserRegsiterAPI extends CoSAPI {

    public readonly USER_REGISTER_CONFIRM_PATH: string = "/user-register-confirm";
    public readonly USER_REGISTER_SUBMIT_PATH: string = "/user-register-submit";

    constructor() {
        super();
        this.associatePathsWithMethodsAndParams([
            this.USER_REGISTER_CONFIRM_PATH,
            this.USER_REGISTER_SUBMIT_PATH,
        ]);
    }

}
