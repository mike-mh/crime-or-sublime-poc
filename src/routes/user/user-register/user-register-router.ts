/**
 * @author Michael Mitchell-Halter
 */

import { validate } from "email-validator";
import { Request, Response, Router } from "express";
import { UserRegsiterAPI } from "../../../../configurations/user/user-register/user-register-api";
import { CoSServerConstants } from "../../../cos-server-constants";
import { ReCaptchaHelper } from "../../../libs/authentication/recaptcha-helper";
import { TempUserModel } from "../../../models/user/temp-user-model";
import { CoSAbstractRouteHandler } from "../../cos-abstract-route-handler";

/**
 * This will handle all registration requests
 */
export class UserRegisterRouter extends CoSAbstractRouteHandler {
    private static readonly userRegisterApi: UserRegsiterAPI = new UserRegsiterAPI();
    private static readonly responses: any = UserRegisterRouter.userRegisterApi.responses;

    /**
     * Initializes all handlers for registration requests.
     */
    public constructor(protected router: Router) {
        super(router);

        this.installRequestHandlers([
            ["get", UserRegisterRouter.userRegisterApi.USER_REGISTER_CONFIRM_PATH, this.userRegisterConfirm],
            ["post", UserRegisterRouter.userRegisterApi.USER_REGISTER_SUBMIT_PATH, this.userRegisterSubmit],
        ], UserRegisterRouter.userRegisterApi);

    }

    /**
     * Should be called after a user clicks a registration link. Registers
     * the user into the database and removes the temporary user data type.
     *
     * @param req - Incoming request
     * @param res - Server response
     */
    private userRegisterSubmit(req: Request, res: Response): void {
        const params = req.body;

        const email = params.email;
        const username = params.username;
        const password = params.password;
        const reCaptchaResponse = params.captcha;

        try {
            UserRegisterRouter.userRegisterApi.validateParams(
                UserRegisterRouter.userRegisterApi.USER_REGISTER_SUBMIT_PATH,
                params, req.method);
        } catch (error) {
            res.json(UserRegisterRouter.responses.InvalidParametersError);
            return;
        }

        ReCaptchaHelper.verifyRecaptchaSuccess(reCaptchaResponse).subscribe(
            () => {
                new TempUserModel().createTempUser(username, email, password).subscribe(
                    () => {
                        res.json({ result: { email, username } });
                    },
                    (error) => {
                        if (error.code === CoSServerConstants.DATABASE_USER_IDENTIFIER_TAKEN_ERROR.code) {
                            res.json(UserRegisterRouter.responses.UsernameOrEmailTakenError);
                            return;
                        }

                        res.json(UserRegisterRouter.responses.InternalServerError);
                    });
            },
            (error) => {
                if (!res.headersSent) {
                    if (error.code === CoSServerConstants.RECAPTCHA_RESPONSE_FAILURE.code) {
                        res.json(UserRegisterRouter.responses.InvalidRegistrationError);
                        return;
                    }
                    res.json(UserRegisterRouter.responses.InternalServerError);
                }
            });
    }

    /**
     * This route is called after the user clicks their registration link sent
     * to their email by CoS. Stores user information into the database.
     *
     * @param req - Incoming request
     * @param res - Server response
     */
    private userRegisterConfirm(req: Request, res: Response): void {
        const username = req.params.id;
        const registrationKey = req.params.key;

        new TempUserModel().registerUser(username, registrationKey).subscribe(
            () => {
                req.session.username = username;
                req.session.save((error) => {
                    if (error) {
                        res.json(UserRegisterRouter.responses.InternalServerError);
                        return;
                    }
                    res.redirect("http://crime-or-sublime.herokuapp.com");
                });
            },
            (error) => {
                if (error.code === CoSServerConstants.DATABASE_NO_DOCUMENTS_FOUND.code) {
                    res.json(UserRegisterRouter.responses.InvalidRegistrationError);
                    return;
                }

                res.json(UserRegisterRouter.responses.InternalServerError);

            });
    }

}
