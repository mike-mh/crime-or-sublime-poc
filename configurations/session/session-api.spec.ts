import { SessionAPI } from "./session-api";

describe("SessionAPI", () => {
    const sessionAPI = new SessionAPI();

    it("should reject a call to create a user session without parameters", () => {
        try {
            sessionAPI.validateParams(sessionAPI.SESSION_CREATE_USER_PATH, {});
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(sessionAPI.MISSING_PARAMETER_ERROR);
        }
    });

    it("should reject a call to create a user session without an identifier", () => {
        const input = {
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
        const input = {
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
        const input = {
            identifier: 2341,
            password: "foobarbaz",
        };

        try {
            sessionAPI.validateParams(sessionAPI.SESSION_CREATE_USER_PATH, input);
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(sessionAPI.PARAMETER_TYPE_ERROR);
        }
    });

    it("should reject nonstring passwords", () => {
        const input = {
            identifier: "test",
            password: 234432631,
        };

        try {
            sessionAPI.validateParams(sessionAPI.SESSION_CREATE_USER_PATH, input);
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(sessionAPI.PARAMETER_TYPE_ERROR);
        }
    });

    it("should reject identifiers that are too long", () => {
        const input = {
            identifier: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            password: "foobarbaz",
        };

        try {
            sessionAPI.validateParams(sessionAPI.SESSION_CREATE_USER_PATH, input);
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(sessionAPI.PARAMETER_MAX_LENGTH_ERROR);
        }
    });

    it("should reject nonalphanumeric passwords", () => {
        const input = {
            identifier: "test",
            password: "!!!!bannasd",
        };

        try {
            sessionAPI.validateParams(sessionAPI.SESSION_CREATE_USER_PATH, input);
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(sessionAPI.PARAMETER_REGEX_ERROR);
        }
    });

    it("should reject passwords that are too short", () => {
        const input = {
            identifier: "test",
            password: "foobars",
        };

        try {
            sessionAPI.validateParams(sessionAPI.SESSION_CREATE_USER_PATH, input);
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(sessionAPI.PARAMETER_MIN_LENGTH_ERROR);
        }
    });

    it("should reject passwords that are too long", () => {
        const input = {
            identifier: "test",
            password: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        };

        try {
            sessionAPI.validateParams(sessionAPI.SESSION_CREATE_USER_PATH, input);
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(sessionAPI.PARAMETER_MAX_LENGTH_ERROR);
        }
    });

    it("should reject a call to end a user session with parameters", () => {
        const input = {
            identifier: "test",
            password: "foobarba",
        };

        try {
            sessionAPI.validateParams(sessionAPI.SESSION_END_USER_PATH, input);
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(sessionAPI.SESSION_PARAM_ERROR);
        }
    });

    it("should reject a call to verify session with parameters", () => {
        const input = {
            identifier: "test",
            password: "foobarba",
        };

        try {
            sessionAPI.validateParams(sessionAPI.SESSION_VERIFY_USER_PATH, input);
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(sessionAPI.SESSION_PARAM_ERROR);
        }
    });

    it("should accept a call to create a session with valid parameters", () => {
        const input = {
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
