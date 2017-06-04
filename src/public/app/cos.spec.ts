import { DebugElement } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { By } from "@angular/platform-browser";
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from "@angular/platform-browser-dynamic/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { CoSComponent } from "./cos.component";
import { NavbarModule } from "./navbar/navbar.module";
import { SessionService } from "./shared/session/session.service";
import { LoginModule } from "./user-management/login/login.module";
import { RegisterUserModule } from "./user-management/register-user/register-user.module";

TestBed.initTestEnvironment(
  BrowserDynamicTestingModule, platformBrowserDynamicTesting());

describe("CoSComponent", () => {
  let component: CoSComponent;
  let fixture: ComponentFixture<CoSComponent>;
  let deNavbar: DebugElement;
  let deRouterOutlet: DebugElement;
  let elNavbar: HTMLElement;
  let elRouterOutlet: HTMLElement;

  let spy: jasmine.Spy;

  beforeEach(async(() => {
    const sessionServiceStub = {
      // Spoof the checkUserIsActive as an empty function. Only need to test that
      // it is called during initialization.
      checkUserIsActive: () => {
        return;
      },
    };

    spy = spyOn(sessionServiceStub, "checkUserIsActive").and.returnValue(undefined);

    TestBed.configureTestingModule({
      declarations: [CoSComponent],
      imports: [
        LoginModule,
        NavbarModule,
        RegisterUserModule,
        RouterTestingModule,
        FormsModule,
        HttpModule],
    });

    TestBed.overrideComponent(CoSComponent, {
      set: {
        providers: [{ provide: SessionService, useValue: sessionServiceStub }],
      },
    }).compileComponents()
      .catch((error) => {
        process.stderr.write(error.message);
      });

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoSComponent);
    component = fixture.componentInstance;
    deNavbar = fixture.debugElement.query(By.css("navbar"));
    deRouterOutlet = fixture.debugElement.query(By.css("router-outlet"));
    elNavbar = deNavbar.nativeElement;
    elRouterOutlet = deRouterOutlet.nativeElement;
  });

  it("should call session service to get current user only once.", () => {
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("should have a navbar", () => {
    fixture.detectChanges();
    expect(elNavbar.tagName).toEqual("NAVBAR");
  });

  it("should have a router-outlet", () => {

    fixture.detectChanges();
    expect(elRouterOutlet.tagName).toEqual("ROUTER-OUTLET");
  });

});
