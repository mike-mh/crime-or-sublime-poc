import { Model, Schema } from "mongoose";
import { CoSAbstractModel } from "./../cos-abstract-model";
import { StaticMethodTupleIndices } from "./../cos-model-constants";

/**
 * This model will hold the users information. It is responsible for holding
 * verification information as well as profile data (may want to think about
 * creating a model for user profiles instead).
 */
export class UserModel extends CoSAbstractModel {

    constructor() {
        super("user");
        this.generateSchema();
        this.generateStaticMethods();

        for (const index in this.staticMethods) {
            if (this.staticMethods[index]) {
                const methodTuple = this.staticMethods[index];
                this.installStaticMethod(methodTuple[StaticMethodTupleIndices.Name],
                                         methodTuple[StaticMethodTupleIndices.Method]);
            }
        }

        this.generateModel();
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

        return;
    }

    /**
     * Generate all static methods for the model and stage them into the
     * staticMethods array.
     */
    protected generateStaticMethods(): void {
        const authenticate = (email: string, password: string) => { return; };
        const checkUserExists = (email: string) => { return; };
        const confirmPasswordsMatch = (email: string, password: string) => { return; };
        const getUserSalt = (email: string) => { return; };

        this.staticMethods.push(["authenticate", authenticate]);
        this.staticMethods.push(["checkUserExists", checkUserExists]);
        this.staticMethods.push(["confirmPasswordsMatch", confirmPasswordsMatch]);
        this.staticMethods.push(["getUserSalt", getUserSalt]);
    }

    /**
     * This class doesn't have any methods right now. Do nothing.
     */
    protected generateMethods(): void {
        return;
    }
}
