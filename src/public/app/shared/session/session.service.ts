import { EventEmitter, Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import "rxjs/add/operator/toPromise";
import { Observable } from "rxjs/Observable";

/**
 * Use this to store data from server responses.
 * 
 * TO-DO: Include username.
 */
export interface ISessionDetails {
    email?: string;
    error?: boolean;
}

@Injectable()

/**
 * Use this to manage user sessions. May want to consider changing this from a
 * service later. Follows an observer pattern. Whenever an update happens to
 * the session it notifies all observers.
 */
export class SessionService {
    // Use these to store session data and emit that data.
    public static sessionStatusEmitter: EventEmitter<ISessionDetails> = new EventEmitter();
    private static sessionIsActive: boolean = false;

    /**
     * Simple getter method to determine if session is active.
     *
     * @return - Boolean value of if session is active.
     */
    public static isSessionActive(): boolean {
        return SessionService.sessionIsActive;
    }

    private static readonly GET_USER_URL = "/get-user";
    private static readonly BEGIN_SESSION = "/submit-credentials";
    private static readonly END_SESSION = "/logout";

    constructor(private http: Http) { }

    /**
     * Makes call to server to determine if a user is currently active.
     * Notifies all observers of status.
     */
    public checkUserIsActive(): void {
        const headers: Headers = new Headers({ "Content-Type": "application/json" });
        this.http.get(SessionService.GET_USER_URL, headers)
            .toPromise()
            .then((res) => {
                const details: ISessionDetails = {};
                if (res.json().error || !res.json().result) {
                    details.error = true;
                } else {
                    details.email = res.json().result.email;
                }
                SessionService.sessionIsActive = !!details.email;
                SessionService.sessionStatusEmitter.emit(details);

            });
    }

    /**
     * Sends request to terminate the session and broadcasts result.
     */
    public endSession(): void {
        const headers: Headers = new Headers({ "Content-Type": "application/json" });
        const options = new RequestOptions({ headers });
        this.http.get(SessionService.END_SESSION, headers)
            .toPromise()
            .then((res) => {
                const details: ISessionDetails = {};
                if (res.json().error || !res.json().result) {
                    details.error = true;
                } else {
                    details.email = null;
                }
                SessionService.sessionIsActive = false;

                SessionService.sessionStatusEmitter.emit(details);
            });
    }

    /**
     * Use this method to log a user in with the given credentials. Will
     * emit results whether successful or not.
     * 
     * TO-DO: Add option to login with username
     * 
     * @param email - User email
     * @param password - User password
     * 
     * @returns - Promise that resolves to boolean for whether or not
     *     credentials were correct. This promise needs to resolve so that
     *     modules that use this method can execute conditionals.
     */
    public beginSession(email: string, password: string): Promise<boolean> {
        if (SessionService.isSessionActive()) {
            return;
        }

        const headers: Headers = new Headers({ "Content-Type": "application/json" });
        const options = new RequestOptions({ headers });
        const credentialsPayload: {} = {
            params: {
                email,
                password,
            },
        }

        return this.http.post(SessionService.BEGIN_SESSION, credentialsPayload, options)
            .toPromise()
            .then((res) => {
                const details: ISessionDetails = {};
                let validCredentials;
                if (res.json().error || !res.json().result) {
                    details.error = true;
                } else {
                    details.email = res.json().result.email;
                }

                SessionService.sessionIsActive = !!details.email;
                SessionService.sessionStatusEmitter.emit(details);

                return SessionService.sessionIsActive;
            });

    }

}
