import { TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { SubjectSubscription } from "rxjs/SubjectSubscription";
import { ISessionDetails, SessionService } from "./session.service";

let expectSessionEndEvent: SubjectSubscription<ISessionDetails>;
let expectSessionStartEvent: SubjectSubscription<ISessionDetails>;

describe("Session servive", () => {
    beforeEach(() => {

    });

    it("should broadcast session status after checking if a user is logged in", () => {});
    it("should broadcast session status after checking if a user is logged out", () => {});
    it("should be able to broadcast session change after start a new session", () => {});
    it("should be able to broadcast session change after ending session", () => {});
    it("shouldn't be able to start a new session if one is still active", () => {});
    it("should broadcast server errors when checking if session is active", () => {});
    it("should broadcast server errors when trying to start a new session", () => {});
    it("should broadcast server errors when trying to end a session", () => {});
});