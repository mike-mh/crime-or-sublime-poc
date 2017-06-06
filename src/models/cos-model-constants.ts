import { Document, Schema } from "mongoose";

export const CRIME: number = -1;
export const SUBLIME: number = 1;

/**
 * Enum holding indicies for static method tuples
 */
export enum StaticMethodTupleIndices {
    Name = 0,
    Method,
}

/**
 * Enum holding indicies for method tuples
 */
export enum MethodTupleIndices {
    Name = 0,
    Method,
}

export interface IGraffitiDocument extends Document {
    artist?: string;
    crime: number;
    latitude: number;
    longitude: number;
    sublime: number;
    uploadedBy?: string;
    url: string;
}

export const GraffitiModelSchema = new Schema({
    artist: {
        type: String,
    },
    crime: {
        default: 0,
        required: true,
        type: Number,
    },
    latitude: {
        required: true,
        type: Number,
    },
    longitude: {
        required: true,
        type: Number,
    },
    sublime: {
        default: 0,
        required: true,
        type: Number,
    },
    uploadedBy: {
        type: String,
    },
    url: {
        required: true,
        type: String,
        unique: true,
    },
},
    {
        minimize: false,
    });

/**
 * Use this to contain all schemas and document interfaces for needed models.
 */
export interface IUserGraffitiRatingDocument extends Document {
    graffiti: IGraffitiDocument;
    rating: number;
}

export const UserGraffitiRatingModelSchema = new Schema({
    graffiti: GraffitiModelSchema,
    rating: {
        default: 0,
        required: true,
        type: Number,
    },
});

export interface IUserDocument extends Document {
    email: string;
    password: string;
    salt: string;
    username: string;
}

export const UserModelSchema: Schema = new Schema(
    {
        createdAt: {
            default: Date.now,
            type: Date,
        },
        email: {
            required: true,
            type: String,
            unique: true,
        },
        favourites: [Schema.Types.ObjectId],
        password: {
            required: true,
            select: false,
            type: String,
        },
        salt: {
            required: true,
            select: false,
            type: String,
        },
        username: {
            required: true,
            type: String,
            unique: true,
        },
    },
    {
        minimize: false,
    });

export interface ITempUserDocument extends Document {
    email: string;
    password: string;
    registrationKey: string;
    salt: string;
    username: string;
}

export const TempUserModelSchema = new Schema(
    {
        createdAt: {
            default: Date.now,
            expires: this.TEMP_USER_EXPIRATION_TIME,
            type: Date,
        },
        email: {
            required: true,
            type: String,
            unique: true,
        },
        password: {
            required: true,
            type: String,
        },
        registrationKey: {
            required: true,
            type: String,
            unique: true,
        },
        salt: {
            required: true,
            type: String,
        },
        username: {
            required: true,
            type: String,
            unique: true,
        },
    },
    {
        minimize: false,
    });
