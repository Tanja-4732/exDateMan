import { Observable } from 'rxjs';
import { RestService } from "../../services/Rest/rest.service";
import { Component, OnInit } from "@angular/core";
import { Thing } from '../../models/thing/thing';
import { ThingService } from '../../services/thing/thing.service';

@Component({
  selector: "app-things",
  templateUrl: "./things.component.html",
  styleUrls: ["./things.component.scss"]
})
export class ThingsComponent implements OnInit {
  things: Thing[] = [];

  constructor(private ts: ThingService) {}

  ngOnInit(): void {
    this.getThings();
  }

  async getThings(): Promise<void> {
    try {
      this.things = this.ts
    } catch (error) {

    }
  }

  onAddThing(): void {}
}
