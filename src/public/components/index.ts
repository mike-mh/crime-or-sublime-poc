import "jquery";
import { Component, ComponentClass, ComponentElement, createElement as e, Props } from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { connect, MapStateToPropsParam, Provider, ProviderProps } from "react-redux";
import { SessionAPI } from "../../../configurations/session/session-api";
import { elements, setElemChildrenCurry } from "../libs/elements/elements";
import { beginSession, endSession } from "../reducers/session-management/session.actions";
import { sessionReducer } from "../reducers/session-management/session.reducer";
import { store } from "../reducers/session-management/session.store";
import styles from "./index.styles";
import Home from "./home/home";
import Navbar from "./navbar/navbar";

const div = elements.div;
const h1 = elements.h1;
const p = elements.p;

/**
 * Keep this as a stateful component for now. This doesn't actually store any
 * states, it subscribes to changes from redux and re-renders the Navbar based
 * on the session state.
 */
class MainIndex extends Component<ProviderProps, Provider> {
    private sessionAPI: SessionAPI = new SessionAPI();

    private readonly COS_ROOT_DIV = setElemChildrenCurry(div, { id: "cos" });

    private readonly COS_NAVBAR = e(Navbar as any, { id: "cos-navbar", sessionActive: false }, null);

    private readonly COS_VIEW_OUTLET_DIV = div({ id: "cos-outlet" });

    constructor(props: Props<{}>) {
        super(props);
        store.subscribe(this.handleSessionChange.bind(this));

        // Check if the user has an active session then render Navbar.
        this.getSessionStatus();
    }

    /**
     * Renders the main entry point for CoS and wraps it with store provider.
     *
     * @returns - Div containing the CoS Navbar and view outlet.
     */
    public render() {
        return e(Provider,
            { store },
            this.COS_ROOT_DIV([
                this.COS_NAVBAR,
                this.COS_VIEW_OUTLET_DIV]));
    }

    /**
     * Use this to render the Navbar based on current session status. Removes
     * any Navabrs that were already rendered.
     *
     * @param sessionActive - Boolean that holds whether or not there is an
     *      active session.
     */
    private renderNavbar(sessionActive: boolean): void {
        if (document.getElementById("cos-navbar")) {
            unmountComponentAtNode(document.getElementById("cos-navbar"));
        }

        // Need to be sure to pass the store back into the rendered element
        render(
            e(Provider, { store },
                e(Navbar as any, { id: "cos-navbar", sessionActive }, null)),
            document.getElementById("cos-navbar"));
    }

    /**
     * Use this to render the home view.
     */
    private renderHomeView(): void {
        if (document.getElementById("cos-outlet")) {
            unmountComponentAtNode(document.getElementById("cos-outlet"));
        }

        render(
            e(Provider, { store },
                e(Home, { id: "cos-home-screen" } as any, null)),
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
        this.renderHomeView();
    }
}

export default MainIndex;
