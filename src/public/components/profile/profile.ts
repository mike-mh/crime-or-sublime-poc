import { Component, createElement as e, DOMElement, SFC } from "react";
import { render, findDOMNode, unmountComponentAtNode } from "react-dom";
import { elements, setElemChildrenCurry } from "../../libs/elements/elements";
import { UserProfileAPI } from "../../../../configurations/user/user-profile/user-profile-api";
import styles from "./profile.styles";

const userProfileAPI: UserProfileAPI = new UserProfileAPI();

const button = elements.button;
const div = elements.div;
const img = elements.img;
const h1 = elements.h1;
const p = elements.p;
const style = elements.style;

const BREAK = e("br");

class Profile extends Component<{}, {}> {

    private readonly COS_PROFILE_DIV = setElemChildrenCurry(div, { id: "cos-profile" });
    private readonly COS_PROFILE_FARVOURITES_CONTAINTER_DIV = div({
        id: "cos-profile-favourites-container-div",
        style: styles["#cos-profile-favourites-container-div"]
    });
    private readonly COS_PROFILE_BANNER_H1_LEAF = h1(null, "Your Favourites:");

    private favouriteGraffitiImages: Array<DOMElement<any, Element>> = [];

    /**
     * Need to use this to render the first graffiti image and configure the state.
     */
    public componentDidMount(): void {
        this.getFavourites();
    }

    public render() {
        return this.COS_PROFILE_DIV([
            this.COS_PROFILE_BANNER_H1_LEAF,
            this.COS_PROFILE_FARVOURITES_CONTAINTER_DIV,
        ]);
    }

    /**
     * Use this to create a favourite graffiti div. This function is necessary
     * to render the element as a component so that it can be removed with the
     * unmountComponentAtNode funcion.
     * 
     * @param url - The URL of the image to render.
     * 
     * @returns - A simple stateless functional component converted into a
     *      DOMElement
     */
    private generateFavouriteDiv = (url: string): DOMElement<any, Element> => {
        // Can't return a simple stateless functional component. Need to
        // convert it into an element before it can be inserted into the
        // virtual DOM.
        return div({ id: `cos-profile-fav-image-container-${url}` }, [
            e(({ }) => {
                return div({
                    className: "user-favourites-container",
                    style: styles[".user-favourites-container"]
                }, [
                        e("img", {
                            className: "farvouties-image",
                            src: `https://i.imgur.com/${url}s.jpg`,
                            style: styles[".farvouties-image"],
                        }),
                        button({
                            className: "btn btn-info remove-button",
                            onClick: () => {
                                this.removeFavourite.bind(this)(url);
                            },
                            style: styles[".remove-button"],
                        }, "X"),
                    ]);
            })
        ]);
    }

    /**
     * Use this to remove a favourite graffiti from a user's profile.
     * 
     * @param url - The URL of the image to render.
     */
    private removeFavourite = (url: string): void => {
        $.ajax({
            contentType: "application/json",
            data: JSON.stringify({
                id: url,
            }),
            dataType: "json",
            error: (xhr: any, status: any, err: any) => {
                // Should add error handling in the future.
                return;
            },
            method: "POST",
            success: (data: any) => {
                // Should handle errors
                if (data.result) {
                    // Remove the old graffiti from the list.
                    this.favouriteGraffitiImages = this.favouriteGraffitiImages.filter(
                        (graffiti: any) => {
                            return graffiti.graffitiUrl !== url;
                    });

                    const favourites: Array<DOMElement<any, Element>> = this.favouriteGraffitiImages.reduce(
                        (acc: Array<DOMElement<any, Element>>, cur: any) => {
                            return acc.concat([this.generateFavouriteDiv(cur.graffitiUrl)]);
                        }, []);
                    unmountComponentAtNode(document.getElementById("cos-profile-favourites-container-div"));
                    render(div(null, favourites), document.getElementById("cos-profile-favourites-container-div"));

                }
            },
            url: userProfileAPI.USER_PROFILE_REMOVE_FAVOURITE,
        });
    }

    /**
     * Use this function to retrieve favrourite graffiti from server.
     */
    private getFavourites(): void {
        $.ajax({
            contentType: "application/json",
            dataType: "json",
            error: (xhr: any, status: any, err: any) => {
                // Should add error handling in the future.
                return;
            },
            success: (data: any) => {
                this.favouriteGraffitiImages = data.result;
                const favourites: Array<DOMElement<any, Element>> = data.result.reduce(
                    (acc: Array<DOMElement<any, Element>>, cur: any) => {
                        return acc.concat([this.generateFavouriteDiv(cur.graffitiUrl)]);
                    }, []);
                render(div(null, favourites), document.getElementById("cos-profile-favourites-container-div"));
            },
            url: userProfileAPI.USER_PROFILE_GET_FAVOURITES,
        });
    }

}

export default Profile;
