import { Component, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observer } from "rxjs/Observer";
import { SubjectSubscription } from "rxjs/SubjectSubscription";
// import { SessionAPI } from "../../../../configurations/session/session-api";
import { ISessionDetails, SessionService } from "./../shared/session/session.service";
import { ProfileService } from "./profile.service";

@Component({
  providers: [ProfileService, SessionService],
  templateUrl: "./profile.component.html",
})

/**
 * Class controls users logging in. Hope to add social media login options
 * as well soon.
 */
export class ProfileComponent implements OnDestroy {
  public isLoggedIn: boolean = false;

  public sessionStatus: SubjectSubscription<ISessionDetails>;
  public sessionUpdateCallback: Observer<ISessionDetails> = {
    complete: null,
    error: null,
    next: (response) => {
      if (response.error) {
        return;
      }
      this.isLoggedIn = (response.email) ? true : false;
    },
  };

//  private sessionAPI: SessionAPI = new SessionAPI();
//  private responses = this.sessionAPI.responses;

  constructor(
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
    private sessionService: SessionService) {

    this.sessionStatus = new SubjectSubscription(SessionService.sessionStatusEmitter, this.sessionUpdateCallback);
    SessionService.sessionStatusEmitter.subscribe(this.sessionUpdateCallback);
    this.isLoggedIn = SessionService.isSessionActive();
  }

  /**
   * Need to unsubscribe from the session emitter.
   */
  public ngOnDestroy(): void {
    // Manually remove observer from event emitter. Unsubscribe doesn't work.
    const observerIndex = SessionService.sessionStatusEmitter.observers.indexOf(this.sessionUpdateCallback);
    SessionService.sessionStatusEmitter.observers.splice(observerIndex, 1);
    this.sessionStatus.unsubscribe();
  }
}
