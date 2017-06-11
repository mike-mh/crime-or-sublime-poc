import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";

@Injectable()

/**
 * Handles all service calls neede by Login component.
 */
export class ProfileService {

  constructor(private http: Http) {
  }

}
