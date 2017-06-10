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

    it("should accept a call to graffiti-get-filter without parameters", () => {
        const input = {};

        try {
            graffitiGetAPI.validateParams(graffitiGetAPI.GRAFFITI_GET_FILTER, input, "post");
        } catch (e) {
            expect(true).toBe(false, e.message);
        }

    });

    it("should accept a call to graffiti-get-filter with only latitude and longitude", () => {
        const input = {
            latitude: 1,
            longitude: 1,
        };

        try {
            graffitiGetAPI.validateParams(graffitiGetAPI.GRAFFITI_GET_FILTER, input, "post");
        } catch (e) {
            expect(true).toBe(false, e.message);
        }

    });

    it("should accept a call to graffiti-get-filter with only popularity", () => {
        const input = {
            popularity: true,
        };

        try {
            graffitiGetAPI.validateParams(graffitiGetAPI.GRAFFITI_GET_FILTER, input, "post");
        } catch (e) {
            expect(true).toBe(false, e.message);
        }

    });

    it("should accept a call to graffiti-get-filter with latitude, longited and popularity", () => {
        const input = {
            latitude: 1,
            longitude: 1,
            popularity: true,
        };

        try {
            graffitiGetAPI.validateParams(graffitiGetAPI.GRAFFITI_GET_FILTER, input, "post");
        } catch (e) {
            expect(true).toBe(false, e.message);
        }

    });

    it("should reject calls made to get-graffiti filter not made with POST", () => {
        const input = {
            latitude: 1,
            longitude: 1,
            popularity: true,
        };

        try {
            graffitiGetAPI.validateParams(graffitiGetAPI.GRAFFITI_GET_FILTER, input, "get");
        } catch (e) {
            expect(e.name).toBe(graffitiGetAPI.METHOD_ERROR, "Wrong error code returned");
        }

    });

});
