import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ProfileComponent } from "./profile.component";

@NgModule({
    bootstrap: [ProfileComponent],
    declarations: [ProfileComponent],
    exports: [ProfileComponent],
    imports: [CommonModule],
})

export class ProfileModule {

}
