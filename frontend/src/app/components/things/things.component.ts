import { Component, OnInit } from "@angular/core";
import { Thing } from "../../models/thing/thing";
import { ThingService } from "../../services/thing/thing.service";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import {
  CrumbTrailComponent,
  Icon
} from "../crumb-trail/crumb-trail.component";
import { InventoryService } from "../../services/inventory/inventory.service";
import { Inventory } from "../../models/inventory/inventory";

@Component({
  selector: "app-things",
  templateUrl: "./things.component.html",
  styleUrls: ["./things.component.scss"]
})
export class ThingsComponent implements OnInit {
  unauthorized = false;
  notFound = false;
  loading = true;
  oof = false;

  things: Thing[] = [];

  inventoryUuid: string;
  inventory: Inventory;

  constructor(
    private ts: ThingService,
    private route: ActivatedRoute,
    private router: Router,
    private is: InventoryService
  ) {}

  async ngOnInit(): Promise<void> {
    // Get Inventory UUID
    this.inventoryUuid = this.route.snapshot.params.inventoryUuid;

    await this.is.ready;
    this.inventory = this.is.inventories[this.inventoryUuid];

    CrumbTrailComponent.crumbs = [
      {
        icon: Icon.Inventory,
        title: this.inventory.name,
        routerLink: `/inventories`
      },
      {
        icon: Icon.Thing,
        title: "Things"
      }
    ];

    // Fetch the things of this inventory
    await this.getThings();

    /*
    // Navigate to the login component 3 seconds after being unauthorized
    setTimeout(() => {
      if (this.unauthorized) {
        this.router.navigate(["/login"]);
      }
    }, 3000);
    */
  }

  async getThings(): Promise<void> {
    try {
      console.log("Getting things");
      await this.ts.ready;
      this.things = this.ts.things[this.inventoryUuid];
      console.log(this.things);
      console.log(JSON.stringify(this.things));

      console.log("Got things");

      this.loading = false;
    } catch (error) {
      this.oof = true;

      console.log("Unknown error in getThings while creating");
      console.error(error);
    }
  }

  onAddThing(): void {}
}
