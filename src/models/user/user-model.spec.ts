import { connect, Document, model, Model, Schema } from "mongoose";
import mongoose = require("mongoose");
import { CoSServerConstants } from "./../../cos-server-constants";
import { AuthenticationEmailer } from "./../../libs/authentication/authentication-emailer";
import { PasswordHelper } from "./../../libs/authentication/password-helper";
import { RegistrationHelper } from "./../../libs/authentication/registration-helper";
import { TempUserModelSchema, UserModelSchema } from "./../cos-model-constants";
import { TempUserModel } from "./temp-user-model";
import { UserModel } from "./user-model";

// Don't want to be spamming unnecessary HTTP calls.
let emailSpy: jasmine.Spy;

let registrationSpy: jasmine.Spy;
let registrationHashSpy: jasmine.Spy;

let passwordSpy: jasmine.Spy;
let passwordHashSpy: jasmine.Spy;

// Need to establish a connection a MongoDB and create spies.
beforeAll((done) => {
    mongoose.Promise = global.Promise;
    emailSpy = spyOn(AuthenticationEmailer, "sendAuthenticationEmail");
    emailSpy.and.returnValue(Promise.resolve());


    registrationSpy = spyOn(RegistrationHelper, "generateRegistrationKey");
    registrationHashSpy = spyOn(RegistrationHelper, "generateSalt");

    passwordSpy = spyOn(PasswordHelper, "hashPassword");
    passwordHashSpy = spyOn(PasswordHelper, "generateSalt");

    connect("mongodb://localhost/cos").then(done);
});

/**
 * Should consider add tests to see that schemas in each model match
 * constraints that are set else where.
 */
describe("TempUserModel", () => {
    const tempUserModel: any = new TempUserModel();

    it("should have the TempUserSchema assigned to it", () => {
        expect(tempUserModel.schema).toEqual(TempUserModelSchema);
    });

    it("should be able to save temp user data to the database", (done) => {
        tempUserModel.commitTempUserData(
            "santa@claus.com",
            "canada",
            "theKey",
            "salty",
            "fattycakes"
        ).then((error: any) => {
            // Now check if it committed
            tempUserModel.getModel().find({ email: "santa@claus.com", registrationKey: "theKey" })
                .then((users: any) => {
                    if (users.length) {
                        // Now remove fake user.
                        tempUserModel.getModel().remove(
                            { email: "santa@claus.com", registrationKey: "theKey" }, (error: any) => {
                                if (error) {
                                    console.log(error);
                                    expect(true).toBe(false);
                                    done();
                                }
                            }).then(done);
                    } else {
                        // User wasn't inserted
                        expect(true).toBe(false);
                        done();
                    }
                });
           })
            .catch((error: any) => {
                console.log(error)
                expect(true).toBe(false)
            });
    });

    it("should be able to save new user data to the database", (done) => {
        const newUser = new UserModel();
        tempUserModel.commitUserData(
            newUser,
            "santa@claus.com",
            "canada",
            "salty",
            "fattycakes"
        ).then((error: any) => {
            // Now check if it committed
            newUser.getModel().find({ email: "santa@claus.com", salt: "salty" })
                .then((users: any) => {
                    if (users.length) {
                        // Now remove fake user.
                        newUser.getModel().remove(
                            { email: "santa@claus.com", salt: "salty" }, (error: any) => {
                                if (error) {
                                    console.log(error);
                                    expect(true).toBe(false);
                                    done();
                                }
                            }).then(done);
                    } else {
                        // User wasn't inserted
                        expect(true).toBe(false);
                        done();
                    }
                });
           })
            .catch((error: any) => {
                console.log(error)
                expect(true).toBe(false)
            });
    });


    it("should throw error when generating a registration salt fails", (done) => {
        registrationSpy.and.throwError(CoSServerConstants.SALT_GENERATION_ERROR.message);
        tempUserModel.createTempUser("test", "test@test.com", "testings")
            .then(() => {
                expect(true).toBe(false);
                registrationSpy.and.stub();
                done();
            })
            .catch((error: Error) => {
                expect(error.message).toEqual(CoSServerConstants.SALT_GENERATION_ERROR.message);
                registrationSpy.and.stub();
                done();
            })
    });

    it("should throw error when generating a salt for a password fails", (done) => {
        registrationSpy.and.returnValue(Promise.resolve("AKEY"));
        passwordHashSpy.and.throwError(CoSServerConstants.SALT_GENERATION_ERROR.message);
        tempUserModel.createTempUser("test", "test@test.com", "testings")
            .then(() => {
                expect(true).toBe(false);
                passwordHashSpy.and.stub();
                done();
            })
            .catch((error: Error) => {
                expect(error.message).toEqual(CoSServerConstants.SALT_GENERATION_ERROR.message);
                passwordHashSpy.and.stub();
                done();
            })
    });

    it("should throw error when generating a salt for a password fails", (done) => {
        passwordHashSpy.and.returnValue(Promise.resolve("AHASH"));
        passwordSpy.and.throwError(CoSServerConstants.SALT_GENERATION_ERROR.message);
        tempUserModel.createTempUser("test", "test@test.com", "testings")
            .then(() => {
                expect(true).toBe(false);
                passwordHashSpy.and.stub();
                done();
            })
            .catch((error: Error) => {
                expect(error.message).toEqual(CoSServerConstants.SALT_GENERATION_ERROR.message);
                passwordHashSpy.and.stub();
                done();
            })
    });

});

describe("UserModel", () => {
    it("this is a stub", () => { });
});