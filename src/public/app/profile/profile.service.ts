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

  /**
   * Use this method to remove a graffiti from the user's favourite list.
   *
   * @param id - The url of the graffiti to remove.
   *
   * @return - Observable resolves to the server's response.
   */
  public removeGraffitiFromFavourites(id: string): Observable<JSON> {
    const headers: Headers = new Headers({ "Content-Type": "application/json" });
    const options = new RequestOptions({ headers });
    const payload: {} = {
      id,
    };

    try {
        this.userProfileAPI.validateParams(this.userProfileAPI.USER_PROFILE_REMOVE_FAVOURITE,
                                            payload, "post");
    } catch (error) {
      return Observable.create((observer: any) => {
          observer.error(error);
      });
    }

    return this.http
      .post(this.userProfileAPI.USER_PROFILE_REMOVE_FAVOURITE, payload, options)
      .map((response) => {
        return response.json();
      });
  }

}
