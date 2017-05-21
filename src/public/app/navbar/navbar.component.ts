import { Component, OnDestroy } from "@angular/core";
import { SessionDetails, SessionService } from "../shared/session/session.service";
import { Observer } from "rxjs/Observer";
import { SubjectSubscription } from "rxjs/SubjectSubscription";

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
  private sessionStatus: SubjectSubscription<SessionDetails>;
  private sessionUpdateCallback: Observer<SessionDetails> = {
    next: (response) => {
      console.log("Yay!");
      if (response.error) {
        return;
      }
      this.isLoggedIn = (response.email) ? true : false;
    },
    error: null,
    complete: null,
  }

  constructor(private sessionService: SessionService) {
    this.sessionStatus = new SubjectSubscription(SessionService.SESSION_STATUS_EMITTER, this.sessionUpdateCallback);
    console.log(SessionService.SESSION_STATUS_EMITTER);
    SessionService.SESSION_STATUS_EMITTER.subscribe(this.sessionUpdateCallback);
    this.isLoggedIn = SessionService.isSessionActive();
    console.log("Navbar, is logged in: " + this.isLoggedIn);
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
    this.sessionStatus.unsubscribe();
  }

}
