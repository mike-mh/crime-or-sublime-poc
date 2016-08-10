import { provideRouter, RouterConfig } from '@angular/router';
import { GraffitiMapComponent } from './locator/graffiti-map.component'
import { ProfileComponent } from './profile/profile.component';
import { RateComponent } from './rate/rate.component';
import { LoginComponent } from './login/login.component';

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
  },
  {
    path: 'rate',
    component: RateComponent
  },
  {
    path: 'login',
    component: LoginComponent
  }
];

export const cosRouteProviders = [
  provideRouter(routes)
];