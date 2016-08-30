import {BrowserModule} from '@angular/platform-browser';
import {Component, NgModule, ApplicationRef} from '@angular/core';
import { CosComponent } from './cos.component';
import { FormsModule } from '@angular/forms';
import { routing } from './cos.routes';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    routing
  ],
  declarations: [CosComponent],
  entryComponents: [CosComponent],
  bootstrap: [CosComponent]
})

export class CosModule {
}
