import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NavbarComponent } from "./navbar.component";

@NgModule({
    bootstrap: [NavbarComponent],
    declarations: [NavbarComponent],
    entryComponents: [NavbarComponent],
    exports: [NavbarComponent],
    imports: [RouterModule],
})

export class NavbarModule {

}
