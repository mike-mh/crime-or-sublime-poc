import { SessionAPI } from "./session-api";

describe("SessionAPI", () => {
    let sessionAPI = new SessionAPI();

    it("should reject a call to create a user session without parameters", () => {
        try {
            sessionAPI.validateParams(sessionAPI.SESSION_CREATE_USER_PATH, {});
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(sessionAPI.MISSING_PARAMETER_ERROR);
        }
    });

    it("should reject a call to create a user session without an identifier", () => {
        let input = {
            password: "foobarbaz",
        };

        try {
            sessionAPI.validateParams(sessionAPI.SESSION_CREATE_USER_PATH, input);
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(sessionAPI.MISSING_PARAMETER_ERROR);
        }
    });

    it("should reject a call to create a user session without a password", () => {
        let input = {
            identifier: "manman",
        };

        try {
            sessionAPI.validateParams(sessionAPI.SESSION_CREATE_USER_PATH, input);
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(sessionAPI.MISSING_PARAMETER_ERROR);
        }
    });

    it("should reject nonstring identifiers", () => {
        let input = {
            identifier: 2341,
            password: "foobarbaz"
        };

        try {
            sessionAPI.validateParams(sessionAPI.SESSION_CREATE_USER_PATH, input);
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(sessionAPI.PARAMETER_TYPE_ERROR);
        }
    });

    it("should reject nonstring passwords", () => {
        let input = {
            identifier: "test",
            password: 234432631
        };

        try {
            sessionAPI.validateParams(sessionAPI.SESSION_CREATE_USER_PATH, input);
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(sessionAPI.PARAMETER_TYPE_ERROR);
        }
    });

    it("should reject identifiers that are too long", () => {
        let input = {
            identifier: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            password: "foobarbaz"
        };

        try {
            sessionAPI.validateParams(sessionAPI.SESSION_CREATE_USER_PATH, input);
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(sessionAPI.PARAMETER_MAX_LENGTH_ERROR);
        }
    });

    it("should reject nonalphanumeric passwords", () => {
        let input = {
            identifier: "test",
            password: "!!!!bannasd"
        };

        try {
            sessionAPI.validateParams(sessionAPI.SESSION_CREATE_USER_PATH, input);
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(sessionAPI.PARAMETER_REGEX_ERROR);
        }
    });

    it("should reject passwords that are too short", () => {
        let input = {
            identifier: "test",
            password: "foobars"
        };

        try {
            sessionAPI.validateParams(sessionAPI.SESSION_CREATE_USER_PATH, input);
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(sessionAPI.PARAMETER_MIN_LENGTH_ERROR);
        }
    });

    it("should reject passwords that are too long", () => {
        let input = {
            identifier: "test",
            password: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
        };

        try {
            sessionAPI.validateParams(sessionAPI.SESSION_CREATE_USER_PATH, input);
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(sessionAPI.PARAMETER_MAX_LENGTH_ERROR);
        }
    });


    it("should reject a call to end a user session with parameters", () => {
        let input = {
            identifier: "test",
            password: "foobarba"
        };

        try {
            sessionAPI.validateParams(sessionAPI.SESSION_END_USER_PATH, input);
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(sessionAPI.SESSION_PARAM_ERROR);
        }
    });

    it("should reject a call to verify session with parameters", () => {
        let input = {
            identifier: "test",
            password: "foobarba"
        };

        try {
            sessionAPI.validateParams(sessionAPI.SESSION_VERIFY_USER_PATH, input);
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(sessionAPI.SESSION_PARAM_ERROR);
        }
    });

    it("should accept a call to create a session with valid parameters", () => {
        let input = {
            identifier: "test",
            password: "password",
        };

        try {
            sessionAPI.validateParams(sessionAPI.SESSION_CREATE_USER_PATH, input);
        } catch (e) {
            expect(true).toBe(false);
        }
    });
});