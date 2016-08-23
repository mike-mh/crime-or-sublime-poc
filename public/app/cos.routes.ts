//import { provideRouter, RouterConfig } from '@angular/router';
import { Routes, RouterModule } from '@angular/router';

import { GraffitiMapComponent } from './locator/graffiti-map.component'
import { ProfileComponent } from './profile/profile.component';
import { RateComponent } from './rate/rate.component';
import { LoginComponent } from './user-management/login/login.component';
import { RegisterUserComponent } from './user-management/register-user/register-user.component';

export const routes: Routes = [
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
  },
  {
    path: 'register',
    component: RegisterUserComponent
  },  
];

export const appRoutingProviders: any[] = [];
export const routing = RouterModule.forRoot(routes);
