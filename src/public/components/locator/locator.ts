import { Component, ComponentElement, createElement as e, DOMElement, SFC } from "react";
import { render, unmountComponentAtNode } from "react-dom";
import "slick-carousel";
import { GraffitiGetAPI } from "../../../../configurations/graffiti/graffiti-get/graffiti-get-api";
import { elements, setElemChildrenCurry } from "../../libs/elements/elements";
import styles from "./locator.styles";

const button = elements.button;
const div = elements.div;
const img = elements.img;

/**
 * The locator class renders the graffiti locating map. There aren't any states
 * nor props set yet but after we implement a filter and the corresponding API
 * we'll definately need state and likely will have props as well.
 */
class Locator extends Component<{}, {}> {
    // This is temporary. Just use as a proof of concept for now.
    private graffitiData: any = [];

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

        this.getRandomGraffiti();
    }

    public render() {
        return div(null, div({
            id: "cos-locator",
            style: styles["#cos-locator"]
        },
            div({
                id: "cos-locator-map",
                style: styles["#cos-locator-map"] as {}
            }),
            div({
                id: "slicking",
                style: styles["#slicking"]
            }, null)));
    }

    /**
     * This will be expanded in the future to include filtering for specific
     * graffiti and a new listener function will be written to allow users to
     * click the map to find graffiti. As of now, this function just gets 10
     * random graffiti images from the server and stores them to an object.
     */
    public getRandomGraffiti(): void {
        try {
            this.graffitiGetAPI.validateParams(
                this.graffitiGetAPI.GRAFFITI_GET_FILTER,
                {},
                "post");
        } catch (error) {
            // Should update DOM here.
            return;
        }

        $.ajax({
            contentType: "application/json",
            data: JSON.stringify({}),
            dataType: "json",
            error: (xhr: any, status: any, err: any) => {
                console.log(err);
            },
            method: "POST",
            success: (data: any) => {
                this.graffitiData = data;
                console.log(this.graffitiData);
                const images: any[] = [];
                data.map((graffiti: any) => {
                    const testMarker = new google.maps.Marker(
                        {
                            map: this.graffitiMap,
                            position: new google.maps.LatLng(graffiti.latitude,
                                graffiti.longitude),
                            title: "NOW IN REACT",
                        });
                    google.maps.event.addListener(testMarker, 'mouseover', function (event: any) {
                        this.setIcon('https://i.imgur.com/' + graffiti.url + 's.jpg');
                    });
                    google.maps.event.addListener(testMarker, 'mouseout', function (event: any) {
                        this.setIcon();
                    });


                    images.push(div(null, [e("img", { style: { display: "block", margin: "auto" }, src: 'https://i.imgur.com/' + graffiti.url + 's.jpg' }),
                    button({ className: "btn btn-warning", style: { display: "block", margin: "auto" } }, "Find on Map")]));

                });

                render(div({ className: "slick-test", style: styles[".slick-test"] }, images), document.getElementById("slicking"))
                $(".slick-test").slick({
                    centerMode: true,
                    centerPadding: '60px',
                    slidesToShow: 7,
                    responsive: [
                        {
                            breakpoint: 992,
                            settings: {
                                arrows: false,
                                centerMode: true,
                                centerPadding: '40px',
                                slidesToShow: 4
                            }
                        },
                        {
                            breakpoint: 480,
                            settings: {
                                arrows: false,
                                centerMode: true,
                                centerPadding: '40px',
                                slidesToShow: 1
                            }
                        }
                    ]
                });

            },
            url: this.graffitiGetAPI.GRAFFITI_GET_FILTER,
        });

    }


}

export default Locator;
