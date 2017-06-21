/**
 * @author Michael Mitchell-Halter
 */

import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { RateComponent } from "./rate.component";

@NgModule({
    bootstrap: [RateComponent],
    declarations: [RateComponent],
    entryComponents: [RateComponent],
    exports: [RateComponent],
    imports: [CommonModule],
})

export class RateModule {

}
