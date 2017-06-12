import { Component, OnDestroy } from "@angular/core";
import { Observer } from "rxjs/Observer";
import { SubjectSubscription } from "rxjs/SubjectSubscription";
import { Subscription } from "rxjs/Subscription";
import { ISessionDetails, SessionService } from "./../shared/session/session.service";
import { RateService } from "./rate.service";

@Component({
    providers: [RateService, SessionService],
    selector: "rate",
    styleUrls: ["./rate.component.css"],
    templateUrl: "./rate.component.html",
})

/**
 * Contains the navbar component. Doesn't have any business logic yet.
 */
export class RateComponent implements OnDestroy {
    public isLoggedIn: boolean = false;
    public displayedGraffiti: string;
    private sessionStatus: SubjectSubscription<ISessionDetails>;
    private getRandomGraffitiSubscription: Subscription;

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

    constructor(private rateService: RateService, private sessionService: SessionService) {
        this.sessionStatus = new SubjectSubscription(SessionService.sessionStatusEmitter, this.sessionUpdateCallback);
        SessionService.sessionStatusEmitter.subscribe(this.sessionUpdateCallback);
        this.isLoggedIn = SessionService.isSessionActive();

        this.rateService.getRandomGraffiti().subscribe(
            (graffiti: any) => {
                this.displayedGraffiti = graffiti.url;
            });
    }

    /**
     * Use this to generate a new random graffiti image.
     */
    public getRandomGraffiti(): void {
        this.rateService.getRandomGraffiti().subscribe(
            (graffiti: any) => {
                this.displayedGraffiti = graffiti.url;
            });
    }

    /**
     * Use this to rate a graffiti.
     *
     * @param rating - The rating assigned to a graffiti
     */
    public rateGraffiti(rating: boolean) {
        this.rateService.rateGraffiti(this.displayedGraffiti, rating).subscribe(
            (response: any) => {
                this.rateService.getRandomGraffiti().subscribe(
                    (graffiti: any) => {
                        this.displayedGraffiti = graffiti.url;
                    });
            },
            (error: any) => {
                return;
            },
        );
    }

    /**
     * Use this to add a graffiti to a user's favourites.
     */
    public addFavourite(): void {
        this.rateService.favouriteGraffiti(this.displayedGraffiti).subscribe(
            (response: any) => {
                // TO-DO: Figure out what to do on success or error.
            },
            (error: any) => {
                return;
            },
        );
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
