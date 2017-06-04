import { Schema } from "mongoose";

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

/**
 * Use this to contain all schemas for needed models.
 */
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
