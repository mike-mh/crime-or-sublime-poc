import { bootstrap } from '@angular/platform-browser-dynamic';
import { CosComponent } from './cos.component';
import { appRouteProviders } from './cos.routes'; 

// Need to include the main app component here.
bootstrap(
  CosComponent,
  [
    appRouteProviders
  ]
);
