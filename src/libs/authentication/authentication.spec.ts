/**
 * @author Michael Mitchell-Halter 
 */

import { pbkdf2, randomBytes } from "crypto";
import { ClientRequest, request } from "http";
import * as https from "https";
import * as pug from "pug";
import { Observable } from "rxjs/Observable";
import { CoSServerConstants } from "./../../cos-server-constants";
import { AuthenticationEmailer } from "./authentication-emailer";
import { HashHelper } from "./hash-helper";
import { PasswordHelper } from "./password-helper";
import { ReCaptchaHelper } from "./recaptcha-helper";
import { RegistrationHelper } from "./registration-helper";

let httpsSpy: jasmine.Spy;
let pugSpy: jasmine.Spy;
let genSaltSpy: jasmine.Spy;
let pbkdf2Spy: jasmine.Spy;

describe("AuthenticationEmailHelper", () => {
    beforeAll(() => {
        // Do this to have access to private methods
        const authenticationEmailer: any = AuthenticationEmailer;
        httpsSpy = spyOn(https, "request");
        pugSpy = spyOn(authenticationEmailer, "compileEmail");
    });

    it("should compile the user registration email", (done) => {
        // Manually spoof HTTP client so that no actual data is sent.
        const clientRequest: any = request({});
        httpsSpy.and.returnValue(clientRequest);
        pugSpy.and.returnValue("the email");
        clientRequest.write = () => {
            clientRequest.emit("end");
        };

        AuthenticationEmailer.sendAuthenticationEmail(
            "test@test.com",
            "testing",
            "deadbeef")
            .subscribe(() => {
                expect(pugSpy).toHaveBeenCalledTimes(1);
                done();
            },
            (error) => {
                process.stderr.write(error.message);
                expect(true).toBe(false);
                done();
            });
    });

    it("should throw error if attempt to send email is unsuccessful", (done) => {
        // Manually spoof HTTP client so that no actual data is sent.
        const clientRequest: any = request({});
        httpsSpy.and.returnValue(clientRequest);
        pugSpy.and.returnValue("the email");

        clientRequest.write = () => {
            clientRequest.emit("error");
        };

        AuthenticationEmailer.sendAuthenticationEmail(
            "test@test.com",
            "testing",
            "deadbeef").subscribe
            (() => {
                expect(true).toBe(false);
                done();
            },
            (error: any) => {
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
            clientRequest.emit("end");
        };

        AuthenticationEmailer.sendAuthenticationEmail(
            "test@test.com",
            "testing",
            "deadbeef")
            .subscribe(() => {
                done();
            },
            (error: any) => {
                expect(error).toBeFalsy();
                done();
            });

    });

});

/**
 * Unfortunately can"t find a way to test failures. Should come back to this if
 * a solution is found.
 */
describe("HashHelper", () => {
    class SampleHelper extends HashHelper {

    }

    it("should generate a promise that produces a salt", (done) => {
        SampleHelper.generateSalt()
            .subscribe((salt: string) => {
                expect(typeof (salt)).toEqual("string");
                done();
            },
            () => {
                expect(true).toBe(false);
            });
    });

    it("should generate a promise that produces a pbkdf2 hash", (done) => {
        SampleHelper.generatePbkdf2Hash("input", "deadbeef")
            .subscribe((salt: string) => {
                expect(typeof (salt)).toEqual("string");
                done();
            },
            () => {
                expect(true).toBe(false);
            });
    });

});

describe("PasswordHelper", () => {
    it("should throw an error if pbkdf2 hashing fails", (done) => {
        pbkdf2Spy = spyOn(HashHelper, "generatePbkdf2Hash");
        pbkdf2Spy.and.returnValue(Observable.create((observer: any) => {
            observer.error(CoSServerConstants.PBKDF2_HASH_ERROR);
        }));

        PasswordHelper.generatePbkdf2Hash("input", "deadbeef")
            .subscribe(() => {
                expect(true).toBe(false);
                done();
            },
            (error) => {
                expect(error.code).toEqual(CoSServerConstants.PBKDF2_HASH_ERROR.code);
                done();
            });
    });
});

describe("RegistrationHelper", () => {
    it("should throw an error if pbkdf2 hashing fails", (done) => {
        pbkdf2Spy = spyOn(HashHelper, "generatePbkdf2Hash");
        pbkdf2Spy.and.returnValue(Observable.create((observer: any) => {
            observer.error(CoSServerConstants.PBKDF2_HASH_ERROR);
        }));

        RegistrationHelper.generatePbkdf2Hash("input", "deadbeef")
            .subscribe(() => {
                expect(true).toBe(false);
                pbkdf2Spy.and.stub();
                done();
            },
            (error) => {
                expect(error.code).toEqual(CoSServerConstants.PBKDF2_HASH_ERROR.code);
                pbkdf2Spy.and.stub();
                done();
            });
    });

    it("should fail to generate a registration key if salt generation fails", (done) => {
        pbkdf2Spy = spyOn(HashHelper, "generatePbkdf2Hash");
        genSaltSpy = spyOn(HashHelper, "generateSalt");
        genSaltSpy.and.returnValue(Observable.create((observer: any) => {
            observer.error(CoSServerConstants.SALT_GENERATION_ERROR);
        }));

        RegistrationHelper.generateRegistrationKey("input", "deadbeef")
            .subscribe(() => {
                expect(true).toBe(false);
                genSaltSpy.and.stub();
                done();
            },
            (error) => {
                expect(error.code).toEqual(CoSServerConstants.SALT_GENERATION_ERROR.code);
                genSaltSpy.and.stub();
                done();
            });
    });

    it("should fail to generate a registration key if pbkdf2 hashing fails", (done) => {
        pbkdf2Spy = spyOn(HashHelper, "generatePbkdf2Hash");
        genSaltSpy = spyOn(HashHelper, "generateSalt");
        genSaltSpy.and.returnValue(Observable.create((observer: any) => {
            observer.next("salt");
        }));
        pbkdf2Spy.and.returnValue(Observable.create((observer: any) => {
            observer.error(CoSServerConstants.PBKDF2_HASH_ERROR);
        }));

        RegistrationHelper.generateRegistrationKey("input", "deadbeef")
            .subscribe(() => {
                expect(true).toBe(false);
                pbkdf2Spy.and.stub();
                done();
            },
            (error) => {
                expect(error.code).toEqual(CoSServerConstants.PBKDF2_HASH_ERROR.code);
                pbkdf2Spy.and.stub();
                done();
            });
    });

    it("should generate a registration key if all hashing succeeds", (done) => {
        genSaltSpy.and.returnValue(Observable.create((observer: any) => {
            observer.next("salt");
        }));
        pbkdf2Spy.and.returnValue(Observable.create((observer: any) => {
            observer.error(CoSServerConstants.PBKDF2_HASH_ERROR);
        }));

        RegistrationHelper.generateRegistrationKey("input", "deadbeef")
            .subscribe((output: string) => {
                expect(typeof (output)).toBe("string");
                done();
            },
            (error) => {
                expect(error).toBeFalsy();
                done();
            });
    });

});

/**
 * Should write tests for for reCaptcha in the future.
 */
