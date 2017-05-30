import { CoSAPI } from "../../cos-api";

/* tslint:disable:no-var-requires */
const swaggerAPI = require("../cos-swagger.json");
/* tslint:enable:no-var-requires */

/**
 * Use this class to enforce the schema definitions assigned to session related
 * tasks.
 */
export class UserRegsiterAPI extends CoSAPI {

    public readonly USER_REGISTER_CONFIRM_PATH: string = "/user-register-confirm";
    public readonly USER_REGISTER_SUBMIT_PATH: string = "/user-register-submit";
    public readonly USER_REGISTER_PARAM_ERROR: string = "UserRegisterParamError";

    private readonly USER_REGISTER_CONFIRM_PATH_PARAMS: object[] =
        swaggerAPI.paths[this.USER_REGISTER_CONFIRM_PATH].get.parameters;

    private readonly USER_REGISTER_SUBMIT_PATH_PARAMS: object[] =
        swaggerAPI.paths[this.USER_REGISTER_SUBMIT_PATH].post.parameters;

    private readonly PATH_PARAMETER_MAP: {[path: string]: object[]} = {
        "/user-register-confirm" : this.USER_REGISTER_CONFIRM_PATH_PARAMS,
        "/user-register-submit" : this.USER_REGISTER_SUBMIT_PATH_PARAMS,
    };

    /**
     * Use this to verify all params given to SESSION_CREATE_USER_PATH as per
     * CoS schema.
     *
     * @param input - The object to be validated.
     * @param schema - The schema to validate the object against.
     */
    public validateParams(path: string,
                          inputParams: { [index: string]: string | number | object | any[]; }): void {
        if (!this.PATH_PARAMETER_MAP[path]) {
            const error = Error("This path doesn't accept parameters.");
            error.name = this.USER_REGISTER_PARAM_ERROR;
            throw error;
        }
        try {
            this.validate(inputParams, this.PATH_PARAMETER_MAP[path]);
        } catch (error) {
            throw error;
        }
    }

}
