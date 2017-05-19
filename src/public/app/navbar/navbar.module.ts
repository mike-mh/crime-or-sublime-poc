import { NgModule } from "@angular/core";
import { NavbarComponent } from "./navbar.component";

@NgModule({
    bootstrap: [NavbarComponent],
    declarations: [NavbarComponent],
    entryComponents: [NavbarComponent],
    exports: [NavbarComponent],
})

export class NavbarModule {

}
