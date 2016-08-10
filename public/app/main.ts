import { bootstrap } from '@angular/platform-browser-dynamic';
import { CosComponent } from './cos.component';
import { cosRouteProviders } from './cos.routes'; 
import { HTTP_PROVIDERS } from '@angular/http';

// Need to include the main app component here.
bootstrap(
  CosComponent,
  [
    cosRouteProviders,
    HTTP_PROVIDERS
  ]
);
