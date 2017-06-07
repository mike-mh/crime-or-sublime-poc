import { GraffitiGetAPI } from "./graffiti-get-api";

describe("graffitiGetAPI", () => {
    const graffitiGetAPI = new GraffitiGetAPI();

    it("should reject graffiti-get call that wasn't made with GET", () => {
        const input = {
            id: "deadbeef",
        };

        try {
            graffitiGetAPI.validateParams(graffitiGetAPI.GRAFFITI_GET, input, "post");
        } catch (e) {
            expect(e.name).toEqual(graffitiGetAPI.METHOD_ERROR);
        }
    });

    it("should reject graffiti-get-random call that wasn't made with GET", () => {
        const input = {};

        try {
            graffitiGetAPI.validateParams(graffitiGetAPI.GRAFFITI_GET_RANDOM, input, "post");
        } catch (e) {
            expect(e.name).toEqual(graffitiGetAPI.METHOD_ERROR);
        }
    });

    it("should reject a call to get-graffiti without parameters", () => {
        try {
            graffitiGetAPI.validateParams(graffitiGetAPI.GRAFFITI_GET, {}, "get");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(graffitiGetAPI.MISSING_PARAMETER_ERROR);
        }
    });

    it("should reject a call to get-graffiti with ID that is not a string", () => {
        const input = {
            id: 2,
        };

        try {
            graffitiGetAPI.validateParams(graffitiGetAPI.GRAFFITI_GET, input, "get");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(graffitiGetAPI.PARAMETER_TYPE_ERROR);
        }
    });

    it("should reject a call to get-graffiti with ID that is not alpanumeric", () => {
        const input = {
            id: "!!!!!!!",
        };

        try {
            graffitiGetAPI.validateParams(graffitiGetAPI.GRAFFITI_GET, input, "get");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(graffitiGetAPI.PARAMETER_REGEX_ERROR);
        }
    });

    it("should reject a call to get a random graffiti when parameters are given", () => {
        const input = {
            id: "deadbeef783",
        };

        try {
            graffitiGetAPI.validateParams(graffitiGetAPI.GRAFFITI_GET_RANDOM, input, "get");
        } catch (e) {
            expect(e.name).toEqual(graffitiGetAPI.NO_SUCH_PARAMETER_ERROR);
        }
    });

});
