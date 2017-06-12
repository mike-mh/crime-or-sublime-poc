import { Router } from "express";
import { request } from "https";
import { UserProfileAPI } from "../../../../configurations/user/user-profile/user-profile-api";
import { CoSServer } from "../../../cos-server";
import { CoSServerConstants } from "../../../cos-server-constants";
import { PasswordHelper } from "../../../libs/authentication/password-helper";
import { ReCaptchaHelper } from "../../../libs/authentication/recaptcha-helper";
import { GraffitiModel } from "../../../models/graffiti/graffiti-model";
import { UserModel } from "../../../models/user/user-model";
import { UserProfileRouter } from "./user-profile-router";

describe("UserProfileRouter", () => {
    // Keep this. It may be needed later.
    // let reCaptchaSpy: jasmine.Spy;

    const userProfileRouter: any = new UserProfileRouter(Router());
    const userProfileAPI: UserProfileAPI = new UserProfileAPI();
    const responses = userProfileAPI.responses;

    const userModel: UserModel = new UserModel();
    const graffitiModel: GraffitiModel = new GraffitiModel();

    const graffitiUrls = [
        "funcakes",
        "madcakes",
        "buncakes",
    ];

    // Use spoofed res and req objects to make calls to the backend instead of
    // launching HTTP calls at the server itself. It's a cool idea for later
    // and it should be done when the time is right.
    const req: any = {
        body: {},
        method: "get",
        params: {},
        session: {
            destroy: () => { return; },
        },
    };

    const res: any = {
        json: () => { return; },
    };

    beforeAll((done) => {
        userModel.getModel().create({
            email: "beh@beh.com",
            favourites: [{ graffitiUrl: "funcakes" }, { graffitiUrl: "madcakes" }],
            password: "deadbeef",
            salt: "deadbeef",
            username: "beh",
        })
            .then(() => {
                return graffitiModel.getModel().create({
                    latitude: 1,
                    longitude: 1,
                    url: "funcakes",
                });

            })
            .then(() => {
                return graffitiModel.getModel().create({
                    latitude: 1,
                    longitude: 1,
                    url: "madcakes",
                });
            })
            .then(() => {
                return graffitiModel.getModel().create({
                    latitude: 1,
                    longitude: 1,
                    url: "buncakes",
                });
            })
            .then(done)
            .catch((error: Error) => {
                process.stderr.write(error.message);
                done();
            });
    });

    afterAll((done) => {

        userModel.getModel().remove({
            email: "beh@beh.com",
        })
            .then(() => {
                return graffitiModel.getModel().remove({url: { $in: graffitiUrls }});
            })
            .then(done)
            .catch((error) => {
                process.stderr.write(error.message);
                done();
            });

    });

    it("should have a handler installed for the user-profile-add-favourite path", () => {
        expect(userProfileRouter.getRouter().stack.reduce((acc: boolean, layer: any) => {
            // If a match is already found, acc will be set to true.
            const match = acc ?
                acc : layer.route.path === userProfileAPI.USER_PROFILE_ADD_FAVOURITE;

            return match;

        }, false)).toBe(true);
    });

    it("should have a handler installed for the user-profile-get-favourites path", () => {
        expect(userProfileRouter.getRouter().stack.reduce((acc: boolean, layer: any) => {
            // If a match is already found, acc will be set to true.
            const match = acc ?
                acc : layer.route.path === userProfileAPI.USER_PROFILE_GET_FAVOURITES;

            return match;

        }, false)).toBe(true);
    });

    it("should have a handler installed for the user-profile-remove-favourite path", () => {
        expect(userProfileRouter.getRouter().stack.reduce((acc: boolean, layer: any) => {
            // If a match is already found, acc will be set to true.
            const match = acc ?
                acc : layer.route.path === userProfileAPI.USER_PROFILE_REMOVE_FAVOURITE;

            return match;

        }, false)).toBe(true);
    });

    it("should reject calls made to user-profile-get-favourites with imporper parameters", (done) => {
        req.method = "get";
        req.session.email = "beh@beh.com";

        req.body = {
            id: "funnybunny",
        };

        res.json = (response: any) => {
            expect(response.error.name).toEqual(responses.InvalidParametersError.error.name);
            // Reset response function
            res.json = () => { return; };
            done();
        };

        userProfileRouter.userProfileGetFavourites(req, res);
    });

    it("should reject calls made to user-profile-get-favourites without a session", (done) => {
        req.method = "get";
        req.session.email = undefined;

        req.body = {};

        res.json = (response: any) => {
            expect(response.error.name).toEqual(responses.NoActiveSessionError.error.name);
            // Reset response function
            res.json = () => { return; };
            done();
        };

        userProfileRouter.userProfileGetFavourites(req, res);
    });

    it("should be able to get all favourites associated with a user", (done) => {
        req.method = "get";
        req.session.email = "beh@beh.com";

        req.body = {};

        res.json = (response: any) => {
            const favouriteDocs = response.result.filter((item: any) => {
                return (item.graffitiUrl === "funcakes" ||
                    item.graffitiUrl === "madcakes");
            });

            const favourites = favouriteDocs.map((document: any) => {
                return document.graffitiUrl;
            });

            expect(favourites.length).toEqual(2, "Favourites returned an incorrect number of graffiti");
            expect(favourites).toContain("funcakes", "A favourite graffiti is missing");
            expect(favourites).toContain("madcakes", "A favourite graffiti is missing");

            // Reset response function
            res.json = () => { return; };
            done();
        };

        userProfileRouter.userProfileGetFavourites(req, res);
    });

    it("should reject calls made to user-profile-remove-favourite with imporper parameters", (done) => {
        req.method = "post";

        req.body = {};
        req.session.email = "beh@beh.com";

        res.json = (response: any) => {
            expect(response.error.name).toEqual(responses.InvalidParametersError.error.name);
            // Reset response function
            res.json = () => { return; };
            done();
        };

        userProfileRouter.userProfileRemoveFavourite(req, res);
    });

    it("should reject calls made to user-profile-remove-favourite without an active session", (done) => {
        req.method = "post";

        req.body = {
            id: "buncakes",
        };
        req.session.email = undefined;

        res.json = (response: any) => {
            expect(response.error.name).toEqual(responses.NoActiveSessionError.error.name);
            // Reset response function
            res.json = () => { return; };
            done();
        };

        userProfileRouter.userProfileRemoveFavourite(req, res);
    });

    it("should not remove items from favourites when the item is not favourited in the params", (done) => {
        req.method = "post";
        req.session.email = "beh@beh.com";

        req.body = {
            id: "sadcakes",
        };

        res.json = (response: any) => {
            userModel.getFavourites(req.session.email).subscribe(
                (result: any) => {
                    const favouriteDocs = result.filter((item: any) => {
                        return (item.graffitiUrl === "funcakes" ||
                            item.graffitiUrl === "madcakes");
                    });

                    const favourites = favouriteDocs.map((document: any) => {
                        return document.graffitiUrl;
                    });

                    expect(favourites.length).toEqual(2, "Favourites returned an incorrect number of graffiti");
                    expect(favourites).toContain("funcakes", "A favourite graffiti is missing");
                    expect(favourites).toContain("madcakes", "A favourite graffiti is missing");

                    // Reset response function
                    res.json = () => { return; };
                    done();

                },
                (error: any) => {
                    // Reset response function
                    res.json = () => { return; };
                    expect(true).toBe(false, "Unexpected error occured checking favourites");
                    done();
                });
        };

        userProfileRouter.userProfileRemoveFavourite(req, res);
    });

    it("should be able to remove a farvourite item using user-profile-remove-favourite", (done) => {
        req.method = "post";
        req.session.email = "beh@beh.com";

        req.body = {
            id: "madcakes",
        };

        res.json = (response: any) => {
            userModel.getFavourites(req.session.email).subscribe(
                (result: any) => {
                    expect(result.reduce((acc: boolean, curr: any) => {
                        const containsDeletedItem = acc ?
                            acc :
                            curr.graffitiUrl === "madcakes";

                        return containsDeletedItem;
                    }, false)).toBe(false);

                    // Reset response function
                    res.json = () => { return; };
                    done();

                },
                (error: any) => {
                    // Reset response function
                    res.json = () => { return; };
                    expect(true).toBe(false, "Unexpected error occured checking favourites");
                    done();
                });
        };

        userProfileRouter.userProfileRemoveFavourite(req, res);
    });

    it("should reject calls made to user-profile-add-favourite with imporper parameters", (done) => {
        req.method = "post";

        req.body = {};
        req.session.email = "beh@beh.com";

        res.json = (response: any) => {
            expect(response.error.name).toEqual(responses.InvalidParametersError.error.name);
            // Reset response function
            res.json = () => { return; };
            done();
        };

        userProfileRouter.userProfileAddFavourite(req, res);
    });

    it("should reject calls made to user-profile-add-favourite without an active session", (done) => {
        req.method = "post";

        req.body = {
            id: "buncakes",
        };
        req.session.email = undefined;

        res.json = (response: any) => {
            expect(response.error.name).toEqual(responses.NoActiveSessionError.error.name);
            // Reset response function
            res.json = () => { return; };
            done();
        };

        userProfileRouter.userProfileAddFavourite(req, res);
    });

    it("should reject calls made to user-profile-add-favourite when the graffiti is favourited", (done) => {
        req.method = "post";

        req.body = {
            id: "funcakes",
        };

        req.session.email = "beh@beh.com";

        res.json = (response: any) => {
            expect(response.error.name).toEqual(responses.AlreadyFavouritedGraffitiError.error.name);
            // Reset response function
            res.json = () => { return; };

            done();
        };

        userProfileRouter.userProfileAddFavourite(req, res);
    });

    it("should be able to add new graffiti urls to favourite list.", (done) => {
        req.method = "post";

        req.body = {
            id: "buncakes",
        };

        req.session.email = "beh@beh.com";

        res.json = (response: any) => {
            expect(response.result).toBeTruthy();
            // Reset response function
            res.json = () => { return; };

            done();
        };

        userProfileRouter.userProfileAddFavourite(req, res);
    });

});
