import { CommonModule } from "@angular/common";
import { EventEmitter } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { DebugElement } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterTestingModule } from '@angular/router/testing';
import { LoginModule } from "./../user-management/login/login.module";
import { NavbarComponent } from "./navbar.component";
import { RegisterUserModule } from "./../user-management/register-user/register-user.module";
import { SessionService, ISessionDetails } from "./../shared/session/session.service";

describe("NavbarComponent", () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let elNavbar: HTMLElement;


  let htmlElements: {} = {};
  let buttonIDs: string[] = [
    "#cos-navbar-nav",
    "#cos-navbar-login-button",
    "#cos-navbar-logout-button",
    "#cos-navbar-register-button"
  ];

  let spy: jasmine.Spy;
  let sessionServiceStub: {
    sessionIsActive: boolean;
  }

  let userIsSignedOn = false;

  beforeEach(async(() => {
    let sessionServiceStub = {
      sessionIsActive: userIsSignedOn,
    }

    // Spy on the actual static class since the method is static.
    spy = spyOn(SessionService, "isSessionActive").and.returnValue(userIsSignedOn);

    TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      imports: [
        LoginModule,
        RegisterUserModule,
        RouterTestingModule,
        FormsModule,
        CommonModule
      ],
    })

    TestBed.overrideComponent(NavbarComponent, {
      set: {
        providers: [{ provide: SessionService, useValue: sessionServiceStub }]
      }
    }).compileComponents()
      .catch((error) => {
        console.log(error);
      })

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    for (let id of buttonIDs) {
      let de = fixture.debugElement.query(By.css(id));

      htmlElements[id] = (de) ?
        de.nativeElement :
        undefined;
    }
  })

  it("should check whether or not the user is signed in after initializing", () => {
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("should know when the user is logged off", () => {
    expect(component.isLoggedIn).toBe(false);
  });

  it("should have a visible navbar", () => {
    fixture.detectChanges();
    expect(htmlElements["#cos-navbar-nav"]).toBeTruthy();
  });

  it("when the user is logged off the login button is visible", () => {
    fixture.detectChanges();
    expect(htmlElements["#cos-navbar-login-button"]).toBeTruthy();
  });

  it("when the user is logged off the registration button is visible", () => {
    fixture.detectChanges();
    expect(htmlElements["#cos-navbar-register-button"]).toBeTruthy();
  });

  it("when the user is logged off the logout button is invisible", () => {
    fixture.detectChanges();
    expect(htmlElements["#cos-navbar-logout-button"]).toBeFalsy();

    // Now configure tests as if user is signed on.
    userIsSignedOn = true;
  });

  it("should know when the user is logged in", () => {
    expect(component.isLoggedIn).toBe(true);
  });

  it("when the user is logged in the login button is invisible", () => {
    fixture.detectChanges();
    expect(htmlElements["#cos-navbar-login-button"]).toBeFalsy();
  });

  it("when the user is logged in the registration button is invisible", () => {
    fixture.detectChanges();
    expect(htmlElements["#cos-navbar-register-button"]).toBeFalsy();
  });

  it("when the user is logged in the logout button is visible", () => {
    fixture.detectChanges();
    expect(htmlElements["#cos-navbar-logout-button"]).toBeTruthy();
  });

  it("should update automatically after a user signs out", () => {
    SessionService.sessionStatusEmitter.emit({});
    expect(component.isLoggedIn).toBe(false);
  });

  it("should update automatically after a user signs in", () => {
    SessionService.sessionStatusEmitter.emit({ email: "test@test.com" });
    expect(component.isLoggedIn).toBe(true);
  });

  it("should unsubscribe from the session service when destroyed", () => {
    expect(SessionService.sessionStatusEmitter.observers.length).toEqual(1)
    component.ngOnDestroy();
    expect(SessionService.sessionStatusEmitter.observers.length).toEqual(0)
  })
});
