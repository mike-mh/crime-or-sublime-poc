import { Component, createElement as e } from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { connect } from "react-redux";
import { beginSession, endSession } from "../../reducers/session-management/session.actions";
import { elements } from "../../libs/elements";
import Test from "../test/test";

const a = elements.a;
const div = elements.div;
const nav = elements.nav;

const test = e(Test, null, null);


class Navbar extends Component<{}, {}> {
    private readonly VIEW_ID: string = "cos-view";
    private readonly ConnectedLogoutButton = connect()(({ dispatch }) => {
        return a({ onClick: () => { dispatch(endSession()) } }, "Logout")
    });

    private readonly links = [
        a({ onClick: () => { this.renderView("test") } }, "Home"),
        a({ onClick: () => { this.renderView("test") } }, "Locator"),
        a({ onClick: () => { this.renderView("view") } }, "Rate"),
        a({ onClick: () => { this.renderView("view") } }, "Register"),
        a({ onClick: () => { this.renderView("test") } }, "Profile"),
        a({ onClick: () => { this.renderView("view") } }, "Login"),
        e(this.ConnectedLogoutButton),
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
        if (view === "test") {
            render(test, document.getElementById("cos-view"));
        }
    }

    public render() {
        return this.container;
    }
}

export default Navbar;