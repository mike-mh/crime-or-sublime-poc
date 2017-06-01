// import { validate } from "@types/email-validator";
import { CoSAPI } from "./cos-api";

// Need to extend an abstract class to instantiate it.
class TestAPI extends CoSAPI {
    /**
     * Don't need to implement these. Each API subclass is unique and these
     * will be tested in their own modules.
     */
    public validateParams(path: string, inputParams: {
        [index: string]: string | number | object | any[];
    }): void {
        throw new Error("Method not implemented.");
    }

    protected associatePathsWithMethodsAndParams(): void {
        throw new Error("Method not implemented.");
    }
}

describe("CoS API", () => {
    let testAPI: TestAPI;

    beforeEach(() => {
        testAPI = new TestAPI();
    });

    it("should throw a ciritical error when given parameters of the wrong type", () => {
        let badInput: any = "Die in a lake of fire.";
        const constraints = [
            {
                name: "test",
                schema: {
                    type: "string",
                },
            },
        ];

        const parameter = {
            test: "foo",
        };

        try {
            testAPI.validate(badInput, constraints);
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(testAPI.CRITICAL_ERROR);
        }

        try {
            testAPI.validate(parameter, badInput);
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(testAPI.CRITICAL_ERROR);
        }

        try {
            testAPI.validate(badInput, badInput);
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(testAPI.CRITICAL_ERROR);
        }
    });

    it("should invalidate input with parameters that are not in the validation schema", () => {
        const constraints = [
            {
                name: "test",
                schema: {
                    type: "string",
                },
            },
        ];

        const invalidParameter = {
            tests: "foo",
        };

        try {
            testAPI.validate(invalidParameter, constraints);
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(testAPI.NO_SUCH_PARAMETER_ERROR);
        }
    });

    it("should reject input parameters that missing a required parameter", () => {
        const constraints = [
            {
                name: "test",
                required: true,
                schema: {
                    type: "string",
                },
            },
            {
                name: "again",
                required: true,
                schema: {
                    type: "string",
                },
            },
        ];

        const invalidParameter = {
            test: "foo",
        };

        try {
            testAPI.validate(invalidParameter, constraints);
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(testAPI.MISSING_PARAMETER_ERROR);
        }
    });

    it("should reject input parameters that don't match types", () => {
        const constraints = [{
            name: "test",
            required: true,
            schema: {
                type: "number",
            },
        }];

        const invalidParameter = {
            test: "foo",
        };

        try {
            testAPI.validate(invalidParameter, constraints);
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(testAPI.PARAMETER_TYPE_ERROR);
        }
    });

    it("should reject input parameters that require an email but input doesn't match format", () => {
        const constraints = [{
            name: "test",
            required: true,
            schema: {
                format: "email",
                type: "string",
            },
        }];

        const invalidParameter = {
            test: "foo@foo",
        };

        try {
            testAPI.validate(invalidParameter, constraints);
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(testAPI.PARAMETER_EMAIL_ERROR);
        }
    });

    it("should reject input parameters that are not multiples of amount specified", () => {
        const constraints = [{
            name: "test",
            schema: {
                multipleOf: 2,
                type: "number",
            },
        }];

        const invalidParameter = {
            test: 3,
        };

        try {
            testAPI.validate(invalidParameter, constraints);
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(testAPI.PARAMETER_MULTIPLES_ERROR);
        }
    });

    it("should reject input that are larger than a set maximum", () => {
        const constraints = [{
            name: "test",
            schema: {
                maximum: 2,
                type: "number",
            },
        }];

        const invalidParameter = {
            test: 3,
        };

        try {
            testAPI.validate(invalidParameter, constraints);
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(testAPI.PARAMETER_MAX_VALUE_ERROR);
        }
    });

    it("should reject input that are larger than or equal to a set maximum with exclusiveMaximum", () => {
        const constraints = [{
            name: "test",
            schema: {
                exclusiveMaximum: true,
                maximum: 2,
                type: "number",
            },
        }];

        const invalidParameter = {
            test: 2,
        };

        try {
            testAPI.validate(invalidParameter, constraints);
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(testAPI.PARAMETER_EX_MAX_VALUE_ERROR);
        }
    });

    it("should reject input that are smaller than a set minimum", () => {
        const constraints = [{
            name: "test",
            schema: {
                minimum: 2,
                type: "number",
            },
        }];

        const invalidParameter = {
            test: 1,
        };

        try {
            testAPI.validate(invalidParameter, constraints);
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(testAPI.PARAMETER_MIN_VALUE_ERROR);
        }
    });

    it("should reject input that are smaller than or equal to a set minimum with exclusiveMinimum", () => {
        const constraints = [{
            name: "test",
            schema: {
                exclusiveMinimum: true,
                minimum: 2,
                type: "number",
            },
        }];

        const invalidParameter = {
            test: 2,
        };

        try {
            testAPI.validate(invalidParameter, constraints);
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(testAPI.PARAMETER_EX_MIN_VALUE_ERROR);
        }
    });

    it("should reject strings that violate maxLength", () => {
        const constraints = [{
            name: "test",
            schema: {
                maxLength: 4,
                type: "string",
            },
        }];

        const invalidParameter = {
            test: "booty",
        };

        try {
            testAPI.validate(invalidParameter, constraints);
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(testAPI.PARAMETER_MAX_LENGTH_ERROR);
        }
    });

    it("should reject strings that violate minLength", () => {
        const constraints = [{
            name: "test",
            schema: {
                minLength: 4,
                type: "string",
            },
        }];

        const invalidParameter = {
            test: "boo",
        };

        try {
            testAPI.validate(invalidParameter, constraints);
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(testAPI.PARAMETER_MIN_LENGTH_ERROR);
        }
    });

    it("should reject strings that violate regex patterns", () => {
        const constraints = [{
            name: "test",
            schema: {
                pattern: /^[A-Za-z0-9]+$/,
                type: "string",
            },
        }];

        const invalidParameter = {
            test: "!a",
        };

        try {
            testAPI.validate(invalidParameter, constraints);
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(testAPI.PARAMETER_REGEX_ERROR);
        }
    });

    it("should reject arrays that have non-unique elements when the unique constraint is set", () => {
        const constraints = [{
            name: "test",
            schema: {
                type: "array",
                uniqueItems: true,
            },
        }];

        const invalidParameter = {
            test: [1, 2, 3, 7, 4, 5, 6, 7, 8, 9, 10],
        };

        try {
            testAPI.validate(invalidParameter, constraints);
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(testAPI.PARAMETER_UNIQUE_ELEMS_ERROR);
        }
    });

    it("should skip over parameters that aren't required if not set.", () => {
        const constraints = [{
            name: "test",
            required: true,
            schema: {
                type: "array",
                uniqueItems: true,
            },
        },
        {
            name: "ignore",
            required: false,
            schema: {
                type: "string",
            },
        }];

        const invalidParameter = {
            test: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        };

        try {
            testAPI.validate(invalidParameter, constraints);
        } catch (e) {
            expect(e).toBeFalsy();
            expect(true).toBe(false);
        }
    });
});
