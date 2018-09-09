import { THING } from "./../models/thing.model";
import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-thing-card",
  templateUrl: "./thing-card.component.html",
  styleUrls: ["./thing-card.component.scss"]
})
export class ThingCardComponent implements OnInit {
  constructor() {}

  @Input()
  thing: THING;

  ngOnInit() {}
}
