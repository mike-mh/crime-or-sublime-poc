import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";

@Injectable()
export class LoginService {
  private LOGIN_URL: string = "/submit-credentials";

  constructor(private http: Http) { }

  public loginUser(email: string, password: string): Observable<JSON> {
    const loginHeaders: Headers = new Headers({ "Content-Type": "application/json" });
    const loginOptions = new RequestOptions({ headers: loginHeaders });
    const registrationPayload: {} = {
      params: {
        email,
        password,
      },
    };

    return this.http.post(this.LOGIN_URL, registrationPayload, loginOptions)
      .map(this.extractData);
  }

  private extractData(res: Response): JSON {
    const body = res.json();
    return body || {};
  }
}
