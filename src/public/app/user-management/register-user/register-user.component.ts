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

export class RegisterUserComponent implements OnInit {
  public CAPTCHA_API_URL: string = "https://www.google.com/recaptcha/api.js";
  public userEmail: string;
  public userUsername: string;
  public userPassword: string;
  public captchaResponse: string;
  public reCaptchaHeadElement: HTMLScriptElement = document.createElement("script");

  constructor(private registerUserService: RegisterUserService, private zone: NgZone ) {
    window["verifyCallback" as any] = ((response: any) => zone.run(this.verifyCallback.bind(this, response)) as any);
    window["captchaExpiredCallback" as any] = (() => zone.run(this.recaptchaExpiredCallback.bind(this)) as any);
  }

  /**
   * Unfortunately it is necessarry to manually render captcha
   */
  public displayRecaptcha() {
//    const doc: HTMLElement = <HTMLDivElement> document
//      .getElementById("registration-form");

    this.reCaptchaHeadElement.innerHTML = "";
    this.reCaptchaHeadElement.src = this.CAPTCHA_API_URL;
    this.reCaptchaHeadElement.async = true;
    this.reCaptchaHeadElement.defer = true;
    document.getElementById("registration-form").appendChild(this.reCaptchaHeadElement);
  }

  public verifyCallback(response: string): void {
    this.captchaResponse = response;
  }

  public recaptchaExpiredCallback(): void {
    this.captchaResponse = null;
  }

  public onSubmit(): void {
    this
      .registerUserService
        .registerUser(this.userEmail, this.userUsername, this.userPassword, this.captchaResponse)
          .subscribe((response) => {
            alert(JSON.stringify(response)); }, (err) => {
              alert(JSON.stringify(err)); });
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
