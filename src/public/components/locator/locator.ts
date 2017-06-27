import { Component, ComponentElement, createElement as e, DOMElement, SFC } from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { GraffitiGetAPI } from "../../../../configurations/graffiti/graffiti-get/graffiti-get-api";
import { elements, setElemChildrenCurry } from "../../libs/elements/elements";
import styles from "./locator.styles";

const div = elements.div;

/**
 * The locator class renders the graffiti locating map. There aren't any states
 * nor props set yet but after we implement a filter and the corresponding API
 * we'll definately need state and likely will have props as well.
 */
class Locator extends Component<{}, {}> {
    private graffitiGetAPI: GraffitiGetAPI = new GraffitiGetAPI();

    private MAP_TYPE_ID: google.maps.MapTypeId =
    google.maps.MapTypeId.ROADMAP;

    private DEFAULT_ZOOM: number = 16;

    // Temporary for a prototype. Should replace with users actual location
    private DEFAULT_LAT_LNG: google.maps.LatLng =
    new google.maps.LatLng(49.2827, -123.1207);

    private graffitiMap: google.maps.Map;
    private mapConfiguration: google.maps.MapOptions;
    private graffitiMarker: google.maps.Marker;

    /**
     * Need to use this function to set up Google maps so that it can render
     * after the component mounts to the DOM.
     */
    public componentDidMount(): void {
        this.mapConfiguration = {
            center: this.DEFAULT_LAT_LNG,
            mapTypeId: this.MAP_TYPE_ID,
            zoom: this.DEFAULT_ZOOM,
        };

        this.graffitiMap = new google.maps.Map(
            document.getElementById("cos-locator-map"),
            this.mapConfiguration);

        this.graffitiMarker = new google.maps.Marker(
            {
                map: this.graffitiMap,
                position: this.DEFAULT_LAT_LNG,
                title: "TESTING",
            });
    }

    public render() {
        return div(null, div({
            id: "cos-locator",
            style: styles["#cos-locator"]
        },
            div({
                id: "cos-locator-map",
                style: styles["#cos-locator-map"]
            },
            )));
    }

}

export default Locator;
