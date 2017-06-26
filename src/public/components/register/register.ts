import { ChangeEvent, Component, createElement as e } from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { UserRegsiterAPI } from "../../../../configurations/user/user-register/user-register-api";
import { elements } from "../../libs/elements";
import { beginSession, endSession } from "../../reducers/session-management/session.actions";
import { store } from "../../reducers/session-management/session.store";

// Use this to bypass type constraints on Window. Need to do this for reCaptcha
// but definately don't want to be doing stuff like this as a habit.
declare var window: {
    [key: string]: any;
    prototype: Window;
    new (): Window;
}

const a = elements.a;
const button = elements.button;
const div = elements.div;
const form = elements.form;
const h1 = elements.h1;
const input = elements.input;
const label = elements.label;

interface IRegisterFormState {
    captcha: string,
    email: string,
    password: string,
    passwordConfirm: string,
    username: string,
}

type RegisterFormStateProperty = ("captcha" | "email" | "password" | "passwordConfirm" | "username");

class Register extends Component<{}, IRegisterFormState> {
    public readonly userRegsiterAPI: UserRegsiterAPI = new UserRegsiterAPI();

    public state: IRegisterFormState = {
        username: "",
        email: "",
        password: "",
        passwordConfirm: "",
        captcha: "",
    }

    private readonly usernameInput = e("input",
        {
            className: "form-control",
            id: "cos-register-username-input",
            name: "username",
            onChange: this.getInput.bind(this, "username"),
            type: "text",
        });

    private readonly emailInput = e("input",
        {
            className: "form-control",
            id: "cos-register-email-input",
            name: "email",
            onChange: this.getInput.bind(this, "email"),
            type: "text",
        });

    private readonly passwordInput = e("input",
        {
            className: "form-control",
            name: "password",
            onChange: this.getInput.bind(this, "password"),
            type: "password",
        });

    private readonly passwordConfirmInput = e("input",
        {
            className: "form-control",
            name: "password",
            onChange: this.getInput.bind(this, "passwordConfirm"),
            type: "password",
        });

    private readonly usernameLabel = label({ for: "username" }, "Username:");
    private readonly emailLabel = label({ for: "email" }, "Email:");
    private readonly passwordLabel = label({ for: "password" }, "Password:");
    private readonly passwordConfirmLabel = label({ for: "passwordConfirm" }, "Confrim Password:");

    private readonly submitButton = button(
        {
            className: "btn btn-primary",
            type: "submit",
        }, "Submit");

    private readonly formLayout = [
        div({ className: "form-group" }, [
            this.usernameLabel,
            this.usernameInput]),
        div({ className: "form-group" }, [
            this.emailLabel,
            this.emailInput]),
        div({ className: "form-group" }, [
            this.passwordLabel,
            this.passwordInput]),
        div({ className: "form-group" }, [
            this.passwordConfirmLabel,
            this.passwordConfirmInput]),
        div({
            id: "cos-register-recaptcha",
            className: "g-recaptcha",
            "data-sitekey": "6LcWJSYUAAAAAEbsDsSvlCeB_T9TPT6kxT50ygGV",
            "data-callback": "captchaVerifyCallback",
            "data-expired-callback": "captchaExpiredCallback"
        }),
        this.submitButton,
    ];

    private readonly registerForm = form({ onSubmit: this.submitRegistration.bind(this) }, [
        this.formLayout,
    ]);

    private readonly container = div(null, this.registerForm);

    constructor(props: {}) {
        super(props);
    }

    public getInput(statePropToEdit: RegisterFormStateProperty, event: ChangeEvent<HTMLSelectElement>): void {
        this.setState(Object.defineProperty({}, statePropToEdit, {
            enumerable: true,
            value: event.target.value
        }));
    }

    public componentDidMount(): void {
        // These initialize recaptcha widget in window.
        window["captchaVerifyCallback"] = ((response: string) => {
            this.captchaVerifyCallback.bind(this)(response);
        }) as any;

        window["captchaExpiredCallback"] = (() => {
            this.captchaExpiredCallback.bind(this)();
        }) as any;

        // Need to manually add reCaptcha element
        let reCaptchaHeadElement = document.createElement("script");
        reCaptchaHeadElement.innerHTML = "";
        reCaptchaHeadElement.src = "https://www.google.com/recaptcha/api.js";
        reCaptchaHeadElement.async = true;
        reCaptchaHeadElement.defer = true;

        document.head.appendChild(reCaptchaHeadElement);
    }

    private submitRegistration(event: Event): void {
        event.preventDefault();
        try {
            this.userRegsiterAPI.validateParams(
                this.userRegsiterAPI.USER_REGISTER_SUBMIT_PATH,
                {
                    captcha: this.state.captcha,
                    email: this.state.email,
                    password: this.state.password,
                    username: this.state.username,
                },
                "post");
        } catch (error) {
            // Should update DOM here.
            console.log(error);
            return;
        }

        $.ajax({
            contentType: "application/json",
            data: JSON.stringify({
                captcha: this.state.captcha,
                email: this.state.email,
                password: this.state.password,
                username: this.state.username,
            }),
            dataType: "json",
            method: "POST",
            success: (data: any) => {
                // Should check for errors here.
                console.log(data);
            },
            url: this.userRegsiterAPI.USER_REGISTER_SUBMIT_PATH,
        });
    }

    public render() {
        return this.container;
    }

    /**
     * Callback for reCaptcha response. Used to set the state.
     */
    private captchaVerifyCallback(captcha: string): void {
        this.setState({ captcha });

        console.log(this.state);
    }

    /**
     * Callback for reCaptcha response. Removes reCaptcah resposne from state.
     */
    private captchaExpiredCallback(): void {
        this.setState({ captcha: "" });
        console.log(this.state);
    }

}

export default Register;
