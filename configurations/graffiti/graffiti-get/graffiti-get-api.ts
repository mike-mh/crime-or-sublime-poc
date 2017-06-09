import { CoSAPI } from "../../cos-api";

export class GraffitiGetAPI extends CoSAPI {
    public readonly GRAFFITI_GET: string = "/graffiti-get/:id";
    public readonly GRAFFITI_GET_RANDOM: string = "/graffiti-get-random";

    public readonly responses = {
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
    };

    constructor() {
        super();
        this.associatePathsWithMethodsAndParams([
            this.GRAFFITI_GET,
            this.GRAFFITI_GET_RANDOM,
        ]);
    }
}
