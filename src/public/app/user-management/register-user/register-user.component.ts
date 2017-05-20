import { Component, NgZone, OnDestroy, OnInit } from "@angular/core";
import { NgModel } from "@angular/forms";
import "rxjs/add/operator/map";
import { RegisterUserService } from "./register-user.service";

@Component({
  providers: [RegisterUserService],
  selector: "register-user",
  styleUrls: ["register-user.component.css"],
  templateUrl: "register-user.component.html",
})

/**
 * This class is responsible for controlling the user registration form.
 */
export class RegisterUserComponent implements OnInit {
  public CAPTCHA_API_URL: string = "https://www.google.com/recaptcha/api.js";
  public userEmail: string;
  public userUsername: string;
  public userPassword: string;
  public confirmPassword: string;
  public captchaResponse: string;
  public reCaptchaHeadElement: HTMLScriptElement = document.createElement("script");

  /**
   * Adds necessarry data to window object to enable reCaptcha on the
   * registration form.
   * 
   * @param registerUserService - Service to handle interfacing with server and
   *     business logic.
   */
  constructor(private registerUserService: RegisterUserService, private zone: NgZone) {
    window["verifyCallback" as any] = ((response: any) => zone.run(this.verifyCallback.bind(this, response)) as any);
    window["captchaExpiredCallback" as any] = (() => zone.run(this.recaptchaExpiredCallback.bind(this)) as any);
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
    document.getElementById("registration-form").appendChild(this.reCaptchaHeadElement);
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
  public onSubmit(): void {
    if (this.userPassword !== this.confirmPassword) {
      alert("Passwords don't match.");
      return;
    }
    this.registerUserService
      .registerUser(this.userEmail, this.userUsername, this.userPassword, this.captchaResponse)
      .subscribe((response) => {
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
