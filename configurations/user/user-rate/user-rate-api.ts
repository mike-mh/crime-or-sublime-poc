import { CoSAPI } from "../../cos-api";

export class UserRateAPI extends CoSAPI {
    public readonly USER_RATE: string = "/user-rate";

    public readonly responses = {
        AlreadyRatedGraffitiError: {
            error: {
                message: "User already rated this graffiti",
                name: "AlreadyRatedGraffitiError",
            },
        },
        GraffitiDoesNotExistError: {
            error: {
                message: "Graffiti with given ID does not exist",
                name: "GraffitiDoesNotExistError",
            },
        },
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
        NoActiveSessionError: {
            error: {
                message: "There is no active session",
                name: "NoActiveSessionError",
            },
        },
    };

    constructor() {
        super();
        this.associatePathsWithMethodsAndParams([
            this.USER_RATE,
        ]);
    }
}
