import { Component, createElement as e, DOMElement } from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { connect } from "react-redux";
import { SessionAPI } from "../../../../configurations/session/session-api";
import { elements } from "../../libs/elements";
import { beginSession, endSession } from "../../reducers/session-management/session.actions";
import { store } from "../../reducers/session-management/session.store";
import Login from "../login/login";
import Test from "../test/test";

const a = elements.a;
const div = elements.div;
const nav = elements.nav;

interface INavbarProps {
    sessionActive: boolean;
}

class Navbar extends Component<INavbarProps, {}> {
    private readonly sessionAPI: SessionAPI = new SessionAPI();
    private readonly VIEW_ID: string = "cos-view";
    private readonly LOGIN_VIEW_ID = "cos-login"
    private readonly VIEW_MAP: any = {
        login: e(Login, null, null),
        test: e(Test, null, null),
    };

    // These views should only appear when a user is logged in
    private readonly VIEWS_REQUIRE_SESSION = [
        "cos-rate",
        "cos-profile",
        "cos-logout",
    ];

    // These views should only appear when a user isn't logged in
    private readonly VIEWS_WITHOUT_SESSION = [
        "cos-register",
        "cos-login",
    ];

    private readonly connectedLogoutButton = connect()(({ dispatch }) => {
        return a({ id:"cos-logout", onClick: () => { dispatch(endSession()); } }, "Logout");
    });

    private readonly links = [
        a({
            onClick: () => { this.renderView("test"); },
            id: "cos-home",
        }, "Home"),
        a({
            onClick: () => { this.renderView("test"); },
            id: "cos-locator",
        }, "Locator"),
        a({
            onClick: () => { this.renderView("view"); },
            id: "cos-rate",
        }, "Rate"),
        a({
            onClick: () => { this.renderView("view"); },
            id: "cos-register",
        }, "Register"),
        a({
            onClick: () => { this.renderView("test"); },
            id: "cos-profile",
        }, "Profile"),
        a({
            onClick: () => { this.renderView("login"); },
            id: "cos-login",
        }, "Login"),
        e(this.connectedLogoutButton),
    ];

    private readonly navbar = nav({ id: "cos-navbar" }, this.links);
    private readonly outlet = div({ id: "cos-view" }, null);

    private readonly container = div(
        null,
        [
            this.navbar,
            this.outlet,
        ]);

    constructor(props: any) {
        super(props);
    }

    public renderView(view: string): void {
        unmountComponentAtNode(document.getElementById(this.VIEW_ID));
        if (this.VIEW_MAP[view]) {
            render(this.VIEW_MAP[view], document.getElementById("cos-view"));
        }
    }

    /**
     * Use this function to generate the Navbar. If a Navbar is already
     * rendered it is removed from the DOM.
     *
     * @param sessionIsActive - Configures the Navbar based on whether or not the
     *      session is active.
     *
     * @return - React Navbar element configure as per session status 
     */
    public generateNavabar(sessionIsActive: boolean): void {

        // Render links based on whether or not there is an active session
        const linksToRender = sessionIsActive ?
            this.links.map((link: any) => {
                if (this.VIEWS_WITHOUT_SESSION.indexOf(link.props.id) < 0) {
                    console.log(link);
                    return link;
                }
            }) :
            this.links.map((link: any) => {
                // Added the or conditional for the logout button. I'm not
                // sure how to pass original props to the new element 'connect'
                // makes but if someone figures that out, definately come back
                // and fix this!
                if (this.VIEWS_REQUIRE_SESSION.indexOf(link.props.id) < 0 && link.props.id) {
                    return link;
                }
            });

        if (document.getElementById("cos-navbar")) {
            unmountComponentAtNode(document.getElementById("cos-navbar"));
        }

        return nav({ id: "cos-navbar" }, linksToRender);
    }

    public render() {
        return div({ id: "cos-main-view" }, [
            this.generateNavabar(this.props.sessionActive),
            this.outlet,
        ]);
    }
}

export default Navbar;
