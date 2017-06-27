import { ChangeEvent, Component, createElement as e, DOMElement, EventHandler } from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { UserRegsiterAPI } from "../../../../configurations/user/user-register/user-register-api";
import { elements, setElemChildrenCurry } from "../../libs/elements/elements";
import { beginSession, endSession } from "../../reducers/session-management/session.actions";
import { store } from "../../reducers/session-management/session.store";

const a = elements.a;
const button = elements.button;
const div = elements.div;
const form = elements.form;
const h1 = elements.h1;
const input = elements.input;
const label = elements.label;

interface IRegisterFormState {
    captcha: string;
    email: string;
    password: string;
    passwordConfirm: string;
    username: string;
}

interface IRegsterFormInputAttributes {
    className: string;
    id: string;
    name: string;
    onChange: () => void;
    type: string;
}

interface IRegsiterFormInputTagData {
    id: string;
    label: DOMElement<any, Element>;
    name: string;
    type: string;
}

type RegisterFormStateProperty = ("captcha" | "email" | "password" | "passwordConfirm" | "username");

class Register extends Component<{}, IRegisterFormState> {
    public readonly userRegsiterAPI: UserRegsiterAPI = new UserRegsiterAPI();

    private readonly INPUT_TAGS: IRegsiterFormInputTagData[] = [
        {
            id: "cos-register-username-input",
            label: label({ for: "username" }, "Username:"),
            name: "username",
            type: "text",
        },
        {
            id: "cos-register-email-input",
            label: label({ for: "email" }, "Email:"),
            name: "email",
            type: "text",
        },
        {
            id: "cos-register-password-input",
            label: label({ for: "password" }, "Password:"),
            name: "password",
            type: "password",
        },
        {
            id: "cos-register-password-confirm-input",
            label: label({ for: "password-confirm" }, "Confirm Password:"),
            name: "passwordConfirm",
            type: "password",
        },
    ];

    private readonly RECAPTCHA_DIV_LEAF = div({
        "className": "g-recaptcha",
        "data-callback": "captchaVerifyCallback",
        "data-expired-callback": "captchaExpiredCallback",
        "data-sitekey": "6LcWJSYUAAAAAEbsDsSvlCeB_T9TPT6kxT50ygGV",
        "id": "cos-register-recaptcha",
    });

    private readonly SUBMIT_BUTTON_LEAF = button({ className: "btn btn-primary", type: "submit" }, "Submit");

    private readonly REGISTER_FORM = setElemChildrenCurry(form, { onSubmit: this.submitRegistration.bind(this) });

    constructor(props: {}) {
        super(props);
    }

    /**
     * Need to use this function to render the reCaptcha widget.
     *
     * TO-DO: Need to remove the head tag this function inserts after the
     *        component dismounts from the DOM.
     */
    public componentDidMount(): void {
        // These initialize recaptcha widget in window.
        Object.defineProperty(window, "captchaVerifyCallback", {
            value: (response: string) => {
                this.captchaVerifyCallback.bind(this)(response);
            },
        });

        Object.defineProperty(window, "captchaExpiredCallback", {
            value: () => {
                this.captchaExpiredCallback.bind(this)();
            },
        });

        // Need to manually add reCaptcha element
        const reCaptchaHeadElement = document.createElement("script");
        reCaptchaHeadElement.innerHTML = "";
        reCaptchaHeadElement.src = "https://www.google.com/recaptcha/api.js";
        reCaptchaHeadElement.async = true;
        reCaptchaHeadElement.defer = true;

        document.head.appendChild(reCaptchaHeadElement);
    }

    /**
     * Should render a bootstrap registration form with all of the input fields
     * specified in the INPUT_TAGS array. Also appends the reCaptcha widget and
     * submit button.
     *
     * @return - The registration form DOMElement.
     */
    public render(): DOMElement<any, Element> {
        return this.REGISTER_FORM([
            this.INPUT_TAGS.reduce((acc: Array<DOMElement<any, Element>>, cur: IRegsiterFormInputTagData) => {
                acc.push(
                    this.generateFormControlTag(
                        cur.label,
                        this.generateInputTag(cur.id, cur.name, cur.type),
                    ));

                return acc;
            }, []).concat([
                this.RECAPTCHA_DIV_LEAF,
                this.SUBMIT_BUTTON_LEAF,
            ]),
        ]);
    }

    /**
     * This function eact time a change occurs in the registration form. It
     * registers all changes to the state at the value stored in
     * 'statePropToEdit' index of the state.
     *
     * @param statePropToEdit - The state property to change
     * @param event - The event that triggered the change.
     */
    public getInput(statePropToEdit: RegisterFormStateProperty, event: ChangeEvent<HTMLSelectElement>): void {
        this.setState(Object.defineProperty({}, statePropToEdit, {
            enumerable: true,
            value: event.target.value,
        }));
    }

    /**
     * Callback for reCaptcha response. Used to set the state.
     */
    private captchaVerifyCallback(captcha: string): void {
        this.setState({ captcha });
    }

    /**
     * Callback for reCaptcha response. Removes reCaptcha resposne from state.
     */
    private captchaExpiredCallback(): void {
        this.setState({ captcha: "" });
    }

    /**
     * Helper function to generate inputs needed for this form.
     *
     * @param id - The CSS id to associte with the input tag.
     * @param name - The name to associate with the input tag.
     * @param type - The type to associate with the input tag, e.g. 'password'
     *
     * @returns - Input tag with properly configured attributes.
     */
    private generateInputTag(id: string, name: string, type: string):
        DOMElement<IRegsterFormInputAttributes, Element> {

        return e("input", {
            className: "form-control",
            id,
            name,
            onChange: this.getInput.bind(this, name),
            type,
        });
    }

    /* tslint:disable:no-shadowed-variable */
    /**
     * Helper function to generate a form-control div
     *
     * @param id - The CSS id to associte with the input tag.
     * @param name - The name to associate with the input tag.
     * @param type - The type to associate with the input tag, e.g. 'password'
     *
     * @returns - Input tag with properly configured attributes.
     */
    private generateFormControlTag(
        label: DOMElement<any, Element>, input: DOMElement<IRegsterFormInputAttributes, Element>):
        DOMElement<any, Element> {

        return div({ className: "form-group" }, [
            label,
            input]);
    }
    /* tslint:enable:no-shadowed-variable */

    /**
     * Submits the registration form to the server.
     *
     * TO-DO: Render error messages if registration fails and redirect user to
     *        a screen with a 'registration success' type message.
     *
     * @param event - The form submission event that triggers this function.
     */
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
                // Should render DOM here.
                return;
            },
            url: this.userRegsiterAPI.USER_REGISTER_SUBMIT_PATH,
        });
    }
}

export default Register;
