import { validate } from "email-validator";
import { Request, Response, Router } from "express";
import { ReCaptchaHelper } from "../../libs/authentication/recaptcha-helper";
import { TempUserModel } from "../../models/user/temp-user-model";
import { CoSAbstractRouteHandler } from "../cos-abstract-route-handler";
import { HTTPMethods } from "../cos-route-constants";

/**
 * This will handle all registration requests
 */
export class RegistrationRouter extends CoSAbstractRouteHandler {
    private static isInstantiated: boolean = false;

    /**
     * Initializes all handlers for registration requests and keeps singleton
     * pattern.
     */
    public constructor(protected router: Router) {
        super(router);
        if (RegistrationRouter.isInstantiated) {
            throw new Error("Profile router already instantiated");
        }

        this.stageRequestPathHandlerTuples();
        this.installRequestHandlers();

        RegistrationRouter.isInstantiated = true;
    }

    /**
     * Stages handlers to be installed on router. Fill with more details after
     * it is known what handlers are going to do.
     */
    protected stageRequestPathHandlerTuples(): void {

        /**
         * Should be called after a user clicks a registration link. Registers
         * the user into the database and removes the temporary user data type.
         *
         * @param req - Incoming request
         * @param res - Server response
         */
        const registerUser = (req: Request, res: Response) => {
            const params = req.body.params;

            if (params === undefined) {
                res.json({ error: { code: -500, message: "No data received", id: "id" } });
                return;
            }

            const email = params.email;
            const username = params.username;
            const password = params.password;
            const reCaptchaResponse = params.reCaptchaResponse;
            // TO-DO: Set up reCaptcha
            // let reCaptchaResponse = params.reCaptchaResponse;

            if (!email) {
                res.json({ error: { code: -500, message: "No email given", id: "id" } });
                return;
            } else if (!username) {
                res.json({ error: { code: -500, message: "No username received", id: "id" } });
                return;
            } else if (!password) {
                res.json({ error: { code: -500, message: "No password given", id: "id" } });
                return;
            } else if (!reCaptchaResponse) {
                res.json({ error: { code: -500, message: "No reCAPTCHA response given", id: "id" } });
                return;
            }

            // Verify email address
            if (!validate(email)) {
                res.json({ error: { message: "Invalid email address" } });
                return;
            }

            ReCaptchaHelper.verifyRecaptchaSuccess(reCaptchaResponse)
                .then(() => {
                    return new TempUserModel()
                        .createTempUser(username, email, password);
                })
                .catch((error) => {
                    res.json({
                        error: {
                            message: "Couldn't save new user",
                        },
                    });
                });
        };

        const confirmUserRegistration = (req: Request, res: Response) => {
            const username = req.params.username;
            const email = req.params.email;
            const registrationKey = req.params.registrationKey;

            new TempUserModel().registerUser(username, registrationKey)
                .then(() => {
                    res.redirect("https://crime-or-sublime.herokuapp.com");
                })
                .then(() => {
                    req.session.email = email;
                    req.session.username = username;
                    req.session.save((error) => { throw new Error("Failed to save session"); });
                })
                .catch((error) => {
                    res.json({ error });
                });
        };

        this.stageAsRequestHandeler(HTTPMethods.Post,
            ["/register-user", registerUser]);
        this.stageAsRequestHandeler(HTTPMethods.Get,
            ["/confirm-user-registration/:username/:registrationKey",
                confirmUserRegistration]);
    }

}
