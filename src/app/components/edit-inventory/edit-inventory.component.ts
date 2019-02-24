import { Component, OnInit } from "@angular/core";
import { Inventory } from "../../models/inventory/inventory";
import { InventoryService } from "../../services/inventory/inventory.service";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-edit-inventory",
  templateUrl: "./edit-inventory.component.html",
  styleUrls: ["./edit-inventory.component.scss"]
})
export class EditInventoryComponent implements OnInit {
  unauthorized: boolean = false;
  notFound: boolean = false;
  loading: boolean = true;
  oof: boolean = false;
  inventory: Inventory = new Inventory();
  inventoryId: number;

  constructor(
    private is: InventoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getInventory().then();
  }

  async getInventory(): Promise<void> {
    this.inventoryId = this.route.snapshot.params["inventoryId"];
    try {
      this.inventory = await this.is.getInventory(this.inventoryId);
      this.loading = false;
    } catch (error) {
      console.log(error);
      if (error instanceof HttpErrorResponse) {
        switch (error.status) {
          case 401:
            // Set flag for html change and timeout above
            this.unauthorized = true;
            break;
          case 404:
            this.notFound = true;
        }
      } else {
        console.log("Unknown error in inventories while fetching");
      }
    }
  }

  onEditInventory(): void {
    this.updateInventory().then(() => {
      if (!this.oof) {
        this.router.navigate(["things"], { relativeTo: this.route });
      }
    });
  }

  async updateInventory(): Promise<void> {
    try {
      await this.is.updateInventory(this.inventory);
      this.oof = false;
    } catch (error) {
      this.oof = true;
      if (error instanceof HttpErrorResponse) {
        switch (error.status) {
          case 401:
            // Set flag for html change and timeout above
            this.unauthorized = true;
            break;
          case 404:
            this.notFound = true;
        }
      } else {
        console.log("Unknown error in inventories while updating");
      }
    }
  }

  onDeleteInventory(): void {}
}
