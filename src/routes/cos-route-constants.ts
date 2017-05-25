export class CoSRouteConstants {
    // Angular uses different routes to render its application and this is used
    // to ensure that these routes are reserved exclusively for serving the
    // application. All start with 'cos'.
    public static readonly COS_CLIENT_PATHS: string[] = [
        "/cos-login",
        "/cos-register",
    ];
}

export enum HTTPMethods {
    Get = 0,
    Put,
    Post,
    Delete,
    Patch,
    Options,
    Head,
}

export enum RequestPathTupleIndices {
    Path = 0,
    Handler,
}
