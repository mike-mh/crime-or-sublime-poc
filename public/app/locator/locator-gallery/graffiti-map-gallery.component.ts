import { Component, OnInit } from '@angular/core';
import { GraffitiMapService } from '../graffiti-map.service';
import { GraffitiMapGalleryItem } from './graffiti-map-gallery-item';

@Component({
  selector: 'graffiti-map-gallery',
  moduleId: module.id,
  templateUrl: 'graffiti-map-gallery.component.html',
  styleUrls: ['graffiti-map-gallery.component.css'],
  providers: [GraffitiMapService]
})

export class GraffitiMapGallery
{
  // These are temporary. Will be replaced by retrieved URLs
  graffitiUrls: string[] =
    [
      'http://i.imgur.com/5cNrGYbs.jpg',
      'http://i.imgur.com/BrWI0PJs.jpg',
      'http://i.imgur.com/Y9rP9eks.jpg'
    ]

  graffitiGalleryElements: GraffitiMapGalleryItem[] =
    [
      new GraffitiMapGalleryItem(new google.maps.LatLng(25, 25), 'http://i.imgur.com/5cNrGYbs.jpg'),
      new GraffitiMapGalleryItem(new google.maps.LatLng(45, 45), 'http://i.imgur.com/BrWI0PJs.jpg'),
      new GraffitiMapGalleryItem(new google.maps.LatLng(49.2, -123), 'http://i.imgur.com/Y9rP9eks.jpg'),
    ];

  constructor(private graffitiMapService: GraffitiMapService)
  {

  }

  ngOnInit()
  {
    this.graffitiMapService.initializeMap();
  }

  private addMarker(selectedGraffiti: GraffitiMapGalleryItem): void
  {
    let newLocation: google.maps.LatLng = selectedGraffiti.getGeoLocation();
    this.graffitiMapService.showGraffitiLocation(newLocation);
  }
}