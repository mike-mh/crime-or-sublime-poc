/**
 * This file is a temporary fix for the problems with building the front end
 * using rollup and some incompatabilities importing a JSON file as a module
 * using TSC. This file is renamed during a build run with build.sh. Hopefully
 * we'll have a more robust solution to this soon.
 */
import * as API from "./cos-swagger";


const cosAPI = (API.cosAPI) ?
    API.cosAPI :
    API;

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
    public readonly PATH_ERROR = "APIPathError";
    public readonly METHOD_ERROR = "APIMethodError";

    public readonly responses: {[response: string]: object} = {
        AlreadyActiveSession: {
            error: {
                message: "Session is already active.",
                name: "AlreadyActiveSession",
            }
        },
        InternalServerError: {
            error: {
                message: "Internal server error occured.",
                name: "InternalServerError",
            }
        },
        InvalidRegistrationError: {
            error: {
                message: "The registration data sent was invalid.",
                name: "InvalidRegistrationError",
            }
        },
        InvalidParameterError: {
            error: {
                message: "The registration data sent was invalid.",
                name: "InvalidParameterError"
            }
        },
        MissingParamater: {
            error: {
                message: "Parameter(s) missing in request.",
                name: "MissingParamater"
            }
        },
        NoActiveSession: {
            error: {
                message: "No active session was found for this request.",
                name: "NoActiveSession",
            }
        },
        UserNotFound: {
            error: {
                message: "No active session was found for this request.",
                name: "NoActiveSession",
            }
        },

    }

    protected pathsMethodsAndParamsMap: {[path: string]: {
            [method: string]: any[],
        },
    } = {};

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
     * Use this to determine if a HTTP method is assoicated with a path in the
     * pathsMethodsAndParamsMap.
     * 
     * @param method - The HTTP method to test
     * @param path - The path to test against
     * 
     * @return - True if the path accepts the method according to schema
     *     otherwise false.
     */
     public isMethodAssigned(method: string, path: string) {
         return !!this.pathsMethodsAndParamsMap[path][method];
     };

    /**
     * Use this to verify all params for paths and the methods they are called
     * with as per the CoS API schema.
     *
     * @param input - The object to be validated.
     * @param schema - The schema to validate the object against.
     * @param method - The HTTP method used to send data.
     */
    public validateParams(path: string,
                          inputParams: { [index: string]: string | number | object | any[]; },
                          method: string): void {
        method = method.toLowerCase();

        if (!this.pathsMethodsAndParamsMap[path]) {
            const error = new Error("This path doesn't exist in the API");
            error.name = this.PATH_ERROR;
            throw error;
        }

        if (!this.pathsMethodsAndParamsMap[path][method]) {
            const error = new Error("This path doesn't accept this method.");
            error.name = this.METHOD_ERROR;
            throw error;
        }

        try {
            this.validate(inputParams, this.pathsMethodsAndParamsMap[path][method]);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Maps an array of paths to the pathsMethodsAndParamsMap. Associates each
     * path with its HTTP method and that method is in turn mapped to the
     * parameters specified in the CoS API schema itself.
     *
     * @param paths - The paths to be associated with their HTTP method and
     *     necessarry parameters.
     */
    protected associatePathsWithMethodsAndParams(paths: string[]): void {

        // Iterate through the API schema for all methods associated with paths
        // and get all parameters associated with that path. If there are no
        // parameters assign an empty array instead
        for (const path of paths) {
            this.pathsMethodsAndParamsMap[path] = {};
            for (const method of Object.keys(cosAPI.paths[path])) {
                this.pathsMethodsAndParamsMap[path][method] = (cosAPI.paths[path][method].parameters) ?
                    cosAPI.paths[path][method].parameters : [ ];
            }
        }
    }
}

/**
 * CODE BELOW IS IMPORTED FROM 'email-validation' MODULE. TEMPORARY WORKAROUND
 * FOR ROLLUP NOT RECOGNIZING VALIDATE FUNCTION FROM MODULE.
 * 
 * https://www.npmjs.com/package/email-validator
 * https://github.com/Sembiance/email-validator
 */
var tester = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-?\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
// Thanks to:
// http://fightingforalostcause.net/misc/2006/compare-email-regex.php
// http://thedailywtf.com/Articles/Validating_Email_Addresses.aspx
// http://stackoverflow.com/questions/201323/what-is-the-best-regular-expression-for-validating-email-addresses/201378#201378
function validate(email: string)
{
	if (!email)
		return false;
		
	if(email.length>254)
		return false;

	var valid = tester.test(email);
	if(!valid)
		return false;

	// Further checking of some things regex can't handle
	var parts = email.split("@");
	if(parts[0].length>64)
		return false;

	var domainParts = parts[1].split(".");
	if(domainParts.some(function(part) { return part.length>63; }))
		return false;

	return true;
}
