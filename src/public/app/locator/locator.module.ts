/**
 * @author Michael Mitchell-Halter
 */

import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { GalleryWidgetModule } from "./gallery-widget/gallery-widget.module";
import { LocatorComponent } from "./locator.component";
import { MapModule } from "./map/map.module";

@NgModule({
    bootstrap: [LocatorComponent],
    declarations: [LocatorComponent],
    entryComponents: [LocatorComponent],
    exports: [LocatorComponent, MapModule, GalleryWidgetModule],
    imports: [RouterModule, CommonModule, MapModule, GalleryWidgetModule],
})

export class LocatorModule {

}
