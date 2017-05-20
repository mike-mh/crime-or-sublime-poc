import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NavbarModule } from "./navbar/navbar.module";
import { RegisterUserComponent } from "./user-management/register-user/register-user.component";
import { LoginComponent } from "./user-management/login/login.component";

const cosRoutes: Routes = [
    { path: "", redirectTo: "/", pathMatch: "full" },
    { path: "login", component: LoginComponent },
    { path: "register", component: RegisterUserComponent },    
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forRoot(cosRoutes)],
})

export class CoSRouter {

}
