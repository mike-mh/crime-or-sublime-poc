import { Component } from '@angular/core';
import { GraffitiMapComponent } from './locator/graffiti-map.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
  selector: 'cos',
  moduleId: module.id,
  templateUrl: 'cos.component.html',
  directives: [GraffitiMapComponent, NavbarComponent, ROUTER_DIRECTIVES]
})

export class CosComponent 
{

}
