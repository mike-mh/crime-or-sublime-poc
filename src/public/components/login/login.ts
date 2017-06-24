import * as $ from "jquery";
import { Component, createElement as e, ChangeEvent } from "react";
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

interface IFormState {
    email: string;
    password: string;
}


class Login extends Component<{}, IFormState> {
    public readonly sessionAPI: SessionAPI = new SessionAPI();

    public state: IFormState = {
        email: "",
        password: "",
    }

    private readonly emailInput = e("input",
        {
            className: "form-control",
            name: "email",
            onChange: this.getEmailInput.bind(this),
            type: "text",
        });

    private readonly passwordInput = e("input",
        {
            className: "form-control",
            name: "password",
            onChange: this.getPasswordInput.bind(this),
            type: "password",
        });

    private readonly emailLabel = label({ for: "email" }, "Email:");
    private readonly passwordLabel = label({ for: "password" }, "Password:");

    private readonly submitButton = button(
        {
            type: "submit",
            className: "btn btn-primary",
        }, "Submit");

    private readonly formLayout = [
        div({ className: "form-group" }, [
            this.emailLabel,
            this.emailInput]),
        div({ className: "form-group" }, [
            this.passwordLabel,
            this.passwordInput]),
            this.submitButton,
    ];

    private readonly loginForm = form({onSubmit: this.submitCredentials.bind(this)}, [
        this.formLayout,
    ]);

    private readonly container = div(null, this.loginForm);

    constructor(props: {}) {
        super(props);

    }

    public getEmailInput(event: ChangeEvent<HTMLSelectElement>): void {
        this.setState({
            email: event.target.value,
        });
    }

    public getPasswordInput(event: ChangeEvent<HTMLSelectElement>): void {
        this.setState({
            password: event.target.value,
        });
    }

    public submitCredentials(event: Event): void {
        event.preventDefault();
        console.log(this.state)
        try {
            this.sessionAPI.validateParams(
                this.sessionAPI.SESSION_CREATE_USER_PATH,
                {
                    identifier: this.state.email,
                    password: this.state.password,
                },
                "post");
        } catch (error) {
            console.log(error);
            console.log("exitting...");
            return;
        }

        $.ajax({
            cache: false,
            contentType: "application/json",
            data: JSON.stringify({
                identifier: this.state.email,
                password: this.state.password,
            }),
            dataType: "json",
            error: (xhr: any, status: any, err: any) => {
                console.log(err.toString());
            },
            method: "POST",
            success: (data: JSON) => {
                console.log(data);
            },
            url: this.sessionAPI.SESSION_CREATE_USER_PATH,
        });
    }

    public render() {
        return this.container;
    }
}

export default Login;