import { validate } from "email-validator";
import { Request, Response, Router } from "express";
import { GraffitiSubmitAPI } from "../../../../configurations/graffiti/graffiti-submit/graffiti-submit-api";
import { CoSServerConstants } from "../../../cos-server-constants";
import { ReCaptchaHelper } from "../../../libs/authentication/recaptcha-helper";
import { TempGraffitiModel } from "../../../models/graffiti/temp-graffiti-model";
import { CoSAbstractRouteHandler } from "../../cos-abstract-route-handler";

export class GraffitiSubmitRouter extends CoSAbstractRouteHandler {
    private static graffitiSubmitAPI: GraffitiSubmitAPI = new GraffitiSubmitAPI();
    private static responses = GraffitiSubmitRouter.graffitiSubmitAPI.responses;

    public constructor(protected router: Router) {
        super(router);

        this.installRequestHandlers([
            ["post", GraffitiSubmitRouter.graffitiSubmitAPI.GRAFFIT_SUBMIT_NEW_SUBMISSION,
                this.graffitiSubmitNewSubmission],
        ], GraffitiSubmitRouter.graffitiSubmitAPI);

    }

    private graffitiSubmitNewSubmission(req: Request, res: Response): void {

        try {
            GraffitiSubmitRouter.graffitiSubmitAPI.validateParams(
                GraffitiSubmitRouter.graffitiSubmitAPI.GRAFFIT_SUBMIT_NEW_SUBMISSION, req.body, req.method);
        } catch (error) {
            res.json(GraffitiSubmitRouter.responses.InvalidParametersError);
            return;
        }

        new TempGraffitiModel().commitTempGraffitiData(req.body.id, req.body.latitude, req.body.longitude)
            .subscribe(() => {
                res.json({result: "success"});
            },
            (error: any) => {
                if (error.code === CoSServerConstants.DATABASE_GRAFFITI_ALREADY_REGISTERED_ERROR.code) {
                    res.json(GraffitiSubmitRouter.responses.GraffitiAlreadyRegisteredError);
                }

                res.json(GraffitiSubmitRouter.responses.InternalServerError);
            });

    }
}
