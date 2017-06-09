import { NextFunction, Request, RequestHandler, Response, Router } from "express";
import { model } from "mongoose";
import { GraffitiGetAPI } from "./../../../../configurations/graffiti/graffiti-get/graffiti-get-api";
import { CoSServerConstants } from "./../../../cos-server-constants";
import { GraffitiModel } from "./../../../models/graffiti/graffiti-model";
import { CoSAbstractRouteHandler } from "./../../cos-abstract-route-handler";
/**
 * This will handle all login requests
 */
export class GraffitiGetRouter extends CoSAbstractRouteHandler {
    private static graffitiGetAPi: GraffitiGetAPI = new GraffitiGetAPI();
    private static responses: any = GraffitiGetRouter.graffitiGetAPi.responses;

    /**
     * Initializes all handlers for login requests.
     */
    public constructor(protected router: Router) {
        super(router);

        this.installRequestHandlers([
            ["get", GraffitiGetRouter.graffitiGetAPi.GRAFFITI_GET_RANDOM, this.graffitiGetRandom],
            ["get", GraffitiGetRouter.graffitiGetAPi.GRAFFITI_GET, this.graffitiGet],
        ], GraffitiGetRouter.graffitiGetAPi);

    }

    /**
     * Use this method to have the server respond with a random graffiti from
     * the database.
     *
     * @param req - Client request
     * @param res - Server resposne
     */
    private graffitiGetRandom(req: Request, res: Response): void {
        try {
            GraffitiGetRouter.graffitiGetAPi.validateParams(
                GraffitiGetRouter.graffitiGetAPi.GRAFFITI_GET_RANDOM, req.body, req.method);
        } catch (error) {
            res.json(GraffitiGetRouter.responses.InvalidParametersError);
            return;
        }

        new GraffitiModel().getRandomGraffiti().subscribe(
            (graffiti) => {
                res.json(graffiti);
            },
            (err) => {
                if (!res.headersSent) {
                    res.json(GraffitiGetRouter.responses.InternalServerError);
                }
            });
    }

    /**
     * Use this method to have the server respond with a specific graffiti from
     * the database.
     *
     * @param req - Client request
     * @param res - Server resposne
     */
    private graffitiGet(req: Request, res: Response): void {
        try {
            GraffitiGetRouter.graffitiGetAPi.validateParams(
                GraffitiGetRouter.graffitiGetAPi.GRAFFITI_GET, req.params, req.method);
        } catch (error) {
            res.json(GraffitiGetRouter.responses.InvalidParametersError);
            return;
        }

        const graffitiID = req.body.id;

        new GraffitiModel().getGraffiti(graffitiID).subscribe(
            (graffiti) => {
                res.json(graffiti);
            },
            (err) => {
                if (!res.headersSent) {
                    res.json(GraffitiGetRouter.responses.InternalServerError);
                }
            });
    }

}
