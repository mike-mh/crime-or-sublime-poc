import { Document, model, Model, Schema } from "mongoose";
import { CoSServerConstants } from "./../../cos-server-constants";
import { PasswordHelper } from "./../../libs/authentication/password-helper";
import { CoSAbstractModel } from "./../cos-abstract-model";
import { UserModelSchema } from "./../cos-model-constants";

/**
 * Document implementation for User.
 */
export interface IUserDocument extends Document {
    email: string;
    favourites: [Schema.Types.ObjectId];
    password: string;
    salt: string;
    username: string;
}

/**
 * This model will hold the users information. It is responsible for holding
 * verification information as well as profile data (may want to think about
 * creating a model for user profiles instead).
 */
export class UserModel extends CoSAbstractModel {

    protected model: Model<IUserDocument>;

    constructor() {
        super("User");
        this.schema = UserModelSchema;
        this.generateModel();
    }

    /**
     * Authenticates user.
     *
     * @param email - Email of user to authenticate.
     * @param password - Password of user to authenticate
     *
     * @return - Void resolving promise.
     */
    public authenticate(email: string, password: string): Promise<void> {
        return this.checkUserExists(email)
            .then(() => {
                return this.confirmPasswordsMatch(email, password);
            });
    }

    /**
     * Simple getter for the model.
     *
     * @return - The mongoose user model object.
     */
    public getModel(): Model<IUserDocument> {
        return this.model;
    }

    /**
     * Confirms that passwords match.
     *
     * @param email - Email of user logging in.
     * @param password - Hashed password.
     *
     * @return - Void resolving promise
     */
    public confirmPasswordsMatch(email: string, password: string): Promise<void> {
        return this.getUserSalt(email)
            .then((salt) => {
                return PasswordHelper.hashPassword(password, salt);
            })
            .then((hashedPassword) => {
                return this.getModel()
                    .find({ email }, { password: 1 })
                    .then((users) => {
                        if (!users.length) {
                            throw CoSServerConstants.DATABASE_USER_DOES_NOT_EXIST_ERROR;
                        }
                        if (users.shift().password === hashedPassword) {
                            return;
                        }
                        throw CoSServerConstants.DATABASE_USER_INVALID_PASSWORD_ERROR;
                    });
            });
    }

    /**
     * Ensures an email exists in the database. May change to include usernames
     * as well in the future.
     *
     * @param email - Email given by user.
     *
     * @return - Void resolving promise
     */
    public checkUserExists(email: string): Promise<void> {
        return this.getModel()
            .find({ email })
            .then((users) => {
                if (users.length) {
                    return;
                }
                throw CoSServerConstants.DATABASE_USER_DOES_NOT_EXIST_ERROR;
            });
    }

    /**
     * User schema information can be found in documentation.
     */
    protected generateSchema(): void {
        this.schema = new Schema(
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
    }

    /**
     * Get the users password salt.
     *
     * @param email - The user's email.
     *
     * @return - Promise resolves to salt
     */
    private getUserSalt(email: string): Promise<string> {
        return this.getModel()
            .find({ email }, { salt: 1 })
            .then((users) => {
                if (users.length) {
                    return users.shift().salt;
                }
                throw CoSServerConstants.DATABASE_USER_DOES_NOT_EXIST_ERROR;
            });
    }

}
