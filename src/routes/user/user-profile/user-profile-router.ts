import { validate } from "email-validator";
import { Request, Response, Router } from "express";
import { UserProfileAPI } from "../../../../configurations/user/user-profile/user-profile-api";
import { CoSServerConstants } from "../../../cos-server-constants";
import { ReCaptchaHelper } from "../../../libs/authentication/recaptcha-helper";
import { UserModel } from "../../../models/user/user-model";
import { CoSAbstractRouteHandler } from "../../cos-abstract-route-handler";

export class UserProfileRouter extends CoSAbstractRouteHandler {
    private static userProfileAPI: UserProfileAPI = new UserProfileAPI();
    private static responses: any = UserProfileRouter.userProfileAPI.responses;

    /**
     * Initializes all handlers for rate requests.
     */
    public constructor(protected router: Router) {
        super(router);

        this.installRequestHandlers([
           ["post", UserProfileRouter.userProfileAPI.USER_PROFILE_ADD_FAVOURITE, this.userProfileAddFavourite],
           ["get", UserProfileRouter.userProfileAPI.USER_PROFILE_GET_FAVOURITES, this.userProfileGetFavourites],
        ], UserProfileRouter.userProfileAPI);

    }

    /**
     * Use this handler to add a favourited graffiti to a user's favourites list.
     *
     * @param req - Client request
     * @param res - Server response
     */
    private userProfileAddFavourite(req: Request, res: Response): void {
        try {
            UserProfileRouter.userProfileAPI.validateParams(
                UserProfileRouter.userProfileAPI.USER_PROFILE_ADD_FAVOURITE, req.body, "post");

        } catch (error) {
            res.json(UserProfileRouter.responses.InvalidParametersError);
            return;
        }

        if (!req.session.email) {
            res.json(UserProfileRouter.responses.NoActiveSessionError);
            return;
        }

        const user = new UserModel();

        user.addFavourite(req.session.email, req.body.id).subscribe(
            (result) => {
                res.json({result: "success"});
            },
            (error) => {
                // TO-DO: try and see if there's a way to make a specific error
                //        when a user tries to favourite a graffiti twice.
                res.json(UserProfileRouter.responses.InternalServerError);
            });

     }

    /**
     * Use this handler to get a user's favourite graffiti
     *
     * @param req - Client request
     * @param res - Server response
     */
    private userProfileGetFavourites(req: Request, res: Response): void {
        try {
            UserProfileRouter.userProfileAPI.validateParams(
                UserProfileRouter.userProfileAPI.USER_PROFILE_GET_FAVOURITES, req.body, "get");

        } catch (error) {
            res.json(UserProfileRouter.responses.InvalidParametersError);
            return;
        }

        if (!req.session.email) {
            res.json(UserProfileRouter.responses.NoActiveSessionError);
            return;
        }

        const user = new UserModel();

        user.getFavourites(req.session.email).subscribe(
            (result) => {
                res.json({ result });
            },
            (error) => {
                res.json(UserProfileRouter.responses.InternalServerError);
            });

     }

    /**
     * Use this handler to remove a graffiti from user's favourite list.
     *
     * @param req - Client request
     * @param res - Server response
     */
    private userProfileRemoveFavourite(req: Request, res: Response): void {
        try {
            UserProfileRouter.userProfileAPI.validateParams(
                UserProfileRouter.userProfileAPI.USER_PROFILE_REMOVE_FAVOURITE, req.body, "post");

        } catch (error) {
            res.json(UserProfileRouter.responses.InvalidParametersError);
            return;
        }

        if (!req.session.email) {
            res.json(UserProfileRouter.responses.NoActiveSessionError);
            return;
        }

        const user = new UserModel();

        user.removeFavourite(req.session.email, req.body.id).subscribe(
            () => {
                res.json({ result: "success" });
            },
            (error) => {
                res.json(UserProfileRouter.responses.InternalServerError);
            });

     }

}
