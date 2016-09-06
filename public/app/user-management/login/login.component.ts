import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.service';

@Component({
  moduleId: module.id,
  templateUrl: './login.component.html',
  providers: [LoginService]
})

export class LoginComponent
{
  userEmail: string;
  userPassword: string;

  constructor(
    private loginService: LoginService
  ) { }

  onSubmit(): void
  {
    this
      .loginService
        .loginUser(this.userEmail, this.userPassword)
          .subscribe((response) => alert(JSON.stringify(response)), (err) => {alert(JSON.stringify(err))}, () => console.log('response recevied'));
  }
}