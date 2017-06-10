import { Component, OnInit } from "@angular/core";

@Component({
  selector: "cos-locator",
  styleUrls: ["./locator.component.css"],
  templateUrl: "./locator.component.html",
})

export class LocatorComponent implements OnInit {
    public images: any[] = [
        "v7QrfXC",
        "zCYYFRJ",
        "Nmu4brX",
        "xHrnW91",
        "b0SrUHu",
        "i4uoCkt",
        "wMncSnc",
        "yeNR3Hm",
        "99CJlzN",
    ];

    private MAP_TYPE_ID: google.maps.MapTypeId =
    google.maps.MapTypeId.ROADMAP;

    private DEFAULT_ZOOM: number = 5;

    // Temporary for a prototype. Should replace with users actual location
    private DEFAULT_LAT_LNG: google.maps.LatLng =
    new google.maps.LatLng(49.2827, -123.1207);

    private graffitiMap: google.maps.Map;
    private mapConfiguration: google.maps.MapOptions;
    private graffitiMarker: google.maps.Marker;

    /**
     * @desc - Center map to graffiti selected by user and creates a marker.
     * @param graffitiLatLng {gooogle.maps.LatLng} - Location of graffiti
     */
    public showGraffitiLocation(graffitiLatLng: google.maps.LatLng): void {
        // Remove current marker from map
        this.graffitiMarker.setMap(null);

        // Set center and add marker
        this.graffitiMap.setCenter(graffitiLatLng);
        this.graffitiMarker = new google.maps.Marker(
            {
                map: this.graffitiMap,
                position: graffitiLatLng,
                title: "VICTORY",
            });
    }

    public locateOnMap(url: string) {
        alert("You're looking for: " + url);
    }

    public ngOnInit(): void {
        this.initializeMap();
    }

    private initializeMap(): void {
        this.mapConfiguration = {
            center: this.DEFAULT_LAT_LNG,
            mapTypeId: this.MAP_TYPE_ID,
            zoom: this.DEFAULT_ZOOM,
        };

        this.graffitiMap = new google.maps.Map(
            document.getElementById("cos-map"),
            this.mapConfiguration);

        this.graffitiMarker = new google.maps.Marker(
            {
                map: this.graffitiMap,
                position: this.DEFAULT_LAT_LNG,
                title: "TESTING",
            });
    }

}
