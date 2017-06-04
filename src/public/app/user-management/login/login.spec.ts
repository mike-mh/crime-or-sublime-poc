import { CommonModule } from "@angular/common";
import { DebugElement, EventEmitter } from "@angular/core";
import { async, ComponentFixture, inject, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { By } from "@angular/platform-browser";
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from "@angular/platform-browser-dynamic/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { ISessionDetails , SessionService } from "./../../shared/session/session.service";
import { LoginComponent } from "./login.component";
import { LoginService } from "./login.service";

describe("LoginComponent", () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let isLocked: boolean = false;

    const htmlElements: {} = {};
    const buttonIDs: string[] = [
        "#cos-login-form",
        "#cos-login-name-field",
        "#cos-login-password-field",
        "#cos-login-submit-button",
        "#cos-login-lockout-message",
    ];

    let userIsSignedOn = false;

    beforeEach(async(() => {
        const sessionServiceStub = {
            sessionIsActive: userIsSignedOn,
        };

        let spy: jasmine.Spy;

        // Spy on the actual static class since the method is static.
        spy = spyOn(SessionService, "isSessionActive").and.returnValue(userIsSignedOn);

        TestBed.configureTestingModule({
            declarations: [LoginComponent],
            imports: [
                CommonModule,
                ReactiveFormsModule,
                HttpModule,
            ],
        });

        TestBed.overrideComponent(LoginComponent, {
            set: {
                providers: [
                    LoginService,
                    { provide: SessionService, useValue: sessionServiceStub }],
            },
        }).compileComponents()
            .catch((error) => {
                return;
            });

    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        component.isLocked = isLocked;
        fixture.detectChanges();

        buttonIDs.map((id) => {
            const de = fixture.debugElement.query(By.css(id));

            htmlElements[id] = (de) ?
                de.nativeElement :
                undefined;
        });
    });

    it("should have a form", () => {
        fixture.detectChanges();
        expect(htmlElements["#cos-login-form"]).toBeTruthy();
    });

    it("should have a form that includes a email/username text input", () => {
        fixture.detectChanges();
        expect(htmlElements["#cos-login-name-field"]).toBeTruthy();
    });

    it("should have a form that includes a password password input", () => {
        fixture.detectChanges();
        expect(htmlElements["#cos-login-password-field"]).toBeTruthy();
    });

    it("should have a form that includes a submit button", () => {
        fixture.detectChanges();
        expect(htmlElements["#cos-login-submit-button"]).toBeTruthy();
    });

    it("the submit button should be disabled if email or password fields are empty", () => {
        // All of the HTML elements should be present, if not just fail.
        if (!htmlElements["#cos-login-password-field"] ||
            !htmlElements["#cos-login-name-field"] ||
            !htmlElements["#cos-login-submit-button"]) {
            expect(true).toBe(false);
        }

        expect(htmlElements["#cos-login-submit-button"].disabled).toBe(true);
        htmlElements["#cos-login-name-field"].value = "test";
        htmlElements["#cos-login-name-field"].dispatchEvent(new Event("input"));
        fixture.detectChanges();

        expect(htmlElements["#cos-login-submit-button"].disabled).toBe(true);

        htmlElements["#cos-login-name-field"].value = "";
        htmlElements["#cos-login-name-field"].dispatchEvent(new Event("input"));
        htmlElements["#cos-login-password-field"].value = "test";
        htmlElements["#cos-login-password-field"].dispatchEvent(new Event("input"));
        fixture.detectChanges();

        expect(htmlElements["#cos-login-submit-button"].disabled).toBe(true);

    });

    it("the submit button should be enabled if the email and password fields are filled", () => {
        htmlElements["#cos-login-name-field"].value = "test";
        htmlElements["#cos-login-name-field"].dispatchEvent(new Event("input"));
        htmlElements["#cos-login-password-field"].value = "test";
        htmlElements["#cos-login-password-field"].dispatchEvent(new Event("input"));
        fixture.detectChanges();
        expect(htmlElements["#cos-login-submit-button"].disabled).toBe(false);

        // Get ready for next test.
        isLocked = true;
    });

    it("should disable the form when the user fails to login too many times.", async(() => {
        fixture.detectChanges();
        expect(htmlElements["#cos-login-lockout-message"]).toBeTruthy();
        expect(htmlElements["#cos-login-submit-button"].disabled).toBe(true);

        // Now configure as if user was signed on.
        userIsSignedOn = true;
    }));

    it("should hide the form when there is an active user session", () => {
        fixture.detectChanges();
        expect(htmlElements["#cos-login-form"]).toBeFalsy();
    });

    // TO-DO write tests for how to handle login success and failure. Still
    // haven"t fully worked out what we want to do.
});

/**
 * Test of the login service may seem redundant but keeping this stub here for
 * now in the event that the service is given more responsibility later.
 */
describe("LoginService", () => {
    let spy: jasmine.Spy;
    const dummyPromise = new Promise((resolve) => { resolve(true); });

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [LoginService, SessionService],
        });
    });

    it("should call SessionService to verify a user's provided credentials.", () => {

        // Spy on the actual static class since the method is static.
        spy = spyOn(TestBed.get(LoginService).sessionService, "beginSession").and.returnValue(dummyPromise);

        const retrievedPromise = TestBed.get(LoginService).loginUser("test@test.com", "test");

        expect(retrievedPromise).toEqual(dummyPromise);
        expect(spy).toHaveBeenCalledTimes(1);
    });

});
