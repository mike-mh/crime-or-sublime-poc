/**
 * @author Michael Mitchell-Halter
 */

import { UserRegsiterAPI } from "./user-register-api";

describe("UserRegsiterAPI", () => {
    const userRegsiterAPI = new UserRegsiterAPI();

    it("should reject registration submit call that wasn't made with POST", () => {
        const input = {
            registrationKey: "deadbeef783",
            username: "deadbeef",
        };

        try {
            userRegsiterAPI.validateParams(userRegsiterAPI.USER_REGISTER_SUBMIT_PATH, input, "get");
        } catch (e) {
            expect(e.name).toEqual(userRegsiterAPI.METHOD_ERROR);
        }
    });

    it("should reject registration confirmt call that wasn't made with GET", () => {
        const input = {
            captcha: "response",
            email: "test@test.com",
            password: "password",
            username: "test",
        };

        try {
            userRegsiterAPI.validateParams(userRegsiterAPI.USER_REGISTER_CONFIRM_PATH, input, "post");
        } catch (e) {
            expect(e.name).toEqual(userRegsiterAPI.METHOD_ERROR);
        }
    });

    it("should reject a call to submit user registration without parameters", () => {
        try {
            userRegsiterAPI.validateParams(userRegsiterAPI.USER_REGISTER_SUBMIT_PATH, {}, "post");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(userRegsiterAPI.MISSING_PARAMETER_ERROR);
        }
    });

    it("should reject a call to submit user registration without a username", () => {
        const input = {
            captcha: "response",
            email: "test@test.com",
            password: "password",
        };

        try {
            userRegsiterAPI.validateParams(userRegsiterAPI.USER_REGISTER_SUBMIT_PATH, {}, "post");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(userRegsiterAPI.MISSING_PARAMETER_ERROR);
        }
    });

    it("should reject a call to submit user registration without an email", () => {
        const input = {
            captcha: "response",
            password: "password",
            username: "test",
        };
        try {
            userRegsiterAPI.validateParams(userRegsiterAPI.USER_REGISTER_SUBMIT_PATH, {}, "post");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(userRegsiterAPI.MISSING_PARAMETER_ERROR);
        }
    });

    it("should reject a call to submit user registration without a password", () => {
        const input = {
            captcha: "response",
            email: "test@test.com",
            username: "test",
        };
        try {
            userRegsiterAPI.validateParams(userRegsiterAPI.USER_REGISTER_SUBMIT_PATH, {}, "post");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(userRegsiterAPI.MISSING_PARAMETER_ERROR);
        }
    });

    it("should reject a call to submit user registration without a reCaptcha response", () => {
        const input = {
            email: "test@test.com",
            password: "password",
            username: "test",
        };
        try {
            userRegsiterAPI.validateParams(userRegsiterAPI.USER_REGISTER_SUBMIT_PATH, {}, "post");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(userRegsiterAPI.MISSING_PARAMETER_ERROR);
        }
    });

    it("should reject a call to submit a username that is not a string", () => {
        const input = {
            captcha: "response",
            email: "test@test.com",
            password: "password",
            username: {Do: "bad stuff"},
        };

        try {
            userRegsiterAPI.validateParams(userRegsiterAPI.USER_REGISTER_SUBMIT_PATH, input, "post");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(userRegsiterAPI.PARAMETER_TYPE_ERROR);
        }
    });

    it("should reject a call to submit a username that is too long", () => {
        const input = {
            captcha: "response",
            email: "test@test.com",
            password: "password",
            username: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        };

        try {
            userRegsiterAPI.validateParams(userRegsiterAPI.USER_REGISTER_SUBMIT_PATH, input, "post");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(userRegsiterAPI.PARAMETER_MAX_LENGTH_ERROR);
        }
    });

    it("should reject a call to submit a username with non alphanumeric characters", () => {
        const input = {
            captcha: "response",
            email: "test@test.com",
            password: "password",
            username: "tes!t",
        };

        try {
            userRegsiterAPI.validateParams(userRegsiterAPI.USER_REGISTER_SUBMIT_PATH, input, "post");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(userRegsiterAPI.PARAMETER_REGEX_ERROR);
        }
    });

    it("should reject a call to submit an email that is not a string", () => {
        const input = {
            captcha: "response",
            email: 42,
            password: "password",
            username: "test",
        };

        try {
            userRegsiterAPI.validateParams(userRegsiterAPI.USER_REGISTER_SUBMIT_PATH, input, "post");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(userRegsiterAPI.PARAMETER_TYPE_ERROR);
        }
    });

    it("should reject a call to submit an email that is invalid", () => {
        const input = {
            captcha: "response",
            email: "test@test.",
            password: "password",
            username: "test",
        };

        try {
            userRegsiterAPI.validateParams(userRegsiterAPI.USER_REGISTER_SUBMIT_PATH, input, "post");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(userRegsiterAPI.PARAMETER_EMAIL_ERROR);
        }
    });

    it("should reject a call to submit a password that is not a string", () => {
        const input = {
            captcha: "response",
            email: "test@test.com",
            password: ["Hello", "Clevland!"],
            username: "test",
        };

        try {
            userRegsiterAPI.validateParams(userRegsiterAPI.USER_REGISTER_SUBMIT_PATH, input, "post");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(userRegsiterAPI.PARAMETER_TYPE_ERROR);
        }
    });

    it("should reject a call to submit a password that is too short", () => {
        const input = {
            captcha: "response",
            email: "test@test.com",
            password: "passwor",
            username: "test",
        };

        try {
            userRegsiterAPI.validateParams(userRegsiterAPI.USER_REGISTER_SUBMIT_PATH, input, "post");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(userRegsiterAPI.PARAMETER_MIN_LENGTH_ERROR);
        }
    });

    it("should reject a call to submit a password that is too long", () => {
        const input = {
            captcha: "response",
            email: "test@test.com",
            password: "passwordaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            username: "test",
        };

        try {
            userRegsiterAPI.validateParams(userRegsiterAPI.USER_REGISTER_SUBMIT_PATH, input, "post");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(userRegsiterAPI.PARAMETER_MAX_LENGTH_ERROR);
        }
    });

    it("should reject a call to submit a username with non alphanumeric characters", () => {
        const input = {
            captcha: "response",
            email: "test@test.com",
            password: "passwor!d",
            username: "test",
        };

        try {
            userRegsiterAPI.validateParams(userRegsiterAPI.USER_REGISTER_SUBMIT_PATH, input, "post");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(userRegsiterAPI.PARAMETER_REGEX_ERROR);
        }
    });

    it("should reject registration with captcha call that is not a string", () => {
        const input = {
            captcha: /^1337 h4x$/,
            email: "test@test.com",
            password: "password",
            username: "test",
        };

        try {
            userRegsiterAPI.validateParams(userRegsiterAPI.USER_REGISTER_SUBMIT_PATH, input, "post");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(userRegsiterAPI.PARAMETER_TYPE_ERROR);
        }
    });

    it("should accept a valid user registration submission", () => {
        const input = {
            captcha: "response",
            email: "test@test.com",
            password: "password",
            username: "test",
        };

        try {
            userRegsiterAPI.validateParams(userRegsiterAPI.USER_REGISTER_SUBMIT_PATH, input, "post");
        } catch (e) {
            expect(e.name).toEqual(userRegsiterAPI.PARAMETER_TYPE_ERROR);
            expect(true).toBe(false);
        }
    });

    it("should reject registration confirmation without parameters", () => {
        try {
            userRegsiterAPI.validateParams(userRegsiterAPI.USER_REGISTER_CONFIRM_PATH, {}, "get");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(userRegsiterAPI.MISSING_PARAMETER_ERROR);
        }
    });

    it("should reject registration confirmation without a username", () => {
        const input = {
            registrationKey: "deadbeef",
        };

        try {
            userRegsiterAPI.validateParams(userRegsiterAPI.USER_REGISTER_CONFIRM_PATH, input, "get");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(userRegsiterAPI.MISSING_PARAMETER_ERROR);
        }
    });

    it("should reject registration confirmation without a registrationKey", () => {
        const input = {
            username: "deadbeef",
        };

        try {
            userRegsiterAPI.validateParams(userRegsiterAPI.USER_REGISTER_CONFIRM_PATH, input, "get");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(userRegsiterAPI.MISSING_PARAMETER_ERROR);
        }
    });

    it("should reject registration confirmation with a username that isn't a string", () => {
        const input = {
            registrationKey: "deadbeef",
            username: 42,
        };

        try {
            userRegsiterAPI.validateParams(userRegsiterAPI.USER_REGISTER_CONFIRM_PATH, input, "get");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(userRegsiterAPI.PARAMETER_TYPE_ERROR);
        }
    });

    it("should reject registration confirmation with a username that is too long", () => {
        const input = {
            registrationKey: "deadbeef",
            username: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        };

        try {
            userRegsiterAPI.validateParams(userRegsiterAPI.USER_REGISTER_CONFIRM_PATH, input, "get");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(userRegsiterAPI.PARAMETER_MAX_LENGTH_ERROR);
        }
    });

    it("should reject registration confirmation with a username that is not alphanumeric", () => {
        const input = {
            registrationKey: "deadbeef",
            username: "dead!beef",
        };

        try {
            userRegsiterAPI.validateParams(userRegsiterAPI.USER_REGISTER_CONFIRM_PATH, input, "get");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(userRegsiterAPI.PARAMETER_REGEX_ERROR);
        }
    });

    it("should reject registration confirmation with a registration key that isn't a string", () => {
        const input = {
            registrationKey: [3, "fity"],
            username: "deadbeef",
        };

        try {
            userRegsiterAPI.validateParams(userRegsiterAPI.USER_REGISTER_CONFIRM_PATH, input, "get");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(userRegsiterAPI.PARAMETER_TYPE_ERROR);
        }
    });

    it("should reject registration confirmation with a registration key that isn't in hex", () => {
        const input = {
            registrationKey: "deadbeef783g",
            username: "deadbeef",
        };

        try {
            userRegsiterAPI.validateParams(userRegsiterAPI.USER_REGISTER_CONFIRM_PATH, input, "get");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(userRegsiterAPI.PARAMETER_REGEX_ERROR);
        }
    });

    it("should accept registration confirmation with valid parameters", () => {
        const input = {
            registrationKey: "deadbeef783",
            username: "deadbeef",
        };

        try {
            userRegsiterAPI.validateParams(userRegsiterAPI.USER_REGISTER_CONFIRM_PATH, input, "get");
        } catch (e) {
            expect(e.name).toEqual(userRegsiterAPI.PARAMETER_REGEX_ERROR);
        }
    });

});
