import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";
import { GraffitiGetAPI } from "../../../../configurations/graffiti/graffiti-get/graffiti-get-api";
import { UserRateAPI } from "../../../../configurations/user/user-rate/user-rate-api";

@Injectable()
export class RateService {
  private graffitiGetAPI: GraffitiGetAPI = new GraffitiGetAPI();
  private userRateAPI: UserRateAPI = new UserRateAPI();

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
    const payload: {} = {
      id,
      rating,
    };

    try {
        this.userRateAPI.validateParams(this.userRateAPI.USER_RATE,
                                            {id, rating: true}, "post");
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

}
