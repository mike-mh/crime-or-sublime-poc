import { NgModule } from "@angular/core";
import { RegisterUserModule } from "./register-user/register-user.module";

@NgModule({
    exports: [RegisterUserModule],
})

export class UserManagementModule {

}
