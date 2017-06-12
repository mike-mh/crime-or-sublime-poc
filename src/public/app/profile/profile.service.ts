import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";
import { UserProfileAPI } from "../../../../configurations/user/user-profile/user-profile-api";

@Injectable()

/**
 * Handles all service calls neede by Login component.
 */
export class ProfileService {
  private userProfileAPI: UserProfileAPI = new UserProfileAPI();

  constructor(private http: Http) {
  }

  /**
   * Use this method to get the user's favourite graffiti list from the server.
   *
   * @return - Observable resolves to the server's response.
   */
  public getUserFavouriteGraffiti(): Observable<JSON> {
    const headers: Headers = new Headers({ "Content-Type": "application/json" });
    const options = new RequestOptions({ headers });
    const payload: {} = {};

    try {
        this.userProfileAPI.validateParams(this.userProfileAPI.USER_PROFILE_GET_FAVOURITES,
                                            payload, "get");
    } catch (error) {
      return Observable.create((observer: any) => {
          observer.error(error);
      });
    }

    return this.http
      .get(this.userProfileAPI.USER_PROFILE_GET_FAVOURITES, options)
      .map((response) => {
        return response.json();
      });
  }
}
