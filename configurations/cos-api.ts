import { validate } from "email-validator";
// const schema = require('./cos-swagger.json');

/**
 * This class serves as the entry point for both the front and backends to get
 * paths and data types defined in the cos-api schema. Should use this class
 * for all HTTP calls involving the CoS API.
 */
export abstract class CoSAPI {

    /**
     * Use this to verify all input for a given schema. Takes input as an
     * object to make verification simpler.
     *
     * @param inputParameters - The object to be validated.
     * @param schemaConstraints - Array of parameter constriants in schema.
     */
    public validateParams(inputParameters: {[index:string]: (number | object | any[] | string)},
        schemaConstraints: any[]) {
        // Verify input against schema for any possible inconsistancy.
        for (const param of Object.keys(inputParameters)) {
            const paramMatches = schemaConstraints.filter((schemaParam) => {
                return param === schemaParam.name;
            });
            if (!paramMatches.length) {
                throw new Error("Parameter " + param + " does not exist in schema.");
            }
        }

        for (const constraint of schemaConstraints) {
            if (!constraint.name) {
                throw new Error("Critical - Schema has unnamed parameter.");
            }

            const inputParameterValue: any = inputParameters[constraint.name];

            if (constraint.required && !inputParameterValue) {
                throw new Error("Parameter '" + constraint.name + "' is required.");
            }

            if (constraint.type !== typeof (inputParameterValue) && constraint.type !== "array") {
                throw new Error("Given parameter " + inputParameterValue + " is of type " +
                    typeof(inputParameterValue) + " but " + constraint.type + " expected.");
            }

            if (constraint.type === "array" && inputParameterValue.constructor !== Array) {
                throw new Error("Given parameter " + inputParameterValue + " is of type " +
                    typeof(inputParameterValue) + " but " + constraint.type + " expected.");
            }

            // Add in format validators as they are needed. Only have email for now.
            if (constraint.format === "email") {
                if (!validate(inputParameterValue)) {
                    throw new Error("Invalid email address given.");
                }
            }

            if (constraint.multipleOf) {
                if (Math.floor(inputParameterValue / constraint.multipleOf) !==
                    (inputParameterValue / constraint.multipleOf)) {

                    throw new Error(constraint.name + ": " + inputParameterValue.toString() +
                        " is not a multiple of " + constraint.multipleOf.toString());
                }
            }

            if (constraint.maximum) {
                const fitsConstraint = (constraint.exclusiveMaximum) ?
                    (constraint.maximum > inputParameterValue) :
                    (constraint.maximum >= inputParameterValue);

                if (!fitsConstraint) {
                    throw new Error("Parameter " + constraint.name + ": " + inputParameterValue.toString() +
                        " is too big.");
                }
            }

            if (constraint.minimum) {
                const fitsConstraint = (constraint.exclusiveMinimum) ?
                    (constraint.minimum < inputParameterValue) :
                    (constraint.minimum <= inputParameterValue);

                if (!fitsConstraint) {
                    throw new Error("Parameter " + constraint.name + ": " + inputParameterValue.toString() +
                        " is too small.");
                }
            }

            if (constraint.maxLength) {
                if (inputParameterValue.length > constraint.maxLength) {
                    throw new Error("The length of parameter " + constraint.name + " is too long.");
                }
            }

            if (constraint.minLength) {
                if (inputParameterValue.length < constraint.minLength) {
                    throw new Error("The length of parameter " + constraint.name + " is too short.");
                }
            }

            if (constraint.pattern) {
                const pattern = new RegExp(constraint.pattern);
                if (!pattern.test(inputParameterValue)) {
                    throw new Error("Parameter violates " + constraint.name + " regex constaraints.");
                }
            }

            if (constraint.uniqueItems) {
                const uniqueItems = inputParameterValue.filter((elem: any, i: number, array: any[]) => {
                    return array.indexOf(elem) === i;
                });

                if (uniqueItems.length !== inputParameterValue.length) {
                    throw new Error("Parameter " + constraint.name + " contained duplicate items in array.");
                }
            }

            // Leave this as a TO-DO. Probably not going to need this but if
            // we do or decide to try and open-source this code into a library
            // we can implement it later.
            if (constraint.enum) {
                return;
            }
        }

    }

}
