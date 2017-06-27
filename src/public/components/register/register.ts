import { ChangeEvent, Component, createElement as e, DOMElement, EventHandler } from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { UserRegsiterAPI } from "../../../../configurations/user/user-register/user-register-api";
import { elements, setElemChildrenCurry } from "../../libs/elements";
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
};

interface IRegsterFormInputAttributes {
    className: string,
    id: string,
    name: string,
    onChange: () => void,
    type: string,
}

interface IRegsiterFormInputTagData {
    id: string,
    name: string,
    type: string,
}

type RegisterFormStateProperty = ("captcha" | "email" | "password" | "passwordConfirm" | "username");

class Register extends Component<{}, IRegisterFormState> {
    public readonly userRegsiterAPI: UserRegsiterAPI = new UserRegsiterAPI();

    private readonly INPUT_TAGS: IRegsiterFormInputTagData[] = [
        {
            id: "cos-register-username-input",
            name: "username",
            type: "text",
        },
        {
            id: "cos-register-password-input",
            name: "email",
            type: "text",
        },
        {
            id: "cos-register-password-input",
            name: "password",
            type: "password",
        },
        {
            id: "cos-register-password-confirm-input",
            name: "passwordConfirm",
            type: "password",
        },
    ];

    private readonly INPUT_LABELS_MAP: {[name: string]: DOMElement<any, Element>} = {
        "email": label({ for: "email" }, "Email:"),
        "password": label({ for: "password" }, "Password:"),
        "passwordConfirm": label({ for: "passwordConfirm" }, "Confirm Password:"),
        "username": label({ for: "username" }, "Username:"),
    }

    private readonly RECAPTCHA_DIV_LEAF = div({
        id: "cos-register-recaptcha",
        className: "g-recaptcha",
        "data-sitekey": "6LcWJSYUAAAAAEbsDsSvlCeB_T9TPT6kxT50ygGV",
        "data-callback": "captchaVerifyCallback",
        "data-expired-callback": "captchaExpiredCallback"
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

    /**
     * Should render a bootstrap registration form with all of the input fields
     * specified in the INPUT_TAGS array. Also appends the reCaptcha widget and
     * submit button.
     * 
     * @return - The registration form DOMElement.
     */
    public render(): DOMElement<any, Element> {
        return this.REGISTER_FORM([
            this.INPUT_TAGS.reduce((acc: DOMElement<any, Element>[], cur: IRegsiterFormInputTagData) => {
                acc.push(
                    this.generateFormControlTag(
                        this.INPUT_LABELS_MAP[cur.name],
                        this.generateInputTag(cur.id, cur.name, cur.type),
                    )
                )
                return acc;
            }, []).concat([
                this.RECAPTCHA_DIV_LEAF,
                this.SUBMIT_BUTTON_LEAF,
            ])
        ])
    }

    public getInput(statePropToEdit: RegisterFormStateProperty, event: ChangeEvent<HTMLSelectElement>): void {
        this.setState(Object.defineProperty({}, statePropToEdit, {
            enumerable: true,
            value: event.target.value
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
    };

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
            input])
    };

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
}

export default Register;
