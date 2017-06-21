/**
 * @author Michael Mitchell-Halter
 */

import { RequestHandler } from "express";

export class CoSRouteConstants {
    // Angular uses different routes to render its application and this is used
    // to ensure that these routes are reserved exclusively for serving the
    // application. All start with 'cos'.
    public static readonly COS_CLIENT_PATHS: string[] = [
        "/cos-locator",
        "/cos-login",
        "/cos-profile",
        "/cos-register",
        "/cos-rate",
    ];
}

// Use these to configure data types for call backs to be installed to the
// express router.
type IRouteOneCallback = [string, string, RequestHandler];
type IRouteTwoCallbacks = [string, string, RequestHandler, RequestHandler];
type IRouteThreeCallbacks = [string, string, RequestHandler, RequestHandler, RequestHandler];

export type IRouteHandler = (IRouteOneCallback | IRouteTwoCallbacks | IRouteThreeCallbacks);

export enum RequestPathTupleIndices {
    Method = 0,
    Path,
    Handler,
}
