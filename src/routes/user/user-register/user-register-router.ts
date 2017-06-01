import { validate } from "email-validator";
import { Request, Response, Router } from "express";
import { UserRegsiterAPI } from "../../../../configurations/user/user-register/user-register-api";
import { ReCaptchaHelper } from "../../../libs/authentication/recaptcha-helper";
import { TempUserModel } from "../../../models/user/temp-user-model";
import { CoSAbstractRouteHandler } from "../../cos-abstract-route-handler";

/**
 * This will handle all registration requests
 */
export class UserRegisterRouter extends CoSAbstractRouteHandler {
    private static readonly userRegisterApi: UserRegsiterAPI = new UserRegsiterAPI();

    /**
     * Initializes all handlers for registration requests.
     */
    public constructor(protected router: Router) {
        super(router);

        this.installRequestHandlers([
            ["get", UserRegisterRouter.userRegisterApi.USER_REGISTER_CONFIRM_PATH, this.userRegisterConfirm],
            ["post", UserRegisterRouter.userRegisterApi.USER_REGISTER_SUBMIT_PATH, this.userRegisterSubmit]
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

        console.log(params);
        try {
            UserRegisterRouter.userRegisterApi.validateParams(UserRegisterRouter.userRegisterApi.USER_REGISTER_SUBMIT_PATH,
                params, req.method);
        } catch (error) {
            console.log(error.message)
            res.json(UserRegisterRouter.userRegisterApi.responses.InvalidParameterError)
            return;
        }
    
        console.log(reCaptchaResponse);

        ReCaptchaHelper.verifyRecaptchaSuccess(reCaptchaResponse)
            .then(() => {
                return new TempUserModel()
                    .createTempUser(username, email, password);
            })
            .then(() => {
                res.json({ result: { email, username } });
            })
            .catch((error) => {
                console.log(error);
                res.json(UserRegisterRouter.userRegisterApi.responses.InternalServerError);
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
        const username = req.params.username;
        const registrationKey = req.params.registrationKey;

        new TempUserModel().registerUser(username, registrationKey)
            .then(() => {
                res.redirect("https://crime-or-sublime.herokuapp.com");
            })
            .then(() => {
                req.session.username = username;
                req.session.save((error) => { throw new Error("Failed to save session"); });
                res.json({ result: username });
            })
            .catch((err) => {
                res.json(UserRegisterRouter.userRegisterApi.responses.InternalServerError);
            });
    }

}
