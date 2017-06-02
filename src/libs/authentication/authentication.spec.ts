import { pbkdf2, randomBytes } from "crypto";
import * as https from "https";
import * as pug from "pug";
import { ClientRequest, request } from "http";
import { CoSServerConstants } from "./../../cos-server-constants";
import { AuthenticationEmailer } from "./authentication-emailer";
import { HashHelper } from "./hash-helper";
import { PasswordHelper } from "./password-helper";
import { ReCaptchaHelper } from "./recaptcha-helper";
import { RegistrationHelper } from "./registration-helper";

let httpsSpy: jasmine.Spy;
let requestSpy: jasmine.Spy;
let pugSpy: jasmine.Spy;
let genSaltSpy: jasmine.Spy;
let pbkdf2Spy: jasmine.Spy;

describe("AuthenticationEmailHelper", () => {
    beforeAll(() => {
        // Do this to have access to private methods
        let authenticationEmailer: any = AuthenticationEmailer;
        httpsSpy = spyOn(https, "request");
        pugSpy = spyOn(authenticationEmailer, "compileEmail");
    });

    it("should compile the user registration email", (done) => {
        // Manually spoof HTTP client so that no actual data is sent.
        const clientRequest: any = request({});
        httpsSpy.and.returnValue(clientRequest);
        pugSpy.and.returnValue("the email");
        clientRequest.write = () => {
            clientRequest.emit('end');
        };


        AuthenticationEmailer.sendAuthenticationEmail(
            "test@test.com",
            "testing",
            "deadbeef")
            .then(() => {
                expect(pugSpy).toHaveBeenCalledTimes(1);
                done();
            })
            .catch((error) => {
                console.log(error.message);
                expect(true).toBe(false);
                done();
            })
    });

    it("should throw error if attempt to send email is unsuccessful", (done) => {
        // Manually spoof HTTP client so that no actual data is sent.
        const clientRequest: any = request({});
        httpsSpy.and.returnValue(clientRequest);
        pugSpy.and.returnValue("the email");

        clientRequest.write = () => {
            clientRequest.emit('error');
        };


        AuthenticationEmailer.sendAuthenticationEmail(
            "test@test.com",
            "testing",
            "deadbeef")
            .then(() => {
                expect(true).toBe(false);
                done();
            })
            .catch((error: any) => {
                expect(error.code).toBe(CoSServerConstants.HTTP_SEND_ERROR.code);
                done();
            });
    });

    it("should send resolving promise if email sent successfully", (done) => {
        // Manually spoof HTTP client so that no actual data is sent.
        const clientRequest: any = request({});
        httpsSpy.and.returnValue(clientRequest);
        pugSpy.and.returnValue("the email");

        clientRequest.write = () => {
            clientRequest.emit('end');
        };


        AuthenticationEmailer.sendAuthenticationEmail(
            "test@test.com",
            "testing",
            "deadbeef")
            .then(() => {
                done();
            })
            .catch((error: any) => {
                expect(error).toBeFalsy();
                done();
            });

    });

});

/**
 * Unfortunately can't find a way to test failures. Should come back to this if
 * a solution is found.
 */
describe("HashHelper", () => {
    class SampleHelper extends HashHelper {

    }

    it("should generate a promise that produces a salt", (done) => {
        SampleHelper.generateSalt()
            .then((salt: string) => {
                expect(typeof (salt)).toEqual("string");
                done();
            })
            .catch(() => {
                expect(true).toBe(false);
            });
    });


    it("should generate a promise that produces a pbkdf2 hash", (done) => {
        SampleHelper.generatePbkdf2Hash("input", "deadbeef")
            .then((salt: string) => {
                expect(typeof (salt)).toEqual("string");
                done();
            })
            .catch(() => {
                expect(true).toBe(false);
            });
    });

});

describe("PasswordHelper", () => {
    it("should throw an error if pbkdf2 hashing fails", (done) => {
        pbkdf2Spy = spyOn(HashHelper, "generatePbkdf2Hash");
        pbkdf2Spy.and.returnValue(Promise.reject(CoSServerConstants.PBKDF2_HASH_ERROR.message));

        PasswordHelper.generatePbkdf2Hash("input", "deadbeef")
            .then(() => {
                expect(true).toBe(false);
                done();
            })
            .catch((error) => {
                expect(error).toEqual(CoSServerConstants.PBKDF2_HASH_ERROR.message);
                done();
            });
    });
});


describe("RegistrationHelper", () => {
    it("should throw an error if pbkdf2 hashing fails", (done) => {
        pbkdf2Spy = spyOn(HashHelper, "generatePbkdf2Hash");
        pbkdf2Spy.and.returnValue(Promise.reject(CoSServerConstants.PBKDF2_HASH_ERROR.message));

        RegistrationHelper.generatePbkdf2Hash("input", "deadbeef")
            .then(() => {
                expect(true).toBe(false);
                pbkdf2Spy.and.stub();
                done();
            })
            .catch((error) => {
                expect(error).toEqual(CoSServerConstants.PBKDF2_HASH_ERROR.message);
                pbkdf2Spy.and.stub();
                done();
            });
    });

    it("should fail to generate a registration key if salt generation fails", (done) => {
        pbkdf2Spy = spyOn(HashHelper, "generatePbkdf2Hash");
        genSaltSpy = spyOn(HashHelper, "generateSalt");
        genSaltSpy.and.returnValue(Promise.reject(CoSServerConstants.SALT_GENERATION_ERROR.message));

        RegistrationHelper.generateRegistrationKey("input", "deadbeef")
            .then(() => {
                expect(true).toBe(false);
                genSaltSpy.and.stub();
                done();
            })
            .catch((error) => {
                expect(error).toEqual(CoSServerConstants.SALT_GENERATION_ERROR.message);
                genSaltSpy.and.stub();
                done();
            });
    });

    it("should fail to generate a registration key if pbkdf2 hashing fails", (done) => {
        pbkdf2Spy = spyOn(HashHelper, "generatePbkdf2Hash");
        genSaltSpy = spyOn(HashHelper, "generateSalt");
        genSaltSpy.and.returnValue(Promise.resolve("salt"));
        pbkdf2Spy.and.returnValue(Promise.reject(CoSServerConstants.PBKDF2_HASH_ERROR.message));

        RegistrationHelper.generateRegistrationKey("input", "deadbeef")
            .then(() => {
                expect(true).toBe(false);
                pbkdf2Spy.and.stub();
                done();
            })
            .catch((error) => {
                expect(error).toEqual(CoSServerConstants.PBKDF2_HASH_ERROR.message);
                pbkdf2Spy.and.stub();
                done();
            });
    });


    it("should generate a registration key if all hashing succeeds", (done) => {
        genSaltSpy.and.returnValue(Promise.resolve("salt"));
        pbkdf2Spy.and.returnValue(Promise.resolve("saltier"));

        RegistrationHelper.generateRegistrationKey("input", "deadbeef")
            .then((output: string) => {
                expect(typeof(output)).toBe("string");
                done();
            })
            .catch((error) => {
                expect(error).toBeFalsy();
                done();
            });
    });


});

/**
 * Should come back to a tester for reCaptcha in the future.
 */
