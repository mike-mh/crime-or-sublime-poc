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
export class RegisterUserComponent implements OnInit {
  public CAPTCHA_API_URL: string = "https://www.google.com/recaptcha/api.js";
  public captchaResponse: string;
  public isLoggedIn: boolean;
  public reCaptchaHeadElement: HTMLScriptElement = document.createElement("script");
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
      username: [null, Validators.compose([Validators.required,
                                           Validators.maxLength(10),
                                           Validators.pattern(/^[a-zA-Z0-9_]+$/)])],
      email: [null, Validators.compose([Validators.required, Validators.email])],
      password: [null, Validators.compose([Validators.required,
                                           Validators.maxLength(20),
                                           Validators.minLength(8),
                                           Validators.pattern(/^[a-zA-Z0-9_]+$/)])],
      passwordVerify: [null, Validators.compose([Validators.required])],
    });

    // These initialize recaptcha widget in window.
    window["verifyCallback" as any] = ((response: any) => zone.run(this.verifyCallback.bind(this, response)) as any);
    window["captchaExpiredCallback" as any] = (() => zone.run(this.recaptchaExpiredCallback.bind(this)) as any);

    this.sessionStatus = new SubjectSubscription(SessionService.sessionStatusEmitter, this.sessionUpdateCallback);
    SessionService.sessionStatusEmitter.subscribe(this.sessionUpdateCallback);
    this.isLoggedIn = SessionService.isSessionActive();

  }

  /**
   * Renders the reCaptcha to the form.
   *
   * TO-DO: See if there is an alternative to this.
   */
  public displayRecaptcha() {
    this.reCaptchaHeadElement.innerHTML = "";
    this.reCaptchaHeadElement.src = this.CAPTCHA_API_URL;
    this.reCaptchaHeadElement.async = true;
    this.reCaptchaHeadElement.defer = true;
    document.getElementById("cos-registration-form").appendChild(this.reCaptchaHeadElement);
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
   */
  public onSubmit(form: any): void {
    this.formSubmitted = true;
    this.passwordsMatch = (form.passwordVerify === form.password)

    if (!form.valid || !this.passwordsMatch) {
      console.log("Invalid form");
      return;
    }

    this.registerUserService
      .registerUser(form.userEmail, form.userUsername, form.userPassword, form.captchaResponse)
      .then((response) => {
        alert(JSON.stringify(response));
      }, (err) => {
        alert(JSON.stringify(err));
      });
  }

  /*
   * TO-DO: Everytime the user navigates away from the registration tab and
   *        back this places a fresh <script> tag in the head for the API.
   *        Considering this only occurs everytime the user selects the
   *        registration tag we should be safe if we ignore it but need to
   *        keep an eye on this.
   */
  public ngOnInit() {
    this.displayRecaptcha();
  }
}
