import { validate } from "email-validator";

/**
 * This class serves as the entry point for both the front and backends to get
 * paths and data types defined in the cos-api schema. Should use this class
 * for all HTTP calls involving the CoS API.
 */
export abstract class CoSAPI {
    public readonly CRITICAL_ERROR = "CriticalError";
    public readonly NO_SUCH_PARAMETER_ERROR = "NoSuchParameterError";
    public readonly MISSING_PARAMETER_ERROR = "MissingParameterError";
    public readonly PARAMETER_TYPE_ERROR = "ParameterTypeError";
    public readonly PARAMETER_EMAIL_ERROR = "ParameterEmailError";
    public readonly PARAMETER_MULTIPLES_ERROR = "ParameterMultiplesError";
    public readonly PARAMETER_MAX_VALUE_ERROR = "ParameterMaxValueError";
    public readonly PARAMETER_EX_MAX_VALUE_ERROR = "ParameterExMaxValueError";
    public readonly PARAMETER_MIN_VALUE_ERROR = "ParameterMinValueError";
    public readonly PARAMETER_EX_MIN_VALUE_ERROR = "ParameterExMinValueError";
    public readonly PARAMETER_MAX_LENGTH_ERROR = "ParameterMaxLengthError";
    public readonly PARAMETER_MIN_LENGTH_ERROR = "ParameterMinLengthError";
    public readonly PARAMETER_REGEX_ERROR = "ParameterRegexError";
    public readonly PARAMETER_UNIQUE_ELEMS_ERROR = "ParameterUniqueElemsError";

    /**
     * Use this to verify all input for a given schema. Takes input as an
     * object to make verification simpler.
     *
     * @param inputParameters - The object to be validated.
     * @param schemaConstraints - Array of parameter constriants in schema.
     */
    public validate(inputParameters: { [index: string]: (number | object | any[] | string) },
                    schemaConstraints: any[]) {
        // Sanity check
        if (!inputParameters || !schemaConstraints) {
            throw new Error("Critical Error - Missing schema or parameter.");
        }

        let error;

        // Verify input against schema for any possible inconsistancy.
        for (const param of Object.keys(inputParameters)) {
            const paramMatches = schemaConstraints.filter((schemaParam) => {
                return param === schemaParam.name;
            });
            if (!paramMatches.length) {
                error = new Error("Parameter " + param + " does not exist in schema.");
                error.name = this.NO_SUCH_PARAMETER_ERROR;
                throw error;
            }
        }

        for (const constraint of schemaConstraints) {

            if (!constraint.name) {
                error = new Error("Critical - Schema has unnamed parameter.");
                error.name = this.CRITICAL_ERROR;
                throw error;
            }

            const inputParameterValue: any = inputParameters[constraint.name];

            if (constraint.required && !inputParameterValue) {
                error = new Error("Parameter '" + constraint.name + "' is required.");
                error.name = this.MISSING_PARAMETER_ERROR;
                throw error;
            }

            // Don't validate an unset parameter if it isn't required.
            if (!constraint.required && !inputParameterValue) {
                continue;
            }

            if (constraint.schema.type !== typeof(inputParameterValue) && constraint.schema.type !== "array") {
                error = new Error("Given parameter " + inputParameterValue + " is of type " +
                    typeof (inputParameterValue) + " but " + constraint.schema.type + " expected.");
                error.name = this.PARAMETER_TYPE_ERROR;
                throw error;
            }

            if (constraint.schema.type === "array" && inputParameterValue.constructor !== Array) {
                error = new Error("Given parameter " + inputParameterValue + " is of type " +
                    typeof (inputParameterValue) + " but " + constraint.schema.type + " expected.");
                error.name = this.PARAMETER_TYPE_ERROR;
                throw error;
            }

            // Add in format validators as they are needed. Only have email for now.
            if (constraint.schema.format === "email") {
                if (!validate(inputParameterValue)) {
                    error = new Error("Invalid email address given.");
                    error.name = this.PARAMETER_EMAIL_ERROR;
                    throw error;
                }
            }

            if (constraint.schema.multipleOf) {
                if (Math.floor(inputParameterValue / constraint.schema.multipleOf) !==
                    (inputParameterValue / constraint.schema.multipleOf)) {

                    error = Error(constraint.name + ": " + inputParameterValue.toString() +
                        " is not a multiple of " + constraint.schema.multipleOf.toString());
                    error.name = this.PARAMETER_MULTIPLES_ERROR;
                    throw error;
                }
            }

            if (constraint.schema.maximum) {
                const fitsConstraint = (constraint.schema.exclusiveMaximum) ?
                    (constraint.schema.maximum > inputParameterValue) :
                    (constraint.schema.maximum >= inputParameterValue);

                if (!fitsConstraint && !constraint.schema.exclusiveMaximum) {
                    error = Error("Parameter " + constraint.name + ": " + inputParameterValue.toString() +
                        " is too big.");
                    error.name = this.PARAMETER_MAX_VALUE_ERROR;
                    throw error;
                }

                if (!fitsConstraint && constraint.schema.exclusiveMaximum) {
                    error = Error("Parameter " + constraint.name + ": " + inputParameterValue.toString() +
                        " is too big.");
                    error.name = this.PARAMETER_EX_MAX_VALUE_ERROR;
                    throw error;
                }

            }

            if (constraint.schema.minimum) {
                const fitsConstraint = (constraint.schema.exclusiveMinimum) ?
                    (constraint.schema.minimum < inputParameterValue) :
                    (constraint.schema.minimum <= inputParameterValue);

                if (!fitsConstraint && !constraint.schema.exclusiveMinimum) {
                    error = Error("Parameter " + constraint.name + ": " + inputParameterValue.toString() +
                        " is too small.");
                    error.name = this.PARAMETER_MIN_VALUE_ERROR;
                    throw error;
                }

                if (!fitsConstraint && constraint.schema.exclusiveMinimum) {
                    error = Error("Parameter " + constraint.name + ": " + inputParameterValue.toString() +
                        " is too small.");
                    error.name = this.PARAMETER_EX_MIN_VALUE_ERROR;
                    throw error;
                }
            }

            if (constraint.schema.maxLength) {
                if (inputParameterValue.length > constraint.schema.maxLength) {
                    error = new Error("The length of parameter " + constraint.name + " is too long.");
                    error.name = this.PARAMETER_MAX_LENGTH_ERROR;
                    throw error;
                }
            }

            if (constraint.schema.minLength) {
                if (inputParameterValue.length < constraint.schema.minLength) {
                    error = new Error("The length of parameter " + constraint.name + " is too short.");
                    error.name = this.PARAMETER_MIN_LENGTH_ERROR;
                    throw error;
                }
            }

            if (constraint.schema.pattern) {
                const pattern = new RegExp(constraint.schema.pattern);
                if (!pattern.test(inputParameterValue)) {
                    error = new Error("Parameter violates " + constraint.name + " regex constaraints.");
                    error.name = this.PARAMETER_REGEX_ERROR;
                    throw error;
                }
            }

            if (constraint.schema.uniqueItems) {
                const uniqueItems = inputParameterValue.filter((elem: any, i: number, array: any[]) => {
                    return array.indexOf(elem) === i;
                });

                if (uniqueItems.length !== inputParameterValue.length) {
                    error = new Error("Parameter " + constraint.name + " contained duplicate items in array.");
                    error.name = this.PARAMETER_UNIQUE_ELEMS_ERROR;
                    throw error;
                }
            }

            // Leave this as a TO-DO. Probably not going to need this but if
            // we do or decide to try and open-source this code into a library
            // we can implement it later.
            if (constraint.schema.enum) {
                return;
            }
        }
    }

    /**
     * This function is defined uniquely in each subclass to use a path instead
     * of parameters. Calls validate method above but leaves the subclass
     * responsible for locating the appropriate parameters template from the
     * schema itself.
     *
     * @param path - The path from the schema against which to validate params.
     * @param inputParams - The parameters to validate.
     */
    public abstract validateParams(path: string,
                                   inputParams: { [index: string]: (number | object | any[] | string) }): void;

}
