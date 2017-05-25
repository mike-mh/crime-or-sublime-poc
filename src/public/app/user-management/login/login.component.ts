import { Component, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Observer } from "rxjs/Observer";
import { SubjectSubscription } from "rxjs/SubjectSubscription";
import { ISessionDetails, SessionService } from "./../../shared/session/session.service";
import { LoginService } from "./login.service";

@Component({
  providers: [LoginService, SessionService],
  templateUrl: "./login.component.html",
})

/**
 * Class controls users logging in. Hope to add social media login options
 * as well soon.
 */
export class LoginComponent implements OnDestroy {
  public userEmail: string;
  public userPassword: string;
  public isLoggedIn: boolean = false;
  public form: FormGroup;

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

  constructor(private formBuilder: FormBuilder,
    private loginService: LoginService,
    private sessionService: SessionService) {
    this.form = formBuilder.group({
      "email": [null, Validators.required],
      "password": [null, Validators.required],
    });

    this.sessionStatus = new SubjectSubscription(SessionService.sessionStatusEmitter, this.sessionUpdateCallback);
    SessionService.sessionStatusEmitter.subscribe(this.sessionUpdateCallback);
    this.isLoggedIn = SessionService.isSessionActive();
  }

  /**
   * Handler after login form is submitted.
   * 
   * TO-DO: Add on handlers for server error and unsuccessful login.
   * 
   * @param form - The form submitted from the loging component html.
   */
  public onSubmit(form: any): void {
    this.loginService
      .loginUser(form.email, form.password)
      .then((result) => {
        // Reset the form if successful
        if (result) {
          this.form.reset();
        }
        console.log(result);
      })
      .catch((error) => {
        console.log(error.message);
      })
  }

  /**
   * Need to unsubscribe from the session emitter.
   */
  public ngOnDestroy(): void {
    this.sessionStatus.unsubscribe();
  }
}
