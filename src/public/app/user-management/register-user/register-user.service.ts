import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/toPromise";
import { UserRegsiterAPI } from "../../../../../configurations/user/user-register/user-register-api";


@Injectable()
export class RegisterUserService {
  private userRegsiterAPI: UserRegsiterAPI = new UserRegsiterAPI();

  constructor(private http: Http) { }

  public registerUser(
    username: string,
    email: string,
    password: string,
    captcha: string): Promise<JSON> {
    const registrationHeaders: Headers = new Headers({ "Content-Type": "application/json" });
    const registrationOptions = new RequestOptions({ headers: registrationHeaders });
    const registrationPayload: {} = {
        email,
        password,
        captcha,
        username,
    };

    console.log();

    try {
        this.userRegsiterAPI.validateParams(this.userRegsiterAPI.USER_REGISTER_SUBMIT_PATH,
                                            registrationPayload, "post");
    } catch(error) {
      console.log(error.message);
      return Promise.reject(error);
    }

    return this.http
      .post(this.userRegsiterAPI.USER_REGISTER_SUBMIT_PATH, registrationPayload, registrationOptions)
      .toPromise()
      .then((response) => {
        return response.json();
      });
  }
}
