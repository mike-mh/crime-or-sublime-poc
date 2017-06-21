/**
 * @author Michael Mitchell-Halter
 */

import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RegisterUserComponent } from "./register-user.component";

@NgModule({
    bootstrap: [RegisterUserComponent],
    declarations: [RegisterUserComponent],
    exports: [RegisterUserComponent],
    imports: [ReactiveFormsModule, CommonModule],
})

export class RegisterUserModule {

}
