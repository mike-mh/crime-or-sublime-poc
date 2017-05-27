import { Component, NgZone, OnDestroy, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, ValidatorFn, Validators } from "@angular/forms";
import { Observer } from "rxjs/Observer";
import { SubjectSubscription } from "rxjs/SubjectSubscription";
import { ISessionDetails, SessionService } from "./../../shared/session/session.service";
import { RegisterUserService } from "./register-user.service";

@Component({
  providers: [RegisterUserService, SessionService],
  selector: "register-user",
  styleUrls: ["register-user.component.css"],
  templateUrl: "register-user.component.html",
})

/**
 * This class is responsible for controlling the user registration form.
 */
export class RegisterUserComponent implements OnInit, OnDestroy {
  public reCaptchaHeadElement: HTMLScriptElement = document.createElement("script");
  public CAPTCHA_API_URL: string = "https://www.google.com/recaptcha/api.js";
  public captchaResponse: string;
  public isLoggedIn: boolean;
  public form: FormGroup;
  public formSubmitted: boolean = false;
  public passwordsMatch: boolean = true;

  private sessionStatus: SubjectSubscription<ISessionDetails>;
  private sessionUpdateCallback: Observer<ISessionDetails> = {
    complete: null,
    error: null,
    next: (response) => {
      if (response.error) {
        return;
      }
      this.isLoggedIn = (response.email) ? true : false;
    },
  };

  /**
   * Adds necessarry data to window object to enable reCaptcha on the
   * registration form.
   *
   * @param registerUserService - Service to handle interfacing with server and
   *     business logic.
   */
  constructor(private formBuilder: FormBuilder,
    private registerUserService: RegisterUserService,
    private zone: NgZone,
    private sessionService: SessionService) {
    this.form = formBuilder.group({
      username: [null, Validators.compose([
        Validators.required,
        Validators.maxLength(10),
        Validators.pattern(/^[a-zA-Z0-9_]+$/)])],
      email: [null, Validators.compose([Validators.required, Validators.email])],
      password: [null, Validators.compose([
        Validators.required,
        Validators.maxLength(20),
        Validators.minLength(8),
        Validators.pattern(/^[a-zA-Z0-9_]+$/)])],
      passwordVerify: [null, [Validators.required]],
    });

    // These initialize recaptcha widget in window.
    window["verifyCallback" as any] = ((response: any) => zone.run(this.verifyCallback.bind(this, response)) as any);
    window["captchaExpiredCallback" as any] = (() => zone.run(this.recaptchaExpiredCallback.bind(this)) as any);

    this.sessionStatus = new SubjectSubscription(SessionService.sessionStatusEmitter, this.sessionUpdateCallback);
    SessionService.sessionStatusEmitter.subscribe(this.sessionUpdateCallback);
    this.isLoggedIn = SessionService.isSessionActive();

  }

  /**
   * Renders the reCaptcha widget to the form.
   *
   * TO-DO: See if there is an alternative to this.
   */
  public displayRecaptcha() {
    this.reCaptchaHeadElement.innerHTML = "";
    this.reCaptchaHeadElement.src = this.CAPTCHA_API_URL;
    this.reCaptchaHeadElement.async = true;
    this.reCaptchaHeadElement.defer = true;
    document.getElementById("cos-register-user-form").appendChild(this.reCaptchaHeadElement);
  }

  /**
   * Use as a callback for reCaptcha to verify user.
   */
  public verifyCallback(response: string): void {
    this.captchaResponse = response;
  }

  /**
   * Callback to configure recaptcha widget after user has been idle.
   */
  public recaptchaExpiredCallback(): void {
    this.captchaResponse = null;
  }

  /**
   * Submit handler for registration form. Gathers data from form and if valid
   * submits registration request to the server as per JSON-RPC schema.
   * 
   * @param form - The data input into the registration form by the user.
   */
  public onSubmit(form: any): void {
    this.formSubmitted = true;
    this.passwordsMatch = (form.passwordVerify === form.password)

    if (!this.form.valid || !this.passwordsMatch) {
      return;
    }

    this.registerUserService
      .registerUser(form.email, form.username, form.password, this.captchaResponse)
      .then((response) => {
        alert(JSON.stringify(response));
      }, (err) => {
        alert(JSON.stringify(err));
      });
  }

  /*
   * Attaches the reCaptcha element to the DOM.
   */
  public ngOnInit() {
    this.displayRecaptcha();
  }

  /**
   * Need to unsubscribe from session service.
   */
  public ngOnDestroy() {
    // Iterate through all script nodes and remove reCaptcha element. This a
    // work around for bug where 'createElement' leaves a dead script tag in
    // the head after this component is destroyed. Come back to this later and
    // try to find a better solution.
    for (let index = 0; index < document.getElementsByTagName('script').length; index++) {
      const script = document.getElementsByTagName('script')[index]
      if (script.async) {
        script.parentNode.removeChild(script);
        break;
      }
    }
    // Manually remove observer from event emitter. Unsubscribe doesn't work.
    // Will need to come back to this and fix it.
    const observerIndex = SessionService.sessionStatusEmitter.observers.indexOf(this.sessionUpdateCallback);
    SessionService.sessionStatusEmitter.observers.splice(observerIndex, 1);
    this.sessionStatus.unsubscribe();
  }
}
