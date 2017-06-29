import { Component, ComponentElement, createElement as e, DOMElement, SFC } from "react";
import { render, unmountComponentAtNode } from "react-dom";
import "slick-carousel";
import { GraffitiGetAPI } from "../../../../configurations/graffiti/graffiti-get/graffiti-get-api";
import { elements, setElemChildrenCurry } from "../../libs/elements/elements";
import styles from "./locator.styles";

const button = elements.button;
const div = elements.div;
const i = elements.i;
const img = elements.img;

/**
 * The locator class renders the graffiti locating map. There aren"t any states
 * nor props set yet but after we implement a filter and the corresponding API
 * we"ll definately need state and likely will have props as well.
 */
class Locator extends Component<{}, {}> {
    // This is temporary. Just use as a proof of concept for now.
    private graffitiData: any = [];

    private graffitiGetAPI: GraffitiGetAPI = new GraffitiGetAPI();

    private readonly COS_LOCATOR_DIV = setElemChildrenCurry(div, {
        id: "cos-locator",
        style: styles["#cos-locator"],
    });

    private readonly COS_LOCATOR_MAP_DIV = div({
        id: "cos-locator-map",
        style: styles["#cos-locator-map"],
    });

    private readonly COS_LOCATOR_CAROUSEL_CONTAINER_DIV = div({
        id: "cos-locator-carousel-container",
        style: styles["#cos-locator-carousel-container"],
    });

    private readonly COS_LOCATOR_CAROUSEL_DIV = setElemChildrenCurry(div, {
        id: "cos-locator-carousel",
        style: styles["#cos-locator-carousel"],
    });

    private MAP_TYPE_ID: google.maps.MapTypeId =
    google.maps.MapTypeId.ROADMAP;

    private DEFAULT_ZOOM: number = 16;

    // Temporary for a prototype. Should replace with users actual location
    private DEFAULT_LAT_LNG: google.maps.LatLng =
    new google.maps.LatLng(49.2827, -123.1207);

    private graffitiMap: google.maps.Map;
    private mapConfiguration: google.maps.MapOptions;
    private graffitiMarker: google.maps.Marker = new google.maps.Marker();

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
        return this.COS_LOCATOR_DIV([
            this.COS_LOCATOR_MAP_DIV,
            this.COS_LOCATOR_CAROUSEL_CONTAINER_DIV,
        ]);
    }

    /**
     * Use this to generate widgets within the carousel.
     *
     * @param url - The URL associated with a graffiti.
     */
    private generateCarouselItem(url: string): DOMElement<any, Element> {
        return div({ className: "carousel-item-contianer" }, [
            e("img", {
                className: "carousel-item-graffiti-image",
                src: `https://i.imgur.com/${url}s.jpg`,
                style: styles[".carousel-item-graffiti-image"],
            }),
            button({
                className: "btn btn-warning carousel-item-find-button",
                onClick: () => { this.showGraffitiLocation(url); },
                style: styles[".carousel-item-find-button"],
            }, "Find on Map")]);

    }

    /**
     * Use this function to configure the carousel widget for graffiti images.
     */
    private configureCarouselWidget(): void {
        $("#cos-locator-carousel").slick({
            centerPadding: "60px",
            nextArrow: `<div class="slick-prev pull-right" style="display: flex;align-items: center;">
                                  <i class="fa fa-arrow-circle-right fa-4x" aria-hidden="true" style="color:blue;"></i>
                                </div>`,
            prevArrow: `<div class="slick-prev pull-left" style="display: flex;align-items: center;">
                                  <i class="fa fa-arrow-circle-left fa-4x" aria-hidden="true" style="color:blue;"></i>
                                </div>`,
            responsive: [
                {
                    breakpoint: 992,
                    settings: {
                        centerPadding: "40px",
                        slidesToShow: 3,
                    },
                },
                {
                    breakpoint: 480,
                    settings: {
                        centerPadding: "40px",
                        slidesToShow: 1,
                    },
                },
            ],
            slidesToShow: 7,
        });

    }

    /**
     * Center map to graffiti selected by user and creates a marker. Also sets
     * icon to show the graffiit image when mouse hovers over it.
     *
     * TO-DO: Add more styling to the marker on hover.
     *
     * @param url - The URL of the graffiti to center on.
     */
    private showGraffitiLocation(url: string): void {
        const graffitiLocation = this.graffitiData.reduce((acc: string, cur: any) => {
            return (cur.url === url) ?
                new google.maps.LatLng(cur.latitude, cur.longitude) :
                acc;
        }, undefined);

        // Remove current marker from map
        this.graffitiMarker.setMap(null);

        // Set center and add marker
        this.graffitiMap.setCenter(graffitiLocation);
        this.graffitiMarker = new google.maps.Marker(
            {
                map: this.graffitiMap,
                position: graffitiLocation,
                title: "A graffiti",
            });

        google.maps.event.addListener(this.graffitiMarker, "mouseover", (event: any) => {
            this.graffitiMarker.setIcon(`https://i.imgur.com/${url}s.jpg`);
        });
        google.maps.event.addListener(this.graffitiMarker, "mouseout", (event: any) => {
            this.graffitiMarker.setIcon(null);
        });

    }

    /**
     * This will be expanded in the future to include filtering for specific
     * graffiti and a new listener function will be written to allow users to
     * click the map to find graffiti. As of now, this function just gets 10
     * random graffiti images from the server and stores them to an object.
     */
    private getRandomGraffiti(): void {
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
                return;
            },
            method: "POST",
            success: (data: any) => {
                this.graffitiData = data;
                const images: any[] = data.reduce((acc: any[], cur: any) => {
                    return acc.concat([this.generateCarouselItem(cur.url)]);
                }, []);

                render(this.COS_LOCATOR_CAROUSEL_DIV(images),
                    document.getElementById("cos-locator-carousel-container"));

                this.configureCarouselWidget();
            },
            url: this.graffitiGetAPI.GRAFFITI_GET_FILTER,
        });

    }

}

export default Locator;
