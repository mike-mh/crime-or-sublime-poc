import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LoginService
{
  private LOGIN_URL: string = '/submit-credentials';

  constructor(private http: Http) {}

  public loginUser(email: string, password: string): Observable<JSON> {
    let loginHeaders: Headers = new Headers({'Content-Type': 'application/json'});
    let loginOptions = new RequestOptions({headers: loginHeaders});
    let registrationPayload: Object = {
      params: {
        email: email,
        password: password
      }
    };

    console.log(registrationPayload);

    return this.http
             .post(this.LOGIN_URL, registrationPayload, loginOptions)
               .map(this.extractData);
  }

  private extractData(res: Response): JSON {
    let body = res.json();
    return body.data || {};
  }
}