import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { RegisterUserService } from './register-user.service';
import 'rxjs/add/operator/map';

@Component({
  selector: 'register-user',
  moduleId: module.id,
  templateUrl:'register-user.component.html',
  styleUrls: ['register-user.component.css'],
  providers: [RegisterUserService]
})

export class RegisterUserComponent implements OnInit
{
  CAPTCHA_API_URL: string = 'https://www.google.com/recaptcha/api.js';
  userEmail: string;
  userUsername: string;
  userPassword: string;
  captchaResponse: string;
  reCaptchaHeadElement: HTMLScriptElement = document.createElement('script');

  constructor( 
    private registerUserService: RegisterUserService,
    private zone: NgZone
    ) {
    window[<any>"verifyCallback"] = <any>((response: any) => zone.run(this.verifyCallback.bind(this, response)));
    window[<any>"captchaExpiredCallback"] = <any>(() => zone.run(this.recaptchaExpiredCallback.bind(this)));
  }

  /*
   * TO-DO: Everytime the user navigates away from the registration tab and
   *        back this places a fresh <script> tag in the head for the API.
   *        Considering this only occurs everytime the user selects the
   *        registration tag we should be safe if we ignore it but need to
   *        keep an eye on this.   
   */
  ngOnInit() {
    this.displayRecaptcha();
  }

  /**
   * Unfortunately it is necessarry to manually render captcha
   */
  displayRecaptcha() {
    let doc: HTMLElement = <HTMLDivElement>document
      .getElementById('registration-form');

    this.reCaptchaHeadElement;
    this.reCaptchaHeadElement.innerHTML = '';
    this.reCaptchaHeadElement.src = this.CAPTCHA_API_URL;
    this.reCaptchaHeadElement.async = true;
    this.reCaptchaHeadElement.defer = true;
    doc.appendChild(this.reCaptchaHeadElement);
  }

  verifyCallback(response: string):void {
    this.captchaResponse = response;
  }

  recaptchaExpiredCallback(): void {
    this.captchaResponse = null;
  }

  onSubmit(): void
  {
    this
      .registerUserService
        .registerUser(this.userEmail, this.userUsername, this.userPassword, this.captchaResponse)
          .subscribe((response) => alert(JSON.stringify(response)), (err) => {alert(JSON.stringify(err))}, () => console.log('response recevied'));
  }
}