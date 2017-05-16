import { CoSAbstractModel } from "./cos-abstract-model";
import { UserModel } from "./user/user-model";

/**
 * Is responsible for initialized all model data structures during CoS
 * initialization.
 */
export class CoSModelInitializer {
    private static isInitialized: boolean = false;
    private models: CoSAbstractModel[] = [];
    /**
     * Constrain the class as a singleton to ensure that models aren't
     * reinitialized.
     */
    constructor() {
        if (CoSModelInitializer.isInitialized) {
            throw new Error("Model initializer already instantiated");
        }

        CoSModelInitializer.isInitialized = true;
    }

    /**
     * Initializes all of the models and saves them to an array.
     */
    public initiaizeModels(): void {
        this.models.push(new UserModel());
    }
}
