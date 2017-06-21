import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "cos-gallery-widget",
  styleUrls: ["./gallery-widget.component.css"],
  templateUrl: "./gallery-widget.component.html",
})

export class GalleryWidgetComponent {
  @Input()
  public imgUrl: string;

}
