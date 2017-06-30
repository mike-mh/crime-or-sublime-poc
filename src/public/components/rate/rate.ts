import { Component, createElement as e, DOMElement, SFC } from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { elements, setElemChildrenCurry } from "../../libs/elements/elements";
import { GraffitiGetAPI } from "../../../../configurations/graffiti/graffiti-get/graffiti-get-api";
import { UserProfileAPI } from "../../../../configurations/user/user-profile/user-profile-api";
import { UserRateAPI } from "../../../../configurations/user/user-rate/user-rate-api";
import styles from "./rate.styles";

const graffitiGetAPI: GraffitiGetAPI = new GraffitiGetAPI();
const userProfileAPI: UserProfileAPI = new UserProfileAPI();
const userRateAPI: UserRateAPI = new UserRateAPI();

const button = elements.button;
const div = elements.div;
const img = elements.img;
const h1 = elements.h1;
const p = elements.p;
const style = elements.style;

const BREAK = e("br");

interface IRateState {
    // Use this to store the former window width for resize events.
    formerWindowWidth: number;
    shownGraffitiUrl: string;
}

class Rate extends Component<{}, IRateState> {

    private readonly COS_RATE_MEDIA_STYLE_LEAF = style({ scoped: true }, `
    #cos-rate-image-and-rating-buttons {
        width: 640px;
    }

    #cos-rate-image-container {
        margin: auto;
        width: 640px;
        min-height: 320px;
    }

    @media (max-width: 660px) {
        #cos-rate-image-and-rating-buttons {
            width: 360px;
        }
    }

    @media (max-width: 660px) {
        #cos-rate-image-container {
            margin: auto;
            width: 320px;
            min-height: 180px;
        }
    }`);

    private readonly COS_RATE_DIV = setElemChildrenCurry(div, { id: "cos-rate" });

    private readonly COS_RATE_IMAGE_AND_RATING_BUTTONS_DIV = setElemChildrenCurry(div, {
        id: "cos-rate-image-and-rating-buttons",
        style: styles["#cos-rate-image-and-rating-buttons"]
    });

    private readonly COS_RATE_IMAGE_CONTAINER_DIV = div({
        id: "cos-rate-image-container",
        style: styles["#cos-rate-image-container"],
    }, null);

    private readonly COS_RATE_RATING_BUTTONS_CONTAINER_DIV = setElemChildrenCurry(div, {
        id: "cos-rate-rating-buttons-container",
        style: styles["#cos-rate-rating-buttons-container"]
    });

    private readonly COS_RATE_CRIME_BUTTON_LEAF = button({
        id: "cos-rate-rating-crime-button",
        className: "btn btn-danger",
        onClick: () => {
            this.rateGraffiti(false);
        },
        style: styles["#cos-rate-rating-crime-button"],
    }, "CRIME");

    private readonly COS_RATE_SUBLIME_BUTTON_LEAF = button({
        id: "cos-rate-rating-sublime-button",
        className: "btn btn-primary",
        onClick: () => {
            this.rateGraffiti(true);
        },
        style: styles["#cos-rate-rating-sublime-button"],
    }, "SUBLIME");

    private readonly COS_RATE_RANDOM_AND_FAVOURITE_BUTTON_CONTAINER_DIV = setElemChildrenCurry(div,
        { id: "cos-rate-random-and-favourite-button-container" });

    private readonly COS_RATE_GET_RANDOM_BUTTON_LEAF = button({
        id: "cos-rate-random-button",
        className: "btn",
        onClick: this.getRandomGraffiti.bind(this),
        style: styles["#cos-rate-random-button"],
    }, "Random");

    private readonly COS_RATE_FAVOURITE_BUTTON_LEAF = button({
        id: "cos-rate-rating-favourite-butotn",
        className: "btn",
        onClick: this.addFavourite.bind(this),
        style: styles["#cos-rate-favourite-button"],
    }, "Add to Favourites");

    /**
     * Need to use this to render the first graffiti image and configure the state.
     */
    public componentDidMount(): void {
        this.getRandomGraffiti();

        this.setState({ formerWindowWidth: window.outerWidth });
        window.addEventListener("resize", () => {
            this.resizeImage(this.state.shownGraffitiUrl);
        })
    }

    public render() {
        return this.COS_RATE_DIV([
            this.COS_RATE_IMAGE_AND_RATING_BUTTONS_DIV([
                this.COS_RATE_MEDIA_STYLE_LEAF,
                this.COS_RATE_IMAGE_CONTAINER_DIV,
                BREAK,
                this.COS_RATE_RATING_BUTTONS_CONTAINER_DIV([
                    this.COS_RATE_CRIME_BUTTON_LEAF,
                    this.COS_RATE_SUBLIME_BUTTON_LEAF,
                ]),
                p({ style: { "padding-top": "50px" } }, "These are for testing and we will change them soon."),
                this.COS_RATE_RANDOM_AND_FAVOURITE_BUTTON_CONTAINER_DIV([
                    this.COS_RATE_GET_RANDOM_BUTTON_LEAF,
                    this.COS_RATE_FAVOURITE_BUTTON_LEAF,
                ]),
            ]),
        ]);
    }

    /**
     * Use this function to resize the image when resize events occur. Sets the
     * state to have the current window width set as the old window width in
     * case another change occurs.
     *
     * @param graffitiUrl - The url of the graffiti image being resized.
     * @param oldWindowWidth - The width of the window before resizing.
     */
    private resizeImage(graffitiUrl: string): void {
        const formerWindowWidth = this.state.formerWindowWidth;

        this.setState({
            formerWindowWidth: window.outerWidth,
        });

        // If the former window width resizes in such a way that no changes are
        // needed, end the function.
        if (formerWindowWidth < 640 && window.outerWidth < 640 ||
            formerWindowWidth >= 640 && window.outerWidth >= 640 ||
            !graffitiUrl) {
            return;
        }


        this.renderImage(graffitiUrl);
    }

    /**
     * Use this to add a photo to a user's favourites collection.
     */
    private addFavourite(rating: boolean): void {
        $.ajax({
            contentType: "application/json",
            data: JSON.stringify({
                id: this.state.shownGraffitiUrl,
            }),
            dataType: "json",
            error: (xhr: any, status: any, err: any) => {
                // Should add error handling in the future.
                return;
            },
            method: "POST",
            success: (data: any) => {
                // Consider changing the DOM here.
                return;
            },
            url: userProfileAPI.USER_PROFILE_ADD_FAVOURITE,
        });
    }

    /**
     * Submits a rating to the server.
     * 
     * @param rating - The rating assigned to a graffiti
     */
    private rateGraffiti(rating: boolean): void {
        $.ajax({
            contentType: "application/json",
            data: JSON.stringify({
                id: this.state.shownGraffitiUrl,
                rating,
            }),
            dataType: "json",
            error: (xhr: any, status: any, err: any) => {
                // Should add error handling in the future.
                return;
            },
            method: "POST",
            success: (data: any) => {
                // Now render the image
                this.getRandomGraffiti();
            },
            url: userRateAPI.USER_RATE,
        });
    }

    /**
     * Use this to render an image with the given URL. Be sure that it is only
     * called after the DOM has been rendered.
     * 
     * @param url - The URL of the image to render.
     */
    private renderImage = (url: string): void => {
        const newImageUrl = (window.outerWidth > 640) ?
            `https://i.imgur.com/${url}l.jpg` :
            `https://i.imgur.com/${url}m.jpg`;

        // Remvoe old image and render the new image.
        unmountComponentAtNode(document.getElementById("cos-rate-image-container"));
        render(e("img", {
            src: newImageUrl,
            style: { margin: "auto" },
        }), document.getElementById("cos-rate-image-container"));
    }

    /**
     * Use this function to create an image for a random graffiti item retrieved
     * from the server.
     */
    private getRandomGraffiti(): void {
        $.ajax({
            contentType: "application/json",
            dataType: "json",
            error: (xhr: any, status: any, err: any) => {
                // Should add error handling in the future.
                return;
            },
            success: (data: any) => {
                // Now render the image
                this.setState({
                    shownGraffitiUrl: data.url,
                });

                this.renderImage(data.url);
            },
            url: graffitiGetAPI.GRAFFITI_GET_RANDOM,
        });
    }

}

export default Rate;
