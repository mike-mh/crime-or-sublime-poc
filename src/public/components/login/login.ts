import { Component, createElement as e } from "react";
import { connect } from "react-redux";
import { beginSession, endSession } from "../../reducers/session-management/session.actions";
import { elements } from "../../libs/elements";
import Test from "../test/test";
import { SessionAPI } from "../../../../configurations/session/session-api";

const a = elements.a;
const button = elements.button;
const div = elements.div;
const form = elements.form;
const h1 = elements.h1;
const input = elements.input;
const label = elements.label;

const emailInput = e("input", { className: "form-control", type: "text", name: "email" });
const passwordInput = e("input", { className: "form-control", type: "password", name: "password" });

const labelsAndInputs = [
    div({ className: "form-group" }, [
        label({ for: "email" }, "Email:"),
        emailInput]),
    div({ className: "form-group" }, [
        label({ for: "password" }, "Password: "),
        passwordInput,
    ]),
    button({ type: "submit", className: "btn btn-primary" }, "Submit"),
]

const loginForm = form(null, labelsAndInputs);

class Login extends Component<{}, {}> {

    private readonly container = div(
        null,
        [
            loginForm
        ]);

    public render() {
        return this.container;
    }
}

export default Login;