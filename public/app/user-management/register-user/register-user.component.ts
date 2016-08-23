import { Component, OnInit } from '@angular/core';
import { RegisterUserService } from './register-user.service';
import 'rxjs/add/operator/map';

@Component({
  selector: 'register-user',
  moduleId: module.id,
  templateUrl:'register-user.component.html',
  styleUrls: ['register-user.component.css'],
  providers: [RegisterUserService]
})

export class RegisterUserComponent
{
  userEmail: string;
  userUsername: string;
  userPassword: string;


  constructor( 
    private registerUserService: RegisterUserService
    ) {  }

  onSubmit(): void
  {
    this
      .registerUserService
        .registerUser(this.userEmail, this.userUsername, this.userPassword)
          .subscribe((response) => alert(JSON.stringify(response)), (err) => {alert(err)}, () => alert('COMPLETE!'));
  }
}