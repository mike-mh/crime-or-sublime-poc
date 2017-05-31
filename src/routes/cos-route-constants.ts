export class CoSRouteConstants {
    // Angular uses different routes to render its application and this is used
    // to ensure that these routes are reserved exclusively for serving the
    // application. All start with 'cos'.
    public static readonly COS_CLIENT_PATHS: string[] = [
        "/cos-login",
        "/cos-register",
    ];
}

export enum RequestPathTupleIndices {
    Method = 0,
    Path,
    Handler,
}
