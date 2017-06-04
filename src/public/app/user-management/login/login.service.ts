import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";
import { SessionService } from "../../shared/session/session.service";

@Injectable()

/**
 * Handles all service calls neede by Login component.
 */
export class LoginService {
  private readonly LOGIN_URL: string = "/submit-credentials";
  private sessionService: SessionService;

  constructor(private http: Http) {
    this.sessionService = new SessionService(http);
  }

  /**
   * Executes call to session service to validate credentials. May seem
   * needlessly modular but we should keep this class in case we need to
   * trigger more complex events through login.
   *
   * @param email - User email.
   * @param password - User password.
   *
   * @return - Promise that resolves to boolean. True if given credentials are
   *     correct, otherwise false.
   */
  public loginUser(email: string, password: string): Promise<JSON> {
    return this.sessionService.beginSession(email, password);
  }

}
