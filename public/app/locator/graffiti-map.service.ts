//import { OnInit } from '@angular/core';

export class GraffitiMapService
{

  private MAP_TYPE_ID: google.maps.MapTypeId =
    google.maps.MapTypeId.ROADMAP;

  private DEFAULT_ZOOM: number = 5;

  // Temporary for a prototype. Should replace with users actual location
  private DEFAULT_LAT_LNG: google.maps.LatLng =
    new google.maps.LatLng(51.508742, -0.120850);

  private graffitiMap: google.maps.Map;
  private mapConfiguration: google.maps.MapOptions;
  private graffitiMarker: google.maps.Marker;

  public initializeMap(): void
  {
    this.mapConfiguration = {
      center: this.DEFAULT_LAT_LNG,
      zoom: this.DEFAULT_ZOOM,
      mapTypeId: this.MAP_TYPE_ID
    };

    this.graffitiMap = new google.maps.Map(
      document.getElementById("googleMap"),
      this.mapConfiguration);

    this.graffitiMarker = new google.maps.Marker(
      {
        position: this.DEFAULT_LAT_LNG,
        map: this.graffitiMap,
        title: 'TESTING'
      });
  }

  /**
   * @desc - Center map to graffiti selected by user and creates a marker.
   * @param graffitiLatLng {gooogle.maps.LatLng} - Location of graffiti
   */
  public showGraffitiLocation(graffitiLatLng: google.maps.LatLng): void
  {
    // Remove current marker from map
    this.graffitiMarker.setMap(null);

    // Set center and add marker
    this.graffitiMap.setCenter(graffitiLatLng);
    this.graffitiMarker = new google.maps.Marker(
      {
        position: graffitiLatLng,
        map: this.graffitiMap,
        title: 'VICTORY'
      });
  }
}
