import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { LoginComponent } from "./login.component";

@NgModule({
    bootstrap: [LoginComponent],
    declarations: [LoginComponent],
    exports: [LoginComponent],
    imports: [FormsModule, CommonModule],
})

export class LoginModule {

}
