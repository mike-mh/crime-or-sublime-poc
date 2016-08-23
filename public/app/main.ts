import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
//import { NgModule } from '@angular/core';
//import { BrowserModule } from '@angular/platform-browser';
import { CosModule } from './cos.module';

// Compile and launch the module
//platformBrowserDynamic().bootstrapModule(CosModule);
platformBrowserDynamic().bootstrapModule(CosModule);

// The app module factory produced by the static offline compiler

//import { cosRouteProviders } from './cos.routes'; 
//import { HTTP_PROVIDERS } from '@angular/http';

/*@NgModule({
  imports: [ BrowserModule ],
  declarations: [ CosComponent ],
  bootstrap:    [ CosComponent ]
})*/

// Need to include the main app component here.
/*bootstrap(
  CosComponent,
  [
    cosRouteProviders,
    HTTP_PROVIDERS
  ]
);*/

//export class CosModule { };