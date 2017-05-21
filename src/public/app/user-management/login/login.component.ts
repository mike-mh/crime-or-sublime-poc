import { Component, OnDestroy } from "@angular/core";
import { NgModel } from "@angular/forms";
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

  constructor(private loginService: LoginService, private sessionService: SessionService) {
    this.sessionStatus = new SubjectSubscription(SessionService.sessionStatusEmitter, this.sessionUpdateCallback);
    SessionService.sessionStatusEmitter.subscribe(this.sessionUpdateCallback);
    this.isLoggedIn = SessionService.isSessionActive();
  }

  /**
   * Handler after login form is submitted.
   */
  public onSubmit(): void {
    this.loginService
      .loginUser(this.userEmail, this.userPassword)
      .subscribe((response) => {
        this.sessionService.checkUserIsActive();
      }, (err) => {
        alert(JSON.stringify(err));
      });
  }

  /**
   * Need to unsubscribe from the session emitter.
   */
  public ngOnDestroy(): void {
    this.sessionStatus.unsubscribe();
  }
}
