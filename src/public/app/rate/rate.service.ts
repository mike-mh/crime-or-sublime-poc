import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";
import { GraffitiGetAPI } from "../../../../configurations/graffiti/graffiti-get/graffiti-get-api";
import { UserProfileAPI } from "../../../../configurations/user/user-profile/user-profile-api";
import { UserRateAPI } from "../../../../configurations/user/user-rate/user-rate-api";

@Injectable()
export class RateService {
  private graffitiGetAPI: GraffitiGetAPI = new GraffitiGetAPI();
  private userRateAPI: UserRateAPI = new UserRateAPI();
  private userProfileAPI: UserProfileAPI = new UserProfileAPI();

  constructor(private http: Http) { }

  /**
   * Use this to retrieve a random graffiti to display.
   *
   * @return - Observable resolves to response.
   */
  public getRandomGraffiti(): Observable<JSON> {
    const headers: Headers = new Headers({ "Content-Type": "application/json" });
    const options = new RequestOptions({ headers });

    const payload: {} = {};

    try {
        this.graffitiGetAPI.validateParams(this.graffitiGetAPI.GRAFFITI_GET_RANDOM,
                                            payload, "get");
    } catch (error) {
      Observable.create((observer: any) => {
        observer.error(error);
      });

      return;
    }

    return this.http
      .get(this.graffitiGetAPI.GRAFFITI_GET_RANDOM, options)
      .map((response) => {
        return response.json();
      });
  }

  /**
   * Use this to retrieve a random graffiti to display.
   *
   * @param id - The URL associated with a graffiti
   * @param rating - The rating a user assoicates with a graffiti
   *
   * @return - Observable resolves to response.
   */
  public rateGraffiti(id: string, rating: boolean): Observable<JSON> {
    const headers: Headers = new Headers({ "Content-Type": "application/json" });
    const options = new RequestOptions({ headers });
    const ratingValidator = (!rating) ?
      true :
      rating;

    const payload: {} = {
      id,
      rating,
    };

    try {
        this.userRateAPI.validateParams(this.userRateAPI.USER_RATE,
                                            { id, rating }, "post");
    } catch (error) {
      return Observable.create((observer: any) => {
        observer.error(error);
      });
    }

    return this.http
      .post(this.userRateAPI.USER_RATE, payload, options)
      .map((response) => {
        return response.json();
      });
  }

  /**
   * Use this to add a graffiti to user's favourites list.
   *
   * @param id - The URL associated with a graffiti
   *
   * @return - Observable resolves to response.
   */
  public favouriteGraffiti(id: string): Observable<JSON> {
    const headers: Headers = new Headers({ "Content-Type": "application/json" });
    const options = new RequestOptions({ headers });
    const payload: {} = {
      id,
    };

    try {
        this.userProfileAPI.validateParams(this.userProfileAPI.USER_PROFILE_ADD_FAVOURITE,
                                            { id }, "post");
    } catch (error) {
      return Observable.create((observer: any) => {
        observer.error(error);
      });
    }

    return this.http
      .post(this.userProfileAPI.USER_PROFILE_ADD_FAVOURITE, payload, options)
      .map((response) => {
        return response.json();
      });
  }

}
