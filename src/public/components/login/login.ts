import { ChangeEvent, Component, createElement as e, DOMElement } from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { SessionAPI } from "../../../../configurations/session/session-api";
import { elements, setElemChildrenCurry } from "../../libs/elements/elements";
import { beginSession, endSession } from "../../reducers/session-management/session.actions";
import { store } from "../../reducers/session-management/session.store";
import styles from "./login.styles";

const a = elements.a;
const button = elements.button;
const div = elements.div;
const form = elements.form;
const h1 = elements.h1;
const input = elements.input;
const label = elements.label;

type LoginFormStateProperty = ("email" | "password");

interface IFormState {
    email: string;
    password: string;
}

interface ILoginFormInputAttributes {
    className: string;
    id: string;
    name: string;
    onChange: () => void;
    type: string;
}

interface ILoginFormInputTagData {
    id: string;
    label: DOMElement<any, Element>;
    name: string;
    type: string;
}

class Login extends Component<{}, IFormState> {
    public readonly sessionAPI: SessionAPI = new SessionAPI();

    private readonly LOGIN_INPUT_TAGS: ILoginFormInputTagData[] = [
        {
            id: "cos-login-email-input",
            label: label({ for: "email" }, "Email:"),
            name: "email",
            type: "text",
        },
        {
            id: "cos-login-password-input",
            label: label({ for: "password" }, "Password:"),
            name: "password",
            type: "password",
        },
    ];

    private readonly LOGIN_DIV = setElemChildrenCurry(div, { id: "cos-login" });

    private readonly LOGIN_BANNER_H1_LEAF = h1({ styles: styles["#cos-login-banner"] }, "Login:");

    private readonly LOGIN_SUBMIT_BUTTON_LEAF = button({ className: "btn btn-primary", type: "submit" }, "Submit");

    private readonly LOGIN_FORM = setElemChildrenCurry(form, {
        id: "cos-login-form",
        onSubmit: this.submitCredentials.bind(this),
        style: styles["#cos-login-form"],
    });

    constructor(props: {}) {
        super(props);

    }

    /**
     * This function eact time a change occurs in the registration form. It
     * registers all changes to the state at the value stored in
     * 'statePropToEdit' index of the state.
     *
     * @param statePropToEdit - The state property to change
     * @param event - The event that triggered the change.
     */
    public getInput(statePropToEdit: string, event: ChangeEvent<HTMLSelectElement>): void {
        this.setState(Object.defineProperty({}, statePropToEdit, {
            enumerable: true,
            value: event.target.value,
        }));
    }

    public submitCredentials(event: Event): void {
        event.preventDefault();
        try {
            this.sessionAPI.validateParams(
                this.sessionAPI.SESSION_CREATE_USER_PATH,
                {
                    identifier: this.state.email,
                    password: this.state.password,
                },
                "post");
        } catch (error) {
            // Should update DOM here.
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
                // Should change the DOM here
                store.dispatch(endSession());
            },
            method: "POST",
            success: (data: any) => {
                if (data.result) {
                    store.dispatch(beginSession(data.result));
                    return;
                }
                store.dispatch(endSession());
            },
            url: this.sessionAPI.SESSION_CREATE_USER_PATH,
        });
    }

    public render() {
        return this.LOGIN_DIV([
            this.LOGIN_BANNER_H1_LEAF,
            this.LOGIN_FORM([
                this.LOGIN_INPUT_TAGS.reduce((acc: Array<DOMElement<any, Element>>, cur: ILoginFormInputTagData) => {
                    acc.push(
                        this.generateFormControlTag(
                            cur.label,
                            this.generateInputTag(cur.id, cur.name, cur.type),
                        ));

                    return acc;
                }, []).concat([this.LOGIN_SUBMIT_BUTTON_LEAF]),
            ])
        ]);
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
        DOMElement<ILoginFormInputAttributes, Element> {

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
        label: DOMElement<any, Element>, input: DOMElement<ILoginFormInputAttributes, Element>):
        DOMElement<any, Element> {

        return div({ className: "form-group" }, [
            label,
            input]);
    }
    /* tslint:enable:no-shadowed-variable */

}

export default Login;
