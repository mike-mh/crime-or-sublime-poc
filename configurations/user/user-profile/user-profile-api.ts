/**
 * @author Michael Mitchell-Halter
 */

import { CoSAPI } from "../../cos-api";

export class UserProfileAPI extends CoSAPI {
    public readonly USER_PROFILE_ADD_FAVOURITE: string = "/user-profile-add-favourite";
    public readonly USER_PROFILE_GET_FAVOURITES: string = "/user-profile-get-favourites";
    public readonly USER_PROFILE_REMOVE_FAVOURITE: string = "/user-profile-remove-favourite";

    public readonly responses = {
        AlreadyFavouritedGraffitiError: {
            error: {
                message: "User already favourited this graffiti",
                name: "AlreadyFavouritedGraffitiError",
            },
        },
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
        GraffitiNotFavouritedError: {
            error: {
                message: "This graffiti doesn't exist on favourites list",
                name: "GraffitiNotFavouritedError",
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
            this.USER_PROFILE_ADD_FAVOURITE,
            this.USER_PROFILE_GET_FAVOURITES,
            this.USER_PROFILE_REMOVE_FAVOURITE,
        ]);
    }
}
