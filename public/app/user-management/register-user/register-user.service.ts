import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RegisterUserService
{
  private REGISTER_USER_URL: string = '/register-user';

  constructor(private http: Http) {}

  public registerUser(email: string,
                      username: string,
                      password: string,
                      reCaptchaResponse:String): Observable<JSON> {
    let registrationHeaders: Headers = new Headers({'Content-Type': 'application/json'});
    let registrationOptions = new RequestOptions({headers: registrationHeaders});
    let registrationPayload: Object = {
      params: {
        email: email,
        username: username,
        password: password,
        reCaptchaResponse: reCaptchaResponse
      }
    };

    console.log(registrationPayload);

    return this
             .http
             .post(this.REGISTER_USER_URL, registrationPayload, registrationOptions)
             .map(this.extractData);
  }

  private extractData(res: Response): JSON {
    let body = res.json();
    console.log(res);
    return body || { };
  }


}