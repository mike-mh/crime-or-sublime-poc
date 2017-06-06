import { request } from "https";
import { compileFile } from "pug";
import "rxjs/add/observable/fromPromise";
import { Observable } from "rxjs/Observable";
import { CoSServerConstants } from "./../../cos-server-constants";

/**
 * Utility class to send emails to users after they have registered with CoS.
 * Users should be able to click a link in the email sent and register with
 * CoS.
 */
export class AuthenticationEmailer {

    /**
     * Use to send an email to confirm a user's registration.
     *
     * @param toEmail - Destination email
     * @param username - User's alias
     * @param email - User's email
     * @param registrationKey - The registration key to use in verification URL
     *
     * @return - Observable that resolves to void or throws an error.
     */
    public static sendAuthenticationEmail(
        toEmail: string,
        username: string,
        registrationKey: string): Observable<void> {

        return Observable.fromPromise(
            new Promise((resolve, reject) => {
                // Use pug to compile the email and set values in its delimiters.
                //
                // TO-DO: Unfortunately, Pug stopped interpolation with attributes.
                //     need to manually add the link to the HTML string. If anyone
                //     finds a solution to this, remind me to buy you ice cream.
                const url = "https://crime-or-sublime.herokuapp.com/user-register-confirm/" +
                    username + "/" + registrationKey;
                let responseEmail = AuthenticationEmailer.compileEmail({
                    username,
                });

                responseEmail += "<a href=" + url + ">Register here!</a>";

                const options = {
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "X-Postmark-Server-Token": process.env.POSTMARK_KEY,
                    },
                    host: this.POSTMARK_URL,
                    method: "POST",
                    path: this.POSTMARK_SEND_EMAIL_PATH,
                    port: 443,
                };

                const postMarkRequest = request(options);

                postMarkRequest.on("error", (error) => {
                    reject(CoSServerConstants.HTTP_SEND_ERROR);
                });

                postMarkRequest.on("end", () => {
                    resolve();
                });

                // Need to remake the HTML file for the email to make it look nicer.
                postMarkRequest.write(JSON.stringify({
                    From: this.REGISTRATION_EMAIL_ADDRESS,
                    HtmlBody: responseEmail,
                    Subject: "Welcome " + username + "!",
                    To: toEmail,
                }), () => {
                    postMarkRequest.end();
                });

            }).then(() => {
                return;
            }));
    }

    private static readonly PATH_TO_EMAIL_PUG = __dirname + "/registration-email.pug";
    private static readonly POSTMARK_URL: string = "api.postmarkapp.com";
    private static readonly POSTMARK_SEND_EMAIL_PATH: string = "/email";
    private static readonly REGISTRATION_EMAIL_ADDRESS: string = "registration@crimeorsublime.com";

    private static compileEmail = compileFile(AuthenticationEmailer.PATH_TO_EMAIL_PUG);
}
