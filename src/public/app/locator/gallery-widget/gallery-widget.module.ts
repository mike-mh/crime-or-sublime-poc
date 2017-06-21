import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { GalleryWidgetComponent } from "./gallery-widget.component";

@NgModule({
    bootstrap: [GalleryWidgetComponent],
    declarations: [GalleryWidgetComponent],
    entryComponents: [GalleryWidgetComponent],
    exports: [GalleryWidgetComponent],
    imports: [CommonModule],
})

export class GalleryWidgetModule {

}
