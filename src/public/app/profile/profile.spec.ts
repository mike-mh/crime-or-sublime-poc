/**
 * @author Michael Mitchell-Halter
 */

import { CommonModule } from "@angular/common";
import { DebugElement, EventEmitter, NgZone } from "@angular/core";
import { async, ComponentFixture, inject, TestBed } from "@angular/core/testing";
import { HttpModule, Response, ResponseOptions, XHRBackend } from "@angular/http";
import { MockBackend } from "@angular/http/testing";
import { By } from "@angular/platform-browser";
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from "@angular/platform-browser-dynamic/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Observable } from "rxjs/Observable";
import { ISessionDetails, SessionService } from "./../shared/session/session.service";
import { GalleryWidgetModule } from "./gallery-widget/gallery-widget.module";
import { ProfileComponent } from "./profile.component";
import { ProfileService } from "./profile.service";

describe("ProfileComponent", () => {
    let component: ProfileComponent;
    let fixture: ComponentFixture<ProfileComponent>;
    let isLoggedin = false;

    const htmlElements: {} = {};
    const buttonIDs: string[] = [
        "#cos-profile",
    ];

    /**
     * Use this function to map all changes to the htmlElements map.
     */
    let mapChanges: () => void;
    mapChanges = () => {
        fixture.detectChanges();
        buttonIDs.map((id) => {
            const de = fixture.debugElement.query(By.css(id));

            htmlElements[id] = (de) ?
                de.nativeElement :
                undefined;
        });
    };

    /**
     * Use this to check an element is rendered. An element should be
     * rendered if it is mapped in the htmlElements hash.
     *
     * @param - The element"s id value
     *
     * @return - True if the element is in the htmlElements hash, or else false
     */
    let isElementRendered: (id: string) => boolean;
    isElementRendered = (id: string) => {
        fixture.detectChanges();
        return !!htmlElements[id];
    };

    beforeEach((done) => {

        let spy: jasmine.Spy;

        // Spy on the actual static class since the method is static.
        spy = spyOn(SessionService, "isSessionActive").and.returnValue(isLoggedin);

        const profileServiceStub = {
            getUserFavouriteGraffiti: () => {
                return Observable.create((observer: any) => {
                    observer.next({ result: [] });
                });
            },
            removeGraffitiFromFavourites: () => {
                return Observable.create((observer: any) => {
                    observer.next({ result: "success" });
                });
            },
        };

        const sessionServiceStub = {
            sessionIsActive: isLoggedin,
        };

        TestBed.configureTestingModule({
            declarations: [ProfileComponent],
            imports: [
                CommonModule,
                GalleryWidgetModule,
                HttpModule,
            ],
        });

        TestBed.overrideComponent(ProfileComponent, {
            set: {
                providers: [
                    { provide: SessionService, useValue: sessionServiceStub },
                    { provide: ProfileService, useValue: profileServiceStub }],
            },
        }).compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(ProfileComponent);
                component = fixture.componentInstance;

                fixture.detectChanges();
                mapChanges();
                done();
            })
            .catch((error) => {
                done();
            });

    });

    it("should not be rendered when the user is not logged in", () => {
        expect(isElementRendered("#cos-profile")).toBe(false);
        isLoggedin = true;
    });

    it("should be rendered when the user is logged in", () => {
        expect(isElementRendered("#cos-profile")).toBe(true);
    });

});

/**
 * Consider re-doing some of these tests in the future. They work but the
 * implementation is a bit sloppy.
 */
describe("ProfileService", () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                ProfileService,
                { provide: XHRBackend, useClass: MockBackend }],
        });
    });

    it("should get favourites from the server", async(
        inject([ProfileService, XHRBackend], (
            profileService: ProfileService,
            mockBackend: MockBackend) => {

            const mockResponse = JSON.stringify({
                result: [
                    {
                        id: 123,
                        url: "figgy",
                    },
                    {
                        id: 132,
                        url: "yiggf",
                    },
                    {
                        id: 321,
                        url: "fggiy",
                    },
                ],
            });

            mockBackend.connections.subscribe((connection: any) => {
                connection.mockRespond(new Response(new ResponseOptions({
                    body: JSON.parse(mockResponse),
                })));
            });

            profileService.getUserFavouriteGraffiti()
                .subscribe(
                (response) => {
                    expect(JSON.stringify(response)).toEqual(mockResponse);
                },
                () => {
                    expect(true).toBe(false, "Error occured retrieveing HTTP response");
                });

        })));

    it("should send HTTP request to remove item from favourites", async(
        inject([ProfileService, XHRBackend], (
            profileService: ProfileService,
            mockBackend: MockBackend) => {

            const mockResponse = JSON.stringify({
                result: "success",
            });

            mockBackend.connections.subscribe((connection: any) => {
                connection.mockRespond(new Response(new ResponseOptions({
                    body: JSON.parse(mockResponse),
                })));
            });
            profileService.removeGraffitiFromFavourites("figgy")
                .subscribe((response) => {
                    expect(JSON.stringify(response)).toEqual(mockResponse);
                },
                () => {
                    expect(true).toBe(false, "Error occured retrieveing HTTP response");
                });

        })));

});
