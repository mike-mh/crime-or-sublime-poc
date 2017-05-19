import { ApplicationRef, Component, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { BrowserModule } from "@angular/platform-browser";
import { CoSComponent } from "./cos.component";
import { NavbarModule } from "./navbar/navbar.module";

@NgModule({
  bootstrap: [CoSComponent],
  declarations: [CoSComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NavbarModule,
  ],
})

export class CoSModule {
}
