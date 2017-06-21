/**
 * @author Michael Mitchell-Halter
 */

import { Component } from "@angular/core";
import { SessionService } from "./shared/session/session.service";

@Component({
  providers: [SessionService],
  selector: "cos",
  styleUrls: ["./cos.component.css"],
  templateUrl: "./cos.component.html",
})

/**
 * Contains the main component for CoS.
 */
export class CoSComponent {
  constructor(private sessionService: SessionService) {
    sessionService.checkUserIsActive();
  }
}
