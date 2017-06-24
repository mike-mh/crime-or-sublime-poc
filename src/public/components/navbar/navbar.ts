import { Component, createElement as e, DOMElement } from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { connect } from "react-redux";
import { beginSession, endSession } from "../../reducers/session-management/session.actions";
import { elements } from "../../libs/elements";
import Login from "../login/login";
import Test from "../test/test";

const a = elements.a;
const div = elements.div;
const nav = elements.nav;

class Navbar extends Component<{}, {}> {
    private readonly VIEW_ID: string = "cos-view";
    private readonly VIEW_MAP: any = {
        login: e(Login, null, null),
        test: e(Test, null, null),
    }

    private readonly connectedLogoutButton = connect()(({ dispatch }) => {
        return a({ onClick: () => { dispatch(endSession()) } }, "Logout")
    });

    private readonly links = [
        a({ onClick: () => { this.renderView("test") } }, "Home"),
        a({ onClick: () => { this.renderView("test") } }, "Locator"),
        a({ onClick: () => { this.renderView("view") } }, "Rate"),
        a({ onClick: () => { this.renderView("view") } }, "Register"),
        a({ onClick: () => { this.renderView("test") } }, "Profile"),
        a({ onClick: () => { this.renderView("login") } }, "Login"),
        e(this.connectedLogoutButton),
    ];

    private readonly navbar = nav(null, this.links);
    private readonly outlet = div({ id: "cos-view" }, null);

    private readonly container = div(
        null,
        [
            this.navbar,
            this.outlet
        ]);

    public renderView(view: string): void {
        unmountComponentAtNode(document.getElementById(this.VIEW_ID));
        if (this.VIEW_MAP[view]) {
            render(this.VIEW_MAP[view], document.getElementById("cos-view"));
        }
    }

    public render() {
        return this.container;
    }

    public getEmailInput(): void {

    }

    public getPasswordInput(): void {

    }
}

export default Navbar;