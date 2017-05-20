import { Component } from "@angular/core";
import { NgModel } from "@angular/forms";
import { LoginService } from "./login.service";

@Component({
  providers: [LoginService],
  templateUrl: "./login.component.html",
})

/**
 * Class controls users logging in. Hope to add social media login options
 * as well soon.
 */
export class LoginComponent {
  public userEmail: string;
  public userPassword: string;

  constructor(private loginService: LoginService) { }

  /**
   * Handler after login form is submitted.
   */
  public onSubmit(): void {
    this.loginService
      .loginUser(this.userEmail, this.userPassword)
      .subscribe((response) => {
        alert(JSON.stringify(response));
      }, (err) => {
        alert(JSON.stringify(err));
      });
  }
}
