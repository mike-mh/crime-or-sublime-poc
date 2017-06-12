import { connect, Document, model, Model, Schema } from "mongoose";
import mongoose = require("mongoose");
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";
import { Observable } from "rxjs/Observable";
import { CoSServerConstants } from "./../../cos-server-constants";
import { AuthenticationEmailer } from "./../../libs/authentication/authentication-emailer";
import { PasswordHelper } from "./../../libs/authentication/password-helper";
import { RegistrationHelper } from "./../../libs/authentication/registration-helper";
import { IUserDocument, TempUserModelSchema, UserModelSchema } from "./../cos-model-constants";
import { GraffitiModel } from "./../graffiti/graffiti-model";
import { TempUserModel } from "./temp-user-model";
import { UserModel } from "./user-model";

/**
 * Should consider add tests to see that schemas in each model match
 * constraints that are set else where.
 */
describe("TempUserModel", () => {
    const tempUserModel: any = new TempUserModel();

    it("should have the TempUserSchema assigned to it", () => {
        expect(tempUserModel.schema).toEqual(TempUserModelSchema);
    });

    it("should be able to save new user data to the database", (done) => {
        tempUserModel.commitUserData(
            "santa@claus.com",
            "canada",
            "salty",
            "fattycakes",
        ).subscribe((error: any) => {
            const newUser: any = new UserModel();
            // Now check if it committed
            newUser.getDocument({ email: "santa@claus.com", salt: "salty" }).subscribe(
                () => {
                    newUser.removeDocuments({ email: "santa@claus.com", salt: "salty" }).subscribe(
                        () => {
                            done();
                        },
                        (removeError: any) => {
                            expect(true).toBe(false, removeError.message);
                            done();
                        });
                },
                (retrieveError: any) => {
                    // This error should also trigger if document was never
                    // saved in the first place.
                    expect(true).toBe(false, retrieveError.message);
                    done();
                });
        });
    });

    it("should throw error when generating a registration salt fails", (done) => {
        const registrationSpy = spyOn(RegistrationHelper, "generateRegistrationKey");
        const registrationHashSpy = spyOn(RegistrationHelper, "generateSalt");

        registrationSpy.and.throwError(CoSServerConstants.SALT_GENERATION_ERROR.message);
        tempUserModel.createTempUser("test", "test@test.com", "testings")
            .subscribe(() => {
                expect(true).toBe(false);
                registrationSpy.and.stub();
                done();
            },
            (error: Error) => {
                expect(error.message).toEqual(CoSServerConstants.SALT_GENERATION_ERROR.message);
                registrationSpy.and.stub();
                done();
            });
    });

    it("should throw error when generating a salt for a password fails", (done) => {
        const registrationSpy = spyOn(RegistrationHelper, "generateRegistrationKey");
        const registrationHashSpy = spyOn(RegistrationHelper, "generateSalt");

        registrationSpy.and.returnValue(Observable.create((observable: any) => {
            observable.next("AKEY");
        }));

        const passwordSpy = spyOn(PasswordHelper, "hashPassword");
        const passwordHashSpy = spyOn(PasswordHelper, "generateSalt");

        passwordHashSpy.and.throwError(CoSServerConstants.SALT_GENERATION_ERROR.message);
        tempUserModel.createTempUser("test", "test@test.com", "testings")
            .subscribe(() => {
                expect(true).toBe(false);
                passwordHashSpy.and.stub();
                done();
            },
            (error: Error) => {
                expect(error.message).toEqual(CoSServerConstants.SALT_GENERATION_ERROR.message);
                passwordHashSpy.and.stub();
                done();
            });
    });

    it("should throw error when generating a password hash fails", (done) => {
        const passwordSpy = spyOn(PasswordHelper, "hashPassword");
        const passwordHashSpy = spyOn(PasswordHelper, "generateSalt");

        passwordHashSpy.and.returnValue(Observable.create((observer: any) => {
            observer.next("AHASH");
        }));
        passwordSpy.and.throwError(CoSServerConstants.SALT_GENERATION_ERROR.message);
        tempUserModel.createTempUser("test", "test@test.com", "testings")
            .subscribe(() => {
                expect(true).toBe(false);
                done();
            },
            (error: Error) => {
                expect(error.message).toEqual(CoSServerConstants.SALT_GENERATION_ERROR.message);
                done();
            });
    });

    it("after a temp user is created, an email should be sent to that user", (done) => {
        const emailSpy = spyOn(AuthenticationEmailer, "sendAuthenticationEmail");
        emailSpy.calls.reset();
        emailSpy.and.returnValue(Observable.create((observer: any) => {
            observer.next();
        }));

        const tempUserCommitSpy = spyOn(tempUserModel, "saveDocument");

        tempUserCommitSpy.and.returnValue(Observable.create((observer: any) => {
            observer.next();
        }));

        const passwordSpy = spyOn(PasswordHelper, "hashPassword");

        passwordSpy.and.returnValue(Observable.create((observer: any) => {
            observer.next("HASHY");
        }));

        emailSpy.calls.reset();

        tempUserModel.createTempUser("test", "test@test.com", "testings")
            .subscribe(() => {
                expect(emailSpy).toHaveBeenCalledTimes(1);
                emailSpy.and.callThrough();
                done();
            },
            (error: Error) => {
                emailSpy.and.callThrough();
                expect(true).toEqual(false);
                done();
            });
    });

    it("should throw an error if a request is made to register a user that doesn't exist", (done) => {
        tempUserModel.registerUser("Fake", "Dudes")
            .subscribe(() => {
                expect(true).toBe(false);
                done();
            },
            (error: any) => {
                expect(error.code).toEqual(CoSServerConstants.DATABASE_NO_DOCUMENTS_FOUND.code);
                done();
            });
    });

    it("should create a new user after confirmation and delete old temp user data", (done) => {
        tempUserModel.saveDocument({
            email: "spork@spork.com",
            password: "spork",
            registrationKey: "spork",
            salt: "NoThanks",
            username: "Spork",
        }).flatMap(() => {
            return tempUserModel.registerUser("Spork", "spork");
        }).subscribe(() => {
            tempUserModel.getDocument({ email: "spork@spork.com" })
                .subscribe(() => {
                    expect(true).toBe(false, "Temporary user data was not removed after registration.");
                    done();
                },
                () => {
                    const userModel: any = new UserModel();
                    userModel.removeDocuments({ email: "spork@spork.com" }).subscribe(
                        () => {
                            done();
                        },
                        () => {
                            expect(true).toBe(false, "Error removing new user data during tear down.");
                            done();
                        });
                });
        },
            (error: any) => {
                expect(true).toBe(false, "Error occured registering a user.");
                done();
            });
    });

    it("should know when a username is already taken in temp users", (done) => {
        tempUserModel.saveDocument({
            email: "test@test.com",
            password: "password",
            registrationKey: "deadbeef",
            salt: "deadbeef",
            username: "testing",
        })
            .flatMap(() => {
                return tempUserModel.emailAndUsernameAreUnique("testing", "unique@unique.com");
            })
            .subscribe(
            () => {
                tempUserModel.removeDocuments({ email: "test@test.com" })
                    .subscribe(null, null, () => {
                        expect(true).toBe(false, "Was unable to recognize when a username was taken");
                        done();
                    });
            },
            (error: any) => {
                expect(error.code).toEqual(CoSServerConstants.DATABASE_USER_IDENTIFIER_TAKEN_ERROR.code);
                tempUserModel.removeDocuments({ email: "test@test.com" }).subscribe(null, null, done);
            });
    });

    it("should know when an email is already taken in temp users", (done) => {
        tempUserModel.saveDocument({
            email: "test@test.com",
            password: "password",
            registrationKey: "deadbeef",
            salt: "deadbeef",
            username: "testing",
        })
            .flatMap(() => {
                return tempUserModel.emailAndUsernameAreUnique("uniqueAlias", "test@test.com");
            })
            .subscribe(
            () => {
                tempUserModel.getModel().remove({ email: "test@test.com" })
                    .then(() => {
                        expect(true).toBe(false);
                        done();
                    });
            },
            (error: any) => {
                expect(error.code).toEqual(CoSServerConstants.DATABASE_USER_IDENTIFIER_TAKEN_ERROR.code);
                tempUserModel.getModel().remove({ email: "test@test.com" })
                    .then(() => {
                        done();
                    });
            });
    });

    it("should know when a username is already taken in users", (done) => {
        const userModel = new UserModel();
        tempUserModel.commitUserData(
            "test@test.com",
            "password",
            "deadbeef",
            "testing")
            .flatMap(() => {
                return tempUserModel.emailAndUsernameAreUnique("testing", "unique@unique.com");
            })
            .subscribe(
            () => {
                userModel.getModel().remove({ email: "test@test.com" }, () => {
                    expect(true).toBe(false);
                    done();
                });
            },
            (error: any) => {
                expect(error.code).toEqual(CoSServerConstants.DATABASE_USER_IDENTIFIER_TAKEN_ERROR.code);
                userModel.getModel().remove({ email: "test@test.com" }, () => {
                    done();
                });
            });
    });

    it("should know when an email is already taken in users", (done) => {
        const userModel = new UserModel();
        tempUserModel.commitUserData(
            "test@test.com",
            "password",
            "deadbeef",
            "testing")
            .flatMap(() => {
                return tempUserModel.emailAndUsernameAreUnique("uniqueAlias", "test@test.com");
            })
            .subscribe(
            () => {
                userModel.getModel().remove({ email: "test@test.com" }, () => {
                    expect(true).toBe(false);
                    done();
                });
            },
            (error: any) => {
                expect(error.code).toEqual(CoSServerConstants.DATABASE_USER_IDENTIFIER_TAKEN_ERROR.code);
                userModel.getModel().remove({ email: "test@test.com" }, () => {
                    done();
                });
            });
    });

});

describe("UserModel", () => {
    const tempUserModel: any = new TempUserModel();
    const userModel: any = new UserModel();
    const graffitiModel: any = new GraffitiModel();

    beforeAll((done) => {
        userModel.saveDocument({
            email: "test@test.com",
            lastLogin: new Date(),
            password: "password",
            salt: "deadbeef",
            username: "testing",
        }).subscribe(() => {
            graffitiModel.saveDocument({
                latitude: 1,
                longitude: 2,
                url: "rabnar",
            }).subscribe(done);
        });
    });

    afterAll((done) => {
        userModel.removeDocuments({
            email: "test@test.com",
        }).subscribe(() => {
            graffitiModel.removeDocuments({
                latitude: 1,
                longitude: 2,
                url: "rabnar",
            }).subscribe(done);
        });
    });

    it("should throw an error when fetching a salt for a non-existant user", (done) => {
        userModel.getUserSalt("fakedude")
            .subscribe(() => {
                expect(true).toBe(false);
                done();
            },
            (error: any) => {
                expect(error.code).toBe(CoSServerConstants.DATABASE_NO_DOCUMENTS_FOUND.code);
                done();
            });
    });

    it("should be able to get the salt of a registered user", (done) => {

        userModel.getUserSalt("test@test.com")
            .subscribe((salt: string) => {
                expect(salt).toBe("deadbeef");
                done();
            },
            (error: any) => {
                expect(error).toBeFalsy();
            });
    });

    it("should throw an error when checking for a user that doesn't exist", (done) => {
        userModel.checkUserExists("test@tink.com")
            .subscribe(() => {
                expect(true).toBe(false);
                done();
            },
            (error: any) => {
                expect(error.code).toEqual(CoSServerConstants.DATABASE_NO_DOCUMENTS_FOUND.code);
                done();
            });
    });

    it("should be able to check an existing user exists", (done) => {
        userModel.checkUserExists("test@test.com")
            .subscribe(() => {
                done();
            },
            (error: any) => {
                expect(error).toBeFalsy();
            });
    });

    it("should catch errors from password hashing", (done) => {
        const passwordSpy = spyOn(PasswordHelper, "hashPassword");
        passwordSpy.and.throwError(CoSServerConstants.PBKDF2_HASH_ERROR.message);

        userModel.confirmPasswordsMatch("test@test.com", "password")
            .subscribe(() => {
                expect(true).toBe(false, "Failed password hashing didn't trigger error");
                done();
            },
            (error: any) => {
                expect(error.message).toEqual(CoSServerConstants.PBKDF2_HASH_ERROR.message);
                expect(passwordSpy).toHaveBeenCalledTimes(1);
                done();
            });

    });

    it("should detect when passwords don't match", (done) => {
        const passwordSpy = spyOn(PasswordHelper, "hashPassword");
        passwordSpy.and.returnValue("passwor");

        userModel.confirmPasswordsMatch("test@test.com", "passwor")
            .subscribe(() => {
                expect(true).toBe(false, "Did not detect mismatched passwords");
                done();
            },
            (error: any) => {
                expect(passwordSpy).toHaveBeenCalledTimes(1);
                expect(error.message).toEqual(CoSServerConstants.DATABASE_USER_INVALID_PASSWORD_ERROR.message);
                done();
            });
    });

    it("should detect when passwords match", (done) => {
        const passwordSpy = spyOn(PasswordHelper, "hashPassword");
        passwordSpy.and.returnValue(Observable.create((observer: any) => {
            observer.next("password");
        }));

        userModel.confirmPasswordsMatch("test@test.com", "password")
            .subscribe(() => {
                done();
            },
            (error: any) => {
                expect(error).toBeFalsy();
                done();
            });

    });

    it("should know when user credentials are invalid", (done) => {
        const confirmPasswordsMatchSpy = spyOn(userModel, "confirmPasswordsMatch");
        confirmPasswordsMatchSpy.and.throwError(CoSServerConstants.DATABASE_USER_INVALID_PASSWORD_ERROR.message);

        userModel.authenticate("test@test.com", "passwor")
            .subscribe(() => {
                expect(true).toBe(false, "Faied to detect invalid credentials");
                done();
            },
            (error: any) => {
                expect(error.message).toEqual(CoSServerConstants.DATABASE_USER_INVALID_PASSWORD_ERROR.message);
                done();
            });
    });

    it("should know when user credentials are valid", (done) => {
        const passwordSpy = spyOn(PasswordHelper, "hashPassword");
        const confirmPasswordsMatchSpy = spyOn(userModel, "confirmPasswordsMatch");
        confirmPasswordsMatchSpy.and.returnValue("password");

        userModel.authenticate("test@test.com", "password")
            .subscribe(() => {
                done();
            },
            (error: any) => {
                expect(error).toBeFalsy();
                done();
            });

    });

    it("should be able to add a new rating to a graffiti", (done) => {
        userModel.rateGraffiti("test@test.com", "rabnar", true)
            .flatMap(() => {
                return userModel.getDocument({ username: "testing" });
            })
            .subscribe((result: any) => {
                const rating = result.ratings.shift();
                expect(rating.graffitiUrl).toEqual("rabnar", "Stored graffiti url was incorrect");
                expect(rating.rating).toBe(true, "Stored graffiti rating was incorrect");
                done();

            },
            (error: any) => {
                expect(error).toBeFalsy();
                done();
            });
    });

    it("should be able to add a change its rating of a graffiti", (done) => {
        userModel.rateGraffiti("test@test.com", "rabnar", false)
            .flatMap(() => {
                return userModel.getDocument({ username: "testing" });
            })
            .subscribe((result: any) => {
                const rating = result.ratings.shift();
                expect(rating.graffitiUrl).toEqual("rabnar", "Stored graffiti url was incorrect");
                expect(rating.rating).toBe(false, "Stored graffiti rating was incorrect");
                done();

            },
            (error: any) => {
                expect(error).toBeFalsy();
                done();
            });

    });

    it("should not be able to rate a graffiti the same way twice", (done) => {
        userModel.rateGraffiti("test@test.com", "rabnar", false)
            .flatMap(() => {
                return userModel.getDocument({ username: "testing" });
            })
            .subscribe((result: any) => {
                expect(true).toBe(false, "Allowed a graffiti to have the same rating entered twice.");
                done();

            },
            (error: any) => {
                expect(error.code).toEqual(CoSServerConstants.USER_DOUBLE_RATE_ERROR.code);
                done();
            });
    });

    it("should not rate a graffiti that doesn't exist", (done) => {
        userModel.rateGraffiti("test@test.com", "flintstones", false)
            .flatMap(() => {
                return userModel.getDocument({ username: "testing" });
            })
            .subscribe((result: any) => {
                expect(true).toBe(false, "Allowed a graffiti to have the same rating entered twice.");
                done();

            },
            (error: any) => {
                expect(error.code).toEqual(CoSServerConstants.DATABASE_NO_DOCUMENTS_FOUND.code);
                done();
            });
    });

    it("should not add a non-existant graffiti to the favourites array", (done) => {
        userModel.addFavourite("test@test.com", "flintstones", false)
            .flatMap(() => {
                return userModel.getDocument({ username: "testing" });
            })
            .subscribe((result: any) => {
                expect(true).toBe(false, "Allowed a graffiti to have the same rating entered twice.");
                done();

            },
            (error: any) => {
                expect(error.code).toEqual(CoSServerConstants.DATABASE_NO_DOCUMENTS_FOUND.code);
                done();
            });
    });

    it("should be able to add a graffiti to the favourites array", (done) => {
        userModel.addFavourite("test@test.com", "rabnar")
            .flatMap(() => {
                return userModel.getDocument({ username: "testing" });
            })
            .subscribe((result: any) => {
                expect(result.favourites.reduce((acc: boolean, curr: any) => {
                    const favouriteExists = acc ?
                        acc :
                        curr.graffitiUrl === "rabnar";

                    return favouriteExists;
                }, false)).toBe(true);

                done();
            },
            (error: any) => {
                expect(true).toBe(false, "Graffiti was not added to favourites array");
                done();
            });
    });

    it("should be able to remove a graffiti from the favourites array", (done) => {
        userModel.removeFavourite("test@test.com", "rabnar", false)
            .flatMap(() => {
                return userModel.getDocument({ username: "testing" });
            })
            .subscribe((result: any) => {
                expect(result.favourites.reduce((acc: boolean, curr: any) => {
                    const favouriteExists = acc ?
                        acc :
                        curr.graffitiUrl === "rabnar";
                }, false)).toBe(false, "Graffiti was not removed from favourites array");
                done();
            },
            (error: any) => {
                expect(true).toBe(false, "Graffiti was not removed from favourites array");
                done();
            });
    });

});
