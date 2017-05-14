export class RouteConstants {
    public static readonly TEST: string = "test";
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
