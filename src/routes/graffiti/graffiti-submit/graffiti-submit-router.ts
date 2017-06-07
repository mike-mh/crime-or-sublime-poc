import { validate } from "email-validator";
import { Request, Response, Router } from "express";
import { UserRegsiterAPI } from "../../../../configurations/user/user-register/user-register-api";
import { CoSServerConstants } from "../../../cos-server-constants";
import { ReCaptchaHelper } from "../../../libs/authentication/recaptcha-helper";
import { TempUserModel } from "../../../models/user/temp-user-model";
import { CoSAbstractRouteHandler } from "../../cos-abstract-route-handler";

export class GraffitiSubmitRouter extends CoSAbstractRouteHandler {

}
