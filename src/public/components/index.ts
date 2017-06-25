import * as $ from "jquery";
import { Component, ComponentElement, createElement as e, Props } from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { connect, MapStateToPropsParam, Provider, ProviderProps } from "react-redux";
import { SessionAPI } from "../../../configurations/session/session-api";
import { elements } from "../libs/elements";
import { beginSession, endSession } from "../reducers/session-management/session.actions";
import { sessionReducer } from "../reducers/session-management/session.reducer";
import { store } from "../reducers/session-management/session.store";
import Navbar from "./navbar/navbar";

const div = elements.div;
const h1 = elements.h1;
const p = elements.p;

class Index extends Component<{}, {}> {
    private sessionAPI: SessionAPI = new SessionAPI();

    constructor(props: Props<{}>) {
        super(props);
        store.subscribe(this.handleSessionChange.bind(this));
    }

    public render() {
        return this.constructEntryPoint();
    }

    /**
     * Use this to render the entry point. Is agnostic about session status.
     */
    private constructEntryPoint(): ComponentElement<ProviderProps, Provider> {
        return e(Provider,
            { store },
            div({ id: "cos" }, [
                h1(null, "Welcome to CoS!"),
                div({ id: "cos-navbar-container" },
                    e(Navbar, { id: "cos-navbar-entry", sessionActive: false }, null))]));
    }

    /**
     * Use this to render the Navbar based on current session status. Removes
     * any Navabrs that were already rendered.
     *
     * @param sessionActive - Boolean that holds whether or not there is an
     *      active session.
     */
    public renderNavbar(sessionActive: boolean): void {
        if (document.getElementById("cos-navbar-entry")) {
            unmountComponentAtNode(document.getElementById("cos-navbar-entry"));
        }

        console.log("rendering...");

        // Need to be sure to pass the store back into the rendered element
        render(
            e(Provider, { store },
                e(Navbar, { id: "cos-navbar-entry", sessionActive }, null)),
            document.getElementById("cos-navbar-container"));
        console.log("done");
    }

    /**
     * Use this method to get the current session status from the server to
     * determine if the user is logged in or not. Will trigger the appropriate
     * action based on server response.
     */
    private getSessionStatus(): void {
        $.ajax({
            cache: false,
            contentType: "application/json",
            error: (xhr: any, status: any, err: any) => {
                store.dispatch(endSession());
                this.renderNavbar(false);
                return;
            },
            method: "GET",
            success: (data: any) => {
                if (data.result) {
                    store.dispatch(beginSession(data.result));
                    this.renderNavbar(true);
                    return;
                }

                this.renderNavbar(false);
                store.dispatch(endSession());
            },
            url: this.sessionAPI.SESSION_VERIFY_USER_PATH,
        });
    }

    /**
     * Use this to handle changes to the session state so that the Navbar can
     * be rendered correctly.
     */
    private handleSessionChange(): void {
        this.renderNavbar((store.getState() as any).sessionStatus);
    }
}

export default Index;
