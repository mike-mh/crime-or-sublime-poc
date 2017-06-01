import { CoSAbstractModel } from "./cos-abstract-model";
import { UserModel } from "./user/user-model";

/**
 * Is responsible for initialized all model data structures during CoS
 * initialization.
 */
export class CoSModelInitializer {
    private models: CoSAbstractModel[] = [];

    /**
     * Initializes all of the models and saves them to an array.
     */
    public initiaizeModels(): void {
        this.models.push(new UserModel());
    }
}
