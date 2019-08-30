import { Component, OnInit } from "@angular/core";
import { EventSourcingService } from "../../services/EventSourcing/event-sourcing.service";

@Component({
  selector: "app-events",
  templateUrl: "./events.component.html",
  styleUrls: ["./events.component.scss"]
})
export class EventsComponent implements OnInit {
  events = [];

  constructor(private es: EventSourcingService) {
    // console.log(es.a);
  }

  ngOnInit() {}

  getEvents() {}
}
