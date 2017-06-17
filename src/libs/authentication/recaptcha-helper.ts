import { request } from "https";
import { stringify } from "query-string";
import "rxjs/add/observable/fromPromise";
import { Observable } from "rxjs/Observable";
import { CoSServerConstants } from "./../../cos-server-constants";

/**
 * Basic helper class for dealing with reCaptcha payloads.
 */
export class ReCaptchaHelper {

    /**
     * Verifies payload includes a correct reCaptcha response typically from a
     * new user registering.
     *
     * @param recaptchaResponse - Response from reCaptcha server.
     *
     * @return - Observable that either resolves or triggers an error.
     */
    public static verifyRecaptchaSuccess(recaptchaResponse: string): Observable<void> {
        return ReCaptchaHelper.makeValidationRequest(recaptchaResponse, process.env.RECAPTCHA_SECRET);
    }

    /**
     * Verifies payload from Android device includes a correct reCaptcha response.
     *
     * @param recaptchaResponse - Response from reCaptcha server.
     *
     * @return - Observable that either resolves or triggers an error.
     */
    public static verifyAndroidRecaptchaSuccess(recaptchaResponse: string): Observable<void> {
        return ReCaptchaHelper.makeValidationRequest(recaptchaResponse, process.env.ANDROID_RECAPTCHA_SECRET);
    }

    /**
     * Use this method to issue a validation request for a given reCaptcha.
     * 
     * @param recaptchaResponse - The reCaptcha response to validate
     * @param key - The key to validate the reCaptcha with.
     * 
     * @returns - Void resolving observable
     */
    private static makeValidationRequest(recaptchaResponse: string, key: string): Observable<void> {
        let responseData = "";
        const requestParams = stringify({
            response: recaptchaResponse,
            secret: key,
        });

        const options = {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            host: this.RECAPTCHA_VERIFY_URL,
            method: "POST",
            path: this.RECAPTCHA_VERIFY_PATH + "?" + requestParams,
            port: 443,
        };

        return Observable.fromPromise(
            new Promise((resolve, reject) => {

                const reCaptchaRequest = request(options, (response) => {
                    response.on("data", (chunk) => {
                        responseData += chunk;
                    });

                    response.on("end", () => {
                        const responseJson = JSON.parse(responseData);
                        if (responseJson.success) {
                            resolve();
                        }
                        reject(CoSServerConstants.RECAPTCHA_RESPONSE_FAILURE);
                    });
                });

                reCaptchaRequest.on("error", (error) => {
                    reject(CoSServerConstants.HTTP_SEND_ERROR);
                });

                reCaptchaRequest.end();

            }).then(() => {
                return;
            }));
    }

    private static readonly RECAPTCHA_VERIFY_URL: string = "www.google.com";
    private static readonly RECAPTCHA_VERIFY_PATH: string = "/recaptcha/api/siteverify";

}
