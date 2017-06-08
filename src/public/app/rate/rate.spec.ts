import { CommonModule } from "@angular/common";
import { DebugElement, EventEmitter, NgZone } from "@angular/core";
import { async, ComponentFixture, inject, TestBed, tick } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpModule, Response, ResponseOptions, XHRBackend } from "@angular/http";
import { MockBackend } from "@angular/http/testing";
import { By } from "@angular/platform-browser";
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from "@angular/platform-browser-dynamic/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Observable } from "rxjs/Observable";
import { ISessionDetails, SessionService } from "./../shared/session/session.service";
import { RateComponent } from "./rate.component";
import { RateService } from "./rate.service";

describe("RateComponent", () => {
    let component: RateComponent;
    let fixture: ComponentFixture<RateComponent>;
    let isLoggedIn = true;
    let expectedRating: boolean;

    const htmlElements: {} = {};
    const buttonIDs: string[] = [
        "#cos-rate",
        "#cos-rate-graffiti-image",
        "#cos-rate-favourite-button",
        "#cos-rate-random-button",
        "#cos-rate-crime-button",
        "#cos-rate-sublime-button",
    ];

    const getRandomGraffiti = () => {
            return Observable.create((observer: any) => {
                const random = Math.floor(2 * Math.random());
                const options = [
                    "xHrnW91",
                    "Nmu4brX",
                ];
                observer.next({ url: "Nmu4brX" });
            });
        };

    const rateGraffiti = (graffitiUrl: string, rating: boolean) => {
            return Observable.create((observer: any) => {
                expect(rating).toBe(expectedRating);
                observer.next(expectedRating);
            });
        };

    const rateServiceStub = {
        getRandomGraffiti,
        rateGraffiti,
    };

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

    beforeEach(async(() => {
        const sessionServiceStub = {
            sessionIsActive: isLoggedIn,
        };

        let spy: jasmine.Spy;

        // Spy on the actual static class since the method is static.
        spy = spyOn(SessionService, "isSessionActive").and.returnValue(isLoggedIn);

        TestBed.configureTestingModule({
            declarations: [RateComponent],
            imports: [
                HttpModule,
            ],
        });

        TestBed.overrideComponent(RateComponent, {
            set: {
                providers: [
                    { provide: SessionService, useValue: sessionServiceStub },
                    { provide: RateService, useValue: rateServiceStub }],
            },
        }).compileComponents()
            .catch((error) => {
                return;
            });

    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        mapChanges();
    });

    it("should have a graffiti image", () => {
        expect(isElementRendered("#cos-rate-graffiti-image")).toBe(true);
    });

    it("should have favourites button", () => {
        expect(isElementRendered("#cos-rate-favourite-button")).toBe(true);
    });

    it("should have a random button", () => {
        expect(isElementRendered("#cos-rate-random-button")).toBe(true);

    });

    it("should have a crime button", () => {
        expect(isElementRendered("#cos-rate-crime-button")).toBe(true);

    });

    it("should have a sublime button", () => {
        expect(isElementRendered("#cos-rate-sublime-button")).toBe(true);

        isLoggedIn = false;
    });

    it("should not display when user is logged off", () => {
        expect(isElementRendered("#cos-rate")).toBe(false);

        isLoggedIn = true;
    });

    it("should get a random graffiti image when the user clicks the random button", async(() => {
        const service = fixture.debugElement.injector.get(RateService);
        const randomSpy = spyOn(service, "getRandomGraffiti");
        randomSpy.and.returnValue(getRandomGraffiti());
        const randomButton = htmlElements["#cos-rate-random-button"];
        randomButton.click();
        fixture.whenStable().then(() => {
            expect(randomSpy).toHaveBeenCalledTimes(1);
        });
    }));

    it("should get a random graffiti image and set a CRIME rating when the user clicks the crime button", async(
        () => {
            expectedRating = false;
            const service = fixture.debugElement.injector.get(RateService);
            const randomSpy = spyOn(service, "getRandomGraffiti");
            randomSpy.and.returnValue(getRandomGraffiti());

            const crimeSpy = spyOn(service, "rateGraffiti");
            // Check proper parameter is passed.
            crimeSpy.and.callFake((url: string, rating: boolean) => {
                expect(rating).toBe(expectedRating);

                return Observable.create((observer: any) => {
                    observer.next();
                });
            });

            const randomButton = htmlElements["#cos-rate-crime-button"];
            randomButton.click();
            fixture.whenStable().then(() => {
                expect(crimeSpy).toHaveBeenCalledTimes(1);
                crimeSpy.and.stub();
            });
        }));

    it("should get a random graffiti image and set a SUBLIME rating when the user clicks the sublime button", async(
        () => {
            expectedRating = true;
            const service = fixture.debugElement.injector.get(RateService);
            const randomSpy = spyOn(service, "getRandomGraffiti");
            randomSpy.and.returnValue(getRandomGraffiti());

            const sublimeSpy = spyOn(service, "rateGraffiti");

            // Check proper parameter is passed.
            sublimeSpy.and.callFake((url: string, rating: boolean) => {
                expect(rating).toBe(expectedRating);

                return Observable.create((observer: any) => {
                    observer.next();
                });
            });

            const randomButton = htmlElements["#cos-rate-sublime-button"];
            randomButton.click();
            fixture.whenStable().then(() => {
                expect(sublimeSpy).toHaveBeenCalledTimes(1);
                sublimeSpy.and.stub();
            });
        }));

    // TO-DO: Need to add tests for adding to favourites when implemented.

});

/**
 * Consider re-doing some of these tests in the future. They work but the
 * implementation is a bit sloppy.
 */
describe("RateService", () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                RateService,
                { provide: XHRBackend, useClass: MockBackend }],
        });
    });

    it("should be able to retrieve a random graffiti from the server", async(
        inject([RateService, XHRBackend], (
            rateService: RateService,
            mockBackend: MockBackend) => {

            const mockResponse = JSON.stringify({
                result: {
                    url: "Nmu4brX",
                },
            });

            mockBackend.connections.subscribe((connection: any) => {
                connection.mockRespond(new Response(new ResponseOptions({
                    body: JSON.parse(mockResponse),
                })));
            });

            rateService.getRandomGraffiti()
                .subscribe((response) => {
                    expect(JSON.stringify(response)).toEqual(mockResponse);
                });

        })));

    it("should be able to send a rating to the server", async(
        inject([RateService, XHRBackend], (
            rateService: RateService,
            mockBackend: MockBackend) => {

            const mockResponse = JSON.stringify({
                result: "success",
            });

            mockBackend.connections.subscribe((connection: any) => {
                connection.mockRespond(new Response(new ResponseOptions({
                    body: JSON.parse(mockResponse),
                })));
            });

            rateService.getRandomGraffiti()
                .subscribe((response) => {
                    expect(JSON.stringify(response)).toEqual(mockResponse);
                });

        })));

});
