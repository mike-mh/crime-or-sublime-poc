import { Component, OnDestroy } from "@angular/core";
import { NgModel } from "@angular/forms";
import { Observer } from "rxjs/Observer";
import { SubjectSubscription } from "rxjs/SubjectSubscription";
import { LoginService } from "./login.service";
import { SessionDetails, SessionService } from "./../../shared/session/session.service";

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
  private sessionStatus: SubjectSubscription<SessionDetails>;
  private sessionUpdateCallback: Observer<SessionDetails> = {
    next: (response) => {
      console.log("I got called!");
      if (response.error) {
        return;
      }
      this.isLoggedIn = (response.email) ? true : false;
    },
    error: null,
    complete: null,
  }

  constructor(private loginService: LoginService, private sessionService: SessionService) {
    this.sessionStatus = new SubjectSubscription(SessionService.SESSION_STATUS_EMITTER, this.sessionUpdateCallback);
    SessionService.SESSION_STATUS_EMITTER.subscribe(this.sessionUpdateCallback);
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
