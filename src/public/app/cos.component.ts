import { Component } from "@angular/core";
import { SessionService } from "./shared/session/session.service";

@Component({
  providers: [SessionService],
  selector: "cos",
  styleUrls: ["./cos.component.css"],
  templateUrl: "./cos.component.html",
})

/**
 * Contains the main component for CoS. Runs intialization protocols.
 */
export class CoSComponent {
  constructor(private sessionService: SessionService) {
    console.log("Hi");
    sessionService.checkUserIsActive();
    console.log("Hi again");
  }
}