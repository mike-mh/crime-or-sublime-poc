import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { LoginComponent } from "./login.component";

@NgModule({
    bootstrap: [LoginComponent],
    declarations: [LoginComponent],
    exports: [LoginComponent],
    imports: [CommonModule, ReactiveFormsModule],
})

export class LoginModule {

}
