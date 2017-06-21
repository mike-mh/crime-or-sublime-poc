/**
 * @author Michael Mitchell-Halter
 */

import { validate } from "email-validator";
import { Request, Response, Router } from "express";
import { UserRateAPI } from "../../../../configurations/user/user-rate/user-rate-api";
import { CoSServerConstants } from "../../../cos-server-constants";
import { ReCaptchaHelper } from "../../../libs/authentication/recaptcha-helper";
import { UserModel } from "../../../models/user/user-model";
import { CoSAbstractRouteHandler } from "../../cos-abstract-route-handler";

export class UserRateRouter extends CoSAbstractRouteHandler {
    private static userRateAPI: UserRateAPI = new UserRateAPI();
    private static responses: any = UserRateRouter.userRateAPI.responses;

    /**
     * Initializes all handlers for rate requests.
     */
    public constructor(protected router: Router) {
        super(router);

        this.installRequestHandlers([
            ["post", UserRateRouter.userRateAPI.USER_RATE, this.userRate],
        ], UserRateRouter.userRateAPI);

    }

    /**
     * Use this handler for all ratings submitted by users.
     *
     * @param req - Client request
     * @param res - Server response
     */
    private userRate(req: Request, res: Response): void {
        try {
            UserRateRouter.userRateAPI.validateParams(UserRateRouter.userRateAPI.USER_RATE, req.body, "post");
        } catch (error) {
            res.json(UserRateRouter.responses.InvalidParametersError);
            return;
        }

        if (!req.session.email) {
            res.json(UserRateRouter.responses.NoActiveSessionError);
            return;
        }

        const user = new UserModel();

        user.rateGraffiti(req.session.email, req.body.id, req.body.rating).subscribe(
            () => {
                res.json({result: "success"});
            },
            (error) => {
                if (error.code === CoSServerConstants.DATABASE_RETRIEVE_ERROR.code) {
                    res.json(UserRateRouter.responses.GraffitiDoesNotExistError);
                    return;
                }
                if (error.code === CoSServerConstants.USER_DOUBLE_RATE_ERROR) {
                    res.json(UserRateRouter.responses.AlreadyRatedGraffitiError);
                    return;
                }

                res.json(UserRateRouter.responses.InternalServerError);
            });

     }
}
