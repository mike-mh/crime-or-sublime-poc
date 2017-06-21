/**
 * @author Michael Mitchell-Halter
 */

import { UserProfileAPI } from "./user-profile-api";

describe("userProfileAPI", () => {
    const userProfileAPI = new UserProfileAPI();

    it("should reject a call to user-profile-add-favourite that isn't made with POST method", () => {
        const input = {};

        try {
            userProfileAPI.validateParams(userProfileAPI.USER_PROFILE_ADD_FAVOURITE, input, "get");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(userProfileAPI.METHOD_ERROR);
        }
    });

    it("should reject a call to user-profile-add-favourite without a graffiti ID", () => {
        const input = {};

        try {
            userProfileAPI.validateParams(userProfileAPI.USER_PROFILE_ADD_FAVOURITE, input, "post");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(userProfileAPI.MISSING_PARAMETER_ERROR);
        }
    });

    it("should reject a call to user-profile-add-favourite with an id that is not a string", () => {
        const input = {
            id: {},
        };

        try {
            userProfileAPI.validateParams(userProfileAPI.USER_PROFILE_ADD_FAVOURITE, input, "post");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(userProfileAPI.PARAMETER_TYPE_ERROR);
        }
    });

    it("should reject a call to user-profile-add-favourite with an id that is not alphanumeric", () => {
        const input = {
            id: "!!!!!!",
        };

        try {
            userProfileAPI.validateParams(userProfileAPI.USER_PROFILE_ADD_FAVOURITE, input, "post");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(userProfileAPI.PARAMETER_REGEX_ERROR);
        }
    });

    it("should reject a call to user-profile-remove-favourite that isn't made with POST method", () => {
        const input = {};

        try {
            userProfileAPI.validateParams(userProfileAPI.USER_PROFILE_REMOVE_FAVOURITE, input, "get");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(userProfileAPI.METHOD_ERROR);
        }
    });

    it("should reject a call to user-profile-remove-favourite without a graffiti ID", () => {
        const input = {};

        try {
            userProfileAPI.validateParams(userProfileAPI.USER_PROFILE_REMOVE_FAVOURITE, input, "post");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(userProfileAPI.MISSING_PARAMETER_ERROR);
        }
    });

    it("should reject a call to user-profile-remove-favourite with an id that is not a string", () => {
        const input = {
            id: {},
        };

        try {
            userProfileAPI.validateParams(userProfileAPI.USER_PROFILE_REMOVE_FAVOURITE, input, "post");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(userProfileAPI.PARAMETER_TYPE_ERROR);
        }
    });

    it("should reject a call to user-profile-remove-favourite with an id that is not alphanumeric", () => {
        const input = {
            id: "!!!!!!",
        };

        try {
            userProfileAPI.validateParams(userProfileAPI.USER_PROFILE_REMOVE_FAVOURITE, input, "post");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(userProfileAPI.PARAMETER_REGEX_ERROR);
        }
    });

    it("should reject a call to user-profile-get-favourites with parameters", () => {
        const input = {
            hello: "world",
        };

        try {
            userProfileAPI.validateParams(userProfileAPI.USER_PROFILE_GET_FAVOURITES, input, "get");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(userProfileAPI.NO_SUCH_PARAMETER_ERROR);
        }
    });

    it("should reject a call to user-profile-get-favourites not made with GET", () => {
        const input = {
            hello: "world",
        };

        try {
            userProfileAPI.validateParams(userProfileAPI.USER_PROFILE_GET_FAVOURITES, input, "post");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(userProfileAPI.METHOD_ERROR);
        }
    });

});
