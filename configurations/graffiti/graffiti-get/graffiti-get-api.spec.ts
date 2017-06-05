import { GraffitiGetAPi } from "./graffiti-get-api";

describe("GraffitiGetAPI", () => {
    const graffitiGetAPi = new GraffitiGetAPi();

    it("should reject graffiti-get call that wasn't made with GET", () => {
        const input = {
            id: "deadbeef",
        };

        try {
            graffitiGetAPi.validateParams(graffitiGetAPi.GRAFFITI_GET, input, "post");
        } catch (e) {
            expect(e.name).toEqual(graffitiGetAPi.METHOD_ERROR);
        }
    });

    it("should reject graffiti-get-random call that wasn't made with GET", () => {
        const input = {};

        try {
            graffitiGetAPi.validateParams(graffitiGetAPi.GRAFFITI_GET_RANDOM, input, "post");
        } catch (e) {
            expect(e.name).toEqual(graffitiGetAPi.METHOD_ERROR);
        }
    });

    it("should reject a call to get-graffiti without parameters", () => {
        try {
            graffitiGetAPi.validateParams(graffitiGetAPi.GRAFFITI_GET, {}, "get");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(graffitiGetAPi.MISSING_PARAMETER_ERROR);
        }
    });

    it("should reject a call to get-graffiti with ID that is not a string", () => {
        const input = {
            id: 2,
        };

        try {
            graffitiGetAPi.validateParams(graffitiGetAPi.GRAFFITI_GET, input, "get");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(graffitiGetAPi.PARAMETER_TYPE_ERROR);
        }
    });

    it("should reject a call to get-graffiti with ID that is not alpanumeric", () => {
        const input = {
            id: "!!!!!!!",
        };

        try {
            graffitiGetAPi.validateParams(graffitiGetAPi.GRAFFITI_GET, input, "get");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(graffitiGetAPi.PARAMETER_REGEX_ERROR);
        }
    });

    it("should reject a call to get a random graffiti when parameters are given", () => {
        const input = {
            id: "deadbeef783",
        };

        try {
            graffitiGetAPi.validateParams(graffitiGetAPi.GRAFFITI_GET_RANDOM, input, "get");
        } catch (e) {
            expect(e.name).toEqual(graffitiGetAPi.NO_SUCH_PARAMETER_ERROR);
        }
    });

});
