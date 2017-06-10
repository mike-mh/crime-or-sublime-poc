import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LocatorComponent } from "./locator/locator.component";
import { NavbarModule } from "./navbar/navbar.module";
import { RateComponent } from "./rate/rate.component";
import { LoginComponent } from "./user-management/login/login.component";
import { RegisterUserComponent } from "./user-management/register-user/register-user.component";

const cosRoutes: Routes = [
    { path: "", redirectTo: "/", pathMatch: "full" },
    { path: "cos-locator", component: LocatorComponent },
    { path: "cos-login", component: LoginComponent },
    { path: "cos-rate", component: RateComponent },
    { path: "cos-register", component: RegisterUserComponent },
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forRoot(cosRoutes)],
})

export class CoSRouter {

}
