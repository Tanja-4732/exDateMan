import { Observable } from "rxjs";
import { RestService } from "../../services/Rest/rest.service";
import { Component, OnInit, Input } from "@angular/core";
import { Thing } from "../../models/thing/thing";
import { ThingService } from "../../services/thing/thing.service";
import { Inventory } from "../../models/inventory/inventory";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-things",
  templateUrl: "./things.component.html",
  styleUrls: ["./things.component.scss"]
})
export class ThingsComponent implements OnInit {
  things: Thing[] = [];
  inventoryId: number;

  constructor(private ts: ThingService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.getInventoryId();
    this.getThings().then();
  }

  async getThings(): Promise<void> {
    try {
      this.things = await this.ts.getThings(this.inventoryId);
    } catch (error) {
      console.log("OOF");
    }
  }

  getInventoryId(): void {
    this.inventoryId = this.route.snapshot.params["inventoryId"];
  }

  onAddThing(): void {}
}
