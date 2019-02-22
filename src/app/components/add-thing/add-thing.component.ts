import { Component, OnInit } from "@angular/core";
import { ThingService } from "../../services/thing/thing.service";
import { Thing } from "../../models/thing/thing";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-add-thing",
  templateUrl: "./add-thing.component.html",
  styleUrls: ["./add-thing.component.scss"]
})
export class AddThingComponent implements OnInit {
  thingName: string;
  thingCategory: string;
  inventoryId: number;

  constructor(private ts: ThingService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.getInventoryId();
  }

  onAddThing(): void {
    const thing: Thing = new Thing();
    thing.name = this.thingName;
    thing.categories = [];

    this.createThing(thing).then();
  }

  async createThing(thing: Thing): Promise<void> {
    try {
      await this.ts.newThing(thing, this.inventoryId);
    } catch (err) {
      console.log("oof");
    }
  }

  getInventoryId(): void {
    this.inventoryId = this.route.snapshot.params["inventoryId"];
  }
}
