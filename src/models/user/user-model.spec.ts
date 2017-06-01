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

let tempUserCommitSpy: jasmine.Spy;
let userCommitSpy: jasmine.Spy;

let confirmPasswordsMatchSpy: jasmine.Spy;

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

    it("should throw error when generating a password hash fails", (done) => {
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

    it("after a temp user is created, an email should be sent to that user", (done) => {
        tempUserCommitSpy = spyOn(tempUserModel, "commitTempUserData");
        passwordSpy.and.returnValue("HASHY");
        tempUserCommitSpy.and.returnValue(Promise.resolve());

        tempUserModel.createTempUser("test", "test@test.com", "testings")
            .then(() => {
                expect(emailSpy).toHaveBeenCalledTimes(1);
                done();
            })
            .catch((error: Error) => {
                expect(true).toEqual(false);
                done();
            })
    });

    it("should throw an error if a request is made to register a user that doesn't exist", (done) => {
        tempUserModel.registerUser("Fake", "Dudes")
            .then(() => {
                expect(true).toBe(false);
                done();
            })
            .catch((error: any) => {
                expect(error.code).toEqual(CoSServerConstants.DATABASE_USER_REGISTRATION_CONFIRMATION_ERROR.code);
                done();
            });
    });

    it("should create a new user after confirmation and delete old temp user data", (done) => {
        tempUserModel.commitTempUserData("gg", "gg", "gg", "gg", "gg")
            .then(() => {
                return tempUserModel.registerUser("gg", "gg")
            })
            .then(() => {
                return tempUserModel.getModel().find({ email: "gg" });
            })
            .then((docs: any) => {
                if (docs.length) {
                    expect(true).toBe(false);
                    done();
                }

                return new UserModel().getModel().find({ email: "gg" })
            })
            .then((users: any) => {
                if (!users.length) {
                    expect(true).toBe(false);
                    done();
                }
                new UserModel().getModel().remove({ email: "gg" }).then(done);
            })
            .catch((error: any) => {
                console.log(error.message);
                expect(true).toBe(false);
                done();
            });
    });

    it("should know when a username or email is already taken in temp users", (done) => {
        tempUserModel.commitTempUserData(
            "test@test.com",
            "password",
            "deadbeef",
            "deadbeef",
            "testing")
            .then(() => {
                return tempUserModel.emailAndUsernameAreUnique("uniqueAlias", "test@test.com");
            })
            // This promise chain should never execute.
            .then(() => {
                return tempUserModel.getModel().remove({ email: "test@test.com" })
            })
            .then(() => {
                expect(true).toBe(false);
                done();
            })
            .catch((error: any) => {
                expect(error.code).toEqual(CoSServerConstants.DATABASE_USER_IDENTIFIER_TAKEN_ERROR.code);
            })
            .then(() => {
                return tempUserModel.emailAndUsernameAreUnique("testing", "unique@unique.com")
            })
            // This promise chain should never execute.
            .then(() => {
                return tempUserModel.getModel().remove({ username: "testing" })
            })
            .then(() => {
                expect(true).toBe(false);
                done();
            })
            .catch((error: any) => {
                expect(error.code).toEqual(CoSServerConstants.DATABASE_USER_IDENTIFIER_TAKEN_ERROR.code);
            })
            .then(() => {
                return tempUserModel.getModel().remove({ username: "testing" })
            })
            .then(() => {
                done();
            });
    });

    it("should know when a username or email is already taken in users", (done) => {
        const userModel = new UserModel();
        tempUserModel.commitUserData(
            userModel,
            "test@test.com",
            "password",
            "deadbeef",
            "testing")
            .then(() => {
                return tempUserModel.emailAndUsernameAreUnique("uniqueAlias", "test@test.com");
            })
            // This promise chain should never execute.
            .then(() => {
                return userModel.getModel().remove({ email: "test@test.com" })
            })
            .then(() => {
                expect(true).toBe(false);
                done();
            })
            .catch((error: any) => {
                expect(error.code).toEqual(CoSServerConstants.DATABASE_USER_IDENTIFIER_TAKEN_ERROR.code);
            })
            .then(() => {
                return tempUserModel.emailAndUsernameAreUnique("testing", "unique@unique.com")
            })
            // This promise chain should never execute.
            .then(() => {
                return userModel.getModel().remove({ username: "testing" })
            })
            .then(() => {
                expect(true).toBe(false);
                done();
            })
            .catch((error: any) => {
                expect(error.code).toEqual(CoSServerConstants.DATABASE_USER_IDENTIFIER_TAKEN_ERROR.code);
            })
            .then(() => {
                return userModel.getModel().remove({ username: "testing" })
            })
            .then(() => {
                done();
            });
    });

});

describe("UserModel", () => {
    let tempUserModel: any;
    let userModel: any;

    beforeAll(() => {
        tempUserModel = new TempUserModel();
        userModel = new UserModel();
    });

    it("should throw an error when fetching a salt for a non-existant user", (done) => {
        userModel.getUserSalt("fakedude")
            .then(() => {
                expect(true).toBe(false);
                done();
            })
            .catch((error: any) => {
                expect(error.code).toBe(CoSServerConstants.DATABASE_USER_DOES_NOT_EXIST_ERROR.code);
                done();
            });
    });

    it("should be able to get the salt of a registered user", (done) => {
        let returnedSalt: string;
        tempUserModel.commitUserData(
            userModel,
            "test@test.com",
            "password",
            "deadbeef",
            "testing"
        )
            .then(() => {
                return userModel.getUserSalt("test@test.com")
            })
            .then((salt: string) => {
                returnedSalt = salt;

                return userModel.getModel().remove({ username: "testing" })
            })
            .then(() => {
                expect(returnedSalt).toBe("deadbeef");
                done();
            })
            .catch((error: any) => {
                console.log(error.message);
                expect(error).toBeFalsy();
                return userModel.getModel().remove({ username: "testing" });
            })
            .then(() => {
                done();
            });
    });

    it("should throw an error when checking for a user that doesn't exist", (done) => {
        userModel.checkUserExists("test@test.com")
            .then(() => {
                expect(true).toBe(false);
                done();
            })
            .catch((error: any) => {
                expect(error.code).toEqual(CoSServerConstants.DATABASE_USER_DOES_NOT_EXIST_ERROR.code);
                done();
            })
    });

    it("should be able to check an existing user exists", (done) => {
        tempUserModel.commitUserData(
            userModel,
            "test@test.com",
            "password",
            "deadbeef",
            "testing"
        )
            .then(() => {
                return userModel.checkUserExists("test@test.com")
            })
            .then(() => {
                return userModel.getModel().remove({ username: "testing" })
            })
            .then(() => {
                done();
            })
            .catch((error: any) => {
                expect(error).toBeFalsy();
                return userModel.getModel().remove({ username: "testing" });
            })
            .then(() => {
                done();
            });
    });

    it("should catch errors from password hashing", (done) => {
        passwordSpy.calls.reset();
        passwordSpy.and.stub();
        passwordSpy.and.throwError(CoSServerConstants.PBKDF2_HASH_ERROR.message);

        tempUserModel.commitUserData(
            userModel,
            "test@test.com",
            "password",
            "deadbeef",
            "testing"
        )
            .then(() => {
                return userModel.confirmPasswordsMatch("test@test.com", "password");
            })
            .then(() => {
                return userModel.getModel().remove({ username: "testing" });
            })
            .then(() => {
                passwordSpy.and.stub();
                expect(true).toBe(false);
                done();
            })
            .catch((error: any) => {
                expect(error.message).toEqual(CoSServerConstants.PBKDF2_HASH_ERROR.message);
                expect(passwordSpy).toHaveBeenCalledTimes(1);
                return userModel.getModel().remove({ username: "testing" });
            })
            .then(() => {
                passwordSpy.and.stub();
                done();
            });
    });

    it("should detect when passwords don't match", (done) => {
        passwordSpy.calls.reset();
        passwordSpy.and.stub();
        passwordSpy.and.returnValue("passwor");

        tempUserModel.commitUserData(
            userModel,
            "test@test.com",
            "password",
            "deadbeef",
            "testing"
        )
            .then(() => {
                return userModel.confirmPasswordsMatch("test@test.com", "passwor");
            })
            .then(() => {
                return userModel.getModel().remove({ username: "testing" });
            })
            .then(() => {
                passwordSpy.and.stub();
                expect(true).toBe(false);
                done();
            })
            .catch((error: any) => {
                expect(passwordSpy).toHaveBeenCalledTimes(1);
                expect(error.message).toEqual(CoSServerConstants.DATABASE_USER_INVALID_PASSWORD_ERROR.message);
                return userModel.getModel().remove({ username: "testing" });
            })
            .then(() => {
                passwordSpy.and.stub();
                done();
            });
    });

    it("should detect when passwords match", (done) => {
        passwordSpy.calls.reset();
        passwordSpy.and.stub();
        passwordSpy.and.returnValue("password");

        tempUserModel.commitUserData(
            userModel,
            "test@test.com",
            "password",
            "deadbeef",
            "testing"
        )
            .then(() => {
                return userModel.confirmPasswordsMatch("test@test.com", "passwor");
            })
            .then(() => {
                return userModel.getModel().remove({ username: "testing" });
            })
            .then(() => {
                passwordSpy.and.stub();
                done();
            })
            .catch((error: any) => {
                expect(error).toBeFalsy();
                return userModel.getModel().remove({ username: "testing" });
            })
            .then(() => {
                passwordSpy.and.stub();
                done();
            });
    });

    it("should know when user credentials are invalid", (done) => {
        confirmPasswordsMatchSpy = spyOn(userModel, "confirmPasswordsMatch");
        confirmPasswordsMatchSpy.and.throwError(CoSServerConstants.DATABASE_USER_INVALID_PASSWORD_ERROR.message);

        tempUserModel.commitUserData(
            userModel,
            "test@test.com",
            "password",
            "deadbeef",
            "testing"
        )
            .then(() => {
                return userModel.authenticate("test@test.com", "passwor");
            })
            .then(() => {
                return userModel.getModel().remove({ username: "testing" });
            })
            .then(() => {
                confirmPasswordsMatchSpy.and.stub();
                passwordSpy.and.stub();
                expect(true).toBe(false);
                done();
            })
            .catch((error: any) => {
                expect(error.message).toEqual(CoSServerConstants.DATABASE_USER_INVALID_PASSWORD_ERROR.message);
                return userModel.getModel().remove({ username: "testing" });
            })
            .then(() => {
                confirmPasswordsMatchSpy.and.stub();
                passwordSpy.and.stub();
                done();
            });
    });

    it("should know when user credentials are valid", (done) => {
        confirmPasswordsMatchSpy = spyOn(userModel, "confirmPasswordsMatch");
        confirmPasswordsMatchSpy.and.returnValue("password");

        tempUserModel.commitUserData(
            userModel,
            "test@test.com",
            "password",
            "deadbeef",
            "testing"
        )
            .then(() => {
                return userModel.authenticate("test@test.com", "password");
            })
            .then(() => {
                return userModel.getModel().remove({ username: "testing" });
            })
            .then(() => {
                passwordSpy.and.stub();
                done();
            })
            .catch((error: any) => {
                expect(error).toBeFalsy();
                return userModel.getModel().remove({ username: "testing" });
            })
            .then(() => {
                passwordSpy.and.stub();
                done();
            });
    });


});