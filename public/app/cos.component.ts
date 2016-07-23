import { Component } from '@angular/core';
import { GraffitiMapComponent } from './locator/graffiti-map.component';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'cos',
  moduleId: module.id,
  templateUrl: 'cos.component.html',
  directives: [GraffitiMapComponent, NavbarComponent]
})

export class CosComponent 
{

}
