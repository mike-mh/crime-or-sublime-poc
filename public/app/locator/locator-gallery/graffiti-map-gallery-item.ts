export class GraffitiMapGalleryItem
{
  private geoLocation: google.maps.LatLng;
  private photoUrl: string;

  constructor(latLng: google.maps.LatLng, url: string)
  {
    this.geoLocation = latLng;
    this.photoUrl = url;
  }

  getGeoLocation(): google.maps.LatLng
  {
    return this.geoLocation;
  }

  getPhotoUrl(): string
  {
    return this.photoUrl
  }
}