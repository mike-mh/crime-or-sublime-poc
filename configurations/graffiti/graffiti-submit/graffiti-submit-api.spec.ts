import { GraffitiSubmitAPI } from "./graffiti-submit-api";

describe("GraffitiSubmitAPI", () => {
    const graffitiSubmitAPI = new GraffitiSubmitAPI();

    it("should reject graffiti-submit-new-submission calls not made with POST", () => {
        const input = {
            id: "deadbeef",
            latitude: 100,
            longitude: 100,
        };

        try {
            graffitiSubmitAPI.validateParams(graffitiSubmitAPI.GRAFFIT_SUBMIT_NEW_SUBMISSION, input, "get");
        } catch (e) {
            expect(e.name).toEqual(graffitiSubmitAPI.METHOD_ERROR);
        }
    });

    it("should reject a call to graffiti-submit-new-submission without parameters", () => {
        try {
            graffitiSubmitAPI.validateParams(graffitiSubmitAPI.GRAFFIT_SUBMIT_NEW_SUBMISSION, {}, "post");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(graffitiSubmitAPI.MISSING_PARAMETER_ERROR);
        }
    });

    it("should reject a call to graffiti-submit-new-submission with ID that is not a string", () => {
        const input = {
            id: 2,
            latitude: 100,
            longitude: 100,
        };

        try {
            graffitiSubmitAPI.validateParams(graffitiSubmitAPI.GRAFFIT_SUBMIT_NEW_SUBMISSION, input, "post");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(graffitiSubmitAPI.PARAMETER_TYPE_ERROR);
        }
    });

    it("should reject a call to graffiti-submit-new-submission with ID that is not alpanumeric", () => {
        const input = {
            id: "!!!!!!!",
            latitude: 100,
            longitude: 100,
        };

        try {
            graffitiSubmitAPI.validateParams(graffitiSubmitAPI.GRAFFIT_SUBMIT_NEW_SUBMISSION, input, "post");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(graffitiSubmitAPI.PARAMETER_REGEX_ERROR);
        }
    });

    it("should reject a call to graffiti-submit-new-submission with longitude that is not a number", () => {
        const input = {
            id: "deadbeef",
            latitude: 100,
            longitude: "2",
        };

        try {
            graffitiSubmitAPI.validateParams(graffitiSubmitAPI.GRAFFIT_SUBMIT_NEW_SUBMISSION, input, "post");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(graffitiSubmitAPI.PARAMETER_TYPE_ERROR);
        }
    });

    it("should reject a call to graffiti-submit-new-submission with longitude greater than 180", () => {
        const input = {
            id: "deadbeef",
            latitude: 100,
            longitude: 181,
        };

        try {
            graffitiSubmitAPI.validateParams(graffitiSubmitAPI.GRAFFIT_SUBMIT_NEW_SUBMISSION, input, "post");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(graffitiSubmitAPI.PARAMETER_MAX_VALUE_ERROR);
        }
    });

    it("should reject a call to graffiti-submit-new-submission with longitude less than -180", () => {
        const input = {
            id: "deadbeef",
            latitude: 100,
            longitude: -181,
        };

        try {
            graffitiSubmitAPI.validateParams(graffitiSubmitAPI.GRAFFIT_SUBMIT_NEW_SUBMISSION, input, "post");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(graffitiSubmitAPI.PARAMETER_MIN_VALUE_ERROR);
        }
    });

    it("should reject a call to graffiti-submit-new-submission with latitude greater than 180", () => {
        const input = {
            id: "deadbeef",
            latitude: 181,
            longitude: 100,
        };

        try {
            graffitiSubmitAPI.validateParams(graffitiSubmitAPI.GRAFFIT_SUBMIT_NEW_SUBMISSION, input, "post");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(graffitiSubmitAPI.PARAMETER_MAX_VALUE_ERROR);
        }
    });

    it("should reject a call to graffiti-submit-new-submission with longitude less than -180", () => {
        const input = {
            id: "deadbeef",
            latitude: -181,
            longitude: 100,
        };

        try {
            graffitiSubmitAPI.validateParams(graffitiSubmitAPI.GRAFFIT_SUBMIT_NEW_SUBMISSION, input, "post");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(graffitiSubmitAPI.PARAMETER_MIN_VALUE_ERROR);
        }
    });
});
