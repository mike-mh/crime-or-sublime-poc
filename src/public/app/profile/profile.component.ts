import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observer } from "rxjs/Observer";
import { SubjectSubscription } from "rxjs/SubjectSubscription";
import { ISessionDetails, SessionService } from "./../shared/session/session.service";
import { ProfileService } from "./profile.service";

@Component({
  providers: [ProfileService, SessionService],
  styleUrls: ["./profile.component.css"],
  templateUrl: "./profile.component.html",
})

/**
 * Class controls users logging in. Hope to add social media login options
 * as well soon.
 */
export class ProfileComponent implements OnDestroy, OnInit {
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

  public userFavourites: any = [];

  constructor(
    private profileService: ProfileService,
    private sessionService: SessionService) {

    this.sessionStatus = new SubjectSubscription(SessionService.sessionStatusEmitter, this.sessionUpdateCallback);
    SessionService.sessionStatusEmitter.subscribe(this.sessionUpdateCallback);
    this.isLoggedIn = SessionService.isSessionActive();
  }

  /**
   * Use this to remove a graffiti from the user's favourites.
   *
   * @param id - The id of the graffiti to remove
   */
   public removeGraffiti(id: string): void {
    this.profileService.removeGraffitiFromFavourites(id)
      .subscribe(
        () => {
          this.userFavourites = this.userFavourites.filter((graffiti: string) => {
            return graffiti !== id;
          });
        });
   }

  /**
   * Fetch the user's favourites.
   */
  public ngOnInit(): void {
    this.profileService.getUserFavouriteGraffiti()
      .subscribe(
        (response: any) => {
          response.result.map((document: any) => {
            // IDs are exposed with response. Look into if this is a security risk.
            this.userFavourites.push(document.graffitiUrl);
          });
        });
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
