import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { GalleryWidgetModule } from "./gallery-widget/gallery-widget.module";
import { ProfileComponent } from "./profile.component";

@NgModule({
    bootstrap: [ProfileComponent],
    declarations: [ProfileComponent],
    exports: [ProfileComponent],
    imports: [CommonModule, GalleryWidgetModule],
})

export class ProfileModule {

}
