import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";

@Injectable()
export class RegisterUserService {
  private readonly REGISTER_USER_URL: string = "/register-user";

  constructor(private http: Http) { }

  public registerUser(
    email: string,
    username: string,
    password: string,
    reCaptchaResponse: string): Observable<JSON> {
    const registrationHeaders: Headers = new Headers({ "Content-Type": "application/json" });
    const registrationOptions = new RequestOptions({ headers: registrationHeaders });
    const registrationPayload: {} = {
      params: {
        email,
        password,
        reCaptchaResponse,
        username,
      },
    };

    return this.http
      .post(this.REGISTER_USER_URL, registrationPayload, registrationOptions)
      .map(this.extractData);
  }

  private extractData(res: Response): JSON {
    const body = res.json();
    return body || {};
  }

}
