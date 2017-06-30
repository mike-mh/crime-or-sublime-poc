import "googlemaps";
import { Component, ComponentElement, createElement as e, DOMElement, SFC, SFCElement, ReactElement } from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { connect, Provider } from "react-redux";
import { SessionAPI } from "../../../../configurations/session/session-api";
import { elements, setElemChildrenCurry } from "../../libs/elements/elements";
import { endSession } from "../../reducers/session-management/session.actions";
import { store } from "../../reducers/session-management/session.store";
import Home from "../home/home"
import Locator from "../locator/locator";
import Login from "../login/login";
import Rate from "../rate/rate";
import Register from "../register/register";
import Test from "../test/test";

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
}

interface INavbarLinkData {
    alwaysShow: boolean;
    linkId: string;
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

const NAVBAR_BRAND_BUTTON_LEAF = a({ className: "navbar-brand", href: "#" }, "Crime or Sublime");

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
            className: "nav-link",
            href: "#",
            id: "cos-logout",
            onClick: () => { endCurrentSession(); },
        }, "Logout"));
}));

/**
 * Wraps individual links in Navbar link tags.
 *
 * @param id - The CSS ID to pass to the link to be insrted into the list item.
 * @param displayName - The string to display on the link to the user.
 *
 * @returns - Curry function to generate the appropriate element and append it
 *      to the virtual DOM.
 */
const createLinkElement: (id: string, displayName: string) => DOMElement<any, Element> =
    (id: string, displayName: string) => {
        return NAVBAR_LINK_LIST_ITEM(
            a({
                className: "nav-link",
                href: "#",
                id,
                onClick: () => { renderView(id); },
            }, displayName),
        );
    };

const LINKS: INavbarLinkData[] = [
    {
        alwaysShow: true,
        linkId: "cos-navbar-home",
        requiresSession: false,
        view: e(Home, null, null),
        viewLink: createLinkElement("cos-navbar-home", "Home"),
    },
    {
        alwaysShow: true,
        linkId: "cos-navbar-locator",
        requiresSession: false,
        view: e(Locator, null, null),
        viewLink: createLinkElement("cos-navbar-locator", "Locator"),
    },
    {
        alwaysShow: false,
        linkId: "cos-navbar-rate",
        requiresSession: true,
        view: e(Rate, null, null),
        viewLink: createLinkElement("cos-navbar-rate", "Rate"),
    },
    {
        alwaysShow: false,
        linkId: "cos-navbar-profile",
        requiresSession: true,
        view: e(Test, null, null),
        viewLink: createLinkElement("cos-navbar-profile", "Profile"),
    },
    {
        alwaysShow: false,
        linkId: "cos-navbar-register",
        requiresSession: false,
        view: e(Register, null, null),
        viewLink: createLinkElement("cos-navbar-register", "Register"),
    },
    {
        alwaysShow: false,
        linkId: "cos-navbar-login",
        requiresSession: false,
        view: e(Login, null, null),
        viewLink: createLinkElement("cos-navbar-login", "Login"),
    },
    {
        alwaysShow: false,
        linkId: "cos-navbar-logout",
        requiresSession: true,
        viewLink: CONNECTED_LOGOUT_LINK,
    },
];

/**
 * Renders a view based on the link clicked by a user.
 *
 * @param linkId - The CSS ID of the link clicked by a user.
 */
const renderView = (linkId: string): void => {
    LINKS.map((link: INavbarLinkData) => {
        if (linkId === link.linkId) {
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
 */
const Navbar: SFC<INavbarProps> = ({ sessionActive }) => {
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

    return NAVBAR([
        NAVBAR_COLLAPSE_BUTTON_LEAF,
        NAVBAR_BRAND_BUTTON_LEAF,
        NAVBAR_COLLAPSING_DIV([
            NAVBAR_LINKS_UL(
                LINKS.reduce(
                    (acc: Array<(DOMElement<any, Element> | ComponentElement<any, any>)>, val: INavbarLinkData) => {
                        return val.requiresSession === sessionActive || val.alwaysShow ?
                            acc.concat(val.viewLink) :
                            acc;
                    }, [])),
        ]),
    ]);
};

export default Navbar;
