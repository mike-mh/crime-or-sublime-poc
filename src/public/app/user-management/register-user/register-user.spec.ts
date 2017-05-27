import { CommonModule } from "@angular/common";
import { EventEmitter, NgZone } from "@angular/core";
import { async, inject, ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpModule, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { By } from "@angular/platform-browser";
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { DebugElement } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterTestingModule } from '@angular/router/testing';
import { SessionService, ISessionDetails } from "./../../shared/session/session.service";
import { RegisterUserComponent } from "./register-user.component";
import { RegisterUserService } from "./register-user.service";

describe("RegisterUserComponent", () => {
    let component: RegisterUserComponent;
    let fixture: ComponentFixture<RegisterUserComponent>;

    let htmlElements: {} = {};
    let buttonIDs: string[] = [
        "#cos-register-user-form",
        "#cos-register-user-username-field",
        "#cos-register-user-email-field",
        "#cos-register-user-password-field",
        "#cos-register-user-password-verify-field",
        "#cos-register-user-recaptcha",
        "#cos-register-user-submit-button",
        "#cos-register-user-username-empty",
        "#cos-register-user-username-too-long",
        "#cos-register-user-username-invalid",
        "#cos-register-user-email-invalid",
        "#cos-register-user-password-empty",
        "#cos-register-user-password-too-long",
        "#cos-register-user-password-too-short",
        "#cos-register-user-password-invalid",
        "#cos-register-user-password-verify-empty",
        "#cos-register-user-password-verify-no-match"
    ];

    let sessionServiceStub: {
        sessionIsActive: boolean;
    };

    let userIsSignedOn = false;

    /**
     * Use this to check all of the necessarry fields of the form have been rendered.
     * 
     * @return - True if the whole form is rendered, false otherwise.
     */
    let formFieldsRendered: () => boolean;
    formFieldsRendered = () => {
        return !!htmlElements["#cos-register-user-form"] &&
            !!htmlElements["#cos-register-user-username-field"] &&
            !!htmlElements["#cos-register-user-email-field"] &&
            !!htmlElements["#cos-register-user-password-field"] &&
            !!htmlElements["#cos-register-user-password-verify-field"] &&
            !!htmlElements["#cos-register-user-recaptcha"] &&
            !!htmlElements["#cos-register-password-submit-button"];
    };

    /**
     * Use this function to map all changes to the htmlElements map.
     */
    let mapChanges: () => void;
    mapChanges = () => {
        fixture.detectChanges();
        for (let id of buttonIDs) {
            let de = fixture.debugElement.query(By.css(id));

            htmlElements[id] = (de) ?
                de.nativeElement :
                undefined;
        }
    };

    /**
     * Use this to check an element is rendered. An element should be
     * rendered if it is mapped in the htmlElements hash.
     * 
     * @param - The element's id value
     * 
     * @return - True if the element is in the htmlElements hash, or else false
     */
    let isElementRendered: (id: string) => boolean;
    isElementRendered = (id: string) => {
        fixture.detectChanges();
        return !!htmlElements[id];
    }

    /**
     * Use this to fill in a given field with text.
     * 
     * @param id - The id of the field to fill
     * @param value - The value to place in the field
     */
    let fillField: (id: string, value: string) => void;
    fillField = (id: string, value: string) => {
        htmlElements[id].value = value;
        htmlElements[id].dispatchEvent(new Event('input'));
        fixture.detectChanges();
    }

    /**
     * Use this as a helper fucntion to fill out the entire form.
     * 
     * @param username - Test username
     * @param email - Test email
     * @param password - Test password
     * @param passwordVerify - Test password verification
     */
    let fillForm: (username: string, email: string, password: string, passwordVerify: string) => void;
    fillForm = (username: string, email: string, password: string, passwordVerify: string) => {
        fillField("#cos-register-user-username-field", username);
        fillField("#cos-register-user-email-field", email);
        fillField("#cos-register-user-password-field", password);
        fillField("#cos-register-user-password-verify-field", passwordVerify);
    };

    beforeEach(async(() => {
        sessionServiceStub = {
            sessionIsActive: userIsSignedOn,
        }

        let spy: jasmine.Spy;

        // Spy on the actual static class since the method is static.
        spy = spyOn(SessionService, "isSessionActive").and.returnValue(userIsSignedOn);


        TestBed.configureTestingModule({
            declarations: [RegisterUserComponent],
            imports: [
                CommonModule,
                ReactiveFormsModule,
                HttpModule
            ],
        })

        TestBed.overrideComponent(RegisterUserComponent, {
            set: {
                providers: [
                    { provide: SessionService, useValue: sessionServiceStub },
                    RegisterUserService]
            }
        }).compileComponents()
            .catch((error) => {
                console.log(error);
            })

    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RegisterUserComponent);
        component = fixture.componentInstance;
        // Need to change the reCaptcha URL to prevent violating same-origin
        // policy.
        component.CAPTCHA_API_URL = "/raboof"

        fixture.detectChanges();
        mapChanges();
    });


    it("should have a registration form", () => {
        expect(isElementRendered("#cos-register-user-form")).toBe(true);
    });

    it("registration form should have a field for username", () => {
        expect(isElementRendered("#cos-register-user-username-field")).toBe(true);
    });

    it("registration form should have a field for user email", () => {
        expect(isElementRendered("#cos-register-user-email-field")).toBe(true);

    });

    it("registration form should have a field for password", () => {
        expect(isElementRendered("#cos-register-user-password-field")).toBe(true);

    });

    it("registration form should have a field for password verification", () => {
        expect(isElementRendered("#cos-register-user-password-verify-field")).toBe(true);

    });

    it("registration form should have a button", () => {
        expect(isElementRendered("#cos-register-user-submit-button")).toBe(true);
    });

    it("registration form should have a recaptcha widget", () => {
        expect(isElementRendered("#cos-register-user-recaptcha")).toBe(true);
    });

    it("should have the button disabled when there is no reCaptcha response", () => {
        expect(htmlElements["#cos-register-user-submit-button"].disabled).toBe(true);
    })

    it("should show an alert when the user doesn't fill in a field", () => {
        component.formSubmitted = true;
        mapChanges();

        expect(isElementRendered("#cos-register-user-username-empty")).toBe(true);
        expect(isElementRendered("#cos-register-user-email-invalid")).toBe(true);
        expect(isElementRendered("#cos-register-user-password-empty")).toBe(true);
        expect(isElementRendered("#cos-register-user-password-verify-empty")).toBe(true);
    });

    it("should show an alert when the usernmane is too long", () => {
        component.formSubmitted = true;
        fillForm("supercalifragalisticackspealidocious",
            "test@test.com",
            "password",
            "password");
        mapChanges();
        expect(isElementRendered("#cos-register-user-username-too-long")).toBe(true);
    });

    it("should show an alert when the email is invalid", () => {
        component.formSubmitted = true;
        fillForm("test",
            "tester",
            "password",
            "password");
        mapChanges();
        expect(isElementRendered("#cos-register-user-email-invalid")).toBe(true);
    });

    it("should show an alert when the password is too short", () => {
        component.formSubmitted = true;
        fillForm("test",
            "test@test.com",
            "toosmal",
            "toosmal");
        mapChanges();
        expect(isElementRendered("#cos-register-user-password-too-short")).toBe(true);
    });

    it("should show an alert when the password is too long", () => {
        component.formSubmitted = true;
        fillForm("test",
            "test@test.com",
            "supercalifragalisticackspealidocious",
            "supercalifragalisticackspealidocious");
        mapChanges();
        expect(isElementRendered("#cos-register-user-password-too-long")).toBe(true);
    });

    it("should show an alert when the usernmane is not alphanumeric (change this)", () => {
        component.formSubmitted = true;
        fillForm("!!!",
            "test@test.com",
            "password",
            "password");
        mapChanges();
        expect(isElementRendered("#cos-register-user-username-invalid")).toBe(true);
    });

    it("should show an alert when the password is not alphanumeric (CHANGE THIS!)", () => {
        component.formSubmitted = true;
        fillForm("test",
            "test@test.com",
            "password!!",
            "password!!");
        mapChanges();
        expect(isElementRendered("#cos-register-user-password-invalid")).toBe(true);
    });

    it("should show an alert when the passwords don't match", () => {
        component.formSubmitted = true;
        fillForm("test",
            "test@test.com",
            "password",
            "password1");

        // Need to actually submit form.
        component.onSubmit(component.form.value);

        mapChanges();
        expect(isElementRendered("#cos-register-user-password-verify-no-match")).toBe(true);
    });

    it("should submit valid forms to the RegisterUserService", () => {
        let serviceSpy: jasmine.Spy;
        serviceSpy = spyOn(fixture.debugElement.injector.get(RegisterUserService), "registerUser")
            .and.returnValue(new Promise((resolve) => { resolve({}) }));

        // Need to spoof a recaptcha response
        component.captchaResponse = "response";

        fillForm("test",
            "test@test.com",
            "password",
            "password");

        component.onSubmit(component.form.value);
        expect(serviceSpy).toHaveBeenCalled();
    });

    it("should not submit invalid forms to the RegisterUserService", () => {
        let serviceSpy: jasmine.Spy;
        serviceSpy = spyOn(fixture.debugElement.injector.get(RegisterUserService), "registerUser")
            .and.returnValue(new Promise((resolve) => { resolve({}) }));

        fillForm("test",
            "testtest.com",
            "password",
            "password");

        component.onSubmit(component.form.value);
        expect(serviceSpy).toHaveBeenCalledTimes(0);
    });

    // TO-DO still need to decide on what to do after a user successfully registers.
});

/**
 * Consider re-doing some of these tests in the future. They work but the
 * implementation is a bit sloppy.
 */
describe("RegisterUserService", () => {
    let spy: jasmine.Spy;
    let userIsSignedOn: boolean = false;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                RegisterUserService,
                { provide: XHRBackend, useClass: MockBackend }]
        })
    });

    it("should send registration details to the server and return succesful response in a promise", async(
        inject([RegisterUserService, XHRBackend], (registerUserService: RegisterUserService,
            mockBackend: MockBackend) => {

            const mockResponse = JSON.stringify({
                result: {
                    email: "test@test.com",
                    username: "test",
                }
            });

            mockBackend.connections.subscribe((connection: any) => {
                connection.mockRespond(new Response(new ResponseOptions({
                    body: JSON.parse(mockResponse)
                })));
            });

            let response = registerUserService.registerUser("test", "test@test.com", "password", "response")
                .then((response) => {
                    expect(JSON.stringify(response)).toEqual(mockResponse);
                });


        })));

    it("should send registration details to the server and return error response in a promise", async(
        inject([RegisterUserService, XHRBackend], (registerUserService: RegisterUserService,
            mockBackend: MockBackend) => {

            const mockResponse = JSON.stringify({
                error: {
                    message: "Couldn't register user.",
                }
            });

            mockBackend.connections.subscribe((connection: any) => {
                connection.mockRespond(new Response(new ResponseOptions({
                    body: JSON.parse(mockResponse)
                })));
            });

            let response = registerUserService.registerUser("test", "test@test.com", "password", "response")
                .then((response) => {
                    expect(JSON.stringify(response)).toEqual(mockResponse);
                });
        })));

});