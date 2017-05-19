import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { CoSModule } from "./cos.module";

/**
 * This file is used in the first step of AOT compilation for the entire
 * front end application. The JIT compilation is performed using the bootstap
 * method here and outputs to another file to generate a factory for the CoS
 * app. This factory can the be used to bootstrap the entire app and rollup
 * into a single javascript file with the entire app aside from libraries.
 * No need for HTML, CSS or even other javascript files to be sent client side
 * aside from library dependencies and the index.html file!
 */
platformBrowserDynamic().bootstrapModule(CoSModule);
