import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MapComponent } from "./map.component";

@NgModule({
    bootstrap: [MapComponent],
    declarations: [MapComponent],
    entryComponents: [MapComponent],
    exports: [MapComponent],
    imports: [CommonModule],
})

export class MapModule {

}
