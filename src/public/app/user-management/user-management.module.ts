/**
 * @author Michael Mitchell-Halter
 */

import { NgModule } from "@angular/core";
import { LoginModule } from "./login/login.module";
import { RegisterUserModule } from "./register-user/register-user.module";

@NgModule({
    exports: [RegisterUserModule, LoginModule],
})

export class UserManagementModule {

}
