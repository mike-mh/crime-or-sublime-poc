import { Component, ComponentElement, createElement as e, DOMElement, SFC } from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { connect, Provider } from "react-redux";
import { elements } from "../../libs/elements";
import { endSession } from "../../reducers/session-management/session.actions";
import { store } from "../../reducers/session-management/session.store";
import Login from "../login/login";
import Register from "../register/register";
import Test from "../test/test";

const a = elements.a;
const div = elements.div;
const nav = elements.nav;


interface INavbarProps {
    sessionActive: boolean;
}

interface INavbarLinkData {
    alwaysShow: boolean,
    linkId: string,
    requiresSession: boolean,
    // Some links don't have a view.
    view?: ComponentElement<any, any>,
    viewLink: DOMElement<any, Element> | ComponentElement<any, any>,
}

// Need to connect the logout button so that it can send redux signals to
// have the Navbar re-rendered correctly.
const connectedLogoutButton = e(connect()(({ dispatch }) => {
    return a({ id: "cos-logout", onClick: () => { dispatch(endSession()); } }, "Logout");
}), { id: "cos-logout" } as any);

const links: INavbarLinkData[] = [
    {
        alwaysShow: true,
        linkId: "cos-navbar-home",
        requiresSession: false,
        view: e(Test, null, null),
        viewLink: a({
            onClick: () => { renderView("cos-navbar-home"); },
            id: "cos-navbar-home",
        }, "Home"),
    },
    {
        alwaysShow: true,
        linkId: "cos-navbar-locator",
        requiresSession: false,
        view: e(Test, null, null),
        viewLink: a({
            onClick: () => { renderView("cos-navbar-locator"); },
            id: "cos-navbar-locator",
        }, "Locator"),
    },
    {
        alwaysShow: false,
        linkId: "cos-navbar-rate",
        requiresSession: true,
        view: e(Test, null, null),
        viewLink: a({
            onClick: () => { renderView("cos-navbar-rate"); },
            id: "cos-navbar-rate",
        }, "Rate"),
    },
    {
        alwaysShow: false,
        linkId: "cos-navbar-profile",
        requiresSession: true,
        view: e(Test, null, null),
        viewLink: a({
            onClick: () => { renderView("cos-navbar-profile"); },
            id: "cos-navbar-profile",
        }, "Profile"),
    },
    {
        alwaysShow: false,
        linkId: "cos-navbar-register",
        requiresSession: false,
        view: e(Register, null, null),
        viewLink: a({
            onClick: () => { renderView("cos-navbar-register"); },
            id: "cos-navbar-register",
        }, "Register"),
    },
    {
        alwaysShow: false,
        linkId: "cos-navbar-login",
        requiresSession: false,
        view: e(Login, null, null),
        viewLink: a({
            onClick: () => { renderView("cos-navbar-login"); },
            id: "cos-navbar-login",
        }, "Login"),
    },
    {
        alwaysShow: false,
        linkId: "cos-navbar-logout",
        requiresSession: true,
        viewLink: connectedLogoutButton,
    },
];

const Navbar: SFC<INavbarProps> = ({ sessionActive }) => {
    return nav({ id: "cos-navbar" }, [
        links.filter((link: INavbarLinkData) => {
            return link.requiresSession === sessionActive || link.alwaysShow;
        }).reduce((acc: (DOMElement<any, Element> | ComponentElement<any, any>)[], val: INavbarLinkData) => {
            return acc.concat(val.viewLink);
        }, [])]);
}

const renderView = (linkId: string) => {
    links.map((link: INavbarLinkData) => {
        if (linkId === link.linkId) {
            unmountComponentAtNode(document.getElementById("cos-outlet"));
            render(e(Provider, { store }, link.view),
                document.getElementById("cos-outlet"));
        }
    });
}

export default Navbar;
