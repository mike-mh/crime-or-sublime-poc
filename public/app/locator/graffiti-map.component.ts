import { Component, OnInit } from '@angular/core';

@Component({
  'selector': 'graffiti-map',
  'templateUrl':'public/app/locator/graffiti-map.component.html'
})

export class GraffitiMapComponent
{
  ngOnInit()
  {
    var mapProp = {
      center:new google.maps.LatLng(51.508742,-0.120850),
      zoom: 5,
      mapTypeId:google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);

    var marker = new google.maps.Marker(
                   {
                     position: new google.maps.LatLng(51.508742,-0.120850),
                     map: map,
                     title: 'Hello World!'
                   });
  }

}
