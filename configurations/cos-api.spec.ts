// import { validate } from "@types/email-validator";
import { CoSAPI } from "./cos-api";

// Need to extend an abstract class to instantiate it.
class TestAPI extends CoSAPI {

}

describe("CoS API", () => {
    let testAPI: TestAPI;

    beforeEach(() => {
        testAPI = new TestAPI();
    });

    it("should invalidate input with parameters that are not in the validation schema", () => {
        const constraints = [{
            name: "test",
            type: "string",
        }];

        const invalidParameter = {
            tests: "foo",
        };

        try {
            testAPI.validateParams(invalidParameter, constraints);
            expect(true).toBe(false);
        } catch (e) {
            process.stderr.write(e.message + "\n");
            expect(e).toBeTruthy();
        }
    });

    it("should reject input parameters that missing a required paraemter", () => {
        const constraints = [{
            name: "test",
            type: "string",
            required: true,
        },
        {
            name: "again",
            type: "string",
            required: true,
        },];

        const invalidParameter = {
            test: "foo",
        };

        try {
            testAPI.validateParams(invalidParameter, constraints);
            expect(true).toBe(false);
        } catch (e) {
            process.stderr.write(e.message + "\n");
            expect(e).toBeTruthy();
        }
    });

    it("should reject input parameters that don't match types", () => {
        const constraints = [{
            name: "test",
            type: "number",
            required: true,
        }];

        const invalidParameter = {
            test: "foo",
        };

        try {
            testAPI.validateParams(invalidParameter, constraints);
            expect(true).toBe(false);
        } catch (e) {
            process.stderr.write(e.message + "\n");
            expect(e).toBeTruthy();
        }
    });

    it("should reject input parameters that require an email but input doesn't match format", () => {
        const constraints = [{
            name: "test",
            type: "string",
            format: "email",
            required: true,
        }];

        const invalidParameter = {
            test: "foo@foo",
        };

        try {
            testAPI.validateParams(invalidParameter, constraints);
            expect(true).toBe(false);
        } catch (e) {
            process.stderr.write(e.message + "\n");
            expect(e).toBeTruthy();
        }
    });

    it("should reject input parameters that are not multiples of amount specified", () => {
        const constraints = [{
            name: "test",
            type: "number",
            multipleOf: 2,
        }];

        const invalidParameter = {
            test: 3,
        };

        try {
            testAPI.validateParams(invalidParameter, constraints);
            expect(true).toBe(false);
        } catch (e) {
            process.stderr.write(e.message + "\n");
            expect(e).toBeTruthy();
        }
    });

    it("should reject input that are larger than a set maximum", () => {
        const constraints = [{
            name: "test",
            type: "number",
            maximum: 2,
        }];

        const invalidParameter = {
            test: 3,
        };

        try {
            testAPI.validateParams(invalidParameter, constraints);
            expect(true).toBe(false);
        } catch (e) {
            process.stderr.write(e.message + "\n");
            expect(e).toBeTruthy();
        }
    });

    it("should reject input that are larger than or equal to a set maximum with exclusiveMaximum", () => {
        const constraints = [{
            name: "test",
            type: "number",
            maximum: 2,
            exclusiveMaximum: true,
        }];

        const invalidParameter = {
            test: 2,
        };

        try {
            testAPI.validateParams(invalidParameter, constraints);
            expect(true).toBe(false);
        } catch (e) {
            process.stderr.write(e.message + "\n");
            expect(e).toBeTruthy();
        }
    });

    it("should reject input that are smaller than a set minimum", () => {
        const constraints = [{
            name: "test",
            type: "number",
            minimum: 2,
        }];

        const invalidParameter = {
            test: 1,
        };

        try {
            testAPI.validateParams(invalidParameter, constraints);
            expect(true).toBe(false);
        } catch (e) {
            process.stderr.write(e.message + "\n");
            expect(e).toBeTruthy();
        }
    });

    it("should reject input that are smaller than or equal to a set minimum with exclusiveMinimum", () => {
        const constraints = [{
            name: "test",
            type: "number",
            minimum: 2,
            exclusiveMinimum: true,
        }];

        const invalidParameter = {
            test: 2,
        };

        try {
            testAPI.validateParams(invalidParameter, constraints);
            expect(true).toBe(false);
        } catch (e) {
            process.stderr.write(e.message + "\n");
            expect(e).toBeTruthy();
        }
    });

    it("should reject strings that violate maxLength", () => {
        const constraints = [{
            name: "test",
            type: "string",
            maxLength: 4,
        }];

        const invalidParameter = {
            test: "booty",
        };

        try {
            testAPI.validateParams(invalidParameter, constraints);
            expect(true).toBe(false);
        } catch (e) {
            process.stderr.write(e.message + "\n");
            expect(e).toBeTruthy();
        }
    });

    it("should reject strings that violate minLength", () => {
        const constraints = [{
            name: "test",
            type: "string",
            minLength: 4,
        }];

        const invalidParameter = {
            test: "boo",
        };

        try {
            testAPI.validateParams(invalidParameter, constraints);
            expect(true).toBe(false);
        } catch (e) {
            process.stderr.write(e.message + "\n");
            expect(e).toBeTruthy();
        }
    });

    it("should reject strings that violate regex patterns", () => {
        const constraints = [{
            name: "test",
            type: "string",
            pattern: /^[A-Za-z0-9]+$/,
        }];

        const invalidParameter = {
            test: "!a",
        };

        try {
            testAPI.validateParams(invalidParameter, constraints);
            expect(true).toBe(false);
        } catch (e) {
            process.stderr.write(e.message + "\n");
            expect(e).toBeTruthy();
        }
    });

    it("should reject arrays that have non-unique elements when the unique constraint is set", () => {
        const constraints = [{
            name: "test",
            type: "array",
            uniqueItems: true,
        }];

        const invalidParameter = {
            test: [1, 2, 3, 7, 4, 5, 6, 7, 8, 9, 10],
        };

        try {
            testAPI.validateParams(invalidParameter, constraints);
            expect(true).toBe(false);
        } catch (e) {
            process.stderr.write(e.message + "\n");
            expect(e).toBeTruthy();
        }
    });
});
