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
import Test from "./test/test";

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
                e(Navbar as any, { id: "cos-navbar", sessionActive: false }, null),
                div({ id: "cos-outlet" })]));
    }

    /**
     * Use this to render the Navbar based on current session status. Removes
     * any Navabrs that were already rendered.
     *
     * @param sessionActive - Boolean that holds whether or not there is an
     *      active session.
     */
    public renderNavbar(sessionActive: boolean): void {
        console.log("rendering....");
        if (document.getElementById("cos-navbar")) {
            unmountComponentAtNode(document.getElementById("cos-navbar"));
        }

        console.log("looking for entry....");
        // Need to be sure to pass the store back into the rendered element
        render(
            e(Provider, { store },
                e(Navbar as any, { id: "cos-navbar", sessionActive }, null)),
            document.getElementById("cos-navbar"));
        console.log("done");
    }

    /**
     * Use this to render the screen the user sees after they logout.
     *
     * @param sessionActive - Boolean that holds whether or not there is an
     *      active session.
     */
    public renderSessionEndScreen(): void {
        if (document.getElementById("cos-outlet")) {
            unmountComponentAtNode(document.getElementById("cos-outlet"));
        }

        // Need to be sure to pass the store back into the rendered element
        render(
            e(Provider, { store },
                e(Test, { id: "cos-logout-screen" } as any, null)),
            document.getElementById("cos-outlet"));
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
        this.renderSessionEndScreen();
    }
}

export default Index;
