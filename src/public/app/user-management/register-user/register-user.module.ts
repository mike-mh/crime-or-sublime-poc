import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RegisterUserComponent } from "./register-user.component";

@NgModule({
    bootstrap: [RegisterUserComponent],
    declarations: [RegisterUserComponent],
    exports: [RegisterUserComponent],
    imports: [FormsModule],
})

export class RegisterUserModule {

}
