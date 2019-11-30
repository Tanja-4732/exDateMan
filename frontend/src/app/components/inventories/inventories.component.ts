import { Component, OnInit } from "@angular/core";
import { Inventory } from "../../models/inventory/inventory";
import { InventoryService } from "../../services/inventory/inventory.service";
import { Router } from "@angular/router";
import {
  CrumbTrailComponent,
  Icon
} from "../crumb-trail/crumb-trail.component";

@Component({
  selector: "app-inventories",
  templateUrl: "./inventories.component.html",
  styleUrls: ["./inventories.component.scss"]
})
export class InventoriesComponent implements OnInit {
  inventories: Inventory[] = [];
  loading = true;
  unauthorized = false;

  constructor(private is: InventoryService, private router: Router) {}

  ngOnInit(): void {
    this.loadInventories();

    CrumbTrailComponent.crumbs = [
      {
        icon: Icon.Inventory,
        title: "Inventories"
      }
    ];
  }

  async loadInventories(): Promise<void> {
    try {
      // Wait for InventoryService to be ready
      await this.is.ready;

      this.inventories = Object.keys(this.is.inventories).map(
        (key: string) => this.is.inventories[key]
      );
      this.loading = false;
    } catch (error) {
      console.log("Unknown error in inventories while fetching");
      console.error(error);
    }
  }
}
