import { Component, OnDestroy } from "@angular/core";
import { Observer } from "rxjs/Observer";
import { SubjectSubscription } from "rxjs/SubjectSubscription";
import { ISessionDetails, SessionService } from "../shared/session/session.service";

@Component({
  providers: [SessionService],
  selector: "navbar",
  styleUrls: ["./navbar.component.css"],
  templateUrl: "./navbar.component.html",
})

/**
 * Contains the navbar component. Doesn't have any business logic yet.
 */
export class NavbarComponent implements OnDestroy {
  public isLoggedIn: boolean = false;
  private sessionStatus: SubjectSubscription<ISessionDetails>;
  private sessionUpdateCallback: Observer<ISessionDetails> = {
    complete: null,
    error: null,
    // This is the function that gets executed during a status update.
    next: (response) => {
      if (response.error) {
        return;
      }
      this.isLoggedIn = (response.email) ? true : false;
    },
  };

  constructor(private sessionService: SessionService) {
    this.sessionStatus = new SubjectSubscription(SessionService.sessionStatusEmitter, this.sessionUpdateCallback);
    SessionService.sessionStatusEmitter.subscribe(this.sessionUpdateCallback);
    this.isLoggedIn = SessionService.isSessionActive();
  }

  /**
   * Wrapper to end session using SessionService.
   */
  public endSession(): void {
    this.sessionService.endSession();
  }

  /**
   * Need to unsubscribe from the session emitter.
   */
  public ngOnDestroy(): void {
    // Manually remove observer from event emitter. Unsubscribe doesn't work.
    // Will need to come back to this and fix it.
    const observerIndex = SessionService.sessionStatusEmitter.observers.indexOf(this.sessionUpdateCallback);
    SessionService.sessionStatusEmitter.observers.splice(observerIndex, 1);
    this.sessionStatus.unsubscribe();
  }

}
