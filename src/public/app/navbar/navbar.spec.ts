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
  let deLoginButton: DebugElement;
  let deLogoutButton: DebugElement;
  let deNavbar: DebugElement;
  let deRegisterButton: DebugElement;
  let elLoginButton: HTMLElement;
  let elLogoutButton: HTMLElement;
  let elNavbar: HTMLElement;
  let elRegisterButton: HTMLElement;

  let spy: jasmine.Spy;
  let sessionServiceStub: {
    sessionIsActive: boolean;
  }

  let userIsSignedOn = false;

  beforeEach(async(() => {
      console.log(userIsSignedOn);
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
        ],
    })

    TestBed.overrideComponent(NavbarComponent, {
      set: {
        providers: [{ provide: SessionService, useValue: sessionServiceStub }]
      }
    })
      .compileComponents()
      .catch((error) => {
        console.log(error);
      })

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    deLoginButton = fixture.debugElement.query(By.css("#fe-navbar-login-button"));
    deLogoutButton = fixture.debugElement.query(By.css("#fe-navbar-logout-button"));
    deNavbar = fixture.debugElement.query(By.css("nav"));
    deRegisterButton = fixture.debugElement.query(By.css("#fe-navbar-register-button"));
    elLoginButton = deLoginButton.nativeElement;
    elLogoutButton = deLogoutButton.nativeElement;
    elNavbar = deNavbar.nativeElement;
    elRegisterButton = deRegisterButton.nativeElement;
  })

  it("should check whether or not the user is signed in after initializing", () => {
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("should have a visible navbar", () => {
    fixture.detectChanges();
    expect(elNavbar.tagName).toEqual("NAV");    
  });

  it("when the user is logged off the login button is visible", () => {
    fixture.detectChanges();
    expect(elLoginButton.hidden).toBe(false);
  });

  it("when the user is logged off the registration button is visible", () => {
    fixture.detectChanges();
    expect(elRegisterButton.hidden).toBe(false);
  });

  it("when the user is logged off the logout button is invisible", () => {
    fixture.detectChanges();
    expect(elLogoutButton.hidden).toBe(true);

    // Now configure tests as if user is signed on.
    userIsSignedOn = true;
  });

  it("when the user is logged in the login button is invisible", () => {
    fixture.detectChanges();
    expect(elLoginButton.hidden).toBe(true);
  });

  it("when the user is logged in the registration button is invisible", () => {
    fixture.detectChanges();
    expect(elRegisterButton.hidden).toBe(true);
  });

  it("when the user is logged in the logout button is visible", () => {
    fixture.detectChanges();
    expect(elLogoutButton.hidden).toBe(false);
  });

});
