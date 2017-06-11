import { ApplicationRef, Component, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { BrowserModule } from "@angular/platform-browser";
import { CoSComponent } from "./cos.component";
import { CoSRouter } from "./cos.routing.module";
import { LocatorModule } from "./locator/locator.module";
import { NavbarModule } from "./navbar/navbar.module";
import { ProfileModule } from "./profile/profile.module";
import { RateModule } from "./rate/rate.module";
import { UserManagementModule } from "./user-management/user-management.module";

@NgModule({
  bootstrap: [CoSComponent],
  declarations: [CoSComponent],
  imports: [
    BrowserModule,
    CoSRouter,
    FormsModule,
    HttpModule,
    LocatorModule,
    NavbarModule,
    ProfileModule,
    RateModule,
    UserManagementModule,
  ],
})

export class CoSModule {
}
