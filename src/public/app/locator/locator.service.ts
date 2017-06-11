import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";
import { GraffitiGetAPI } from "../../../../configurations/graffiti/graffiti-get/graffiti-get-api";

@Injectable()
export class LocatorService {
  private graffitiGetAPI: GraffitiGetAPI = new GraffitiGetAPI();

  constructor(private http: Http) { }

  /**
   * This method will be responsible for actually filtering the graffiti from
   * the database. Currently just sends a signal to retrieve 10 random graffiti
   * images from the database.
   *
   * @return - Observable that resolves to the server response.
   */
  public filterGraffiti(): Observable<JSON> {
    const headers: Headers = new Headers({ "Content-Type": "application/json" });
    const options = new RequestOptions({ headers });
    const payload: {} = {};

    try {
        this.graffitiGetAPI.validateParams(this.graffitiGetAPI.GRAFFITI_GET_FILTER,
                                            payload, "post");
    } catch (error) {
      return Observable.create((observer: any) => {
          observer.error(error);
      });
    }

    return this.http
      .post(this.graffitiGetAPI.GRAFFITI_GET_FILTER, payload, options)
      .map((response) => {
        return response.json();
      });
  }
}
