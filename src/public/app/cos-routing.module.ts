import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NavbarModule } from "./navbar/navbar.module";
import { LoginComponent } from "./user-management/login/login.component";
import { RegisterUserComponent } from "./user-management/register-user/register-user.component";

const cosRoutes: Routes = [
    { path: "", redirectTo: "/", pathMatch: "full" },
    { path: "cos-fe-login", component: LoginComponent },
    { path: "cos-fe-register", component: RegisterUserComponent },
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forRoot(cosRoutes)],
})

export class CoSRouter {

}
