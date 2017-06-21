/**
 * @author Michael Mitchell-Halter
 */

import { platformBrowser } from "@angular/platform-browser";
import { CoSModuleNgFactory } from "../../aot/src/public/app/cos.module.ngfactory";

/**
 * Compile this file after a factory for the entire app has been generated.
 * Recompile with the factory and then rollup the output to condense the entire
 * application into a single javascript file.
 */
platformBrowser().bootstrapModuleFactory(CoSModuleNgFactory);
