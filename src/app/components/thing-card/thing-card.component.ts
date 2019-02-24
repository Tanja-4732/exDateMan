import { Component, OnInit, Input } from "@angular/core";
import { Thing } from "../../models/thing/thing";

@Component({
  selector: "app-thing-card",
  templateUrl: "./thing-card.component.html",
  styleUrls: ["./thing-card.component.scss"]
})
export class ThingCardComponent implements OnInit {
  @Input()
  thing: Thing;

  constructor() {}

  ngOnInit(): void {}
}
