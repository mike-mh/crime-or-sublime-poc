import { request } from "https";

export class AuthenticationEmailer {
    /**
     * Use to send an email to confirm a user's registration.
     *
     * @param toEmail - Destination email
     * @param username - User's alias
     * @param registrationKey - The registration key to use in verification URL
     *
     * @return - Void resolving promise
     */
    public static sendAuthenticationEmail(toEmail: string, username: string, registrationKey: string): Promise<void> {
        return new Promise((resolve, reject) => {
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
                reject(error);
            });

            postMarkRequest.write(JSON.stringify({
                From: this.REGISTRATION_EMAIL_ADDRESS,
                HtmlBody: "<h1>Hey " + username + "!</h1><br>" +
                "Click here to officially register: " +
                "<a href=\"https://crime-or-sublime.herokuapp.com/confirm-user-registration/" +
                username + "/" + registrationKey + "\"/> REGISTER </a><br>" +
                "<p>Please don\'t respond to this email.</p>",
                Subject: "Welcome " + username + "!",
                To: toEmail,
            }), () => {
                postMarkRequest.end();
                resolve();
            });

        })
        .then(() => {
            return;
        });
    }

    private static readonly POSTMARK_URL: string = "api.postmarkapp.com";
    private static readonly POSTMARK_SEND_EMAIL_PATH: string = "/email";
    private static readonly REGISTRATION_EMAIL_ADDRESS: string = "registration@crimeorsublime.com";

}
