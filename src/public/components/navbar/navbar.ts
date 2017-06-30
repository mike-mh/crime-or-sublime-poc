import "googlemaps";
import { Component, ComponentElement, createElement as e, DOMElement, ReactElement, SFC, SFCElement } from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { connect, Provider } from "react-redux";
import { SessionAPI } from "../../../../configurations/session/session-api";
import { elements, setElemChildrenCurry } from "../../libs/elements/elements";
import { endSession } from "../../reducers/session-management/session.actions";
import { store } from "../../reducers/session-management/session.store";
import Home from "../home/home";
import Locator from "../locator/locator";
import Login from "../login/login";
import Profile from "../profile/profile";
import Rate from "../rate/rate";
import Register from "../register/register";
import styles from "./navbar.styles";

const a = elements.a;
const button = elements.button;
const div = elements.div;
const li = elements.li;
const nav = elements.nav;
const span = elements.span;
const ul = elements.ul;

const sessionAPI: SessionAPI = new SessionAPI();

interface INavbarProps {
    sessionActive: boolean;
    pathname: string;
}

interface INavbarLinkData {
    alwaysShow: boolean;
    linkId: string;
    pathname: string;
    requiresSession: boolean;
    // Some links don't have a view.
    view?: ComponentElement<any, any> | SFCElement<any>;
    viewLink: DOMElement<any, Element> | ComponentElement<any, any>;
}

const NAVBAR_BOOTSTRAP_CLASSES = "navbar navbar-inverse bg-primary navbar-toggleable-md navbar-light bg-faded";
const NAVBAR_ATTRIBUTES = {
    className: NAVBAR_BOOTSTRAP_CLASSES,
    id: "cos-navbar",
};
const NAVBAR = setElemChildrenCurry(nav, NAVBAR_ATTRIBUTES);

const NAVBAR_COLLAPSE_BUTTON_ATTRIBUTES = {
    "aria-controls": "navbarSupportedContent",
    "aria-expanded": "false",
    "aria-label": "Toggle navigation",
    "className": "navbar-toggler navbar-toggler-right",
    "data-target": "#cos-navbar-links",
    "data-toggle": "collapse",
    "type": "button",
};

const NAVBAR_COLLAPSE_BUTTON_LEAF = button(NAVBAR_COLLAPSE_BUTTON_ATTRIBUTES,
    span({ className: "navbar-toggler-icon" }));

const NAVBAR_BRAND_BUTTON_LEAF = a({
    className: "navbar-brand active cos-brand",
    style: styles[".cos-brand"] }, "Crime or Sublime");

const NAVBAR_COLLAPSING_DIV = setElemChildrenCurry(div, {
    className: "collapse navbar-collapse",
    id: "cos-navbar-links",
});

const NAVBAR_LINKS_UL = setElemChildrenCurry(ul, { className: "navbar-nav mr-auto" });

const NAVBAR_LINK_LIST_ITEM = setElemChildrenCurry(li, { className: "nav-item active" });

// Need to connect the logout button so that it can send redux signals to
// have the Navbar re-rendered correctly.
const CONNECTED_LOGOUT_LINK = e(connect()(({ dispatch }) => {
    return NAVBAR_LINK_LIST_ITEM(
        a({
            className: "nav-link cos-link",
            id: "cos-logout",
            onClick: () => { endCurrentSession(); },
            style: styles[".cos-link"],
        }, "Logout"));
}));

/**
 * Wraps individual links in Navbar link tags. Also sets the pathname in the
 *
 * @param id - The CSS ID to pass to the link to be insrted into the list item.
 * @param displayName - The string to display on the link to the user.
 * @param pathname - The pathname associated with the link.
 *
 * @returns - Curry function to generate the appropriate element and append it
 *      to the virtual DOM.
 */
const createLinkElement = (id: string, displayName: string, pathname: string): DOMElement<any, Element> => {
        return NAVBAR_LINK_LIST_ITEM(
            a({
                className: "nav-link",
                id,
                onClick: () => { renderView(pathname); },
                style: styles[".cos-link"],
            }, displayName),
        );
    };

const LINKS: INavbarLinkData[] = [
    {
        alwaysShow: true,
        linkId: "cos-navbar-home",
        pathname: "/",
        requiresSession: false,
        view: e(Home, null, null),
        viewLink: createLinkElement("cos-navbar-home", "Home", "/"),
    },
    {
        alwaysShow: true,
        linkId: "cos-navbar-locator",
        pathname: "/cos-locator",
        requiresSession: false,
        view: e(Locator, null, null),
        viewLink: createLinkElement("cos-navbar-locator", "Locator", "/cos-locator"),
    },
    {
        alwaysShow: false,
        linkId: "cos-navbar-rate",
        pathname: "/cos-rate",
        requiresSession: true,
        view: e(Rate, null, null),
        viewLink: createLinkElement("cos-navbar-rate", "Rate", "/cos-rate"),
    },
    {
        alwaysShow: false,
        linkId: "cos-navbar-profile",
        pathname: "/cos-profile",
        requiresSession: true,
        view: e(Profile, null, null),
        viewLink: createLinkElement("cos-navbar-profile", "Profile", "/cos-profile"),
    },
    {
        alwaysShow: false,
        linkId: "cos-navbar-register",
        pathname: "/cos-register",
        requiresSession: false,
        view: e(Register, null, null),
        viewLink: createLinkElement("cos-navbar-register", "Register", "/cos-register"),
    },
    {
        alwaysShow: false,
        linkId: "cos-navbar-login",
        pathname: "/cos-login",
        requiresSession: false,
        view: e(Login, null, null),
        viewLink: createLinkElement("cos-navbar-login", "Login", "/cos-login"),
    },
    {
        alwaysShow: false,
        linkId: "cos-navbar-logout",
        pathname: "/cos-logout",
        requiresSession: true,
        viewLink: CONNECTED_LOGOUT_LINK,
    },
];

/**
 * Renders a view based on the link clicked by a user and configures the
 * address bar to contain the proper pathname.
 *
 * @param pathname - The pathname to place in address bar.
 */
const renderView = (pathname: string): void => {
    // Make sure the same view isn't pushed multiple times.
    if (pathname !== window.location.pathname) {
        window.history.pushState(pathname, "", pathname);
    }

    LINKS.map((link: INavbarLinkData) => {
        if (pathname === link.pathname) {
            unmountComponentAtNode(document.getElementById("cos-outlet"));
            render(link.view as ReactElement<any>,
                document.getElementById("cos-outlet"));
        }
    });
};

/**
 * Use this method to get the current session status from the server to
 * determine if the user is logged in or not. Will trigger the appropriate
 * action based on server response.
 */
const endCurrentSession = (): void => {
    $.ajax({
        contentType: "application/json",
        error: (xhr: any, status: any, err: any) => {
            return;
        },
        method: "GET",
        success: (data: any) => {
            if (data.result) {
                store.dispatch(endSession());
                return;
            }
        },
        url: sessionAPI.SESSION_END_USER_PATH,
    });
};

/**
 * Renders standard collapsing Navbar. Includes jQuery to collapse the Navbar
 * after a link is selected.
 *
 * @prop sessionActive - Holds boolean for whether or not a user session is
 *     currently active.
 *
 * @prop pathname - The pathname passed in when page was loaded.
 */
const Navbar: SFC<INavbarProps> = ({ sessionActive, pathname }) => {
    /**
     * Unfortunately Bootstrap doesn"t support recollapsing the navbar after an
     * option is selcted. This will trigger a click event on the Navbar button to
     * have the Navbar re-collapse after a link is selected.
     *
     * TO-DO: If anyone can figure out how to collapse the Navbar without jQuery,
     *        please do!
     *
     */
    jQuery(document).ready(($) => {
        $(".nav-link").on("click", () => {
            // Only trigger click event when navbar is collapsed
            if ($(window).width() < 992) {
                $(".navbar-toggler").click();
            }
        });
    });

    // Use this to handle user hitting the 'back' button. Only the URL of the
    // loaded view is stored in the state.
    window.onpopstate = (event) => {
        const viewUrlToRender = event.state ?
            event.state :
            "/";

        renderView(viewUrlToRender);
    };

    // Save pathname to the history state in case the user refreshes the page.
    if (pathname !== window.location.pathname && pathname) {
        window.history.pushState(pathname, "", pathname);
    }

    if (!window.location.pathname) {
        pathname = "/";
    }

    return NAVBAR([
        NAVBAR_COLLAPSE_BUTTON_LEAF,
        NAVBAR_BRAND_BUTTON_LEAF,
        NAVBAR_COLLAPSING_DIV([
            NAVBAR_LINKS_UL(
                LINKS.reduce(
                    (acc: Array<(DOMElement<any, Element> | ComponentElement<any, any>)>, val: INavbarLinkData) => {
                        // Render the proper view based on path provided.
                        if (pathname === val.pathname) {
                            if (val.requiresSession === sessionActive || val.alwaysShow) {
                                renderView(val.pathname);
                            }
                        }

                        // Add appropriate links to the navbar.
                        return val.requiresSession === sessionActive || val.alwaysShow ?
                            acc.concat(val.viewLink) :
                            acc;
                    }, [])),
        ]),
    ]);
};

export default Navbar;
