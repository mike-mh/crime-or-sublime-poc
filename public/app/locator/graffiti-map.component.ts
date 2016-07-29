import { Component, OnInit } from '@angular/core';
import { GraffitiMapGallery } from './locator-gallery/graffiti-map-gallery.component';
import { Router } from '@angular/router';

@Component({
  selector: 'graffiti-map',
  moduleId: module.id,
  directives: [GraffitiMapGallery],
  templateUrl:'graffiti-map.component.html'
})

export class GraffitiMapComponent
{
  constructor(private router: Router)
  {

  }
}
