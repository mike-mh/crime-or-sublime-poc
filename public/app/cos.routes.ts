import { provideRouter, RouterConfig } from '@angular/router';
import { GraffitiMapComponent } from './locator/graffiti-map.component'
import { ProfileComponent } from './profile/profile.component';

const routes: RouterConfig = [
  {
    path: '',
    redirectTo: '/map',
    pathMatch: 'full'
  },
  {
    path: 'map',
    component: GraffitiMapComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  }
];

export const appRouteProviders = [
  provideRouter(routes)
];